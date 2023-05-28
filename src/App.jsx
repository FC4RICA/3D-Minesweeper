import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { a } from '@react-spring/three'

class Cell {
  constructor(isMined, adjacentMines, isRevealed = false, isFlagged = false) {
    this.isMined = isMined
    this.adjacentMines = adjacentMines
    this.isRevealed = isRevealed
    this.isFlagged = isFlagged
  }
}

const init = (size, mineNum) => {
  const maxcord = Math.floor(size / 2)
  let minedCell = new Cell(true, '')
  let dict = new Map()
  let temp = [0, 0, 0]

  // generate random mine coordinate
  for (let i = 0; i < mineNum; i++) {
    let fixedsied = Math.floor(Math.random() * 3)
    temp[fixedsied] = (maxcord + 1) * (Math.round(Math.random()) ? 1 : -1)
    for (let j = 0; j < 3; j++) {
      if (j != fixedsied)
        temp[j] = Math.floor(Math.random() * size) - maxcord
    }
    if (dict.has(temp.toString())) {
      i--
      continue
    }
    dict.set(temp.toString(), minedCell)
  }

  // generate every coordinate except mined cell
  for (let i = 0; i < 6; i++) {
    let fixedIndx = i % 3
    if (i % 2 == 0) temp[fixedIndx] = maxcord + 1
    else temp[fixedIndx] = -maxcord - 1

    for (let j = -maxcord; j <= maxcord; j++) {
      for (let k = -maxcord; k <= maxcord; k++) {
        switch (fixedIndx) {
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
        if (!dict.has(temp.toString())) {
          let cellAttr = new Cell(false, 0)
          dict.set(temp.toString(), cellAttr)
        }
      }
    }
  }

  // generate every cell number of adjacency mines
  for (let i = 0; i < 6; i++) {
    let fixedIndx = i % 3
    if (i % 2 == 0) temp[fixedIndx] = maxcord + 1
    else temp[fixedIndx] = -maxcord - 1
    for (let j = -maxcord; j <= maxcord; j++) {
      for (let k = -maxcord; k <= maxcord; k++) {
        switch (fixedIndx) {
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
        if (dict.get(temp.toString()).isMined) continue
        let mineSum = 0
        for (let l = -1; l < 2; l++) {
          for (let m = -1; m < 2; m++) {
            for (let n = -1; n < 2; n++) {
              let tempp = [temp[0] + l, temp[1] + m, temp[2] + n]
              if (!dict.has(tempp.toString())) continue
              if (dict.get(tempp.toString()).isMined) mineSum++
            }
          }
        }
        if (mineSum == 0) mineSum = ''
        dict.get(temp.toString()).adjacentMines = mineSum
      }
    }
  }

  return dict
}

const generateChildId = (size) => {
  const maxcord = Math.floor(size / 2)
  let tempList = []
  let temp = [0, 0, 0]

  for (let i = 0; i < 6; i++) {
    let fixedIndx = i % 3
    if (i % 2 == 0) temp[fixedIndx] = maxcord + 1
    else temp[fixedIndx] = -maxcord - 1

    for (let j = -maxcord; j <= maxcord; j++) {
      for (let k = -maxcord; k <= maxcord; k++) {
        switch (fixedIndx) {
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
        tempList.push(temp.toString())
      }
    }
  }
  return tempList
}

//-----------------------------------------------------------------------------------------------------------

const Button = ({ position, newZPosition, fixedCord, pCord, dict, flipDirction, reveal, setReveal, gameState, setGameState, flagNum, setFlagNum }) => {
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
      revealAllMines()
      setGameState(false)
      return
    }

    revealCells(cord)
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
    dict.forEach( function(object, name) {
      if (object.isMined) setReveal(name)
      dict.get(name).isRevealed = true

    })
  }

  const onContextFunc = () => {
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


const createButton = (num) => {
  let table = []
  let offset = Math.floor(num / 2)
  if (num % 2 == 0) {
    offset -= 0.5
  }
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      table[(num * i) + j] = [i - offset, j - offset, 0]
    }
  }
  return table
}

const Side = ({ position, rotation, size, fixedCord, pCord, tempDict, flipDirction, stage, setStage, gameState, setGameState, flagNum, setFlagNum }) => {
  let z = -0.03
  const buttons = createButton(size).map((cords, i) =>
    (<Button key={i} position={cords} newZPosition={z} fixedCord={fixedCord} pCord={pCord} dict={tempDict} flipDirction={flipDirction} reveal={stage} setReveal={setStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} />)
  )

  return (
    <mesh position={position} rotation={rotation}>
      {buttons}
    </mesh>
  )
}

const Box = ({ size, mineNum, tempDict, childIds, startTimer, stopTimer, setFlagText }) => {
  const mesh = useRef(null)
  let fixedCord = Math.floor(size / 2) + 1

  const generateInitialStages = (ids) => {
    const initialStages = {}
    ids.forEach(id => {
      initialStages[id] = false
    })
    return initialStages
  }

  const [stage, setStage] = useState(generateInitialStages(childIds))

  const handleSetStage = (childId) => {
    setStage(prevStage => ({
      ...prevStage,
      [childId]: true,
    }))
  }

  const [gameState, setGameState] = useState(false)

  const firstRender1 = useRef(true)
  useEffect(() => {
    if (firstRender1.current) {
      firstRender1.current = false
      return
    }
    if (gameState) startTimer()
    if (!gameState) stopTimer()

  }, [gameState])

  const [flagNum, setFlagNum] = useState(mineNum)

  useEffect(() => {
    setFlagText(flagNum)
  }, [flagNum])


  return (
    <mesh ref={mesh} onClick={(e) => { e.stopPropagation() }} onContextMenu={(e) => { e.stopPropagation() }}>
      <boxBufferGeometry attach='geometry' args={[size, size, size]} />
      <meshStandardMaterial attach='material' color='gray' />

      <Side position={[0, 0, size / 2]} size={size} fixedCord={[2, fixedCord]} pCord={[0, 1]} tempDict={tempDict} flipDirction={[1, 1, 1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} />
      <Side position={[0, 0, -size / 2]} rotation={[0, 3.14, 0]} size={size} fixedCord={[2, -fixedCord]} pCord={[0, 1]} tempDict={tempDict} flipDirction={[-1, 1, 1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} />
      <Side position={[size / 2, 0, 0]} rotation={[0, 1.57, 0]} size={size} fixedCord={[0, fixedCord]} pCord={[2, 1]} tempDict={tempDict} flipDirction={[1, 1, -1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} />
      <Side position={[-size / 2, 0, 0]} rotation={[0, -1.57, 0]} size={size} fixedCord={[0, -fixedCord]} pCord={[2, 1]} tempDict={tempDict} flipDirction={[1, 1, 1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} />
      <Side position={[0, size / 2, 0]} rotation={[-1.57, 0, 0]} size={size} fixedCord={[1, fixedCord]} pCord={[0, 2]} tempDict={tempDict} flipDirction={[1, 1, -1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} />
      <Side position={[0, -size / 2, 0]} rotation={[1.57, 0, 0]} size={size} fixedCord={[1, -fixedCord]} pCord={[0, 2]} tempDict={tempDict} flipDirction={[1, 1, 1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} />
    </mesh>
  )
}

const GameBoard = ({ size, mineNum }) => {
  const time_elem = document.querySelector('.time')
  const flag_elem = document.querySelector('.flag')

  let dict = init(size, mineNum)
  let childIdList = generateChildId(size)

  let seconds = 0
  let interval = null

  const timer = () => {
    seconds++

    let mins = Math.floor(seconds / 60)
    let secs = seconds % 60

    if (mins < 10) mins = '0' + mins
    if (secs < 10) secs = '0' + secs

    time_elem.innerHTML = mins + ':' + secs
  }

  const startTimer = () => {
    interval = setInterval(timer, 1000)
  }

  const stopTimer = () => {
    clearInterval(interval)
    interval = null
  }

  const resetTimer = () => {
    stopTimer()
    seconds = 0
    time_elem.innerHTML = '00:00'
  }

  const setFlagText = (num) => {
    if (num < 100) num = '0'+ num
    if (num < 10) num = '0'+ num
    flag_elem.innerHTML = num
  }

  return (
    <mesh>
      <ambientLight intensity={0.6} color={'lightblue'} />
      <OrbitControls enablePan={false} minDistance={size} maxDistance={1.5 * size} />
      <pointLight intensity={0.8} position={[-2 * size, -2 * size, -2 * size]} color={'purple'} />
      <pointLight intensity={0.5} position={[2 * size, 2 * size, 2 * size]} color={'red'} />
      <Box size={size} mineNum={mineNum} tempDict={dict} childIds={childIdList} startTimer={startTimer} stopTimer={stopTimer} setFlagText={setFlagText} />
    </mesh>
  )
}

//--------------------------------------------------------------------------------------------

const x = 5
const y = 25

const App = () => {

  return (
    <>
      <div className='top'>
        <div className='difficultyBar'>
          <button className='difficultyButton' >Beginner</button>
          <button className='difficultyButton'>Intermediate</button>
          <button className='difficultyButton'>Expert</button>
        </div>
        <div className='gameBar'>
          <div className='gameBarComponent flagNumber'>
            <div className='flag'>000</div>
          </div>
          <button className='gameBarComponent resetButton'></button>
          <div className='gameBarComponent timer'>
            <div className='time'>00:00</div>
          </div>
        </div>
      </div>
      <div className='bottom'>
        <div className='appbox'>
          <Canvas>
            <GameBoard size={x} mineNum={y}/>
          </Canvas>
        </div>
      </div>
    </>
  )
}

export default App
