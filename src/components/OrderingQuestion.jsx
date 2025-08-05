import { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import Mascot from "./Mascot";

export default function OrderingQuestion({
                                             question,
                                             items,
                                             correctOrder,
                                             onAnswer,
                                             isCompleted,
                                             moduleId,
                                             blockId,
                                             mascotType,
                                         }) {
    const storageKey = `answered-${moduleId}`;
    const [currentItems, setCurrentItems] = useState(items);
    const [showResults, setShowResults] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
        const savedOrder = saved[blockId];

        if (savedOrder && Array.isArray(savedOrder) && savedOrder.length === items.length) {
            setCurrentItems(savedOrder);
            setShowResults(true);
        } else {
            const shuffled = shuffleArray([...items]);
            setCurrentItems(shuffled);
        }
    }, [items, storageKey, blockId]);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = currentItems.indexOf(active.id);
            const newIndex = currentItems.indexOf(over.id);
            setCurrentItems(arrayMove(currentItems, oldIndex, newIndex));
        }
    }

    function handleCheck() {
        if (showResults) return;

        setShowResults(true);
        const newAnswered = JSON.parse(localStorage.getItem(storageKey)) || {};
        newAnswered[blockId] = currentItems;
        localStorage.setItem(storageKey, JSON.stringify(newAnswered));

        if (onAnswer) onAnswer(currentItems);
    }

    const isAllCorrect = currentItems.every((item, index) => item === correctOrder[index]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{question}</h2>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={currentItems} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-3 max-w-xl mx-auto">
                        {currentItems.map((item, index) => (
                            <SortableItem
                                key={`${item}-${index}-${showResults ? 'checked' : 'uncheck'}`}
                                id={item}
                                content={item}
                                isCorrect={showResults ? item === correctOrder[index] : null}
                                showResult={showResults}
                                disableDragging={showResults}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>

            <button
                className="mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleCheck}
                disabled={isCompleted}
            >
                Проверить
            </button>

            {showResults && (
                <div className="mt-4">
                    <p className="font-semibold mb-2">
                        {isAllCorrect
                            ? "✅ Все шаги расположены правильно!"
                            : "❌ Есть ошибки. Проверь порядок шагов."}
                    </p>
                    <Mascot selected={isAllCorrect} type={mascotType || "meerkat"} />
                </div>
            )}
        </div>
    );
}

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}
