const fs = require('fs')

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

const parseMove = (move) => {
  const split = move.split(' ')
  return {
    direction: split[0],
    steps: parseInt(split[1])
  }
}

const position = (x, y) => {
  return {
    x: x,
    y: y
  }
}

const compare = (pos1, pos2) => position(pos1.x - pos2.x, pos1.y - pos2.y)

const movePointTowards = (from, to) => {
  const diff = compare(from, to)
  const newPosDiff = diffOneDim => diffOneDim > 1 ? -1 : (diffOneDim < -1 ? 1 : 0)
  const maxOne = value => value > 1 ? 1 : (value < -1 ? -1 : value)
  const xDiff = newPosDiff(diff.y) === 0 ? newPosDiff(diff.x) : -maxOne(diff.x)
  const yDiff = newPosDiff(diff.x) === 0 ? newPosDiff(diff.y) : -maxOne(diff.y)
  return position(from.x + xDiff, from.y + yDiff)
}

const parseDirection = direction => {
  switch (direction) {
    case 'R': return position(1, 0)
    case 'L': return position(-1, 0)
    case 'U': return position(0, -1)
    case 'D': return position(0, 1)
  }
}

const coveredPoints = (moves, ropeSize) => {
  const visitedPositions = new Set()
  const rope = [...Array(ropeSize)].map(() => position(0, 0))
  visitedPositions.add(`${rope[ropeSize-1].x}:${rope[ropeSize-1].y}`)
  moves.map(parseMove).forEach(move => {
    const dir = parseDirection(move.direction)
    for (let i = 0; i < move.steps; i++) {
      rope[0] = position(rope[0].x + dir.x, rope[0].y + dir.y)
      for (let ropeIdx = 1; ropeIdx < ropeSize; ropeIdx++) {
        rope[ropeIdx] = movePointTowards(rope[ropeIdx], rope[ropeIdx-1])
      }
      const tail = rope[ropeSize-1]
      // const log = [...Array(ropeSize).keys()].map(idx => `${rope[idx].x}:${rope[idx].y}`).join('  |  ')
      // console.log(log)
      visitedPositions.add(`${tail.x}:${tail.y}`)
    }
  })
  return visitedPositions.size
}

const part1 = data => coveredPoints(splitInputLines(data), 2)
const part2 = data => coveredPoints(splitInputLines(data), 10)

console.log(part1(data))
console.log(part2(data))
