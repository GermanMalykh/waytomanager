import React, {useState, useEffect} from 'react'
import Sidebar from './components/Sidebar'
import ModuleSection from './components/ModuleSection'
import StarterBanner from './components/StarterBanner'

export default function App() {
    const [selectedModuleId, setSelectedModuleId] = useState(null)
    const [blockedModuleId, setBlockedModuleId] = useState(null)
    const [isInitialized, setIsInitialized] = useState(false)
    useEffect(() => {
        const last = localStorage.getItem("waytomanager-last-selected")
        if (last) {
            setSelectedModuleId(last)
        }
        setIsInitialized(true)
    }, [])
    const [moduleData, setModuleData] = useState(null)

    const handleSelectModule = (moduleId) => {
        const blocked = localStorage.getItem(`blocked-${moduleId}`)
        if (blocked === "true") {
            setBlockedModuleId(moduleId)
            setSelectedModuleId(null)
            return
        }

        setSelectedModuleId(moduleId)
        setBlockedModuleId(null)
        if (moduleId) {
            localStorage.setItem("waytomanager-last-selected", moduleId)
        }
    }
    useEffect(() => {
        if (!selectedModuleId) return

        fetch(`/waytomanager/data/modules/${selectedModuleId}.json`)
            .then(res => res.json())
            .then(setModuleData)
            .catch(() => setModuleData(null))
    }, [selectedModuleId])
    const handleModuleComplete = (completedModuleId) => {
        const toc = JSON.parse(localStorage.getItem("waytomanager-toc-cache") || "null")
        if (!toc) return

        for (let section of toc) {
            const idx = section.modules.findIndex(mod => mod.id === completedModuleId)
            if (idx !== -1 && idx + 1 < section.modules.length) {
                const next = section.modules[idx + 1]
                setSelectedModuleId(next.id)
                break
            }
        }
    }
    return (
        <div style={{display: "flex"}}>
            <Sidebar onSelect={handleSelectModule} activeModuleId={selectedModuleId}/>
            {!isInitialized ? null : (
                <main style={{flex: 1, padding: 40, maxWidth: 800}}>
                    {blockedModuleId ? (
                        <StarterBanner
                            src="assets/system/stop.svg"
                            alt="Блокировка"
                            text="⛔ Ещё рано сюда — сначала пройди предыдущий модуль!"
                        />
                    ) : selectedModuleId && moduleData !== null ? (
                        <ModuleSection data={moduleData} onComplete={handleModuleComplete}/>
                    ) : selectedModuleId && moduleData === null ? (
                        <StarterBanner
                            src="assets/system/no-results.svg"
                            alt="Тема в разработке"
                            text="🐑 Эта тема ещё в процессе оформления. Загляни позже!"
                        />
                    ) : (
                        <StarterBanner
                            src="assets/system/eagle-pointer.svg"
                            alt="Орел"
                            text="🦅 Выберите тему слева, чтобы начать путь Менеджера!"
                        />
                    )}
                </main>
            )}
        </div>
    )
}