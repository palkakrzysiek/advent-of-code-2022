const fs = require('fs');

try {
  const data = fs.readFileSync('calories.input', 'utf8')
  let maxCal = 0
  data.split('\n\n').forEach(perElf => {
      const elfCal = perElf.split('\n').reduce((acc, val) => acc + parseInt(val), 0)
      if (elfCal > maxCal) {
        maxCal = elfCal
      }
    }
  )
  console.log(maxCal)
} catch (err) {
  console.error(err)
}
