import { getInput } from "../helper";

const alphabet = "abcdefghijklmnopqrstuvwxyz"

export async function day5() {
  const data = (await getInput('5')).trim()

  let polymer = data

  polymer = reducePolymer(polymer)

  console.log('A:', polymer.length)

  let shortest = data

  for (const char of alphabet) {
    const shorter = reducePolymer(data.replace(new RegExp(char, 'gi'), ''))

    if (shorter.length < shortest.length) {
      shortest = shorter
    }
  }

  console.log('B:', shortest.length)
}

export function reducePolymer(data: string) {
  let polymer = data
  let matched = false
  do {
    matched = false;
    for (let n = 0; n < polymer.length - 1; n++) {
      const l = polymer[n]
      const r = polymer[n + 1]

      if (l !== r && l.toLowerCase() === r.toLowerCase()) {
        polymer = polymer.substr(0, n) + '__' + polymer.substr(n + 2);
        matched = true
        n++
      }
    }

    polymer = polymer.replace(/_/g, '')
  } while (matched)

  return polymer
}