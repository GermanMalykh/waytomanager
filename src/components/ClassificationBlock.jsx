import React, { useState } from 'react'
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
import { arrayMove } from '@dnd-kit/sortable'
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

function DraggableCard({ id, text, activeId }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 10,
        border: '1px solid #ccc',
        borderRadius: 4,
        background: '#f9f9f9',
        marginBottom: 8,
        cursor: 'grab',
        opacity: isDragging ? 0 : 1, // 👈 скрыть оригинал во время перетаскивания
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {text}
        </div>
    )
}

export default function ClassificationBlock({ block, onAnswer, disabled }) {
    const allIds = block.items.map((item, idx) => `item-${idx}`)
    const idToText = Object.fromEntries(allIds.map((id, i) => [id, block.items[i].text]))
    const idToCorrect = Object.fromEntries(allIds.map((id, i) => [id, block.items[i].correctColumn]))

    const [columns, setColumns] = useState({
        unclassified: allIds,
        left: [],
        right: []
    })
    const [activeId, setActiveId] = useState(null)

    const sensors = useSensors(useSensor(PointerSensor))

    const findContainer = (id) => {
        for (const key in columns) {
            if (columns[key].includes(id)) return key
        }
        return null
    }

    const handleDragStart = (event) => {
        const { active } = event
        setActiveId(active.id)
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

    const isAllPlaced = columns.unclassified.length === 0
    const isCorrect = () =>
        columns.left.every(id => idToCorrect[id] === 'left') &&
        columns.right.every(id => idToCorrect[id] === 'right')

    return (
        <div>
            <p>{block.question}</p>

            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                    <DroppableColumn id="unclassified" label="⬆️ Нужно распределить" items={columns.unclassified}>
                        {columns.unclassified.map(id => (
                            <DraggableCard key={id} id={id} text={idToText[id]} />
                        ))}
                    </DroppableColumn>

                    <DroppableColumn id="left" label={`🟦 ${block.leftLabel}`} items={columns.left}>
                        {columns.left.map(id => (
                            <DraggableCard key={id} id={id} text={idToText[id]} />
                        ))}
                    </DroppableColumn>

                    <DroppableColumn id="right" label={`🟥 ${block.rightLabel}`} items={columns.right}>
                        {columns.right.map(id => (
                            <DraggableCard key={id} id={id} text={idToText[id]} />
                        ))}
                    </DroppableColumn>
                </div>

                <DragOverlay>
                    {activeId ? (
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
                    ) : null}
                </DragOverlay>

            </DndContext>

            {!disabled && (
                <button
                    disabled={!isAllPlaced}
                    onClick={() => onAnswer(isCorrect())}
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
