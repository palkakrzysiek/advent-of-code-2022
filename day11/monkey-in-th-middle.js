const fs = require('fs')
const _ = require('lodash')

const data = fs.readFileSync('input.txt', 'utf8')

const splitMonkeys = data => data.split('\n\n')
const parseMonkey = monkey => {
  const parsed = monkey.match(/Monkey (\d+):\n.*Starting items: (.+)\n  Operation: new = (.*)\n  Test: divisible by (.*)\n    If true: throw to monkey (\d+)\n    If false: throw to monkey (\d+)/m)
  return {
    monkey: parseInt(parsed[1]),
    items: parsed[2].split(', ').map(item => parseInt(item)).reverse(),
    operation: parsed[3],
    test: parseInt(parsed[4]),
    ifTrue: parseInt(parsed[5]),
    ifFalse: parseInt(parsed[6]),
    inspectionCounter: 0
  }
}

const monkeyBusiness = (data, roundsNumber, worryLevelModifier) => {
  const monkeys = _.mapValues(_.groupBy(splitMonkeys(data).map(parseMonkey), 'monkey'), array => array[0])
  const existingModuloConditions = _.uniq(_.values(monkeys).map(m => m.test))
  const moduloLimit = existingModuloConditions.reduce((a, b) => a * b)

  for (let round = 1; round <= roundsNumber; round++) {
    for (let monkeyKey in monkeys) {
      const monkey = monkeys[monkeyKey]
      let item = monkey.items.pop()
      while (item !== undefined) {
        monkey.inspectionCounter++
        const old = item
        item = Math.floor(worryLevelModifier(eval(monkey.operation)))
        if (item % monkey.test === 0)
          monkeys[monkey.ifTrue].items.push(item % moduloLimit)
        else
          monkeys[monkey.ifFalse].items.push(item % moduloLimit)
        item = monkey.items.pop()
      }
    }
  }
  return Object.values(monkeys).map(m => m.inspectionCounter).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b)
}

const partOne = data => monkeyBusiness(data, 20, level => level / 3)
const partTwo = data => monkeyBusiness(data, 10000, level => level)

console.log(partOne(data))
console.log(partTwo(data))
