import React, { useRef, useState } from 'react'
import { RoundedBox, Text } from '@react-three/drei'
import { a } from '@react-spring/three'

const Button = ({ position, newZPosition, fixedCord, pCord, dict, flipDirction, reveal, setReveal, gameState, setGameState, flagNum, setFlagNum, setIconText }) => {
  const mesh = useRef(null)

  let cord = []
  cord[fixedCord[0]] = fixedCord[1]
  cord[pCord[0]] = position[0] * flipDirction[pCord[0]]
  cord[pCord[1]] = position[1] * flipDirction[pCord[1]]
  let cellName = cord.toString()
  let [flagged, setFlag] = useState(false)
  let isMined = dict.get(cellName).isMined
  let text = dict.get(cellName).adjacentMines


  const onClickFunc = () => {
    if (flagged || dict.get(cellName).isRevealed) return

    if (!gameState) setGameState(true)

    if (isMined) {
      console.log("!!Boom")
      setIconText('sentiment_very_dissatisfied')
      revealAllMines()
      setGameState(false)
      return
    }

    revealCells(cord)

    if (isWinning()) {
      console.log('winning')
      setIconText('sentiment_very_satisfied')
      setGameState(false)
      }
  }

  const isWinning = () => {
    let result = true
    dict.forEach(i => {
      if (!i.isMined && !i.isRevealed) result = false
    })
    return result
  }

  const revealCells = (cord) => {
    const stack = []
    stack.push(cord.toString())
    let temp = []


    while (stack.length > 0) {
      const curCellName = stack.pop()
      const cell = dict.get(curCellName)

      if (cell.isRevealed || cell.isFlagged) continue

      setReveal(curCellName)
      dict.get(curCellName).isRevealed = true

      if (cell.adjacentMines != '') continue

      let tempCord = curCellName.split(',')
      tempCord.forEach(function (item, i) {
        tempCord[i] = Number(item)
      })

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          for (let k = -1; k <= 1; k++) {
            if (i == 0 && j == 0 && k == 0) continue

            temp = [tempCord[0] + i, tempCord[1] + j, tempCord[2] + k]

            let sTemp = temp.toString()
            if (!dict.has(sTemp) || stack.includes(sTemp)) continue

            stack.push(sTemp)
          }
        }
      }
    }
  }

  const revealAllMines = () => {
    dict.forEach(function (object, name) {
      if (object.isMined) setReveal(name)
      dict.get(name).isRevealed = true
    })
  }


  const onContextFunc = () => {
    if (!gameState) return
    if (dict.get(cellName).isRevealed) return
    if (flagNum == 0 && flagged == false) return
    if (!flagged) setFlagNum(flagNum - 1)
    if (flagged) setFlagNum(flagNum + 1)
    dict.get(cellName).isFlagged = !flagged
    setFlag(!flagged)
  }

  return (
    <a.mesh onClick={(e) => { e.stopPropagation(); onClickFunc() }} onContextMenu={(e) => { e.stopPropagation(); onContextFunc() }} ref={mesh} position={reveal[cellName] ? [position[0], position[1], newZPosition] : position} name={cellName}>
      <RoundedBox args={[0.96, 0.96, 0.1]} radius={0.05}>
        <meshLambertMaterial attach='material' needsUpdate={true} color={reveal[cellName] ? isMined ? 'pink' : 'darkgray' : flagged ? '#fbc286' : 'lightgray'} />
      </RoundedBox>
      <Text scale={[0.5, 0.5, 0.5]} position={reveal[cellName] ? [0, 0, 0.081 + newZPosition] : [0, 0, 0.048]} >
        {text}
      </Text>
    </a.mesh>
  )
}

export default Button