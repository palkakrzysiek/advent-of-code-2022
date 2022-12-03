const fs = require('fs')

// A rock 1pt; B paper 2pts; C scissors 3pts
// X Lose 0pts; Y draw 3pts; Z win (ruskie onuce) 6tps
const resultPoints = {
  'A': {
    'X': 0 + 3,
    'Y': 3 + 1,
    'Z': 6 + 2,
  },
  'B': {
    'X': 0 + 1,
    'Y': 3 + 2,
    'Z': 6 + 3,
  },
  'C': {
    'X': 0 + 2,
    'Y': 3 + 3,
    'Z': 6 + 1,
  },
}
try {
  const data = fs.readFileSync('input.txt', 'utf8')
  let totalCount = 0
  data.split('\n').forEach(strategyLine => {
    if (strategyLine !== '') {
      const strategy = strategyLine.split(' ')
      const opponent = strategy[0]
      const me = strategy[1]
      totalCount += resultPoints[opponent][me]
    }
  })
  console.log(totalCount)
} catch (err) {
  console.error(err)
}
