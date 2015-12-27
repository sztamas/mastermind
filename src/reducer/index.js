import {fromJS, Map} from 'immutable'
import {times, range, uniq, sample, identity, random} from 'lodash'

import {NEW_GAME, CHANGE_COLOR, SCORE_GUESS} from '../actions'
import {STATES} from '../game'

const ROWS_IN_GAME = 12

export default function(state = Map(), action) {
  switch (action.type) {
  case NEW_GAME: 
      return state.set('game', fromJS({
        state: STATES.IN_PROGRESS,
        rows: times(ROWS_IN_GAME, n => makeEmptyRow()),
        secretCode: generateSecretCode()
      }))

  case CHANGE_COLOR:
    const {rowIndex, index, newColor} = action
    return state.setIn(['game', 'rows', rowIndex, 'pegs', index], newColor)

  case SCORE_GUESS:
    const secretCode = state.getIn(['game', 'secretCode'])
    const guess = state.getIn(['game', 'rows', action.rowIndex, "pegs"])
    const score = calculateScore(secretCode, guess)
    let newState = state.updateIn(['game', 'rows', action.rowIndex], row =>
      row.set('score', fromJS(score)))
    if (allCorrect(score)) {
      newState = newState.setIn(['game', 'state'], STATES.WON)
    } else if (wasLastGuess(newState.get('game'))) {
      newState = newState.setIn(['game', 'state'], STATES.LOST)
    }
    return newState

  }
  return state
}

function makeEmptyRow() {
  return {
    pegs: [null, null, null, null],
  }
}

function wasLastGuess(game) {
  return game.get('rows').findIndex(row => !row.has('score')) === -1
}

function allCorrect(score) {
  return score.correct === 4
}

function generateSecretCode() {
  return times(4, () => random(5))
}

function calculateScore(secretCode, guess) {
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

export {calculateScore}
