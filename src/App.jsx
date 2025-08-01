import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ModuleSection from './components/ModuleSection'

export default function App() {
    const [selectedModuleId, setSelectedModuleId] = useState(null)
    const [moduleData, setModuleData] = useState(null)

    useEffect(() => {
        if (!selectedModuleId) return

        fetch(`/waytomanager/data/modules/${selectedModuleId}.json`)
            .then(res => res.json())
            .then(setModuleData)
            .catch(() => setModuleData(null))
    }, [selectedModuleId])

    return (
        <div style={{ display: "flex" }}>
            <Sidebar onSelect={setSelectedModuleId} activeModuleId={selectedModuleId} />
            <main style={{ flex: 1, padding: 40, maxWidth: 800 }}>
                {moduleData
                    ? <ModuleSection data={moduleData} />
                    : <p>Выберите модуль из списка слева</p>}
            </main>
        </div>
    )
}