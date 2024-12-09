import { readFileSync } from "node:fs"

const sort_desc = (list) => list.sort((a, b) => a - b)

const input = readFileSync("input.txt", "utf8").trim()

const [list_a, list_b] = input
    .split("\n")
    .reduce((list, line) => {
        const [a, b] = line.split(/\s+/)
        list[0].push(Number(a))
        list[1].push(Number(b))
        return list
    }, [[], []])

const one = [list_a, list_b]
    .map(list => sort_desc(list))
    .reduce((list_a, list_b) => 
        list_a.reduce((total, a, i) =>
            total += Math.abs(a - list_b[i]), 0))

console.log(`Respuesta a la parte1: ${one}`)


const [_, two] = list_a.reduce(([cache, total], n) => {
    if(!cache[n]) cache[n] = list_b.filter(el => el === n).length
    total += cache[n] * n
    return [cache, total]
}, [{}, 0])

console.log(`Respuesta a la parte2: ${two}`)

