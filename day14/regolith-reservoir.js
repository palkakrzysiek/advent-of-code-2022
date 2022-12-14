const fs = require('fs')
const _ = require('lodash')

const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

const SAND_SOURCE_X = 500
const SAND_SOURCE_Y = 0

const parseLine = line => line.split(' -> ').map(segment => {
  const xy = segment.split(',')
  return {
    x: parseInt(xy[0]),
    y: parseInt(xy[1]),
  }
})

const toStr = (x, y) => `${x},${y}`

const point = (x, y) => {
  return {x: x, y: y}
}

const DIR = {
  D: point(0, 1),
  DL: point(-1, 1),
  DR: point(1, 1)
}

const simulate = (lines, withInfiniteFloor) => {
  const rocks = new Set()
  const sand = new Set()
  const parsedLines = lines.map(parseLine)
  let maxYRock = -Infinity

  parsedLines.forEach (line => {
    for (let stepIdx = 1; stepIdx < line.length; stepIdx++) {
      const start = line[stepIdx-1]
      const end = line[stepIdx]
      const inclusiveX = end.x >= start.x ? 1 : -1
      const inclusiveY = end.y >= start.y ? 1 : -1
      const xs = _.range(start.x, end.x + inclusiveX)
      const ys = _.range(start.y, end.y + inclusiveY)

      xs.forEach(x => {
        ys.forEach(y => {
          maxYRock = y > maxYRock ? y : maxYRock
          rocks.add(toStr(x,y))
        })
      })

    }
  })

  const move = (dir1, dir2) => point(dir1.x + dir2.x, dir1.y + dir2.y)

  let newGrain = point(SAND_SOURCE_X, SAND_SOURCE_Y)
  let grainCounter = 0
  let keepFalling = true
  while (keepFalling) {
    const canFall = dir => !rocks.has(toStr(newGrain.x + dir.x, newGrain.y + dir.y)) && !sand.has(toStr(newGrain.x + dir.x, newGrain.y + dir.y)) && (newGrain.y + dir.y < maxYRock + 2)
    if (canFall(DIR.D)) {
      newGrain = move(newGrain, DIR.D)
    } else if (canFall(DIR.DL)) {
      newGrain = move(newGrain, DIR.DL)
    } else if (canFall(DIR.DR)) {
      newGrain = move(newGrain, DIR.DR)
    } else {
      sand.add(toStr(newGrain.x, newGrain.y))
      if (newGrain.x === SAND_SOURCE_X && newGrain.y === SAND_SOURCE_Y) {
        keepFalling = false // part 2 cond, works also for part 1
      } else {
        newGrain = point(SAND_SOURCE_X, SAND_SOURCE_Y)
      }
      grainCounter++
    }
    if (!withInfiniteFloor && newGrain.y > maxYRock) {
      keepFalling = false
    }
  }
  return grainCounter

}


const part1 = data => simulate(data, false)
const part2 = data => simulate(data, true)

const exampleData = fs.readFileSync('input-example.txt', 'utf8')
const inputData = fs.readFileSync('input.txt', 'utf8')

console.log(part1(splitInputLines(exampleData)))
console.log(part1(splitInputLines(inputData)))
console.log(part2(splitInputLines(exampleData)))
console.log(part2(splitInputLines(inputData)))
