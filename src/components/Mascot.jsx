export default function Mascot({ selected }) {
  if (selected === null) return null

  const message = selected
    ? "Отличный выбор! Ты управляешь рисками как профи ✅"
    : "Хм, подумай ещё раз — лучше фиксировать риски заранее ⚠️"

  const base = import.meta.env.BASE_URL

  return (
    <div style={{ marginTop: 30, textAlign: 'center' }}>
      <img src={`${base}meerkat_standart.svg`} alt="Маскот-сурикат" style={{ height: 200 }} />
      <p style={{ fontSize: 18, marginTop: 10 }}>{message}</p>
    </div>
  )
}
