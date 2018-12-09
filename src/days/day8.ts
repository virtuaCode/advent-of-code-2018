import { getInput } from "../helper";

export async function day8() {
  const data = await getInput('8')

  const numbers = data.trim().split(/\s+/).map(e => +e)

  const node = new Node(numbers)

  console.log('A:', node.reduceMetadata)

  console.log('B:', node.reduceMetadataRef)
}

class Node {
  metaDataCount: number
  nodeCount: number
  childNodes: Node[] = []
  metaData: number[] = []

  constructor(input: number[]) {
    const ncount = input.shift()
    const mcount = input.shift()

    if (ncount === undefined)
      throw new Error('no value for node count')

    if (mcount === undefined)
      throw new Error('no value for metadata count')

    this.metaDataCount = mcount
    this.nodeCount = ncount

    for (let i = 0; i < ncount; i++) {
      this.childNodes.push(new Node(input))
    }

    for (let i = 0; i < mcount; i++) {
      const mdata = input.shift()

      if (mdata === undefined)
        throw new Error('expected metadata but got undefined')

      this.metaData.push(mdata)
    }
  }

  get reduceMetadata(): number {
    const metaSum = this.metaData.reduce((acc, data) => acc + data, 0)
    const childSum = this.childNodes.reduce((acc, node) => acc + node.reduceMetadata, 0)

    return metaSum + childSum
  }

  get reduceMetadataRef(): number {
    if (this.childNodes.length === 0) {
      return this.reduceMetadata
    }

    return this.metaData.reduce((acc, ref) => {
      const childNode = this.childNodes[ref - 1]
      return childNode ? acc + childNode.reduceMetadataRef : acc
    }, 0)
  }
}