import React, {useState, useEffect} from "react"

export default function StarterBanner({
                                          src,
                                          alt,
                                          text,
                                          spinner = false,
                                          base = import.meta.env.BASE_URL
                                      }) {
    const [ready, setReady] = useState(false)

    const funTips = [
        "Проектируем красивую картинку...",
        "Подключаем художника...",
        "Скачиваем пиксели...",
        "Подбираем нужный цвет...",
        "Рисуем с любовью и HTML..."
    ]

    const [tip] = useState(() => {
        return funTips[Math.floor(Math.random() * funTips.length)]
    })

    useEffect(() => {
        setReady(false)
    }, [src])

    return (
        <div
            style={{
                position: "relative",
                height: 320,
                marginTop: 80
            }}
        >
            <div
                style={{
                    height: 220,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                }}
            >
                {src && !spinner && (
                    <img
                        src={`${base}${src}`}
                        alt={alt}
                        onLoad={() => setReady(true)}
                        style={{
                            maxHeight: 220,
                            opacity: ready ? 1 : 0,
                            transition: "opacity 0.3s ease"
                        }}
                    />
                )}

                {(spinner || !ready) && (
                    <div style={{position: "absolute", top: 0, textAlign: "center", width: "100%"}}>
                        <div
                            style={{
                                margin: "0 auto",
                                width: 40,
                                height: 40,
                                border: "4px solid #ccc",
                                borderTop: "4px solid #007acc",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }}
                        />
                        <div style={{marginTop: 12, fontSize: 14, color: "#666"}}>
                            {tip}
                        </div>
                    </div>
                )}
            </div>

            {(ready || spinner) && (
                <p
                    style={{
                        position: "absolute",
                        bottom: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 18,
                        margin: 0,
                        whiteSpace: "nowrap"
                    }}
                >
                    {text}
                </p>
            )}
        </div>
    )
}
