import React from 'react'
import {connect} from 'react-redux'

import Board from './components/board'
import GameOverDialog from './components/game-over-dialog'
import {newGame} from './actions'
import {isGameOver} from './game'

const App = React.createClass({
  render: function() {
    const {dispatch, game} = this.props
    const gameState = game.get('state')

    return (<div>
      <h1 id="title">Mastermind</h1>
      <Board game={game} dispatch={dispatch} />
      {isGameOver(gameState) ? 
          <GameOverDialog
              gameState={gameState}
              newGame={() => dispatch(newGame())}/>
          : null}
    </div>)
  }
})

function mapStateToProps(state) {
  return {
    game: state.get('game')
  }
}

const AppContainer = connect(mapStateToProps)(App)

export default AppContainer
