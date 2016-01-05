import React from 'react'
import {connect} from 'react-redux'
import {Navigation} from 'react-router'

import {newGame} from '../actions'

const MainButton = React.createClass({
  render: function() {
    const style= {
      width: 200,
      margin: 'auto',
      padding: 12,
    }

    const buttonStyle= {
      width: 200,
      margin: 'auto',
      padding: 20,
      fontSize: 18
    }

    return (<div style={style}>
      <button style={buttonStyle} onClick={this.props.goTo}>{this.props.text}</button>
    </div>)
  }
})

const HomePage = React.createClass({
  contextTypes: {
    history: React.PropTypes.object
  },

  goToGameRules: function() {
    this.context.history.pushState(null, '/rules')
  },

  goToPlayAGame: function() {
    this.props.dispatch(newGame())
    this.context.history.pushState(null, '/play')
  },

  render: function() {

    const style= {
      padding: 20,
    }

    return (<div id="home" style={style}>
      <MainButton text="Play a Game" goTo={this.goToPlayAGame} />
      <MainButton text="Game Rules" goTo={this.goToGameRules} />
      {/*
      <MainButton text="Replay Games" />
      */}
    </div>)
  }
})

const HomePageContainer = connect()(HomePage)

export default HomePageContainer
