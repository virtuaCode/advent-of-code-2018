import { getInput } from "../helper";

export interface Event {
  id?: string,
  action: 'shift' | 'asleep' | 'awake'
  date: Date
}

export async function day4() {
  const data = await getInput('4')

  const lines = data.trim().split('\n')

  /**
   * Solution for A
   */

  const events = lines.map(e => parseEvent(e))

  events.sort((a, b) => {
    return a.date.getTime() - b.date.getTime()
  })

  const guardNaps = new Map<string, [number, number][]>()

  let guard = null
  let start = 0
  let end = 0

  for (const e of events) {
    if (e.action === 'shift') {
      guard = e.id
    } else if (e.action === 'asleep') {
      start = e.date.getMinutes()
    } else if (e.action === 'awake') {
      end = e.date.getMinutes()
      if (guard) {
        const previous = guardNaps.get(guard) || []
        guardNaps.set(guard, [...previous, [start, end]])
      }
    }
  }

  const [id, sum, ranges] = Array.from(guardNaps.entries()).map(([id, ranges]) => {
    const sum = ranges.reduce((sum, [l, r]) => sum + (r - l), 0)
    return [id, sum, ranges] as [string, number, [number, number][]]
  }).reduce((max, cur) => {
    return cur[1] > max[1] ? cur : max
  })

  const minute = ranges.reduce((stats, [start, end]) => {
    for (let i = start; i < end; i++) {
      stats[i] = (stats[i] || 0) + 1
    }
    return stats
  }, [] as number[]).reduce((maxIdx, cur, idx, stats) => {
    return cur > stats[maxIdx] ? idx : maxIdx
  })

  console.log('A:', +id * minute)

  /**
   * Solution for B
   */

  const naps = Array.from(guardNaps.entries())

  const [idB, countB, minuteB] = naps.map(([id, ranges]) => {
    const [count, minute] =
      ranges.reduce((stats, [start, end]) => {
        for (let i = start; i < end; i++) {
          stats[i] = (stats[i] || 0) + 1
        }
        return stats
      }, [] as number[]).map((n, index) => {
        return [n, index] as [number, number]
      }).reduce(([count, minute], [cur, curIdx], idx, stats) => {
        return cur > stats[minute][0] ? [cur, idx] : [count, minute]
      })
    return [id, count, minute] as [string, number, number]
  }).reduce((prev, [id, count, minute]) => {
    return (count > prev[1] ? [id, count, minute] : prev) as [string, number, number]
  })

  console.log('B:', +idB * minuteB)
}

export function parseEvent(line: string): Event {
  const timeMatch = line.match(/^\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (.*)$/)

  if (!timeMatch)
    throw new Error(`Invalid line: ${line}`)

  const [match, year, month, day, hour, minute, actionText] = timeMatch

  const [action, id] = parseAction(actionText)

  return {
    date: new Date(+year, +month - 1, +day, +hour, +minute),
    id: id,
    action,
  }
}

export function parseAction(line: string): ['awake' | 'asleep' | 'shift', string?] {
  let match
  if (match = line.match(/falls asleep/)) {
    return ['asleep', undefined]
  } else if (match = line.match(/wakes up/)) {
    return ['awake', undefined]
  } else if (match = line.match(/Guard #(\d+) begins shift/)) {
    return ['shift', match[1]]
  }

  throw new Error('Invalid action text')
}