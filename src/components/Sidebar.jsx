import React, {useState, useEffect} from "react";

export default function Sidebar({onSelect, activeModuleId}) {
    const [toc, setToc] = useState([]);
    const [query, setQuery] = useState("")
    const filteredToc = toc
        .map((section) => ({
            ...section,
            modules: section.modules.filter((mod) =>
                mod.title.toLowerCase().includes(query.toLowerCase())
            )
        }))
        .filter((section) => section.modules.length > 0)
    useEffect(() => {
        fetch('/waytomanager/public/data/system/toc.json')
            .then((res) => res.json())
            .then(setToc)
            .catch((err) => console.error("Ошибка загрузки TOC:", err));
    }, []);

    return (
        <div style={{
            width: 250,
            borderRight: "1px solid #ccc",
            padding: "20px",
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#f9f9f9"
        }}>
            <h2 style={{fontSize: 20, marginBottom: 20}}>📚 WayToManager</h2>
            <input
                type="text"
                placeholder="Поиск..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: "100%",
                    padding: "6px 8px",
                    marginBottom: 20,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    fontSize: 14
                }}
            />
            {filteredToc.length > 0 ? (
                filteredToc.map((section) => (
                <div key={section.id} style={{marginBottom: 20}}>
                    <h3 style={{fontSize: 16}}>{section.title}</h3>
                    <ul style={{listStyle: "none", padding: 0}}>
                        {section.modules
                            .filter((mod) =>
                                mod.title.toLowerCase().includes(query.toLowerCase())
                            )
                            .map((mod) => (
                                <li key={mod.id} style={{margin: "6px 0"}}>
                                    <button
                                        onClick={() => onSelect(mod.id)}
                                        style={{
                                            background: activeModuleId === mod.id ? "#007acc" : "none",
                                            color: activeModuleId === mod.id ? "#fff" : "#333",
                                            fontWeight: activeModuleId === mod.id ? "bold" : "normal",
                                            padding: "6px 8px",
                                            borderRadius: 4,
                                            border: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            width: "100%",
                                        }}
                                    >
                                        {mod.title}
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
                ))
            ) : (
                <div style={{ textAlign: "center", color: "#999", marginTop: 40 }}>
                    <img
                        src="/waytomanager/assets/system/no-results.svg"
                        alt="Ничего не найдено"
                        style={{ maxWidth: 150, marginBottom: 10 }}
                    />
                    <p style={{ fontStyle: "italic" }}>Ничего не найдено</p>
                </div>
            )}
        </div>
    );
}