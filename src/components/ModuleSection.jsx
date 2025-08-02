import React, {useState, useEffect} from 'react'
import Mascot from './Mascot'

export default function ModuleSection({data, onComplete}) {
    if (!data?.blocks || !Array.isArray(data.blocks)) return null

    const [selectedOption, setSelectedOption] = useState(null)
    const [answered, setAnswered] = useState({})
    const blocks = data.blocks
    const [activeTab, setActiveTab] = useState(null)

    useEffect(() => {
        setSelectedOption(null)
        const saved = JSON.parse(localStorage.getItem(`answered-${data.id}`)) || {}
        setAnswered(saved)

        const firstTheory = blocks.find(b => b.type === 'theory')?.id
        const savedTab = localStorage.getItem(`tab-${data.id}`)
        setActiveTab(savedTab || firstTheory || blocks[0]?.id || 'block-0')
    }, [data])

    const handleAnswer = (blockId, optionIndex) => {
        if (selectedOption === null) return
        if (answered[blockId] !== undefined) return

        const block = blocks.find(b => b.id === blockId)
        const selected = block.options[optionIndex]

        const newAnswered = {...answered, [blockId]: optionIndex}
        setAnswered(newAnswered)

        if (selected.isCorrect && typeof onComplete === 'function') {
            onComplete(data.id)
        }

        localStorage.setItem(`answered-${data.id}`, JSON.stringify(newAnswered))
        localStorage.setItem(`progress-${data.id}`, 'done')
    }

    const activeBlock = blocks.find(block => block.id === activeTab)

    return (
        <div>
            <h2>{data.title}</h2>

            <div style={{display: 'flex', marginBottom: 10}}>
                {blocks.map((block, index) => (
                    <button
                        key={block.id || index}
                        onClick={() => {
                            setActiveTab(block.id)
                            localStorage.setItem(`tab-${data.id}`, block.id)
                        }}
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
                            <div style={{marginTop: 12}}>
                                <p style={{fontWeight: 'bold', marginBottom: 10}}>
                                    {activeBlock.options[answered[activeBlock.id]].isCorrect
                                        ? `✅ Верно! Отличный выбор!`
                                        : `❌ Это не совсем то... но ты молодец, что пробуешь!`}
                                </p>

                                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
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
                    setSelectedOption(null)
                    localStorage.removeItem(`answered-${data.id}`)
                    localStorage.removeItem(`progress-${data.id}`)
                    localStorage.setItem(`tab-${data.id}`, activeTab) // сохраняем текущую вкладку
                    window.location.reload()
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
