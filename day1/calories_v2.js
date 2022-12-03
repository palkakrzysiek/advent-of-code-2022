const fs = require('fs');
const _ = require('lodash');

try {
  const data = fs.readFileSync('calories.input', 'utf8')
  let maxCal = [0, 0, 0]
  data.split('\n\n').forEach(perElf => {
    const elfCal = perElf.split('\n').reduce((acc, val) => acc + parseInt(val), 0)
      if (_.some(maxCal, val => val < elfCal)) {
        maxCal.push(elfCal)
        maxCal = maxCal.sort((a, b) => b - a).slice(0, 3)
      }
  })
  console.log(maxCal)
  console.log(_.sum(maxCal))
} catch (err) {
  console.error(err)
}
