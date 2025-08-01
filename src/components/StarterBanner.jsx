import React, {useState} from "react"

export default function StarterBanner({
                                          src,
                                          alt,
                                          text,
                                          base = import.meta.env.BASE_URL
                                      }) {
    const [ready, setReady] = useState(false)

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
                    alignItems: "center"
                }}
            >
                <img
                    src={`${base}${src}`}
                    alt={alt}
                    style={{
                        maxHeight: 220,
                        opacity: ready ? 1 : 0,
                        transition: "opacity 0.3s ease"
                    }}
                    onLoad={() => setReady(true)}
                />
            </div>

            {ready && (
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
