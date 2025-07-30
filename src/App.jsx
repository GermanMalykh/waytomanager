import React, { useState, useEffect } from 'react'
import TheoryBlock from './components/TheoryBlock'
import CaseBlock from './components/CaseBlock'
import Mascot from './components/Mascot'
import XPBar from './components/XPBar'
import moduleData from './data/module1.json'

export default function App() {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('pm-xp')) || 0)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    localStorage.setItem('pm-xp', xp)
  }, [xp])

  const handleAnswer = (isCorrect) => {
    if (selected !== null) return
    setSelected(isCorrect)
    if (isCorrect) setXp(prev => prev + 5)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif', padding: 20 }}>
      <h1>WayToManager: Принцип 6 — Управление рисками</h1>
      <XPBar xp={xp} />
      <TheoryBlock text={moduleData.theory} />
      <CaseBlock caseData={moduleData.case} onAnswer={handleAnswer} selected={selected} />
      <Mascot selected={selected} />
    </div>
  )
}