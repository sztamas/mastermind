export const NEW_GAME = "NEW_GAME"
export const CHANGE_COLOR = "CHANGE_COLOR"
export const SCORE_GUESS = "SCORE_GUESS"

export function newGame() {
  return {type: NEW_GAME}
}

export function scoreGuess(rowIndex) {
  return {type: SCORE_GUESS, rowIndex}
}

export function changeColor(rowIndex, index, newColor) {
  return {type: CHANGE_COLOR, rowIndex, index, newColor}
}
