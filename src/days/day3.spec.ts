import * as mocha from 'mocha'
import * as chai from 'chai'
import { Rect, parseLine } from './day3'
import { expect } from 'chai'

describe('day3 part A', () => {
    it('should parse line', () => {
        const expected: Rect = {
            id: '#123',
            x: 30,
            y: 40,
            w: 300,
            h: 400,
        }

        const line = '#123 @ 30,40: 300x400'

        expect(parseLine(line)).to.deep.equal(expected)        
    })
})