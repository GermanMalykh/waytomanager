import React, { useState } from 'react'
import ModuleSection from './ModuleSection'
import Mascot from './Mascot'

export default function ValueSystem() {
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const theory = (
    <div>
      <h2>📘 Теория</h2>
      <p>
        Создание ценности — это то, ради чего вообще существуют проекты.
        Они помогают организациям достигать стратегических целей и приносить пользу клиентам, обществу и бизнесу.
      </p>
    </div>
  )

  const scenario = (
    <div>
      <h2>🎯 Ситуация</h2>
      <p>Ты ведёшь проект по запуску нового сервиса. Руководство предлагает отказаться от MVP и сразу делать полноценный продукт. Что ты сделаешь?</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><button onClick={() => setSelectedAnswer(false)}>Сделаем всё и сразу</button></li>
        <li><button onClick={() => setSelectedAnswer(true)}>Начнём с MVP — так быстрее получим обратную связь</button></li>
        <li><button onClick={() => setSelectedAnswer(false)}>Отдадим подрядчику, пусть решает</button></li>
      </ul>
    </div>
  )

  const result = <Mascot selected={selectedAnswer} />

  return (
    <ModuleSection
      blocks={[
        { id: 'theory', label: '📘 Теория', content: theory },
        { id: 'case', label: '🎯 Ситуация', content: scenario },
        { id: 'result', label: '🧠 Ответ', content: result },
      ]}
    />
  )
}
