import React, {useState} from 'react'
import {ArcherContainer, ArcherElement} from 'react-archer'

export default function MatchingBlock({block, onAnswer, disabled, savedConnections = {}, savedShuffledRight = []}) {
    const [selectedLeft, setSelectedLeft] = useState(null)
    const [connections, setConnections] = useState({})
    const [showResult, setShowResult] = useState(false)

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

    const handleCheck = () => {
        setShowResult(true)
        const isCorrect = isAnswerCorrect()
        if (onAnswer) {
            onAnswer(isCorrect, connections, shuffledRight)
        }
    }

    const getStrokeColor = (leftText, connectionsSource) => {
        if (!showResult && !disabled) return '#007acc' // ✅ до проверки — всегда синие

        if (!connectionsSource || typeof connectionsSource !== 'object') return '#007acc'

        const correctPair = block.pairs.find(p => p.left === leftText)
        if (!correctPair) return '#007acc'

        const correctRight = correctPair.right
        const actualRight = connectionsSource[leftText]

        if (!actualRight) return '#007acc'

        return correctRight === actualRight ? '#22c55e' : '#ef4444'
    }

    const markerDefs = (
        <svg style={{height: 0, width: 0}}>
            <defs>
                <marker id="green-check" viewBox="0 0 20 20" refX="10" refY="10" markerWidth="20" markerHeight="20"
                        orient="auto">
                    <circle cx="10" cy="10" r="9" fill="#22c55e"/>
                    <path d="M6 10l2 2l5 -5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </marker>
                <marker id="red-cross" viewBox="0 0 20 20" refX="10" refY="10" markerWidth="20" markerHeight="20"
                        orient="auto">
                    <circle cx="10" cy="10" r="9" fill="#ef4444"/>
                    <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </marker>
            </defs>
        </svg>
    )

    return (

        <div>
            {markerDefs}
            <ArcherContainer strokeColor="#007acc" strokeWidth={2}>
                <div style={{display: 'flex', justifyContent: 'space-between', gap: 80, marginTop: 20}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                        {block.pairs.map((pair, idx) => (
                            <ArcherElement
                                key={pair.left}
                                id={`left-${idx}`}
                                relations={(disabled ? savedConnections : connections)[pair.left]
                                    ? [{
                                        targetId: `right-${(disabled ? savedShuffledRight : shuffledRight).indexOf(
                                            (disabled ? savedConnections : connections)[pair.left]
                                        )}`,
                                        targetAnchor: 'left',
                                        sourceAnchor: 'right',
                                        style: {
                                            strokeColor: getStrokeColor(pair.left, disabled ? savedConnections : connections),
                                            strokeWidth: 2,
                                            markerEnd: getStrokeColor(pair.left, disabled ? savedConnections : connections) === '#22c55e'
                                                ? 'url(#green-check)'
                                                : 'url(#red-cross)'
                                        }
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

                    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
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
                    onClick={handleCheck}
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
