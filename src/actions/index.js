import {generateSecretCode} from '../game'

export const NEW_GAME = "NEW_GAME"
export const CHANGE_COLOR = "CHANGE_COLOR"
export const SCORE_GUESS = "SCORE_GUESS"

export const REPLAY_GAME = "REPLAY_GAME"
export const REPLAY_MOVE_TO_START = "REPLAY_MOVE_TO_START"
export const REPLAY_PREV = "REPLAY_PREV"
export const REPLAY_NEXT = "REPLAY_NEXT"
export const REPLAY_MOVE_TO_END = "REPLAY_MOVE_TO_END"
export const REPLAY_HIDE_GAME_OVER_DIALOG = "REPLAY_HIDE_GAME_OVER_DIALOG"

export function newGame(secretCode = generateSecretCode()) {
  return {type: NEW_GAME, secretCode}
}

export function scoreGuess(rowIndex) {
  return {type: SCORE_GUESS, rowIndex}
}

export function changeColor(rowIndex, index, newColor) {
  return {type: CHANGE_COLOR, rowIndex, index, newColor}
}

export function replayGame(gameId) {
  return {type: REPLAY_GAME, gameId}
}

export function replayMoveToStart() {
  return {type: REPLAY_MOVE_TO_START}
}

export function replayPrev() {
  return {type: REPLAY_PREV}
}

export function replayNext() {
  return {type: REPLAY_NEXT}
}

export function replayMoveToEnd() {
  return {type: REPLAY_MOVE_TO_END}
}

export function replayHideGameOverDialog() {
  return {type: REPLAY_HIDE_GAME_OVER_DIALOG}
}
