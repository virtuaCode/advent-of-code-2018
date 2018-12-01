import { getInput } from '../helper'

export async function day1() {
  const data = await getInput('1')
  const numbers =
    data
      .trim()
      .split('\n')
      .map((line: string) => +line)


  /**
   * Solution for A
   */

  const sumA = numbers.reduce((sum: number, num: number) => sum + num, 0)
  console.log('A:', sumA)

  /**
   * Solution for B
   */

  let sumB = 0
  const set = new Set([0])

  while (true) {
    for (const n of numbers) {
      sumB += n
      if (set.has(sumB)) {
        console.log('B:', sumB)
        process.exit(0)
      }
      set.add(sumB)
    }
  }
}
