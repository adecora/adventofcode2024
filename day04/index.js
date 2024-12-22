import { fileURLToPath } from 'node:url'
import { argv, exit } from 'node:process'

import { loadLines, parseArgs } from '../common.js'


class Point {
  static directions = ["up", "down", 'left', 'right', "up-left", "up-right", "down-left", "down-right"]
  #move = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]
  
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  move(dir, incr=1) {
    const [dx, dy] = this.#move[this.constructor.directions.indexOf(dir)]
    return [this.x + incr * dx, this.y + incr * dy]
  }
}

function main (filename, part) {
  const lines = loadLines(filename)
  const rows = lines.length
  const cols = lines[0].length

  if (part === 'part1') {
    let xmas = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (lines[row][col] === 'X') {
          const startChar = new Point(row, col)
          for (const dir of Point.directions) {
            let isXMAS = true
            for (let [i, char] of Object.entries('MAS')) {
              const [x, y] = startChar.move(dir, i + 1)
              if (x < 0 || y < 0 || x >= cols || y >= rows || lines[x][y] !== char) {
                isXMAS = false
                break 
              }
            }
            if(isXMAS) xmas++
          }
        } 
      }
    }
    console.log(`parte1: ${xmas}`)
  } else if (part === 'part2') {
    let xmas = 0
    for (let row = 1; row < (rows - 1); row++) {
      for (let col = 1; col < (cols - 1); col++) {
        // Buscamos el centro de la figura
        if (lines[row][col] === 'A') {
          if (
            // Comprobamos las diagonales
            (lines[row-1][col-1]==='M' && lines[row+1][col+1] === 'S' ||
              lines[row-1][col-1]==='S' && lines[row+1][col+1] === 'M' ) &&
              (lines[row+1][col-1]==='M' && lines[row-1][col+1] === 'S' ||
                lines[row+1][col-1]==='S' && lines[row-1][col+1] === 'M' ) 
          ) xmas++
        }
      }
    }
    
    console.log(`parte2: ${xmas}`)
  } else {
    console.log("Sólo part1 o part2")
    exit(1)
  }
}


if (argv[1] === fileURLToPath(import.meta.url)) {
  const { values: { part }, positionals: [filename] } = parseArgs()
  main(filename, part)
}