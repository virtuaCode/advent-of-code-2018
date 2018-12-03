import { getInput } from "../helper"

export interface Rect {
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
}

export async function day3() {
    const data = await getInput('3')

    const lines = data.trim().split('\n')

    const rects = lines.map(line => parseLine(line))

    /**
     * Solution for A
     */

    const map = new Map()

    const result = rects.reduce((map, rect) => {
        for (let x = 0; x < rect.w; x++) {
            for (let y = 0; y < rect.h; y++) {
                const key = `${x + rect.x},${y + rect.y}`
                const val = map.get(key) || 0
                map.set(key, val + 1)
            }
        }

        return map
    }, map)

    const squareInches = Array.from(result.entries()).reduce((count, [k, value]) => {
        return value > 1 ? count + 1 : count
    }, 0)

    console.log('A:', squareInches)

    /**
     * Solution for B
     */

    for (let a = 0; a < rects.length; a++) {
        let anyOverlap = false

        for (let b = 0; b < rects.length; b++) {
            if (a !== b) {
                anyOverlap = anyOverlap || doOverlap(rects[a], rects[b])
            }
        }

        if (anyOverlap === false) {
            console.log('B:', rects[a].id)
            return
        }
    }
}

/**
 * doOverlap
 * 
 * ---------
 * | rect1 |
 * |   ---------
 * |   | rect2 |
 * |   |       |
 * ----|       |
 *     |       |
 *     ---------
 */


export function doOverlap(rect1: Rect, rect2: Rect) {
    return (
        rect1.x < rect2.x + rect2.w &&
        rect1.y < rect2.y + rect2.h &&
        rect2.x < rect1.x + rect1.w &&
        rect2.y < rect1.y + rect1.h
    )

}

export function parseLine(line: string): Rect {
    const match = line.match(/^(#\d+) @ (\d+),(\d+): (\d+)x(\d+)$/)

    if (!match)
        throw new Error(`regex doesn't match line: ${line}`)

    const [text, id, x, y, w, h] = match

    return {
        id,
        x: +x,
        y: +y,
        w: +w,
        h: +h,
    }
}