export const motionDuration = {
  fast: 0.12,
  base: 0.22,
  slow: 0.36,
  response: 0.42,
} as const

export const motionEase = {
  standard: [0.22, 1, 0.36, 1],
  emphasis: [0.16, 1, 0.3, 1],
} as const

export const motionTransition = {
  fast: { duration: motionDuration.fast, ease: motionEase.standard },
  base: { duration: motionDuration.base, ease: motionEase.standard },
  slow: { duration: motionDuration.slow, ease: motionEase.emphasis },
  response: { type: 'spring', duration: motionDuration.response, bounce: 0.18 },
} as const
