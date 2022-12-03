const fs = require('fs')
const _ = require('lodash')

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

const priority = (item) => item >= 'A' && item <= 'Z' ?
  item.charCodeAt() - 'A'.charCodeAt() + 1 + 26 :
  item.charCodeAt() - 'a'.charCodeAt() + 1
const lineToPriorities = line => (line.split('').map(priority))

const splitCompartments = (rucksack) => [rucksack, rucksack.splice(rucksack.length / 2)]
const overlappingElement = ([compartment1, compartment2]) => {
  secondCompartmentSet = new Set(compartment1)
  return compartment2.find(val => secondCompartmentSet.has(val))
}
const part1 = (lines) => _.sum(lines.map(line => overlappingElement(splitCompartments(lineToPriorities(line)))))
console.log(part1(splitInputLines(data)))

const toGroups = rucksacks => _.chunk(rucksacks, 3)
const commonItem = ([elf1, elf2, elf3]) => {
  const elf2Set = new Set(elf2)
  const commonBetweenFirstAndSecond = new Set(elf1.filter(item => elf2Set.has(item)))
  return elf3.find(item => commonBetweenFirstAndSecond.has(item))
}
const part2 = (lines) => _.sum(toGroups(lines.map(lineToPriorities)).map(commonItem))
console.log(part2(splitInputLines(data)))
