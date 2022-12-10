const fs = require('fs')

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

const processAddx = (line, register) => {
  const match = line.match(/^addx (.+)$/)
  if (match) {
    return {
      register: register + parseInt(match[1]),
      cycles: 2
    }
  } else {
    return {
      register: register,
      cycles: 0
    }
  }
}

const processNoop = (line, register) => {
  const match = line.match(/^noop$/)
  if (match) {
    return {
      register: register,
      cycles: 1
    }
  } else {
    return {
      register: register,
      cycles: 0
    }
  }
}

const execute = lines => {
  let register = 1
  let clockCounter = 0
  let signalStrengthsSum = 0
  let screen = ''
  lines.forEach(line => {
    const resultAdd = processAddx(line, register)
    let newRegister = resultAdd.register
    const resultNoop = processNoop(line, newRegister)
    newRegister = resultNoop.register
    const clockDiff = resultNoop.cycles + resultAdd.cycles
    for (let i = 1; i <= clockDiff; i++) {
      clockCounter += 1
      const ctrRow = clockCounter % 40
      screen += ctrRow - register >= 0 && ctrRow - register < 3 ? '#' : '.'
      if (clockCounter % 40 === 0) {
        screen += '\n'
      }
      if (clockCounter % 40 === 20) {
        signalStrengthsSum += clockCounter * register
      }
    }
    register = newRegister
  })
  console.log(screen)
  return signalStrengthsSum
}

console.log(execute(splitInputLines((data))))
