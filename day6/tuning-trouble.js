const fs = require('fs')

const data = fs.readFileSync('input.txt', 'utf8')

const pastNCharsDistinctIdx = (chars, n) => {
  for (let i = n - 1; i < chars.length; i++) {
    const lastFourChars = new Set(chars.substring(i - n, i))
    if (lastFourChars.size === n)
      return i
  }
}

const part1 = data => pastNCharsDistinctIdx(data, 4)
const part2 = data => pastNCharsDistinctIdx(data, 14)

console.log(part1(data))
console.log(part2(data))
