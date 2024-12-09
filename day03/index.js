import { fileURLToPath } from 'node:url'
import { argv, exit } from 'node:process'

import { loadFile, parseArgs } from '../common.js'


function main (filename, part) {
  const file = loadFile(filename)

  if (part === 'part1') {
    let mul = 0
    for(let m of file.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
      const [_ , A, B] = m
      mul += Number(A) * Number(B)
    } 
    console.log(`parte1: ${mul}`)
  } else if (part === 'part2') {
    const regex = new RegExp(/(?:mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\))/g)
    let m, mul = 0, skip = false
    while ((m = regex.exec(file)) !== null) {
      if (!skip && m[0].startsWith('mul')) {
        const [_ , A, B] = m
        mul += Number(A) * Number(B)
      } else if(!skip && m[0] === "don't()") {
        skip = true
      } else if(skip && m[0] === "do()") {
        skip = false
      }
    }
    console.log(`parte2: ${mul}`)
  } else {
    console.log("Sólo part1 o part2")
    exit(1)
  }
}


if (argv[1] === fileURLToPath(import.meta.url)) {
  const { values: { part }, positionals: [filename] } = parseArgs()
  main(filename, part)
}