import React from 'react'
import {take, times, constant} from 'lodash'

import {changeColor, scoreGuess} from '../actions'
import {isGameOver} from '../game'

const colorScheme = {
  0: 'red',
  1: 'cyan',
  2: 'green',
  3: 'orange',
  4: 'magenta',
  5: 'blue',
  'correct': 'black',
  'correctColor': 'red'
}

const Peg = React.createClass({
  onClick: function(evt) {
    evt.stopPropagation()
    const peg = evt.target
    const {top, left, width, height} = peg.getBoundingClientRect()
    const {index, color, isEditable, changeColor} = this.props
    if (!isEditable) {
      return
    }
    this.props.showColorChooser(this.props.index, peg)
  },

  render: function() {
    const {color, isEditable} = this.props
    let type = "hole"
    let style = {}

    if (color !== null) {
      style = {
        backgroundColor: colorScheme[color],
        borderColor: colorScheme[color]
      }
      type = "peg"
    }
    if (isEditable) {
      style.cursor = 'pointer'
    }

    return (<div className={type} style={style} onClick={this.onClick}>
    </div>)
  }
})

const ScorePeg = React.createClass({
  getType: function (score) {
      let type
      let style = null
      if (score === 'correct') {
        type = 'small peg'
        style = {backgroundColor: colorScheme['correct']}
      } else if (score === 'correctColor') {
        type = 'small peg'
        style = {backgroundColor: colorScheme['correctColor']}
      } else {
        type = 'small hole'
      }
      return [type, style]
  },

  render: function() {
    let [type, style] = this.getType(this.props.value)
    return (<div className={type} style={style}>
    </div>)
  }
})

const Scores = React.createClass({
  convertScore: function(scoresObj) {
    if (!scoresObj) {
      return [null, null, null, null]
    }
    const correct = scoresObj.get('correct', 0)
    const correctColor = scoresObj.get('correctColor', 0)
    return ensureLength(
      times(correct, constant('correct')).concat(times(correctColor, constant('correctColor'))),
      4)
  },

  render: function() {
    const [score1, score2, score3, score4] = this.convertScore(this.props.score)

    return (<div className="score">
      <div>
        <ScorePeg value={score1} />
        <ScorePeg value={score2} />
      </div>
      <div>
        <ScorePeg value={score3} />
        <ScorePeg value={score4} />
      </div>
    </div>)
  }
})

const Row = React.createClass({
  allPegsSet: function(row) {
    return row.get('pegs').every(peg => peg !== null)
  },

  scoresOrEvaluteButton: function(row, isEditable, isCurrentRow) {
    if (isCurrentRow) {
      return (<div className='score'>
        <button className="checkButton"
          disabled={!(isEditable && this.allPegsSet(row))}
          onClick={this.props.score}>Check</button>
      </div>)
    }
    return <Scores score={row.get('score')} />
  },

  render: function() {
    const {row, isEditable, isCurrentRow, showColorChooser}  = this.props

    return (<div className="row">
      <div className="holes">
        {row.get('pegs').map((color, idx) =>
            <Peg key={idx} index={idx} isEditable={isEditable} color={color} showColorChooser={showColorChooser} />)}
      </div>
      {this.scoresOrEvaluteButton(row, isEditable, isCurrentRow)}
    </div>)
  }
})

const ColorChooser = React.createClass({
  getInitialState: function() {
    return {
      isShowing: false,
      style: {
        display: 'none'
      }
    }
  },

  show: function(targetEl) {
    if (this.state.isShowing && targetEl === this.state.showingForEl) {
      this.close()
      return
    }
    let myTop, myLeft
    const targetRect = targetEl.getBoundingClientRect()
    myTop = window.scrollY + targetRect.top + targetRect.height / 2
    myLeft = targetRect.right - targetRect.width / 2
    this.setState({
      showingForEl: targetEl,
      isShowing: true,
      style: {
        display: 'block',
        top: myTop,
        left: myLeft
      }})
  },

  close: function() {
    this.setState({
      style: {
        display: 'none'
      },
      isShowing: false
    })
  },

  colorClick: function(colIndex) {
    this.props.changeColor(colIndex)
    this.close()
  },

  render: function() {
    const {changeColor} = this.props

    const colorBlock = colIndex => {
      return (<div className="color"
          onClick={() => this.colorClick(colIndex)}
          style={{backgroundColor: colorScheme[colIndex]}}>
      </div>)
    }

    return (<div id="colorChooser" style={this.state.style}>
      <div>
        {colorBlock(0)}
        {colorBlock(1)}
        {colorBlock(2)}
      </div>
      <div>
        {colorBlock(3)}
        {colorBlock(4)}
        {colorBlock(5)}
      </div>
    </div>)
  }
})

const Board = React.createClass({

  showColorChooser: function(pegIdx, pegEl) {
    this.refs.colorChooser.show(pegEl)
    this.pegIdx = pegIdx
  },

  render: function() {
    const {game, dispatch} = this.props
    const boardEditable = this.props.hasOwnProperty('editable') ? this.props.editable : true
    const rows = game.get('rows')
    const gameState = game.get('state')
    if (!rows) {
      return <div id="board"></div>
    }

    const currentRowIdx = rows.findIndex(row => !row.get('score'))

    const noop = () => {}

    return (<div className="mainPanel">
      {rows.map((row, idx) =>
        <Row key={idx}
          isEditable={boardEditable && !isGameOver(gameState) && currentRowIdx === idx}
          isCurrentRow={currentRowIdx === idx}
          row={row}
          showColorChooser={boardEditable ? this.showColorChooser : noop}
          score={() => boardEditable ? dispatch(scoreGuess(idx)) : noop} />)}

      <ColorChooser ref='colorChooser'
        changeColor={(newColor) => dispatch(changeColor(currentRowIdx, this.pegIdx, newColor))} />

    </div>)
  }

})

function ensureLength(xs, requiredLength, fillValue=null) {
  return xs.concat(times(constant(fillValue), requiredLength - xs.length))
}

export default Board;

