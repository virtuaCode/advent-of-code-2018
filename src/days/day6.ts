import { getInput } from "../helper";

type Area = (null | number)[][]

export interface Boundary {
  minX: number, minY: number, maxX: number, maxY: number
}

export async function day6() {
  const data = await getInput('6')

  //   const data = `
  // 1, 1
  // 1, 6
  // 8, 3
  // 3, 4
  // 5, 5
  // 8, 9
  //   `

  const coordinates = data.trim().split('\n').map(line => {
    const [x, y] = line.trim().split(', ').map(e => +e)
    return [x, y] as [number, number]
  })

  const [minX, minY, maxX, maxY] = coordinates.reduce(([minX, minY, maxX, maxY], [x, y]) => {
    return [Math.min(x, minX), Math.min(y, minY), Math.max(x, maxX), Math.max(y, maxY)]
  }, [Infinity, Infinity, -Infinity, -Infinity])


  const boundary = {
    minX,
    minY,
    maxX,
    maxY
  }

  const area = fillAreaWith(coordinates, boundary, shortestLocation)

  const indices = findEdgeIndices(area, boundary)

  const sizes = calculateSizes(area)

  const maxSize = [...sizes.entries()].filter(
    ([i, count]) => !indices.has(i)
  ).reduce(
    (max, [i, count]) => (count > max ? count : max), -Infinity
  )

  console.log('A:', maxSize)


  const distanceArea = fillAreaWith(coordinates, boundary, distanceToLocation)

  const size = closeRegionSize(distanceArea)

  console.log('B:', size)
}

function distance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

function shortestLocation(coordinates: [number, number][], testX: number, testY: number): null | number {
  const [, result] = coordinates.reduce(([minDistance, result], [x, y], index, input) => {
    const currDistance = distance([x, y], [testX, testY])

    if (currDistance < minDistance) {
      return [currDistance, index] as [number, null | number]
    }

    if (currDistance === minDistance) {
      return [minDistance, null] as [number, null | number]
    }

    return [minDistance, result] as [number, null | number]
  }, [Infinity, null] as [number, null | number])

  return result
}

function distanceToLocation(coordinates: [number, number][], x: number, y: number) {
  return coordinates.reduce((prev, coordinate) => {
    return prev + distance(coordinate, [x, y])
  }, 0)
}

function fillAreaWith(
  coordinates: [number, number][],
  { minX, minY, maxX, maxY }: Boundary,
  fun: (input: [number, number][], x: number, y: number) => (number | null)
) {
  const area: (null | number)[][] = []

  for (let y = minY; y <= maxY; y++) {
    area[y] = []
    for (let x = minX; x <= maxX; x++) {
      area[y][x] = fun(coordinates, x, y)
    }
  }

  return area
}

function calculateSizes(area: Area) {
  return area.reduce((map, field) => {
    if (Array.isArray(field)) {
      for (const val of field) {
        if (typeof val === 'number') {
          map.set(val, (map.get(val) || 0) + 1)
        }
      }
      return map
    } else {
      return map
    }
  }, new Map<number, number>())
}

function findEdgeIndices(area: Area, { minX, minY, maxX, maxY }: Boundary): Set<number> {
  const set = new Set<number>()

  for (let y = minY; y <= maxY; y++) {
    const val1 = area[y][minX]
    const val2 = area[y][maxX]
    if (val1 !== null)
      set.add(val1)
    if (val2 !== null)
      set.add(val2)
  }

  for (let x = minX; x <= maxX; x++) {
    const val1 = area[minY][x]
    const val2 = area[maxY][x]
    if (val1 !== null)
      set.add(val1)
    if (val2 !== null)
      set.add(val2)
  }

  return set
}

function closeRegionSize(area: Area) {
  return area.reduce((prev, field) => {
    return prev + field.filter(sum => sum !== null && sum < 10000).length;
  }, 0);
}

function printArea(area: Area) {
  for (const field of area) {
    if (Array.isArray(field)) {
      let output = ""
      for (const element of field) {
        if (typeof element === 'number') {
          output += String(element) + " "
        } else if (element === null) {
          output += ". "
        }
      }
      console.log(output)
    }
  }
}