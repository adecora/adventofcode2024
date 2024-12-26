import { fileURLToPath } from 'node:url'
import { argv, exit } from 'node:process'

import { loadFile, parseArgs } from '../common.js'


function main (filename, part) {
  const [section1, section2] = loadFile(filename).split(/^\n/m)

  const rules = section1
      .trim()
      .split('\n')
      .reduce((rules, line) => {
        const [before, after] = line.split('|')
        if(!rules[before]) rules[before] = new Set()
        rules[before].add(after)
        return rules
      }, {})

  if (part === 'part1') {  
    const updates = section2
      .split('\n')
      .filter((line) => {
        line = line.split(',')
        for (let [i, page] of line.slice(0, -1).entries()) {
          if(!line.slice(i+1).every((el) => rules[page]?.has(el))) return false
        }
        return true
      })

    const middlePageSum = updates.reduce((sum, line) => { 
      line = line.split(',')
      sum += Number(line[Math.floor(line.length / 2)])
      return sum
    }, 0)
    
    console.log(`parte1: ${middlePageSum}`)
  } else if (part === 'part2') {
    console.log("No implementado todavía")
    exit(1)
  } else {
    console.log("Sólo part1 o part2")
    exit(1)
  }
}


if (argv[1] === fileURLToPath(import.meta.url)) {
  const { values: { part }, positionals: [filename] } = parseArgs()
  main(filename, part)
}