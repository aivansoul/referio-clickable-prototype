import { describe, expect, it } from 'vitest'
import { demoReducer, initialState } from './DemoContext'

describe('Referio demo progression', () => {
  it('starts with the earned Local Hero badge visible', () => {
    expect(initialState).toMatchObject({ level: 'Local Hero', badgeUnlocked: true })
  })

  it('awards five points once per daily discovery', () => {
    const discovered = demoReducer(initialState, { type: 'DISCOVER_MERCHANT', discoveryId: 'daily-cafe-central' })

    expect(discovered).toMatchObject({
      points: 1285,
      balance: 1285,
      dailyDiscoveries: ['daily-cafe-central'],
      dailyBonusClaimed: false,
    })
    expect(demoReducer(discovered, { type: 'DISCOVER_MERCHANT', discoveryId: 'daily-cafe-central' })).toEqual(discovered)
  })

  it('awards the daily bonus once after eight unique discoveries', () => {
    const sevenDiscoveries = Array.from({ length: 7 }, (_, index) => `daily-${index + 1}`).reduce(
      (state, discoveryId) => demoReducer(state, { type: 'DISCOVER_MERCHANT', discoveryId }),
      initialState,
    )
    const completed = demoReducer(sevenDiscoveries, { type: 'DISCOVER_MERCHANT', discoveryId: 'daily-8' })

    expect(sevenDiscoveries).toMatchObject({ points: 1315, balance: 1315, dailyBonusClaimed: false })
    expect(completed).toMatchObject({ points: 1345, balance: 1345, dailyBonusClaimed: true })
    expect(completed.dailyDiscoveries).toHaveLength(8)
    expect(demoReducer(completed, { type: 'DISCOVER_MERCHANT', discoveryId: 'daily-8' })).toEqual(completed)
  })

  it('advances the local challenge without ever regressing it', () => {
    const completed = ['daily-1', 'daily-2', 'daily-3'].reduce(
      (state, discoveryId) => demoReducer(state, { type: 'DISCOVER_MERCHANT', discoveryId }),
      initialState,
    )

    expect(completed.challengeProgress).toBe(5)
    expect(demoReducer(completed, { type: 'VERIFY_VISIT' }).challengeProgress).toBe(5)
  })

  it('awards the completed challenge once', () => {
    const ready = { ...initialState, challengeProgress: 5 }
    const claimed = demoReducer(ready, { type: 'CLAIM_CHALLENGE_REWARD' })

    expect(claimed).toMatchObject({ points: 1430, balance: 1430, challengeRewardClaimed: true })
    expect(demoReducer(claimed, { type: 'CLAIM_CHALLENGE_REWARD' })).toEqual(claimed)
  })

  it('adds a verified visit exactly once', () => {
    const visited = demoReducer(initialState, { type: 'VERIFY_VISIT' })
    expect(visited).toMatchObject({ points: 1330, balance: 1330, stamps: 5, visitVerified: true, challengeProgress: 3 })
    expect(demoReducer(visited, { type: 'VERIFY_VISIT' })).toEqual(visited)
  })

  it('advances the level and unlocks the reward after the verified review', () => {
    const visited = demoReducer(initialState, { type: 'VERIFY_VISIT' })
    const reviewed = demoReducer(visited, { type: 'PUBLISH_REVIEW' })
    expect(reviewed).toMatchObject({ points: 1500, balance: 1500, level: 'Légende locale', badgeUnlocked: true, rewardUnlocked: true })
  })

  it('spends only the available balance and never lifetime points', () => {
    const reviewed = demoReducer(demoReducer(initialState, { type: 'VERIFY_VISIT' }), { type: 'PUBLISH_REVIEW' })
    const redeemed = demoReducer(reviewed, { type: 'USE_REWARD' })
    expect(redeemed.balance).toBe(1300)
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
