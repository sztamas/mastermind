import React from 'react'
import {connect} from 'react-redux'

import {newGame} from '../actions'

const ReplayGameRow = React.createClass({
  render: function() {
    const {game} = this.props
    const name = game.get('name')
    const playedAt = new Date(game.get('states').first().get('at')).toLocaleString()

    return (<tr>
      <td>
        <div>{name}</div>
        <div style={{marginTop: 5, fontSize: '90%'}}>{playedAt}</div>
       </td>
      <td>
        <button style={{padding: 8 }} onClick={this.props.replayGame}>Replay</button></td>
    </tr>)
  }
})

const ReplayGamesPage = React.createClass({
  contextTypes: {
    history: React.PropTypes.object
  },

  replayGame: function(id) {
    const history = this.context.history
    history.pushState(null, `/replay/${id}`)
  },

  render: function() {
    const {dispatch, games} = this.props

    return (<div className="mainPanel">
      <table>
        <thead>
          <tr>
            <th>Game</th>
            <th>Replay</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, id) => 
            <ReplayGameRow key={id} game={game}
              replayGame={(evt) => this.replayGame(id)}/>).valueSeq()}
        </tbody>
      </table>
    </div>)
  }
})

function mapStateToProps(state) {
  return {
    games: state.getIn(['replay', 'replayableGames'])
  }
}

const ReplayGamesPageContainer = connect(mapStateToProps)(ReplayGamesPage)

export default ReplayGamesPageContainer
