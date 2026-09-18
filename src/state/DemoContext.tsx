import { createContext, type ReactNode, useContext, useEffect, useMemo, useReducer } from 'react'

export type DemoState = {
  city: string
  points: number
  balance: number
  level: 'Curieux' | 'Explorateur' | 'Insider' | 'Local Hero' | 'Légende locale'
  stamps: number
  interested: string[]
  favorites: string[]
  visitVerified: boolean
  reviewPublished: boolean
  badgeUnlocked: boolean
  rewardUnlocked: boolean
  rewardUsed: boolean
  challengeProgress: number
  notifications: number
  businessCompleteness: number
  adminPending: number
}

type DemoAction =
  | { type: 'INTEREST'; merchantId: string }
  | { type: 'FAVORITE'; merchantId: string }
  | { type: 'VERIFY_VISIT' }
  | { type: 'PUBLISH_REVIEW' }
  | { type: 'USE_REWARD' }
  | { type: 'SET_CITY'; city: string }
  | { type: 'COMPLETE_BUSINESS_STEP'; amount?: number }
  | { type: 'VALIDATE_BUSINESS' }
  | { type: 'RESET' }

export const initialState: DemoState = {
  city: 'Charleroi',
  points: 1280,
  balance: 1280,
  level: 'Local Hero',
  stamps: 4,
  interested: [],
  favorites: ['cafe-central'],
  visitVerified: false,
  reviewPublished: false,
  badgeUnlocked: false,
  rewardUnlocked: false,
  rewardUsed: false,
  challengeProgress: 2,
  notifications: 3,
  businessCompleteness: 72,
  adminPending: 14,
}

const STORAGE_KEY = 'referio-demo-state-v1'

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'INTEREST':
      return {
        ...state,
        interested: state.interested.includes(action.merchantId)
          ? state.interested
          : [...state.interested, action.merchantId],
      }
    case 'FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.merchantId)
          ? state.favorites.filter((id) => id !== action.merchantId)
          : [...state.favorites, action.merchantId],
      }
    case 'VERIFY_VISIT':
      return state.visitVerified
        ? state
        : {
            ...state,
            visitVerified: true,
            points: state.points + 50,
            balance: state.balance + 50,
            stamps: state.stamps + 1,
            challengeProgress: 3,
          }
    case 'PUBLISH_REVIEW':
      return state.reviewPublished
        ? state
        : {
            ...state,
            reviewPublished: true,
            badgeUnlocked: true,
            rewardUnlocked: true,
            points: state.points + 170,
            balance: state.balance + 170,
            level: 'Légende locale',
          }
    case 'USE_REWARD':
      return state.rewardUnlocked && !state.rewardUsed
        ? { ...state, rewardUsed: true, balance: Math.max(0, state.balance - 600) }
        : state
    case 'SET_CITY':
      return { ...state, city: action.city }
    case 'COMPLETE_BUSINESS_STEP':
      return { ...state, businessCompleteness: Math.min(100, state.businessCompleteness + (action.amount ?? 8)) }
    case 'VALIDATE_BUSINESS':
      return { ...state, adminPending: Math.max(0, state.adminPending - 1) }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

type DemoContextValue = {
  state: DemoState
  dispatch: React.Dispatch<DemoAction>
  reset: () => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

function loadInitialState(): DemoState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialState, ...(JSON.parse(saved) as Partial<DemoState>) } : initialState
  } catch {
    return initialState
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, loadInitialState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo(
    () => ({ state, dispatch, reset: () => dispatch({ type: 'RESET' }) }),
    [state],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo doit être utilisé dans DemoProvider')
  return context
}
