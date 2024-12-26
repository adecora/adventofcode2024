import { fileURLToPath } from 'node:url'
import { argv, exit } from 'node:process'

import { loadArray, printArray, parseArgs, sleep } from '../common.js'

const guardMoves = {
  // posicion: movimiento
  '^': [-1, 0],
  '>': [0, 1],
  'v': [1, 0],
  '<': [0, -1]
}

const findGuard = (array) => {
  // Busqueda del guardia en el mapa
  for (let [y,line] of array.entries()) {
    for (let [x, char] of line.entries()) {
      if (Object.keys(guardMoves).includes(char)) {
        return [{ x, y, face: char }, null]
      }
    }
  }
  return [{}, 'No hay guardia en el mapa']
}

const moveGuard = ({x, y,face}) => {
  return {
    x: x + guardMoves[face][1],
    y: y + guardMoves[face][0],
    face
  }
}

const turnRight = ({x, y, face}) => {
  return {
    x: x - guardMoves[face][1],
    y: y - guardMoves[face][0],
    face: Object.keys(guardMoves)[(Object.keys(guardMoves).findIndex(el => el === face) + 1) % 4]
  }
}

const printMap = async (file) => {
  console.clear()
  console.log(printArray(file))
  await sleep(10)
}

async function main (filename, part) {
  const file = loadArray(filename)
  const height = file.length
  const width = file[0].length

  if (part === 'part1') {
    // En la resolución de la primera parte generamos una visualizacion con el 
    // movimiento del guardia
    let [guard, err] = findGuard(file)
    if (err !== null) {
      console.log(err)
      exit(1)
    }

    let moves = new Set()
    while (true) {
      await printMap(file)
      moves.add(`${guard.y},${guard.x}`)
      file[guard.y][guard.x] = '.'
      guard = moveGuard(guard)
      if(guard.x < 0 || guard.x >= width || guard.y < 0 || guard.y >= height) break
      if (file[guard.y][guard.x] === '#') guard = turnRight(guard)
      file[guard.y][guard.x] = guard.face
    }
    console.log(`Parte1: ${moves.size}`)
  } else if (part === 'part2') {
    // En la resolucion imprimimos el mapa con la posición de los obstaculos O
    let [guard, err] = findGuard(file)
    if (err !== null) {
      console.log(err)
      exit(1)
    }
    const initial = Object.assign({}, guard)
    // Guardamos el camino que sigue el guardia, para iterar sobre el
    // colocando los obstaculos
    let moves = new Set()
    while (true) {
      moves.add(`${guard.y},${guard.x}`)
      guard = moveGuard(guard)
      if(guard.x < 0 || guard.x >= width || guard.y < 0 || guard.y >= height) break
      if (file[guard.y][guard.x] === '#') guard = turnRight(guard)
    }
    // En la posición inicial del guardia no puede haber un obstaculo
    moves.delete(`${initial.y},${initial.x}`)
    
    const obstacleMap = file.map(r => r.map(c => c))
    let obstacles = 0
    // Iteramos sobre los movimientos del guardia colocando obstaculos
    for (let move of moves) {
      const [y, x] = move.split(',').map(Number)
      file[y][x] = '#'
      guard = Object.assign({}, initial)
      let loopMoves = new Set()
      // Comprobamos si el obstaculo colocado genera un loop en el camino del guardia
      while (true) {
        loopMoves.add(`${guard.y},${guard.x},${guard.face}`)
        guard = moveGuard(guard)
        if(guard.x < 0 || guard.x >= width || guard.y < 0 || guard.y >= height) break
        if (file[guard.y][guard.x] === '#') guard = turnRight(guard)
        if(loopMoves.has(`${guard.y},${guard.x},${guard.face}`)) {
          obstacleMap[y][x] = 'O' 
          obstacles++;
          break
        }
      }
      file[y][x] = '.'
    }
    console.log(printArray(obstacleMap))
    console.log(`Parte2: ${obstacles}`)
  } else {
    console.log("Sólo part1 o part2")
    exit(1)
  }
}


if (argv[1] === fileURLToPath(import.meta.url)) {
  const { values: { part }, positionals: [filename] } = parseArgs()
  main(filename, part)
}