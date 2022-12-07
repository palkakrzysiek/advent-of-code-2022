const fs = require('fs')
const _ = require('lodash')

const data = fs.readFileSync('input.txt', 'utf8')
const splitInputLines = (input) => input.split('\n').filter(line => line !== '')

const newDir = (name, parent) => {
  let dir = {
    '..': parent,
    name: name,
    children: {},
    files: {}
  }
  dir['.'] = dir
  if (!parent) // root
    dir['..'] = dir
  return dir
}

const dirUp = state => {
  const currentRef = state['.']
  state['.'] = currentRef['..']
  state['..'] = currentRef['..']['..']
}

const parseCd = (line, state) => {
  let match = line.match(/^\$ cd (.+)$/)
  if (match) {
    const dir = match[1]
    if (dir === '/') {
      let currentDir = state['.']['name']
      while (currentDir !== '/') {
        dirUp(state)
        currentDir = state['.']['name']
      }
    } else if (dir === '..') {
      dirUp(state)
    } else {
      if (state['.']['children'][dir]) {
        state['..'] = state['.']
        state['.'] = state['.']['children'][dir]['.']
      } else {
        state['.']['children'][dir] = newDir(dir, state['.'])
        state['..'] = state['.']
        state['.'] = state['.']['children'][dir]['.']
      }
    }
  }
}

const parseFile = (line, state) => {
  let match = line.match(/^(\d+) (.*)$/)
  if (match) {
    state['.']['files'][match[2]] = parseInt(match[1])
  }
}

const parseInput = lines => {
  const state = newDir('/')
  lines.forEach(line => {
      parseCd(line, state)
      parseFile(line, state)
    }
  )
  parseCd('$ cd /', state)
  console.log(state)
  return state
}

const countDirSizes = (state, acc) => {
  const currentFilesSize = _.sum(Object.values(state['files']))
  const childrenFilesSize = Object.values(state['children']).map(child => countDirSizes(child, acc))
  const totalSize = currentFilesSize + _.sum(childrenFilesSize)
  acc[state['name']] = totalSize
  return totalSize
}

const part1 = data => {
  const dirSizesAcc = {}
  countDirSizes(parseInput(splitInputLines(data)), dirSizesAcc)
  return _.sum(Object.values(dirSizesAcc).filter(size => size <= 100000))
}

console.log(part1(data))

