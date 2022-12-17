const fs = require('fs')
const _ = require('lodash')

const InputExample = fs.readFileSync('input-example.txt', 'utf8')
const Input = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')


const parseLine = line => {
  const match = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
  return {
    sensor: {
      x: parseInt(match[1]),
      y: parseInt(match[2]),
    },
    beacon: {
      x: parseInt(match[3]),
      y: parseInt(match[4]),
    }
  }
}


const part1 = (lines, atY) => {

  let minSensorX = Infinity
  let maxSensorX = -Infinity
  let maxDistanceGlobally = 0

  const noBeaconHere = (sensorX, sensorY, beaconX, beaconY) => {
    const maxDistance = Math.abs(beaconX - sensorX) + Math.abs(sensorY - beaconY)
    return (whereX, whereY) => {
      const distance = Math.abs(whereX - sensorX) + Math.abs(whereY - sensorY)
      return distance <= maxDistance
    }
  }

  const parsed = lines.map(parseLine)
  parsed.forEach(({sensor, beacon}) => {
    const maxDistance = Math.abs(beacon.x - sensor.x) + Math.max(sensor.y - beacon.y)
    minSensorX = minSensorX <= sensor.x ? minSensorX : sensor.x
    maxSensorX = maxSensorX >= sensor.x ? maxSensorX : sensor.x
    maxDistanceGlobally = maxDistanceGlobally >= maxDistance ? maxDistanceGlobally : maxDistance

  })

  const beacons = new Set()
  const mkStr = (x, y) => `${x},${y}`
  const isBeacon = (x, y) => beacons.has(mkStr(x, y))

  parsed.forEach(({beacon}) => beacons.add(mkStr(beacon.x, beacon.y)))

  const noBeaconSet = parsed.reduceRight((acc, line) => (x, y) => isBeacon(x, y) ? false :
    noBeaconHere(line.sensor.x, line.sensor.y, line.beacon.x, line.beacon.y)(x, y) ? true : acc(x, y), () => false)

  let noBeaconCounter = 0
  for (let x = minSensorX - maxDistanceGlobally; x <= maxSensorX + maxDistanceGlobally; x++) {
    if (noBeaconSet(x, atY)) {
      noBeaconCounter++
    }
  }
  return noBeaconCounter
}

console.log(part1(splitInputLines(InputExample), 10))
console.log(part1(splitInputLines(Input), 2000000))
