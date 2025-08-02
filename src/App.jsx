import React, {useState, useEffect} from 'react'
import Sidebar from './components/Sidebar'
import ModuleSection from './components/ModuleSection'
import StarterBanner from './components/StarterBanner'

export default function App() {
    const [selectedModuleId, setSelectedModuleId] = useState(null)
    const [moduleData, setModuleData] = useState(null)
    const [blockedModuleId, setBlockedModuleId] = useState(null)
    const [isInitialized, setIsInitialized] = useState(false)
    const [loadStage, setLoadStage] = useState('idle')
    const [fetchError, setFetchError] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // восстановление последнего выбора
    useEffect(() => {
        const last = localStorage.getItem('waytomanager-last-selected')
        if (last) setSelectedModuleId(last)
        setIsInitialized(true)
    }, [])

    // загрузка модуля
    useEffect(() => {
        if (!selectedModuleId) return

        setModuleData(null)
        setFetchError(false)
        setLoadStage('loading')
        console.log("📡 Загружаем модуль:", selectedModuleId)
        fetch(`${import.meta.env.BASE_URL}data/modules/${selectedModuleId}.json`)
            .then((res) => {
                if (!res.ok) throw new Error('fetch_failed')
                return res.json()
            })
            .then((data) => {
                if (!data || !data.title || !data.blocks) throw new Error('json_parse_failed')
                setModuleData(data)
                setLoadStage('success')
            })
            .catch((err) => {
                console.error('Ошибка загрузки модуля:', err)
                setModuleData(null)
                setFetchError(true)
                setLoadStage('error')
            })
    }, [selectedModuleId])

    // обработка выбора модуля
    const handleSelectModule = (moduleId, isBlocked = false) => {
        setIsTransitioning(true)
        setBlockedModuleId(null)
        setSelectedModuleId(null)
        setModuleData(null)
        setFetchError(false)
        setLoadStage('idle')

        setTimeout(() => {
            if (isBlocked) {
                setBlockedModuleId(moduleId)
            } else {
                setSelectedModuleId(moduleId)
                localStorage.setItem('waytomanager-last-selected', moduleId)
            }
            setIsTransitioning(false)
        }, 10)
    }

    const handleModuleComplete = (moduleId) => {
        localStorage.setItem(`blocked-${moduleId}`, 'false')
    }

    function renderContent() {
        if (isTransitioning) {
            return null
        }

        if (loadStage === 'loading' && selectedModuleId && !blockedModuleId) {
            return (
                <StarterBanner
                    key={`loading-${selectedModuleId}`}
                    spinner
                />
            )
        }

        if (blockedModuleId) {
            return (
                <StarterBanner
                    key={`blocked-${blockedModuleId}`}
                    src={`assets/system/stop.svg?v=${Date.now()}`}
                    alt="Блокировка"
                    text="⛔ Ещё рано сюда — сначала пройди предыдущий модуль!"
                />
            )
        } else if (!selectedModuleId) {
            return (
                <StarterBanner
                    key="eagle"
                    src={`assets/system/eagle-pointer.svg?v=${Date.now()}`}
                    alt="Орел"
                    text="🦅 Выберите тему слева, чтобы начать путь Менеджера!"
                />
            )
        } else if (!moduleData && loadStage === 'error') {
            return (
                <StarterBanner
                    key={`no-data-${selectedModuleId}`}
                    src={`assets/system/no-results.svg?v=${Date.now()}`}
                    alt="Нет данных"
                    text="🐑 Тема ещё в процессе оформления. Загляните позже!"
                />
            )
        } else {
            return (
                <ModuleSection data={moduleData} onComplete={handleModuleComplete}/>
            )
        }
    }

    return (
        <div style={{display: 'flex'}}>
            <Sidebar onSelect={handleSelectModule} activeModuleId={selectedModuleId}/>

            {!isInitialized ? null : (
                <main style={{flex: 1, padding: 40, maxWidth: 800}}>
                    {renderContent()}
                </main>
            )}
        </div>
    )
}
