import { readFileSync } from 'node:fs'
import { parseArgs as parseUtil } from 'node:util'

const loadFile = file => readFileSync(file, {encoding: 'utf8'}).trim()
const loadLines = file => readFileSync(file, {encoding: 'utf8'}).trim().split('\n')
const loadArray = file => readFileSync(file, {encoding: 'utf8'}).trim().split('\n').map(l => l.split(''))

const printArray = array => array.map(l => l.join('')).join('\n')

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

const options = {
  part: {
    short: 'p',
    type: 'string',
    default: 'part1'
  }
}
const parseArgs = () => parseUtil({ options, allowPositionals: true })

export {
  loadFile,
  loadLines,
  loadArray,
  printArray,
  sleep,
  parseArgs
}