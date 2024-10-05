import React, { useEffect, useRef, useState } from 'react'
import Side from './Side'

const generateInitialStages = (ids) => {
  const initialStages = {}
  ids.forEach(id => {
    initialStages[id] = false
  })
  return initialStages
}

const MineBox = ({ size, mineNum, tempDict, childIds, startTimer, stopTimer, setFlagText, setIconText }) => {
  const mesh = useRef(null)
  let fixedCord = Math.floor(size / 2) + 1

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
      <boxGeometry attach='geometry' args={[size, size, size]} />
      <meshStandardMaterial attach='material' color='gray' />

      <Side position={[0, 0, size / 2]} size={size} fixedCord={[2, fixedCord]} pCord={[0, 1]} tempDict={tempDict} flipDirction={[1, 1, 1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} setIconText={setIconText} />
      <Side position={[0, 0, -size / 2]} rotation={[0, 3.14, 0]} size={size} fixedCord={[2, -fixedCord]} pCord={[0, 1]} tempDict={tempDict} flipDirction={[-1, 1, 1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} setIconText={setIconText} />
      <Side position={[size / 2, 0, 0]} rotation={[0, 1.57, 0]} size={size} fixedCord={[0, fixedCord]} pCord={[2, 1]} tempDict={tempDict} flipDirction={[1, 1, -1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} setIconText={setIconText} />
      <Side position={[-size / 2, 0, 0]} rotation={[0, -1.57, 0]} size={size} fixedCord={[0, -fixedCord]} pCord={[2, 1]} tempDict={tempDict} flipDirction={[1, 1, 1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} setIconText={setIconText} />
      <Side position={[0, size / 2, 0]} rotation={[-1.57, 0, 0]} size={size} fixedCord={[1, fixedCord]} pCord={[0, 2]} tempDict={tempDict} flipDirction={[1, 1, -1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} setIconText={setIconText} />
      <Side position={[0, -size / 2, 0]} rotation={[1.57, 0, 0]} size={size} fixedCord={[1, -fixedCord]} pCord={[0, 2]} tempDict={tempDict} flipDirction={[1, 1, 1]} stage={stage} setStage={handleSetStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} setIconText={setIconText} />
    </mesh>
  )
}

export default MineBox