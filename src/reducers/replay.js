import {fromJS} from 'immutable'

import replayableGames from '../replayable-games'
import {REPLAY_GAME, REPLAY_MOVE_TO_START, REPLAY_PREV, REPLAY_NEXT, REPLAY_MOVE_TO_END, REPLAY_HIDE_GAME_OVER_DIALOG} from '../actions'
import {isGameOver} from '../game'


const ROWS_IN_GAME = 12

const initialState = fromJS({
  replayableGames,
})

let states = []

export default function(state = initialState, action) {
  switch (action.type) {
  case REPLAY_GAME:
    return state.merge({
      gameReplayed: state.getIn(['replayableGames', action.gameId]),
      replayPosition: -1,
      showGameOverDialog: true,
      game: {}
    })

  case REPLAY_MOVE_TO_START:
  case REPLAY_PREV:
  case REPLAY_NEXT:
  case REPLAY_MOVE_TO_END:
    const gameReplayed = state.get('gameReplayed')
    if (!gameReplayed) {
      return state
    }
    const replayPosition = state.get('replayPosition')
    const game = state.get('game')

    let newReplayPosition = moveReplayPosition(replayPosition, action.type, gameReplayed.get('states').count())

    if (replayPosition === newReplayPosition) {
      return state
    }
    const gameState = gameReplayed.getIn(['states', newReplayPosition, 'state']).toJS()
    let showGameOverDialog = isGameOver(gameState.state)

    return state.merge({
      game: gameState,
      replayPosition: newReplayPosition,
      showGameOverDialog
    })

  case REPLAY_HIDE_GAME_OVER_DIALOG:
    return state.set('showGameOverDialog', false)
  }

  return state
}

function moveReplayPosition(current, actionType, statesCount) {
  let lastStateIdx = statesCount - 1
  switch (actionType) {
    case REPLAY_MOVE_TO_START:
      return 0
    case REPLAY_PREV:
      return Math.max(current - 1, 0)
    case REPLAY_NEXT:
      return Math.min(current + 1, lastStateIdx)
    case REPLAY_MOVE_TO_END:
        return lastStateIdx
  }
  return current
}
