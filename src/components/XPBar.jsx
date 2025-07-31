export default function XPBar({ xp, completed, total }) {
    const progress = (completed / total) * 100;
    return (
        <div style={{ marginBottom: 20 }}>
            <strong>🌟 Опыт: {xp} XP</strong>
            <div style={{ width: '100%', background: '#ddd', height: 10, marginTop: 5 }}>
                <div style={{ width: `${progress}%`, background: '#007BFF', height: 10 }}></div>
            </div>
            <p>Прогресс: {progress.toFixed(0)}% ({completed}/{total} модулей)</p>
        </div>
    );
}