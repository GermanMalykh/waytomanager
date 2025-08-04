import React, { useState, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    useDroppable,
    useDraggable,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

function DroppableColumn({ id, label, items, children }) {
    const { isOver, setNodeRef } = useDroppable({ id })
    return (
        <div style={{ flex: 1 }}>
            <h4>{label}</h4>
            <div
                ref={setNodeRef}
                style={{
                    minHeight: 180,
                    padding: 8,
                    border: `2px dashed ${isOver ? '#007acc' : '#bbb'}`,
                    borderRadius: 6,
                    background: isOver ? '#e6f4ff' : '#fcfcfc',
                    transition: 'border 0.2s, background 0.2s'
                }}
            >
                {children}
                {items.length === 0 && (
                    <p style={{ color: '#888', fontSize: 13 }}>Перетащи карточки сюда</p>
                )}
            </div>
        </div>
    )
}

function DraggableCard({ id, text, isCorrect, draggable }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
        id,
        disabled: !draggable
    })

    const borderColor =
        isCorrect === true ? '#22c55e' :
            isCorrect === false ? '#ef4444' :
                '#ccc'

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 10,
        border: `2px solid ${borderColor}`,
        borderRadius: 4,
        background: '#f9f9f9',
        marginBottom: 8,
        cursor: draggable ? 'grab' : 'default',
        opacity: isDragging ? 0 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...(draggable ? { ...attributes, ...listeners } : {})}>
            {text}
        </div>
    )
}

export default function ClassificationBlock({ block, onAnswer, resetKey }) {
    const allIds = block.items.map((item, idx) => `item-${idx}`)
    const idToText = Object.fromEntries(allIds.map((id, i) => [id, block.items[i].text]))
    const idToCorrect = Object.fromEntries(allIds.map((id, i) => [id, block.items[i].correctColumn]))

    const savedResults = localStorage.getItem(`classification-results-${block.id}`)
    const savedColumns = localStorage.getItem(`classification-${block.id}`)
    const parsedResults = savedResults ? JSON.parse(savedResults) : null
    const parsedColumns = savedResults && savedColumns
        ? JSON.parse(savedColumns)
        : { unclassified: allIds, left: [], right: [] }

    const [columns, setColumns] = useState(parsedColumns)
    const [activeId, setActiveId] = useState(null)
    const [resultState, setResultState] = useState({
        show: !!parsedResults,
        results: parsedResults || {}
    })

    const sensors = useSensors(useSensor(PointerSensor))

    useEffect(() => {
        const savedResults = localStorage.getItem(`classification-results-${block.id}`)
        const savedColumns = localStorage.getItem(`classification-${block.id}`)

        if (savedResults && savedColumns) {
            setResultState({ show: true, results: JSON.parse(savedResults) })
            setColumns(JSON.parse(savedColumns))
        } else {
            setResultState({ show: false, results: {} })
            setColumns({ unclassified: allIds, left: [], right: [] })
        }
    }, [resetKey])

    const findContainer = (id) => {
        for (const key in columns) {
            if (columns[key].includes(id)) return key
        }
        return null
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id)
    }

    const handleDragOver = (event) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const from = findContainer(active.id)
        const to = over.id
        if (!from || !to || from === to) return

        setColumns(prev => {
            const fromItems = prev[from].filter(id => id !== active.id)
            const toItems = [...prev[to], active.id]
            return {
                ...prev,
                [from]: fromItems,
                [to]: toItems
            }
        })
    }

    const handleDragEnd = () => {
        setActiveId(null)
    }

    const handleCheck = () => {
        const newResults = {}

        for (const id of columns.left) {
            newResults[id] = idToCorrect[id] === 'left'
        }

        for (const id of columns.right) {
            newResults[id] = idToCorrect[id] === 'right'
        }

        const isCorrect = Object.values(newResults).every(x => x === true)

        setResultState({ show: true, results: newResults })

        if (isCorrect) {
            localStorage.setItem(`classification-${block.id}`, JSON.stringify(columns))
            localStorage.setItem(`classification-results-${block.id}`, JSON.stringify(newResults))
        }

        onAnswer(newResults)
    }

    const isAllPlaced = columns.unclassified.length === 0

    return (
        <div>
            <p>{block.question}</p>

            {resultState.show && (
                <p style={{ fontWeight: 'bold', marginBottom: 12 }}>
                    {Object.values(resultState.results).every(x => x === true)
                        ? '✅ Всё верно! Отличная работа!'
                        : '❌ Есть ошибки. Попробуй ещё раз!'}
                </p>
            )}

            <DndContext
                collisionDetection={closestCenter}
                onDragStart={resultState.show ? undefined : handleDragStart}
                onDragOver={resultState.show ? undefined : handleDragOver}
                onDragEnd={resultState.show ? undefined : handleDragEnd}
                sensors={sensors}
            >
                <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                    <DroppableColumn id="unclassified" label="⬆️ Нужно распределить" items={columns.unclassified}>
                        {columns.unclassified.map(id => (
                            <DraggableCard
                                key={id}
                                id={id}
                                text={idToText[id]}
                                isCorrect={resultState.show ? resultState.results[id] : null}
                                draggable={!resultState.show}
                            />
                        ))}
                    </DroppableColumn>

                    <DroppableColumn id="left" label={`🟦 ${block.leftLabel}`} items={columns.left}>
                        {columns.left.map(id => (
                            <DraggableCard
                                key={id}
                                id={id}
                                text={idToText[id]}
                                isCorrect={resultState.show ? resultState.results[id] : null}
                                draggable={!resultState.show}
                            />
                        ))}
                    </DroppableColumn>

                    <DroppableColumn id="right" label={`🟥 ${block.rightLabel}`} items={columns.right}>
                        {columns.right.map(id => (
                            <DraggableCard
                                key={id}
                                id={id}
                                text={idToText[id]}
                                isCorrect={resultState.show ? resultState.results[id] : null}
                                draggable={!resultState.show}
                            />
                        ))}
                    </DroppableColumn>
                </div>

                <DragOverlay>
                    {activeId && (
                        <div
                            style={{
                                padding: 10,
                                border: '1px solid #ccc',
                                borderRadius: 4,
                                background: '#f9f9f9',
                                fontSize: 14,
                                maxWidth: 240,
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                cursor: 'grabbing'
                            }}
                        >
                            {idToText[activeId]}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            {!resultState.show && (
                <button
                    disabled={!isAllPlaced}
                    onClick={handleCheck}
                    style={{
                        marginTop: 20,
                        padding: '8px 16px',
                        backgroundColor: isAllPlaced ? '#007acc' : '#ccc',
                        color: isAllPlaced ? 'white' : '#666',
                        border: 'none',
                        borderRadius: 4,
                        cursor: isAllPlaced ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s'
                    }}
                >
                    Проверить
                </button>
            )}
        </div>
    )
}
