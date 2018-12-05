import { getInput } from "../helper";

const alphabet = "abcdefghijklmnopqrstuvwxyz"

export async function day5() {
  const data = (await getInput('5')).trim()

  let polymer = data

  polymer = reducePolymer(polymer)

  console.log('A:', polymer.length)

  let shortest = Infinity

  for (const char of alphabet) {
    const shorter = reducePolymer(data.replace(new RegExp(char, 'gi'), '')).length

    if (shorter < shortest) {
      shortest = shorter
    }
  }

  console.log('B:', shortest)
}

export function reducePolymer(data: string) {
  let polymer = data
  let maxIndex = polymer.length - 1
  for (let n = 0; n < maxIndex; n++) {
    const l = polymer[n]
    const r = polymer[n + 1]

    if (l !== r && l.toLowerCase() === r.toLowerCase()) {
      polymer = polymer.substr(0, n) + polymer.substr(n + 2);
      n = Math.max(1, n - 2)
      maxIndex -= 2
    }
  }
  return polymer
}