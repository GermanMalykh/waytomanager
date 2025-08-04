import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ id, content, isCorrect, showResult, disableDragging }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: disableDragging ? 0.8 : 1,
        pointerEvents: disableDragging ? "none" : "auto",
    };

    const borderColor =
        isCorrect === true ? "#22c55e" : isCorrect === false ? "#ef4444" : "#d1d5db";

    return (
        <li
            ref={setNodeRef}
            style={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "12px",
                border: `2px solid ${borderColor}`,
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                cursor: disableDragging ? "default" : "move",
            }}
            {...(disableDragging ? {} : attributes)}
            {...(disableDragging ? {} : listeners)}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#aaa", fontSize: "18px" }}>☰</span>
                <span>{content}</span>
            </div>

            {showResult && (
                <span style={{ fontSize: "20px", marginLeft: "auto", flexShrink: 0 }}>
          {isCorrect ? "✅" : "❌"}
        </span>
            )}
        </li>
    );
}
