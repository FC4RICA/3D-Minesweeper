import Button from './Button'

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

const Side = ({ position, rotation, size, fixedCord, pCord, tempDict, flipDirction, stage, setStage, gameState, setGameState, flagNum, setFlagNum, setIconText }) => {
  let z = -0.03
  const buttons = createButton(size).map((cords, i) =>
    (<Button key={i} position={cords} newZPosition={z} fixedCord={fixedCord} pCord={pCord} dict={tempDict} flipDirction={flipDirction} reveal={stage} setReveal={setStage} gameState={gameState} setGameState={setGameState} flagNum={flagNum} setFlagNum={setFlagNum} setIconText={setIconText} />)
  )

  return (
    <mesh position={position} rotation={rotation}>
      {buttons}
    </mesh>
  )
}

export default Side