import { describe, expect, it } from 'vitest'
import { demoReducer, initialState } from './DemoContext'

describe('Referio demo progression', () => {
  it('adds a verified visit exactly once', () => {
    const visited = demoReducer(initialState, { type: 'VERIFY_VISIT' })
    expect(visited).toMatchObject({ points: 1330, balance: 1330, stamps: 5, visitVerified: true, challengeProgress: 3 })
    expect(demoReducer(visited, { type: 'VERIFY_VISIT' })).toEqual(visited)
  })

  it('unlocks the badge and reward after the verified review', () => {
    const visited = demoReducer(initialState, { type: 'VERIFY_VISIT' })
    const reviewed = demoReducer(visited, { type: 'PUBLISH_REVIEW' })
    expect(reviewed).toMatchObject({ points: 1500, balance: 1500, level: 'Légende locale', badgeUnlocked: true, rewardUnlocked: true })
  })

  it('spends only the available balance and never lifetime points', () => {
    const reviewed = demoReducer(demoReducer(initialState, { type: 'VERIFY_VISIT' }), { type: 'PUBLISH_REVIEW' })
    const redeemed = demoReducer(reviewed, { type: 'USE_REWARD' })
    expect(redeemed.balance).toBe(900)
    expect(redeemed.points).toBe(1500)
    expect(redeemed.rewardUsed).toBe(true)
    expect(demoReducer(redeemed, { type: 'USE_REWARD' })).toEqual(redeemed)
  })

  it('keeps business and admin mutations bounded', () => {
    const completed = demoReducer({ ...initialState, businessCompleteness: 98 }, { type: 'COMPLETE_BUSINESS_STEP' })
    const validated = demoReducer({ ...initialState, adminPending: 0 }, { type: 'VALIDATE_BUSINESS' })
    expect(completed.businessCompleteness).toBe(100)
    expect(validated.adminPending).toBe(0)
  })
})
