import React from 'react'

import {STATES} from '../game'

const GameOverDialog = React.createClass({
  render: function() {
    const {gameState, newGame} = this.props

    const styles = {
      msg: {
        fontSize: 24,
        marginBottom: 20
      },
      button: {
        fontSize: 18,
        padding: 12
      }
    }

    return (<div id="dialog">
      <div>
        <div style={styles.msg}>{gameState === STATES.WON ? 'You won!' : 'You lost!'}</div>
        <button style={styles.button} onClick={newGame}>Play another game</button>
      </div>
    </div>)
  }
})

export default GameOverDialog
