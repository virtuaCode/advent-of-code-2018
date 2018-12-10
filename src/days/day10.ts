import { getInput } from "../helper";

const USE_EXAMPLE_DATA = false

export async function day10() {
    const data1 = await getInput('10')
    const data2 = `
    position=< 9,  1> velocity=< 0,  2>
    position=< 7,  0> velocity=<-1,  0>
    position=< 3, -2> velocity=<-1,  1>
    position=< 6, 10> velocity=<-2, -1>
    position=< 2, -4> velocity=< 2,  2>
    position=<-6, 10> velocity=< 2, -2>
    position=< 1,  8> velocity=< 1, -1>
    position=< 1,  7> velocity=< 1,  0>
    position=<-3, 11> velocity=< 1, -2>
    position=< 7,  6> velocity=<-1, -1>
    position=<-2,  3> velocity=< 1,  0>
    position=<-4,  3> velocity=< 2,  0>
    position=<10, -3> velocity=<-1,  1>
    position=< 5, 11> velocity=< 1, -2>
    position=< 4,  7> velocity=< 0, -1>
    position=< 8, -2> velocity=< 0,  1>
    position=<15,  0> velocity=<-2,  0>
    position=< 1,  6> velocity=< 1,  0>
    position=< 8,  9> velocity=< 0, -1>
    position=< 3,  3> velocity=<-1,  1>
    position=< 0,  5> velocity=< 0, -1>
    position=<-2,  2> velocity=< 2,  0>
    position=< 5, -2> velocity=< 1,  2>
    position=< 1,  4> velocity=< 2,  1>
    position=<-2,  7> velocity=< 2, -2>
    position=< 3,  6> velocity=<-1, -1>
    position=< 5,  0> velocity=< 1,  0>
    position=<-6,  0> velocity=< 2,  0>
    position=< 5,  9> velocity=< 1, -2>
    position=<14,  7> velocity=<-2,  0>
    position=<-3,  6> velocity=< 2, -1>`

    const data = USE_EXAMPLE_DATA ? data2 : data1

    const stars = data.trim().split('\n').map(line => {
        const matched = line.match(/position=<\s*(-?\d+),\s*(-?\d+)\s*> velocity=<\s*(-?\d+),\s*(-?\d+)\s*>/)

        if (matched === null)
            throw new Error(`no match for line: ${line}`)

        return new Star(
            new Vector2(+matched[1], +matched[2]),
            new Vector2(+matched[3], +matched[4])
        )
    })

    const starMap = new StarMap(stars)

    starMap.adjustStars()

    console.log('A:')

    starMap.printStars()

    console.log('B:', starMap.seconds)
}



class Vector2 {
    constructor(public readonly x: number, public readonly y: number) { }

    add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y)
    }

    mult(factor: number) {
        return new Vector2(this.x * factor, this.y * factor)
    }
}

class Star {
    constructor(public position: Vector2, public velocity: Vector2) { }

    move(steps = 1) {
        this.position = this.position.add(this.velocity.mult(steps))
    }
}

class StarMap {
    private _seconds: number = 0

    constructor(public readonly stars: Star[]) { }

    get seconds() {
        return this._seconds
    }

    move(secs: number) {
        for (const star of this.stars) {
            star.move(secs)
        }

        this._seconds += secs
    }

    printStars() {
        const [x1, y1, x2, y2] = this.findBoundary()

        const yHeight = Math.abs(y1 - y2) + 1
        const xWidth = Math.abs(x1 - x2) + 1

        const map: boolean[][] = []

        for (let y = 0; y < yHeight; y++) {
            map[y] = []
            for (let x = 0; x < xWidth; x++) {
                map[y][x] = false
            }
        }

        for (const { position: { x, y } } of this.stars) {
            map[y - y1][x - x1] = true
        }

        for (const line of map) {
            for (const bool of line) {
                if (bool)
                    process.stdout.write('#')
                else
                    process.stdout.write('.')
            }
            process.stdout.write('\n')
        }
    }

    adjustStars() {
        let prevHeight = Infinity
        let prevWidth = Infinity

        // reset Stars to initial position
        this.move(-this._seconds)

        while (true) {
            const [x1, y1, x2, y2] = this.findBoundary()

            const width = Math.abs(x1 - x2) + 1
            const height = Math.abs(y1 - y2) + 1
    
            if (width > prevWidth || height > prevHeight) {
                this.move(-1)
                return
            }
    
            prevHeight = height
            prevWidth = width
    
            this.move(1)
        }
    }

    private findBoundary() {
        return this.stars.reduce(([x1, y1, x2, y2], { position }) => {
            return [
                position.x < x1 ? position.x : x1,
                position.y < y1 ? position.y : y1,
                position.x > x2 ? position.x : x2,
                position.y > y2 ? position.y : y2,
            ] as [number, number, number, number]
        }, [Infinity, Infinity, -Infinity, -Infinity])
    }
}