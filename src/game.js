
// Game states
export const STATES = {
  IN_PROGRESS: 'IN_PROGRESS',
  WON: 'WON',
  LOST: 'LOST',
}

export function isGameOver(state) {
  return state === STATES.WON || state === STATES.LOST
}
