import {times, range, uniq, sample, identity, random} from 'lodash'

export const ROWS_IN_GAME = 12

// Game states
export const STATES = {
  IN_PROGRESS: 'IN_PROGRESS',
  WON: 'WON',
  LOST: 'LOST',
}

export function isGameOver(state) {
  return state === STATES.WON || state === STATES.LOST
}

export function wasLastGuess(game) {
  return game.get('rows').findIndex(row => !row.has('score')) === -1
}

export function allCorrect(score) {
  return score.correct === 4
}

export function generateSecretCode() {
  return times(4, () => random(5))
}

export function calculateScore(secretCode, guess) {
  let perfectMatches = guess.filter((col, idx) => col == secretCode.get(idx))
  let correct = perfectMatches.count()

  let secretCodeCountByColors = secretCode.countBy(identity)
  let totalColorMatches = guess.countBy(identity).reduce(
      (sum, count, color) =>
          sum += Math.min(secretCodeCountByColors.get(color, 0), count)
      , 0)
  let correctColor = totalColorMatches - correct

  return {correct: correct, correctColor: correctColor}
}

