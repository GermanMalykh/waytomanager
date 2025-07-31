import React, { useState, useEffect } from "react";

export default function Sidebar({ onSelect }) {
  const [toc, setToc] = useState([]);

  useEffect(() => {
      fetch('/waytomanager/toc.json')
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
      <h2 style={{ fontSize: 20, marginBottom: 20 }}>📚 WayToManager</h2>
      {toc.map((section) => (
        <div key={section.id} style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16 }}>{section.title}</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {section.modules.map((mod) => (
              <li key={mod.id} style={{ margin: "6px 0" }}>
                <button
                  onClick={() => onSelect(mod.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#333",
                    textAlign: "left",
                    padding: 0,
                    cursor: "pointer"
                  }}
                >
                  {mod.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}