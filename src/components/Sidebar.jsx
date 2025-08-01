import React, {useState, useEffect} from "react";

export default function Sidebar({onSelect, activeModuleId}) {
    const [toc, setToc] = useState([]);
    const [query, setQuery] = useState("")
    const [isTocLoaded, setIsTocLoaded] = useState(false)
    const isModuleUnlocked = (sectionIndex, moduleIndex) => {

        if (moduleIndex === 0) return true

        const prevModuleId = toc[sectionIndex].modules[moduleIndex - 1].id
        const savedProgress = localStorage.getItem(`progress-${prevModuleId}`)
        return !!savedProgress
    }
    const filteredToc = toc
        .map((section) => ({
            ...section,
            modules: section.modules.filter((mod) =>
                mod.title.toLowerCase().includes(query.toLowerCase())
            )
        }))
        .filter((section) => section.modules.length > 0)
    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/system/toc.json`)
            .then((res) => res.json())
            .then((data) => {
                setToc(data)
                setIsTocLoaded(true)
                localStorage.setItem("waytomanager-toc-cache", JSON.stringify(data))
            })
            .catch((err) => console.error("Ошибка загрузки TOC:", err));
    }, []);

    if (!isTocLoaded) return null

    return (
        <div style={{
            width: 250,
            borderRight: "1px solid #ccc",
            padding: "20px",
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#f9f9f9"
        }}>
            <h2 style={{fontSize: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 8}}>
                <img
                    src={`${import.meta.env.BASE_URL}assets/system/books-and-people.svg`}
                    alt="WayToManager лого"
                    style={{width: 24, height: 24}}
                />
                WayToManager
            </h2>
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
                filteredToc.map((section, sectionIndex) => (
                    <div key={section.id} style={{marginBottom: 20}}>
                        <h3 style={{fontSize: 16}}>{section.title}</h3>
                        <ul style={{listStyle: "none", padding: 0}}>
                            {section.modules
                                .filter((mod) =>
                                    mod.title.toLowerCase().includes(query.toLowerCase())
                                )
                                .map((mod, moduleIndex) => {
                                    const isUnlocked = isModuleUnlocked(sectionIndex, moduleIndex)

                                    return (
                                        <li key={mod.id} style={{margin: "6px 0", opacity: isUnlocked ? 1 : 0.5}}>
                                            <button
                                                onClick={() => {
                                                    if (isUnlocked) {
                                                        onSelect(mod.id)
                                                    } else {
                                                        localStorage.setItem(`blocked-${mod.id}`, "true")
                                                        onSelect(mod.id)
                                                    }
                                                }}
                                                style={{
                                                    background: activeModuleId === mod.id ? "#007acc" : "none",
                                                    color: activeModuleId === mod.id ? "#fff" : "#333",
                                                    fontWeight: activeModuleId === mod.id ? "bold" : "normal",
                                                    padding: "6px 8px",
                                                    borderRadius: 4,
                                                    border: "none",
                                                    textAlign: "left",
                                                    cursor: isUnlocked ? "pointer" : "not-allowed",
                                                    width: "100%",
                                                }}
                                            >
                                                {mod.title}
                                            </button>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                ))
            ) : (
                <div style={{textAlign: "center", color: "#999", marginTop: 40}}>
                    <img
                        src="/waytomanager/assets/system/no-results.svg"
                        alt="Ничего не найдено"
                        style={{maxWidth: 150, marginBottom: 10}}
                    />
                    <p style={{fontStyle: "italic"}}>Ничего не найдено</p>
                </div>
            )}
        </div>
    );
}