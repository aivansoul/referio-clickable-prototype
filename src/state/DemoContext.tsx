import { createContext, type ReactNode, useContext, useEffect, useMemo, useReducer } from 'react'

export type DemoState = {
  city: string
  points: number
  balance: number
  level: 'Curieux' | 'Explorateur' | 'Insider' | 'Local Hero' | 'Légende locale'
  stamps: number
  interested: string[]
  favorites: string[]
  dailyDiscoveries: string[]
  dailyBonusClaimed: boolean
  visitVerified: boolean
  reviewPublished: boolean
  badgeUnlocked: boolean
  rewardUnlocked: boolean
  rewardUsed: boolean
  challengeProgress: number
  challengeRewardClaimed: boolean
  notifications: number
  businessCompleteness: number
  adminPending: number
}

type DemoAction =
  | { type: 'INTEREST'; merchantId: string }
  | { type: 'FAVORITE'; merchantId: string }
  | { type: 'DISCOVER_MERCHANT'; discoveryId: string }
  | { type: 'VERIFY_VISIT' }
  | { type: 'PUBLISH_REVIEW' }
  | { type: 'USE_REWARD' }
  | { type: 'CLAIM_CHALLENGE_REWARD' }
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
  dailyDiscoveries: [],
  dailyBonusClaimed: false,
  visitVerified: false,
  reviewPublished: false,
  badgeUnlocked: true,
  rewardUnlocked: false,
  rewardUsed: false,
  challengeProgress: 2,
  challengeRewardClaimed: false,
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
    case 'DISCOVER_MERCHANT': {
      if (state.dailyDiscoveries.includes(action.discoveryId)) return state

      const dailyDiscoveries = [...state.dailyDiscoveries, action.discoveryId]
      const dailyBonusClaimed = state.dailyBonusClaimed || dailyDiscoveries.length >= 8
      const earnedPoints = 5 + (!state.dailyBonusClaimed && dailyBonusClaimed ? 25 : 0)

      return {
        ...state,
        dailyDiscoveries,
        dailyBonusClaimed,
        points: state.points + earnedPoints,
        balance: state.balance + earnedPoints,
        challengeProgress: Math.min(5, state.challengeProgress + 1),
      }
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
            challengeProgress: Math.max(3, state.challengeProgress),
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
        ? { ...state, rewardUsed: true, balance: Math.max(0, state.balance - 200) }
        : state
    case 'CLAIM_CHALLENGE_REWARD':
      return state.challengeProgress >= 5 && !state.challengeRewardClaimed
        ? { ...state, challengeRewardClaimed: true, points: state.points + 150, balance: state.balance + 150 }
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
    if (!saved) return initialState

    const parsed = JSON.parse(saved) as Partial<DemoState>
    const levelHasBadge = parsed.level === 'Local Hero' || parsed.level === 'Légende locale'
    return {
      ...initialState,
      ...parsed,
      badgeUnlocked: Boolean(parsed.badgeUnlocked || levelHasBadge),
    }
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
