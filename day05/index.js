import { fileURLToPath } from 'node:url'
import { argv, exit } from 'node:process'

import { loadFile, parseArgs } from '../common.js'
import { builtinModules } from 'node:module'


function main (filename, part) {
  const [section1, section2] = loadFile(filename).split(/^\n/m)

  const rules = section1
      .trim()
      .split('\n')
      .reduce((rules, line) => {
        const [before, after] = line.split('|').map(Number)
        if(!rules[before]) rules[before] = new Set()
        rules[before].add(after)
        return rules
      }, {})
  
  const middlePageSum = (updates) => updates.reduce((sum, line) => { 
    sum += line[Math.floor(line.length / 2)]
    return sum
  }, 0)

  if (part === 'part1') { 
    const updates = section2
      .split('\n')
      .map(line => line.split(',').map(Number))
      .filter(line => {
        for (let [i, page] of line.slice(0, -1).entries()) {
          if(!line.slice(i+1).every((el) => rules[page]?.has(el))) return false
        }
        return true
      })

    console.log(`parte1: ${middlePageSum(updates)}`)
  } else if (part === 'part2') {
    const unorderFix = section2
      .split('\n')
      .map(line => line.split(',').map(Number))
      .filter(line => {
        for (let [i, page] of line.slice(0, -1).entries()) {
          if(!line.slice(i+1).every((el) => rules[page]?.has(el))) return true
        }
        return false
      })
      .map(line => line.sort((a, b) => {
        if(rules[a]?.has(b)) {
          return -1
        } 
        return 0
      }))
    
      console.log(`parte2: ${middlePageSum(unorderFix)}`)
  } else {
    console.log("Sólo part1 o part2")
    exit(1)
  }
}


if (argv[1] === fileURLToPath(import.meta.url)) {
  const { values: { part }, positionals: [filename] } = parseArgs()
  main(filename, part)
}