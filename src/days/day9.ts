import { getInput } from "../helper";

export interface Marble {
  value: number;
  next: Marble;
  prev: Marble;
}

export async function day9() {
  const data = await getInput('9')
  //const data = `9 players; last marble is worth 25 points`

  const matched = data.match(/(\d+) players; last marble is worth (\d+) points/)

  if (matched === null)
    throw new Error('regex does not match')

  const players = +matched[1]
  const rounds = +matched[2]

  const scoresA = play(players, rounds)

  console.log('A:', maxScore(scoresA))

  const scoresB = play(players, rounds * 100)

  console.log('B:', maxScore(scoresB))
}

function play(players: number, rounds: number) {
  const scores: { [key: number]: number } = {}

  let currentMarble: Marble = initMarble(0)

  let counter = 1

  while (counter < rounds) {
    const playerNum = counter % players
    if (counter % 23 === 0) {
      scores[playerNum] = (scores[playerNum] || 0) + counter

      for (let i = 0; i < 7; i++) {
        currentMarble = currentMarble.prev
      }

      const remove = currentMarble
      scores[playerNum] += remove.value

      removeMarble(remove)
      currentMarble = currentMarble.next
    } else {
      currentMarble = insertAfterMarble(currentMarble.next, counter)
    }

    counter++
  }
  return scores
}

function initMarble(value: number): Marble {
  const anyMarble: any = { value }

  anyMarble.prev = anyMarble
  anyMarble.next = anyMarble

  return anyMarble
}

function removeMarble(marble: Marble): Marble {
  marble.prev.next = marble.next;
  marble.next.prev = marble.prev;
  return marble
}

function insertAfterMarble(marble: Marble, value: number) {
  const newMarble = {
    value,
    next: marble.next,
    prev: marble,
  }

  marble.next = newMarble
  newMarble.next.prev = newMarble
  return newMarble
}

function printMarbles(start: Marble) {
  const output = [start.value]

  for (let marble = start.next; marble !== start; marble = marble.next) {
    output.push(marble.value)
  }

  console.log(output)
}

function maxScore(scores: { [key: number]: number }): number {
  return Object.values(scores).reduce((max, n) => n > max ? n : max, 0)
}