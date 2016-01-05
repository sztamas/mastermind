import React from 'react'
import {Router} from 'react-router'

import {history} from '../index.jsx'

const RulesPage = React.createClass({
  goBack: function(evt) {
    history.goBack(-1)

  },

  render: function() {
    const style = {
      width: '90%',
      margin: '40px auto',
      fontFamily: 'Georgia',
      fontSize: '110%'
    }

    return (<div style={style}>
    <p>
      At the beginning of each game the computer generates a secret code of four colors. The colors are always chosen from the same six colors.
      Duplicates are allowed, so the computer could even choose the same color four times.
    </p>
    <p>
      Your objective is to guess the secret code. You will have to guess the colors and put them in the same order as they are in the secret code.
    </p>
    <p>
      Choose four colors in the next available row and then click on the Check button. The computer will score your guess in the following way:
    </p>
      <ul>
        <li>For each guess that is right in both color and position you get a black point</li>
        <li>For each guess that is right in color but not in position you get a red point</li>
      </ul>
    <p>
      You have twelve rows to make your guesses, if you exhaust all of them without guessing the code, you lost the game.
    </p>
    <p>
      Good Luck!
    </p>

    <a href="" onClick={this.goBack}>Go back</a>
    </div>)
  }
})

export default RulesPage
