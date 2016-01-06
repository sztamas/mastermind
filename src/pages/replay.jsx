import React from 'react'
import {connect} from 'react-redux'

import Board from '../components/board'
import GameOverDialog from '../components/game-over-dialog'
import {isGameOver} from '../game'

import {replayGame, replayMoveToStart, replayPrev, replayNext, replayMoveToEnd, replayHideGameOverDialog} from '../actions'

const ReplayToolBar = React.createClass({
  render: function() {
    const {start, next, prev, end} = this.props

    const styles = {
      toolbar: {
        border: '2px solid #f2f2f2',
        width: 310,
        position: 'fixed',
        bottom: 50,
        textAlign: 'center',
        padding: 5
      },
      button: {
        padding: 8,
        margin: 4
      },
    }

    return (<div id="replayToolbar" style={styles.toolbar}>
      <button style={styles.button} onClick={start}>Start</button>
      <button style={styles.button} onClick={prev}>Prev</button>
      <button style={styles.button} onClick={next}>Next</button>
      <button style={styles.button} onClick={end}>End</button>

    </div>)
  }
})

const ReplayPage = React.createClass({
  componentDidMount() {
    this.props.dispatch(replayGame(this.props.params.gameId))
    this.props.dispatch(replayNext(this.props.params.gameId))
  },

  render: function() {
    const {dispatch, replay} = this.props
    const gameReplayed = replay.get('gameReplayed')
    const showGameOverDialog = replay.get('showGameOverDialog', true)
    if (!gameReplayed) {
      return (<div id="replay"></div>)
    }
    const name = gameReplayed.get('name')
    const at = new Date(gameReplayed.get('states').first().get('at')).toLocaleString()
    const game = replay.get('game')
    const gameState = game.get('state')

    return (<div className="mainPanel">
      <div style={{textAlign: 'center'}}>
        Game played by <br />
        <strong>{name}</strong>
       <br /> at <br />
       <em>{at}</em>
      </div>

      <ReplayToolBar
        start={() => dispatch(replayMoveToStart())}
        prev={() => dispatch(replayPrev())}
        next={() => dispatch(replayNext())}
        end={() => dispatch(replayMoveToEnd())} />

      <Board game={game} editable={false}  />
      {isGameOver(gameState) && showGameOverDialog ?
          <GameOverDialog
              buttonText="OK"
              gameState={gameState}
              newGame={() => dispatch(replayHideGameOverDialog())}/>
          : null}
    </div>)
  }
})

function mapStateToProps(state) {
  return {
    games: state.get('replayableGames'),
    replay: state.get('replay')
  }
}

const ReplayPageContainer = connect(mapStateToProps)(ReplayPage)

export default ReplayPageContainer

