export default function CaseBlock({ caseData, onAnswer, selected }) {
  return (
    <div>
      <h2>🎯 Ситуация</h2>
      <p>{caseData.question}</p>
      {caseData.choices.map((choice, idx) => (
        <button key={idx} onClick={() => onAnswer(choice.correct)} style={{
          display: 'block',
          margin: '8px 0',
          background: selected === null ? '#eee' :
                     choice.correct ? '#c8f7c5' : '#f7c5c5'
        }}>
          {choice.text}
        </button>
      ))}
    </div>
  )
}