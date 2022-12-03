const fs = require('fs')

const resultPoints = {
  'A': {
    'X': 3,
    'Y': 6,
    'Z': 0,
  },
  'B': {
    'X': 0,
    'Y': 3,
    'Z': 6,
  },
  'C': {
    'X': 6,
    'Y': 0,
    'Z': 3,
  },
}
const shapeBonuses = {
  'X': 1,
  'Y': 2,
  'Z': 3,
}
try {
  const data = fs.readFileSync('input.txt', 'utf8')
  let totalCount = 0
  data.split('\n').forEach(strategyLine => {
    if (strategyLine !== '') {
      const strategy = strategyLine.split(' ')
      const opponent = strategy[0]
      const me = strategy[1]
      // console.log(opponent, me)
      totalCount += resultPoints[opponent][me] + shapeBonuses[me]
    }
  })
  console.log(totalCount)
} catch (err) {
  console.error(err)
}
