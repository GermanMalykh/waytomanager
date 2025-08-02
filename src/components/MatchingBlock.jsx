import React, { useState } from 'react'
import { ArcherContainer, ArcherElement } from 'react-archer'

export default function MatchingBlock({ block, onAnswer, disabled }) {
    const [selectedLeft, setSelectedLeft] = useState(null)
    const [connections, setConnections] = useState({})
    const shuffledRight = React.useMemo(() => {
        return [...block.pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
    }, [block])

    const handleRightClick = (rightText) => {
        if (selectedLeft === null) return
        setConnections(prev => ({
            ...prev,
            [selectedLeft]: rightText
        }))
        setSelectedLeft(null)
    }

    const isAnswerCorrect = () => {
        return block.pairs.every(pair => connections[pair.left] === pair.right)
    }

    return (
        <div>
            <ArcherContainer strokeColor="#007acc" strokeWidth={2}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 80, marginTop: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {block.pairs.map((pair, idx) => (
                            <ArcherElement
                                key={pair.left}
                                id={`left-${idx}`}
                                relations={connections[pair.left]
                                    ? [{
                                        targetId: `right-${shuffledRight.indexOf(connections[pair.left])}`,
                                        targetAnchor: 'left',
                                        sourceAnchor: 'right'
                                    }]
                                    : []}
                            >
                                <div
                                    style={{
                                        padding: 10,
                                        border: selectedLeft === pair.left ? '2px solid #007acc' : '1px solid #ccc',
                                        borderRadius: 4,
                                        cursor: disabled ? 'default' : 'pointer',
                                        background: '#f9f9f9',
                                        minWidth: 200
                                    }}
                                    onClick={() => !disabled && setSelectedLeft(pair.left)}
                                >
                                    {pair.left}
                                </div>
                            </ArcherElement>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {shuffledRight.map((right, idx) => (
                            <ArcherElement key={right} id={`right-${idx}`}>
                                <div
                                    style={{
                                        padding: 10,
                                        border: '1px solid #ccc',
                                        borderRadius: 4,
                                        cursor: disabled ? 'default' : 'pointer',
                                        background: '#f9f9f9',
                                        minWidth: 200
                                    }}
                                    onClick={() => !disabled && handleRightClick(right)}
                                >
                                    {right}
                                </div>
                            </ArcherElement>
                        ))}
                    </div>
                </div>
            </ArcherContainer>

            {!disabled && (
                <button
                    disabled={Object.keys(connections).length !== block.pairs.length}
                    onClick={() => onAnswer(isAnswerCorrect())}
                    style={{
                        marginTop: 20,
                        padding: '8px 16px',
                        backgroundColor: '#007acc',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    Проверить
                </button>
            )}
        </div>
    )
}
