import React from 'react'
import {connect} from 'react-redux'
import {merge} from 'lodash'

import Board from '../components/board'
import GameOverDialog from '../components/game-over-dialog'
import {isGameOver} from '../game'

import {replayGame, replayMoveToStart, replayPrev, replayNext, replayMoveToEnd, replayHideGameOverDialog} from '../actions'

const toolbarStyles = {
      toolbar: {
        border: '2px solid #f2f2f2',
        backgroundColor: '#f2f2f2',
        width: 310,
        position: 'fixed',
        bottom: 50,
        textAlign: 'center',
        padding: 5
      },
      button: {
        height: 40,
        padding: 2,
        margin: 4
      },
      img: {
        verticalAlign: 'middle',
        height: 36
      }
  }
const ReplayAutoPlayToolBar = React.createClass({
  render: function() {
    const {stop, skip, speed, setSpeed, nextEventIn} = this.props

    const styles = merge({}, toolbarStyles, {
      speedUpButton: {
        height: 40,
        margin: 1,
      },
    })

    function btnStyle(btnSpeed) {
      if (speed === btnSpeed) {
        return merge({}, styles.speedUpButton, {fontWeight: 'bold'})
      } else {
        return styles.speedUpButton
      }
    }

    function formatMs(ms) {
      let s = Math.floor(ms / 1000)
      if (s > 60) {
        return '>1m'
      }
      if (s === 0) {
        s = '<0'
      } else if (s < 10) {
        s = ' ' + s
      }
      return s + 's'
    }

    let nextEventInFormatted = formatMs(nextEventIn)

    return (<div id="replayToolbar" style={styles.toolbar}>
      <button style={styles.button} onClick={stop}>
        <img style={styles.img} src="img/ic_stop_black_48dp.png" alt="Stop" title="Stop" />
      </button>
        <span style={{paddingLeft: 12, fontFamily: 'Courier'}}>{nextEventInFormatted}</span>
      <button style={styles.button} onClick={skip}>
        <img style={styles.img} src="img/ic_skip_next_black_48dp.png" alt="Skip" title="Skip" />
      </button>
      <span style={{paddingLeft: 12}}></span>
      <button style={btnStyle(1)} onClick={() => setSpeed(1)}>1x</button>
      <button style={btnStyle(2)} onClick={() => setSpeed(2)}>2x</button>
      <button style={btnStyle(4)} onClick={() => setSpeed(4)}>4x</button>
      <button style={btnStyle(8)} onClick={() => setSpeed(8)}>8x</button>
    </div>)
  }
})

const ReplayManualToolBar = React.createClass({
  render: function() {
    const {play, start, next, prev, end} = this.props

    const styles = toolbarStyles

    return (<div id="replayToolbar" style={styles.toolbar}>
      <button style={styles.button} onClick={play}>
        <img style={styles.img} src="img/ic_play_arrow_black_48dp.png" alt="Autoplay" title="Autoplay" />
      </button>
      <span style={{paddingLeft: 12}}></span>
      <button style={styles.button} onClick={start}>
        <img style={styles.img} src="img/ic_fast_rewind_black_48dp.png" alt="Skip to Start" title="Skip to Start" />
      </button>
      <button style={styles.button} onClick={prev}>
        <img style={styles.img} src="img/ic_skip_previous_black_48dp.png" alt="Previous" title="Previous" />
      </button>
      <button style={styles.button} onClick={next}>
        <img style={styles.img} src="img/ic_skip_next_black_48dp.png" alt="Next" title="Next" />
      </button>
      <button style={styles.button} onClick={end}>
        <img style={styles.img} src="img/ic_fast_forward_black_48dp.png" alt="Skip to the End" title="Skip to the End" />
      </button>

    </div>)
  }
})

const ReplayPage = React.createClass({
  getInitialState: function() {
    return {
      manualControl: true,
      nextEventIn: null,
      speed: 1
    }
  },

  componentDidMount: function() {
    this.props.dispatch(replayGame(this.props.params.gameId))
    this.props.dispatch(replayNext(this.props.params.gameId))
  },

  componentWillUnmount: function() {
    this.unschedule()
  },

  switchToAutoplay: function() {
      this.setState({manualControl: false})
  },

  switchToManualControl: function() {
      this.setState({manualControl: true})
  },

  unschedule: function() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
    }
  },

  setSpeed: function(newSpeed) {
    this.setState({speed: newSpeed})
  },

  skip: function() {
    this.unschedule()
    this.scheduleNext(true)
  },

  stop: function() {
    this.unschedule()
    this.switchToManualControl()
  },

  play: function() {
    const {dispatch, replay} = this.props
    if (isGameOver(replay.getIn(['game', 'state']))) {
      this.setState({speed: 1})
      dispatch(replayMoveToStart())
    }
    this.switchToAutoplay()

    setTimeout(() => this.scheduleNext(), 0)
  },

  scheduleNext: function(immediate = false) {
    const {dispatch, replay} = this.props
    let gameReplayed = replay.get('gameReplayed')
    let position = replay.get('replayPosition')

    let atEnd = (position, game) => (position + 1 === game.get('states').count())

    if (atEnd(position, gameReplayed)) {
      this.switchToManualControl()
      return
    }

    let current = gameReplayed.getIn(['states', position])
    let next = gameReplayed.getIn(['states', position + 1])
    let delta =
        new Date(next.get('at')).getTime() -
        new Date(current.get('at')).getTime()

    let nextEventIn = immediate ? 0 : (delta / this.state.speed)
    this.setState({nextEventIn})

    this.timeoutHandler = setTimeout(() => {
      dispatch(replayNext())
      this.scheduleNext()
    }, nextEventIn)
},


  render: function() {
    const {dispatch, replay} = this.props
    const gameReplayed = replay.get('gameReplayed')
    const showGameOverDialog = replay.get('showGameOverDialog', true)
    if (!gameReplayed) {
      return (<div style={{textAlign: 'center'}} className="mainPanel">
          <span>No such game</span>
      </div>)
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

      {this.state.manualControl ?
        <ReplayManualToolBar
          play={this.play}
          start={() => dispatch(replayMoveToStart())}
          prev={() => dispatch(replayPrev())}
          next={() => dispatch(replayNext())}
          end={() => dispatch(replayMoveToEnd())} />
        :
        <ReplayAutoPlayToolBar
          skip={this.skip}
          stop={this.stop}
          speed={this.state.speed}
          setSpeed={this.setSpeed}
          nextEventIn={this.state.nextEventIn}/>}

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

