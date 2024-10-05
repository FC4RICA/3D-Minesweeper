import Cell from '../models/Cell'

export const init = (size, mineNum) => {
  let dict = new Map()

  initMines(dict, size, mineNum)

  runFuncOnCells(dict, size, createNonMinedCells)
  runFuncOnCells(dict, size, createAdjencyMineNum)

  return dict
}

export const runFuncOnCells = (dict, size, inputFunction) => {
  const maxCord = Math.floor(size / 2)
  let temp = [0, 0, 0]
  const CUBE_SIDE_NUM = 6

  for (let i = 0; i < CUBE_SIDE_NUM; i++) {
    let fixedCord = i % 3
    if (i % 2 == 0) temp[fixedCord] = maxCord + 1
    else temp[fixedCord] = -maxCord - 1

    for (let j = -maxCord; j <= maxCord; j++) {
      for (let k = -maxCord; k <= maxCord; k++) {
        switch (fixedCord) {
          case 0:
            temp[1] = j
            temp[2] = k
            break
          case 1:
            temp[0] = j
            temp[2] = k
            break
          case 2:
            temp[0] = j
            temp[1] = k
            break
        }
        inputFunction(dict, temp)
      }
    }
  }
}

const initMines = (dict, size, mineNum) => {
  const maxCord = Math.floor(size / 2)
  let minedCell = new Cell(true, '')
  let temp = [0, 0, 0]
  for (let i = 0; i < mineNum; i++) {
    let fixedCord = Math.floor(Math.random() * 3)
    temp[fixedCord] = (maxCord + 1) * (Math.round(Math.random()) ? 1 : -1)

    for (let j = 0; j < 3; j++) {
      if (j != fixedCord)
        temp[j] = Math.floor(Math.random() * size) - maxCord
    }

    if (dict.has(temp.toString())) {
      i--
      continue
    }
    dict.set(temp.toString(), minedCell)
  }
}

const createNonMinedCells = (dict, cord) => {
  let sCord = cord.toString()
  if (!dict.has(sCord)) {
    let nonMinedCell = new Cell(false, '')
    dict.set(sCord, nonMinedCell)
  }
}

const createAdjencyMineNum = (dict, cord) => {
  let sCord = cord.toString()
  if (dict.get(sCord).isMined) return

  let mineSum = 0
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      for (let k = -1; k < 2; k++) {
        let adjCord = [cord[0] + i, cord[1] + j, cord[2] + k]
        let sAdjCord = adjCord.toString()
        if (!dict.has(sAdjCord)) continue
        if (dict.get(sAdjCord).isMined) mineSum++
      }
    }
  }
  if (mineSum > 0) dict.get(sCord).adjacentMines = mineSum.toString()
}