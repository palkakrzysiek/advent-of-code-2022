const fs = require('fs')
const _ = require('lodash')

const point = (x, y) => {
  return {x: x, y: y}
}

const allDirections = [point(0, 1), point(0, -1), point(1, 0), point(-1, 0)]

const symbolHeight = symbol => symbol === 'S' ? 0 : symbol === 'E' ? 25 : symbol.charCodeAt(0) - 'a'.charCodeAt(0)

const lowestDistanceFromSymbol = (map, startSymbol) => {
  const maxY = map.length
  const maxX = map[0].length

  const findPointsWithSymbol = symbol => {
    let points = []
    for (let y = 0; y <= maxY - 1; y++)
      for (let x = 0; x <= maxX - 1; x++)
        if (map[y][x] === symbol)
          points.push(point(x, y))
    return points
  }

  const canMove = (from, dir) => {
    const to = point(from.x + dir.x, from.y + dir.y)
    if (to.x < 0 || to.x > maxX - 1 || to.y < 0 || to.y > maxY - 1) return false
    else return  height(to) - height(from) <= 1
  }

  const height = (point) => symbolHeight(map[point.y][point.x])

  const mkVertices = () => {
    const buffer = [...Array(maxY)].map(() => [...Array(maxX)].map(() => {
      return {
        distance: Infinity,
        possibleMoves: [],
        predecessor: null
      }
    }))
    for (let y = 0; y <= maxY - 1; y++)
      for (let x = 0; x <= maxX - 1; x++)
        for (const direction of allDirections)
          if (canMove(point(x, y), direction))
            buffer[y][x].possibleMoves.push(buffer[y + direction.y][x + direction.x])
    return buffer
  }

  const targetPoint = findPointsWithSymbol('E')[0]
  const distanceToTarget = from => {
    const vertices = mkVertices()
    vertices[from.y][from.x].distance = 0

    let queue = [vertices[from.y][from.x]]
    const enqueue = vertex => {
      queue.push(vertex)
      queue = _.uniq(queue)
      queue = queue.sort((a, b) => b.distance - a.distance)
    }

    while (queue.length !== 0) {
      const currentVertex = queue.pop()
      for (let possibleMove of currentVertex.possibleMoves) {
        if (currentVertex.distance + 1 < possibleMove.distance) {
          possibleMove.distance = currentVertex.distance + 1
          possibleMove.predecessor = currentVertex
          enqueue(possibleMove)
        }
      }
    }
    return vertices[targetPoint.y][targetPoint.x].distance
  }

  const startPoints = findPointsWithSymbol(startSymbol)
  return _.min(startPoints.map(distanceToTarget))
}

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

const part1 = map => lowestDistanceFromSymbol(map, 'S')
const part2 = map => lowestDistanceFromSymbol(map, 'a')

console.log(part1(splitInputLines(data)))
console.log(part2(splitInputLines(data)))
