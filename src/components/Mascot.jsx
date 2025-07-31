export default function Mascot({ selected, type = "turtle" }) {
    if (selected === null) return null

    const base = import.meta.env.BASE_URL

    const mascots = {
        turtle: {
            img: `${base}turtle.svg`,
            correct: "🐢 Отличный выбор! Ты двигаешься по PMBOK как черепаха к успеху!",
            wrong: "🐢 Ой! Подумай ещё раз — не спеши, как черепаха 🐢"
        },
        meerkat: {
            img: `${base}meerkat_standart.svg`,
            correct: "🦝 Отличный выбор! Ты управляешь рисками как профи ✅",
            wrong: "🦝 Хм, подумай ещё раз — лучше фиксировать риски заранее ⚠️"
        }
    }

    const mascot = mascots[type] || mascots.turtle

    return (
        <div style={{ marginTop: 30, textAlign: 'center' }}>
            <img src={mascot.img} alt={`Маскот ${type}`} style={{ height: 200 }} />
            <p style={{ fontSize: 18, marginTop: 10 }}>
                {selected ? mascot.correct : mascot.wrong}
            </p>
        </div>
    )
}