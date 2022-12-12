const fs = require('fs')
const _ = require('lodash')

const point = (x, y) => {
  return {x: x, y: y}
}

const symbolHeight = symbol => symbol === 'S' ? 0 : symbol === 'E' ? 25 : symbol.charCodeAt(0) - 'a'.charCodeAt(0)


const part1 = map => {
  const maxY = map.length - 1
  const maxX = map[0].length - 1
  const findStartPoint = () => {
    for (let y = 0; y <= maxY; y++)
      for (let x = 0; x <= maxX; x++)
        if (map[y][x] === 'S')
          return point(x, y)
  }
  const height = (point) => symbolHeight(map[point.y][point.x])
  const canMove = (from, dir) => {
    const to = point(from.x + dir.x, from.y + dir.y)
    if (to.x < 0 || to.x > maxX || to.y < 0 || to.y > maxY) return false
    else return Math.abs(height(from) - height(to)) <= 1
  }
  const isPreferredMove = (from, dir) => {
    if (!canMove(from, dir)) {
      return false
    } else {
      const to = point(from.x + dir.x, from.y + dir.y)
      return height(to) - height(from) === 1
    }
  }
  const allDirections = [point(0, 1), point(0, -1), point(1, 0), point(-1, 0)]
  const moveUpwards = (from) => {
    return allDirections.find(to => isPreferredMove(from, to))
  }
  const possiblePaths = []
  let minPossibleLength = Infinity
  const dfs = (position, visited) => {
    if (visited.length >= minPossibleLength) {
      return
    }
    const currentPosStr = `${position.x}:${position.y}`
    const newVisited = [...visited]
    newVisited.push(currentPosStr)
    const wasVisited = (dir) => visited.includes(`${position.x + dir.x}:${position.y + dir.y}`)
    const visitIfPossible = (to) => {
      if (canMove(position, to) && !wasVisited(to))
        dfs(point(position.x + to.x, position.y + to.y), newVisited)
    }
    if (map[position.y][position.x] === 'E') {
      if (newVisited.length < minPossibleLength) {
        minPossibleLength = newVisited.length
        console.log(minPossibleLength)
        possiblePaths.push(newVisited)
      }
    }
    else {
      const preferredMove = moveUpwards(position)
      if (preferredMove) {
        visitIfPossible(preferredMove)
        allDirections.filter(dir => dir.x !== preferredMove.x && dir.y !== preferredMove.y).forEach(visitIfPossible)
      } else {
        allDirections.forEach(visitIfPossible)
      }
    }
  }
  const startPoint = findStartPoint()
  dfs(startPoint, [])
  console.log(possiblePaths)
  console.log(_.min(possiblePaths.map(path => path.length)) - 1)
}

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

part1(splitInputLines(data))







