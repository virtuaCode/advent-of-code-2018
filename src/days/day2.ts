import { getInput } from "../helper"

interface Result {
  hasTwo: boolean;
  hasThree: boolean;
}

export async function day2() {
  const data = await getInput('2')

  const lines = data.trim().split('\n')

  /**
   * Solution for A
   */

  const [a, b] = lines.reduce((sum, line) => {
    const res = analyseString(line)

    const [two, three] = sum

    return [two + (res.hasTwo ? 1 : 0), three + (res.hasThree ? 1 : 0)]
  }, [0, 0])

  console.log('A:', a * b)

  /**
   * Solution for B
   */

  for (const wordA of lines) {
    for (const wordB of lines) {
      const diffs = diffAt(wordA, wordB)

      if (diffs.length === 1) {
        const word = wordA.slice(0, diffs[0]) + wordA.slice(diffs[0] + 1)
        console.log('B:', word)
        return
      }
    }
  }
}

function analyseString(text: string): Result {
  const counts = text.split('').reduce((map, char) => {
    return { ...map, [char]: (map[char] || 0) + 1 }
  }, {} as { [key: string]: number });

  const result = {
    hasTwo: false,
    hasThree: false,
  }

  for (const [key, value] of Object.entries(counts)) {
    if (value === 2) {
      result.hasTwo = true
    } else if (value === 3) {
      result.hasThree = true
    }

    if (result.hasThree && result.hasTwo) {
      return result
    }
  }

  return result
}

function diffAt(a: string, b: string): number[] {
  const result: number[] = []

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      result.push(i)
    }
  }
  return result
}