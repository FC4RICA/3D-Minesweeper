import React from 'react'
import { OrbitControls } from '@react-three/drei'
import { init, runFuncOnCells } from '../utils/Init'
import MineBox from "./MineBox"

const generateChildId = (size) => {
  let ids = []
  runFuncOnCells(ids, size, (list, cord) => {
    list.push(cord.toString())
  })
  return ids
}

const GameBoard = ({ size, mineNum }) => {
  const timeElem = document.querySelector('.time')
  const flagElem = document.querySelector('.flag')
  const iconElem = document.querySelector('.material-symbols-rounded')
  const dict = init(size, mineNum)
  let childIdList = generateChildId(size)

  let seconds = 0
  let interval = null

  const timer = () => {
    seconds++

    let mins = Math.floor(seconds / 60)
    let secs = seconds % 60

    if (mins < 10) mins = '0' + mins
    if (secs < 10) secs = '0' + secs

    timeElem.innerHTML = mins + ':' + secs
  }

  const startTimer = () => {
    interval = setInterval(timer, 1000)
  }

  const stopTimer = () => {
    clearInterval(interval)
    interval = null
  }

  const setFlagText = (num) => {
    if (num < 100) num = '0' + num
    if (num < 10) num = '0' + num
    flagElem.innerHTML = num
  }

  setFlagText(mineNum)

  const setIconText = (text) => {
    iconElem.innerHTML = text
  }

  return (
    <mesh>
      <ambientLight intensity={0.6} color={'lightblue'} />
      <OrbitControls enablePan={false} minDistance={size} maxDistance={1.5 * size} />
      <pointLight intensity={0.8} position={[-2 * size, -2 * size, -2 * size]} color={'purple'} />
      <pointLight intensity={0.5} position={[2 * size, 2 * size, 2 * size]} color={'red'} />
      <MineBox size={size} mineNum={mineNum} tempDict={dict} childIds={childIdList} startTimer={startTimer} stopTimer={stopTimer} setFlagText={setFlagText} setIconText={setIconText}/>
    </mesh>
  )
}

export default GameBoard