import { getInput } from "../helper";

const SIZE = 300

export async function day11() {
  const data = +(await getInput('11'))

  const powerMap = buildPowerMap(data, SIZE)

  const maxA = findMaximum(powerMap, 3, 3)

  console.log(maxA)

  const maxB = findMaximum(powerMap, 1, 300)

  console.log(maxB)
}

function buildPowerMap(data: number, size: number) {
  const integral: number[][] = [Array(size).fill(0)]

  for (let y = 1; y <= size; y++) {
    integral[y] = [0]
    for (let x = 1; x <= size; x++) {
      const rackid = x + 10
      const power = Math.floor((((rackid * (y) + data) * rackid) % 1000) / 100) - 5

      integral[y][x] = integral[y - 1][x] + integral[y][x - 1] - integral[y - 1][x - 1] + power
    }
  }

  return integral
}

function sumArea(powerMap: number[][], x1: number, y1: number, x2: number, y2: number): number {
  const A = powerMap[y1 - 1][x1 - 1]
  const B = powerMap[y2][x1 - 1]
  const C = powerMap[y1 - 1][x2]
  const D = powerMap[y2][x2]

  const result = A - B - C + D

  return result
}

function findMaximum(powerMap: number[][], min = 1, max = SIZE): string {
  let maxNumber = -Infinity
  let xResult = null
  let yResult = null
  let gridSize = null

  for (let size = min; size <= max; size++) {
    for (let y = 1; y <= SIZE - size; y++) {
      for (let x = 1; x <= SIZE - size; x++) {
        const sum = sumArea(powerMap, x, y, x + size - 1, y + size - 1)
        if (sum > maxNumber) {
          maxNumber = sum
          xResult = x
          yResult = y
          gridSize = size
        }
      }
    }
  }

  return `${xResult},${yResult},${gridSize}`
}