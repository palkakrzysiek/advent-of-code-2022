const fs = require('fs')
const _ = require('lodash')

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

const parseLine = (line) => {
  const match = line.match(/(\d+)-(\d+),(\d+)-(\d+)/)
  return {
    firstLower: parseInt(match[1]),
    firstUpper: parseInt(match[2]),
    secondLower: parseInt(match[3]),
    secondUpper: parseInt(match[4]),
  }
}

const pairContainsAnother = ({firstLower, firstUpper, secondLower, secondUpper}) =>
  firstLower <= secondLower && firstUpper >= secondUpper ||
  secondLower <= firstLower && secondUpper >= firstUpper
const part1 = (lines) => _.sum(lines.map(parseLine).map(pairContainsAnother).map(fullyContains => fullyContains ? 1 : 0))

const pairsOverlap = ({firstLower, firstUpper, secondLower, secondUpper}) =>
  firstLower >= secondLower && firstLower <= secondUpper ||
  firstUpper >= secondLower && firstUpper <= secondUpper ||
  secondLower >= firstLower && secondLower <= firstUpper ||
  secondUpper >= firstLower && secondUpper <= firstUpper
const part2 = (lines) => _.sum(lines.map(parseLine).map(pairsOverlap).map(overlap => overlap ? 1 : 0))

console.log(part1(splitInputLines(data)))
console.log(part2(splitInputLines(data)))



