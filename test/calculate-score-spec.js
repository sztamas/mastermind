import {expect} from 'chai'
import {fromJS} from 'immutable'

import {calculateScore} from '../src/reducer'

describe('calculate score', () => {
  let secret = fromJS([1, 1, 2, 3])
  describe('nothing matches', () => {
    it('returns 0 for correct and correctColor', () => {
      let guess = fromJS([0, 0, 0, 0])
     
      let score = calculateScore(secret, guess) 

      expect(score.correct).to.equal(0)
      expect(score.correctColor).to.equal(0)
    })
  })

  describe('perfect match', () => {
    it('returns 4 for correct and 0 for correctColor', () => {
      let guess = fromJS([1, 1, 2, 3])
     
      let score = calculateScore(secret, guess) 

      expect(score.correct).to.equal(4)
      expect(score.correctColor).to.equal(0)
    })
  })

  describe('all colors match but all positions are wrong', () => {
    it('returns 0 for correct and 4 for correctColor', () => {
      let guess = fromJS([2, 3, 1, 1])
     
      let score = calculateScore(secret, guess) 

      expect(score.correct).to.equal(0)
      expect(score.correctColor).to.equal(4)
    })
  })

  describe('one color match, one perfect match', () => {
    it('returns 0 for correct and 4 for correctColor', () => {
      let guess = fromJS([1, 4, 4, 1])
     
      let score = calculateScore(secret, guess) 

      expect(score.correct).to.equal(1)
      expect(score.correctColor).to.equal(1)
    })
  })


  describe('2 perfect matches same colors are not reported as correct colors', () => {
    it('returns 2 for correct and 0 for correctColor', () => {
      let guess = fromJS([1, 1, 1, 1])
     
      let score = calculateScore(secret, guess) 

      expect(score.correct).to.equal(2)
      expect(score.correctColor).to.equal(0)
    })
  })


})
