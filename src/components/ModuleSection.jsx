import React, {useState, useEffect} from 'react'
import Mascot from './Mascot'

export default function ModuleSection({ data, onComplete }) {
    if (!data?.blocks || !Array.isArray(data.blocks)) {
        return null
    }

    const [selectedOption, setSelectedOption] = useState(null)
    const [answered, setAnswered] = useState({})
    const [xp, setXp] = useState(0)

    const handleAnswer = (blockId, optionIndex) => {
        if (selectedOption === null) return
        if (answered[blockId] !== undefined) return

        const block = blocks.find(b => b.id === blockId)
        const selected = block.options[optionIndex]

        const newAnswered = {...answered, [blockId]: optionIndex}
        const newXp = selected.isCorrect ? xp + 3 : xp

        setAnswered(newAnswered)
        setXp(newXp)

        if (selected.isCorrect && typeof onComplete === 'function') {
            onComplete(data.id)
        }

        localStorage.setItem(
            `progress-${data.id}`,
            JSON.stringify({answered: newAnswered, xp: newXp})
        )
    }

    const blocks = data.blocks
    const [activeTab, setActiveTab] = useState(null)

    useEffect(() => {
        setSelectedOption(null)
        const firstTheory = blocks.find(b => b.type === 'theory')?.id
        setActiveTab(firstTheory || blocks[0]?.id || 'block-0')

        const savedProgress = JSON.parse(localStorage.getItem(`progress-${data.id}`)) || {}
        setAnswered(savedProgress.answered || {})
        setXp(savedProgress.xp || 0)
    }, [data])

    const activeBlock = blocks.find(block => block.id === activeTab)
    const progress = Math.min((xp / 10) * 100, 100)

    const ProgressBar = () => (
        <div style={{marginBottom: 20}}>
            <div style={{marginBottom: 5}}>🌟 Ваш прогресс: {xp} XP</div>
            <div style={{background: '#eee', borderRadius: 4, height: 10, width: '100%'}}>
                <div style={{
                    width: `${progress}%`,
                    background: '#4caf50',
                    height: '100%',
                    borderRadius: 4,
                    transition: 'width 0.3s ease-in-out'
                }}></div>
            </div>
        </div>
    )

    return (
        <div>
            <h2>{data.title}</h2>
            <ProgressBar/>
            <div style={{display: 'flex', marginBottom: 10}}>
                {blocks.map((block, index) => (
                    <button
                        key={block.id || index}
                        onClick={() => setActiveTab(block.id)}
                        style={{
                            padding: '6px 12px',
                            marginRight: 8,
                            background: activeTab === block.id ? '#007acc' : '#eee',
                            color: activeTab === block.id ? '#fff' : '#333',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                        }}
                    >
                        {block.label || block.type}
                    </button>
                ))}
            </div>

            <div style={{padding: 10, border: '1px solid #ddd', borderRadius: 4}}>
                {activeBlock?.type === 'theory' && (
                    <div>
                        <h3>📘 Теория</h3>
                        <p>{activeBlock.text}</p>
                    </div>
                )}

                {activeBlock?.type === 'situation' && (
                    <div>
                        <h3>🎯 Ситуация</h3>
                        <p>{activeBlock.question}</p>

                        {answered[activeBlock.id] !== undefined ? (
                            <div style={{ marginTop: 12 }}>
                                <p style={{ fontWeight: 'bold', marginBottom: 10 }}>
                                    {activeBlock.options[answered[activeBlock.id]].isCorrect
                                        ? `✅ Верно! Отличный выбор!`
                                        : `❌ Это не совсем то... но ты молодец, что пробуешь!`}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {activeBlock.options.map((opt, idx) => {
                                        const isChosen = idx === answered[activeBlock.id]
                                        const isCorrect = opt.isCorrect

                                        const background = isChosen
                                            ? (isCorrect ? '#d4edda' : '#f8d7da')
                                            : '#f1f1f1'

                                        const border = isChosen
                                            ? (isCorrect ? '2px solid #28a745' : '2px solid #dc3545')
                                            : '1px solid #ccc'

                                        return (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: '10px',
                                                    background,
                                                    border,
                                                    borderRadius: 6,
                                                    opacity: isChosen ? 1 : 0.6
                                                }}
                                            >
                                                {opt.text}
                                            </div>
                                        )
                                    })}
                                </div>

                                <Mascot
                                    selected={activeBlock.options[answered[activeBlock.id]].isCorrect}
                                    type={data.mascot}
                                />
                            </div>
                        ) : (
                            <form
                                onSubmit={e => {
                                    e.preventDefault()
                                    if (selectedOption !== null) {
                                        handleAnswer(activeBlock.id, selectedOption)
                                    }
                                }}
                                style={{marginTop: 10}}
                            >
                                <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                                    {activeBlock.options.map((opt, idx) => (
                                        <label key={idx} style={{cursor: 'pointer'}}>
                                            <input
                                                type="radio"
                                                name="situationAnswer"
                                                value={idx}
                                                checked={selectedOption === idx}
                                                onChange={() => setSelectedOption(idx)}
                                                style={{marginRight: 8}}
                                            />
                                            {opt.text}
                                        </label>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    disabled={selectedOption === null}
                                    style={{
                                        marginTop: 16,
                                        padding: '8px 16px',
                                        backgroundColor: '#007acc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: selectedOption === null ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Ответить
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={() => {
                    setAnswered({})
                    setXp(0)
                    localStorage.removeItem(`progress-${data.id}`)
                    setSelectedOption(null)
                }}
                style={{
                    marginTop: 16,
                    background: 'transparent',
                    color: '#666',
                    border: '1px dashed #ccc',
                    padding: '6px 12px',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
            >
                🔁 Начать заново
            </button>
        </div>
    )
}
