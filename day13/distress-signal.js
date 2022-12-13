const fs = require('fs')
const _ = require('lodash')

const splitPairs = data => data.split('\n\n')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

const isCorrect = (line1, line2) => {
  let left = line1.shift()
  while (left !== undefined) {
    let right = line2.shift()
    if (right === undefined) {
      return false
    }
    if (typeof left === 'number' && typeof right === 'number') {
      if (left < right) {
        return true
      } else if (left > right) {
        return false
      }
    } else if (Array.isArray(left) && Array.isArray(right)) {
      const result = isCorrect(_.cloneDeep(left), _.cloneDeep(right))
      if (result === true) return true
      else if (result === false) return false
    } else if (Array.isArray(left) && typeof right === 'number') {
      const result = isCorrect(_.cloneDeep(left), [right])
      if (result === true) return true
      else if (result === false) return false
    } else if (typeof left === 'number' && Array.isArray(right)) {
      const result = isCorrect([left], _.cloneDeep(right))
      if (result === true) return true
      else if (result === false) return false
    }
    left = line1.shift()
  }
  if (line2.length > line1.length) {
    return true
  } else if (line2.length < line1.length) {
    return false
  } else {
    return "🤷"
  }

}

const part1 = pairs => {
  let correctCounter = 0
  pairs.forEach((pair, idx) => {
    const line1 = eval(pair[0])
    const line2 = eval(pair[1])
    if (isCorrect(line1, line2) === true) {
      correctCounter += idx + 1
    }
  })
  return correctCounter
}

const ordering = (a, b) => {
  const result = isCorrect(_.cloneDeep(a), _.cloneDeep(b))
  if (result === true) return -1
  else if (result !== false) return 1
  else return 0
}

const part2 = lines => {
  const withDividers = lines.map(eval)
  withDividers.push([[2]])
  withDividers.push([[6]])
  let decoderKey = 1
  withDividers.sort(ordering).forEach((line, idx) => {
    if (_.isEqual(line, [[2]]) || _.isEqual(line, [[6]])) {
      decoderKey *= idx + 1
    }
  })
  return decoderKey
}


const examples = [
  [[1], [1], '🤷'],
  [[1,1,3,1,1], [1,1,5,1,1], true],
  [[[1],[2,3,4]], [[1],4], true],
  [[9], [[8,7,6]], false],
  [[[4,4],4,4], [[4,4],4,4,4], true],
  [[7,7,7,7], [7,7,7], false],
  [[], [3], true],
  [[[[]]], [[]], false],
  [[1,[2,[3,[4,[5,6,7]]]],8,9], [1,[2,[3,[4,[5,6,0]]]],8,9], false]
]

for (const [left, right, expected] of examples) {
  const result = isCorrect(_.cloneDeep(left), _.cloneDeep(right))
  console.assert(result === expected, `expected ${expected}, got ${result}`, left, right)
}

const exampleData = fs.readFileSync('input-example.txt', 'utf8')
const inputData = fs.readFileSync('input.txt', 'utf8')
console.log(part1(splitPairs(exampleData).map(splitInputLines)))
console.log(part1(splitPairs(inputData).map(splitInputLines)))
console.log(part2(splitInputLines(exampleData)))
console.log(part2(splitInputLines(inputData)))
