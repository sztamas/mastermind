import {fromJS, Map} from 'immutable'
import {times, range, uniq, sample, identity, random} from 'lodash'

import {NEW_GAME, CHANGE_COLOR, SCORE_GUESS} from '../actions'
import {
  STATES,
  ROWS_IN_GAME,
  generateSecretCode,
  wasLastGuess,
  allCorrect,
  calculateScore} from '../game'


export default function reducer(state = Map(), action) {
  switch (action.type) {

  case NEW_GAME:
    return state.merge({
      state: STATES.IN_PROGRESS,
      rows: times(ROWS_IN_GAME, n => makeEmptyRow()),
      secretCode: action.secretCode
    })

  case CHANGE_COLOR:
    const {rowIndex, index, newColor} = action
    return state.setIn(['rows', rowIndex, 'pegs', index], newColor)

  case SCORE_GUESS:
    const secretCode = state.get('secretCode')
    const guess = state.getIn(['rows', action.rowIndex, "pegs"])
    const score = calculateScore(secretCode, guess)
    let newState = state.updateIn(['rows', action.rowIndex], row =>
      row.set('score', fromJS(score)))
    if (allCorrect(score)) {
      newState = newState.set('state', STATES.WON)
    } else if (wasLastGuess(newState)) {
      newState = newState.set('state', STATES.LOST)
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

