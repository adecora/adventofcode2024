import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'


const loadLines = (file) => {
  return fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), file), { encoding: 'utf8' })
          .trim()
          .split('\n')
}

function levelsDiff(report) {
  return report
          .split(' ')
          .map(Number)
          .reduce((levels, val, i, arr) => {
            if (i !== 0) {
              levels.push(val - arr[i - 1])
            }
            return levels
          }, [])
}

function isSafe(report) {
  const levels = levelsDiff(report)
  return levels.every((el) => (1 <= el && el <= 3))
          || levels.every((el) => (-3 <= el && el <= -1))
}

const reports = loadLines('./input.txt')


console.log(reports.map(isSafe).reduce((a, b) => a + b))

const chekIncr = (diff) => diff.every((el) => (1 <= el && el <= 3))
const chekDecr = (diff) => diff.every((el) => (-3 <= el && el <= -1))


function Dampener(report) {
  const diffs = levelsDiff(report)
  if (chekIncr(diffs) || chekDecr(diffs)) {
    return true
  }
  let levels = report.split(' ')
  for (let i = 0; i < levels.length; i++) {
    const diffs = levelsDiff([...levels.slice(0,i), ...levels.slice(i + 1)].join(' '))
    if (chekIncr(diffs) || chekDecr(diffs)) {
      return true
    }
  }
  return false
}

console.log(reports.map(Dampener).reduce((a, b) => a + b))