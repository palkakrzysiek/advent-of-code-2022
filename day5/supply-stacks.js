const fs = require('fs')
const _ = require('lodash')

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')
const splitInitialStateAndMoves = (input) => input.split('\n\n')

const parseInitialState = (raw) => {
  const stacksNumber =  (raw[0].length + 1) / 4
  const stacks = [...Array(stacksNumber)].map(() => [])
  raw.reverse().forEach((row) => {
    for (column = 0; column < row.length/4; column += 1) {
      const symbol = row[column * 4 + 1]
      if (symbol >= 'A' && symbol <= 'Z') {
        stacks[column].push(symbol)
      }
    }
  })
  return stacks
}

const parseMove = (line) => {
  const match = line.match(/move (\d+) from (\d+) to (\d+)/)
  return {
    qty: parseInt(match[1]),
    from: parseInt(match[2]),
    to: parseInt(match[3]),
  }
}

const processMovesOneByOne = (initialState, moves) => {
  const result = _.cloneDeep(initialState)
  moves.forEach(({qty, from, to}) => {
    for (i = 0; i < qty; i++) {
      const currentItem = result[from-1].pop()
      result[to-1].push(currentItem)
    }
  })
  return result
}

const processMovesWithBatching = (initialState, moves) => {
  const result = _.cloneDeep(initialState)
  moves.forEach(({qty, from, to}) => {
    const toBeMoved = result[from-1].splice(result[from-1].length - qty, qty)
    result[to-1].push(...toBeMoved)
  })
  return result
}

const topOfStacks = (state) => state.map(stack => stack[stack.length - 1])
const part1 = (initialState, moves) => topOfStacks(processMovesOneByOne(initialState, moves)).join('')
const part2 = (initialState, moves) => topOfStacks(processMovesWithBatching(initialState, moves)).join('')

const initialStateAndMoves = splitInitialStateAndMoves(data)
const parsedInitialState = parseInitialState(splitInputLines(initialStateAndMoves[0]))
const parsedMoves = splitInputLines(initialStateAndMoves[1]).map(parseMove)

console.log(part1(parsedInitialState, parsedMoves))
console.log(part2(parsedInitialState, parsedMoves))
