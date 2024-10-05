import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import GameBoard from './components/GameBoard'

const App = () => {
  const [difficulty, setDifficulty] = useState(0)
  const difficultys = [[5, 25], [7, 60], [9, 111]]

  useEffect(() => {
    const data = window.localStorage.getItem('GAME_DIFFUCULTY')
    if (data != null) setDifficulty(JSON.parse(data))
  }, [])

  useEffect(() => {
    window.localStorage.setItem('GAME_DIFFUCULTY', JSON.stringify(difficulty))
  }, [difficulty])

  function refreshPage() {
    window.location.reload(false);
  }

  const icons = ['sentiment_satisfied', 'sentiment_very_dissatisfied', 'sentiment_very_satisfied']

  return (
    <>
      <div className='top'>
        <div className='difficultyBar'>
          <button className='difficultyButton' onClick={() => {refreshPage(), setDifficulty(0)}} style={(difficulty == 0) ? {color: 'white', textDecoration: 'underline'} : {}}>Beginner</button>
          <button className='difficultyButton' onClick={() => {refreshPage(), setDifficulty(1)}} style={(difficulty == 1) ? {color: 'white', textDecoration: 'underline'} : {}}>Intermediate</button>
          <button className='difficultyButton' onClick={() => {refreshPage(), setDifficulty(2)}} style={(difficulty == 2) ? {color: 'white', textDecoration: 'underline'} : {}}>Expert</button>
        </div>
        <div className='gameBar'>
          <div className='gameBarComponent flagNumber'>
            <div className='flag'>000</div>
          </div>
          <button className='gameBarComponent resetButton' onClick={() => refreshPage()}>
            <span className='material-symbols-rounded'>sentiment_satisfied</span>
          </button>
          <div className='gameBarComponent timer'>
            <div className='time'>00:00</div>
          </div>
        </div>
      </div>
      <div className='bottom'>
        <div className='appbox'>
          <Canvas>
            <GameBoard size={difficultys[difficulty][0]} mineNum={difficultys[difficulty][1]} />
          </Canvas>
        </div>
      </div>
    </>
  )
}

export default App