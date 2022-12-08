const fs = require('fs')
const _ = require('lodash')

const range = (start, size) => [...Array(size - start).keys()].map(v => v + start)

const part1 = data => {
  const width = data[0].length
  const height = data.length
  const visibleField = [...Array(height)].map(() => [...Array(width)].map(() => true))

  const isVisible = (x, y) => {
    const h = data[y][x]
    const notVisibleUp = (x, y) => range(1, y + 1).some(offset => data[y - offset][x] >= h)
    const notVisibleDown = (x, y) => range(1, height - y).some(offset =>  data[y + offset][x] >= h)
    const notVisibleLeft = (x, y) => range(1, x + 1).some(offset =>  data[y][x-offset] >= h)
    const notVisibleRight = (x, y) => range(1, width - x).some(offset =>  data[y][x+offset] >= h)
    if ((notVisibleUp(x, y)) && (notVisibleDown(x, y)) && (notVisibleLeft(x, y)) && (notVisibleRight(x, y))) {
      visibleField[y][x] = false
      return 0
    } else {
      return 1
    }
  }
  let visibleCount = width * 2 + height * 2 - 4
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      visibleCount += isVisible(x, y)
    }
  }
  visibleField.forEach(y => console.log(y.map(x => x ? 'O' : 'X').join('')))
  return visibleCount
}

const part2 = data => {
  const width = data[0].length
  const height = data.length
  const fieldScores = [...Array(height)].map(() => [...Array(width)].map(() => 0))

  const score = (x, y) => {
    const h = data[y][x]
    const scoreUp = (x, y) => {
      let max = 0
      for (let offset = 1; offset <= y; offset++) {
        max = offset
        if (data[y - offset][x] >= h) {
          return offset
        }
      }
      return max
    }
    const scoreDown = (x, y) => {
      let max = 0
      for (let offset = 1; offset <= height - y - 1; offset++) {
        max = offset
        if (data[y + offset][x] >= h) {
          return offset
        }
      }
      return max
    }
    const scoreLeft = (x, y) => {
      let max = 0
      for (let offset = 1; offset <= x; offset++) {
        max = offset
        if (data[y][x - offset] >= h) {
          return offset
        }
      }
      return max
    }
    const scoreRight = (x, y) => {
      let max = 0
      for (let offset = 1; offset <= width - x - 1; offset++) {
        max = offset
        if (data[y][x + offset] >= h) {
          return offset
        }
      }
      return max
    }
    return scoreLeft(x,y) * scoreRight(x,y) * scoreUp(x, y) * scoreDown(x, y)
  }
  let max = 0
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const s = score(x, y)
      fieldScores[y][x] = s
      if (s > max) {
        max = s
      }
    }
  }
  // console.log(fieldScores)
  return max
}

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

console.log(part1(splitInputLines(data)))
console.log(part2(splitInputLines(data)))
