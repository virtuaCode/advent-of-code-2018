import { getInput } from "../helper";

export async function day7() {
    const data = await getInput('7')

    /*
    const data = `Step C must be finished before step A can begin.
    Step C must be finished before step F can begin.
    Step A must be finished before step B can begin.
    Step A must be finished before step D can begin.
    Step B must be finished before step E can begin.
    Step D must be finished before step E can begin.
    Step F must be finished before step E can begin.`
    */


    const graph = data.trim().split('\n').map(line => {
        const matched = line.match(/Step (\w) must be finished before step (\w) can begin\./)

        if (matched === null) {
            throw new Error()
        }

        const [match, left, right] = matched

        return [left, right] as [string, string]
    }).reduce((prev, [left, right]) => {

        const from = prev.get(right) || new Set<string>()

        if (!prev.has(left)) {
            prev.set(left, new Set<string>())
        }

        from.add(left)
        prev.set(right, from)

        return prev
    }, new Map<string, Set<string>>())

    // debug
    // console.log(graph)
    // console.log('expected:','CABDFE')

    const result = doTasks(graph)


    console.log('A:', result)
}

function doTasks(graph: Map<string, Set<string>>) {
    let output = ''

    while (graph.size > 0) {
        const entries = [...graph.entries()]

        entries.sort((a, b) => {
            if (a[0] < b[0]) { return -1; }
            if (a[0] > b[0]) { return 1; }
            return 0;
        })

        const entry = entries.find(([letter, from]) => from.size === 0)

        if (entry === undefined)
            throw new Error('entry is undefined')

        const [letter] = entry

        output += letter

        for (const [key, from] of entries) {
            from.delete(letter)
        }

        graph.delete(letter)
    }

    return output
}