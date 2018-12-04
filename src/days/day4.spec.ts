import * as mocha from 'mocha'
import * as chai from 'chai'

import { expect } from 'chai'
import { Event, parseEvent } from './day4';

describe('Day 4', () => {
    it('should parse event', () => {
        const expected: Event = {
          id: '232',
          action: 'shift',
          date: new Date(1501, 9, 23, 7, 54)
        }

        const line = '[1501-10-23 07:54] Guard #232 begins shift'

        expect(parseEvent(line)).to.deep.equal(expected)        
    })
})