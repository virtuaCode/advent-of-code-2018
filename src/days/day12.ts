import { getInput } from "../helper";

const USE_EXAMPLE_DATA = false
const FIVE_DOTS = '.'.repeat(5)
const GENS = 50000000000

export async function day12() {
  const data1 = await getInput('12')

  const data2 = `initial state: #..#.#..##......###...###

  ...## => #
  ..#.. => #
  .#... => #
  .#.#. => #
  .#.## => #
  .##.. => #
  .#### => #
  #.#.# => #
  #.### => #
  ##.#. => #
  ##.## => #
  ###.. => #
  ###.# => #
  ####. => #`

  const gardenA = new BinaryGarden((USE_EXAMPLE_DATA ? data2 : data1))
  gardenA.nextGenerations(20)
  console.log('A:', gardenA.getSum())

  const gardenB = new BinaryGarden((USE_EXAMPLE_DATA ? data2 : data1))
  gardenB.nextGenerationsUntilRepeat()
  console.log('B:', gardenB.getSum(GENS - gardenB.generation ))
}

class BinaryGarden {
  readonly initial: string
  private _state: string
  private _generation: number = 0
  private _index: number = 0
  private readonly map: Map<string, string>

  constructor(input: string) {
    const [initLine, _saparator, ...relations] = input.trim().split('\n')

    this.initial = initLine.trim().replace(/initial state: /, '').trim()
    this._state = this.initial

    this.map = relations.reduce((map, relation) => {
      const [key, value] = relation.trim().split(' => ')
      map.set(key, value)
      return map
    }, new Map<string, string>())
  }

  get index() {
    return this._index
  }

  set index(index) {
    this._index = index
  }

  nextGenerationsUntilRepeat() {
    let previous = ''
    let current = this._state

    do {
      previous = current
      this.nextGenerations()
      current = this._state
    } while (previous !== current)
  }

  nextGenerations(repeat = 1) {
    for (let n = 0; n < repeat; n++) {
      const expandedState = FIVE_DOTS + this._state + FIVE_DOTS
      let newState = ''

      for (let i = 0; i < expandedState.length - 5; i++) {
        const result = this.map.get(expandedState.substr(i, 5))

        if (result === undefined) {
          newState += '.'
        } else {
          newState += result
        }
      }

      let firstPlant: null | number = null

      for (let i = 0; i < newState.length; i++) {
        if (newState[i] === '#') {
          firstPlant =  i - 3
          break;
        }
      }

      if (firstPlant === null)
        throw new Error('no plant found')

      this._index = firstPlant + this._index
      
      const matched = newState.match(/^\.*([.#]*#)\.*$/)

      if (matched === null)
        throw new Error('cannot trim newState')

      this._state = matched[1]
      this._generation += 1
    }
  }

  get state() {
    return this._state
  }

  get stateWithPointer() {
    const plants = `${this._state}`.padStart(this._state.length + this._index, '.')
    const padding = ' '.repeat(Math.max(0, -this._index)) 
    const pointer = `^----- position 0 (index = ${this._index})`

    return plants + '\n' + padding + pointer
  }

  get generation() {
    return this._generation
  }

  getSum(offset = 0) {
    let sum = 0
    for (let n = 0; n < this._state.length; n++) {
      if (this._state[n] === '#') {
        sum += n + this._index + offset
      }
    }
    return sum
  }
}