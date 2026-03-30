import { useState, useCallback } from "react";
import { PCScene } from "./components/PCScene.jsx";
import { PC_PARTS, PART_IDS } from "./data/pcParts.js";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  /** Bumps only on sidebar list clicks so the camera frames the part; 3D picks do not bump. */
  const [sidebarFocusNonce, setSidebarFocusNonce] = useState(0);

  const onSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const onHover = useCallback((id) => {
    setHoveredId(id);
  }, []);

  const selected = selectedId ? PC_PARTS[selectedId] : null;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1 className="title">Interactive 3D PC</h1>
          <p className="subtitle">
            Choose a part in the list to highlight it and read details. Drag to orbit and pinch to
            zoom—the view stays under your control. Tap the model, use the red arrow for the CPU
            (central processing unit), or pick SSD (solid-state drive) in the list.
          </p>
        </div>
      </header>

      <main className="main">
        <section className="canvas-wrap" aria-label="3D PC model">
          <PCScene
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={onSelect}
            onHover={onHover}
            sidebarFocusNonce={sidebarFocusNonce}
          />
        </section>

        <aside className="sidebar" aria-label="Parts and details">
          <div className="panel parts-list">
            <h2 className="panel-title">All parts</h2>
            <ul className="part-buttons">
              {PART_IDS.map((id) => {
                const part = PC_PARTS[id];
                const active = selectedId === id;
                const hover = hoveredId === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`part-btn${active ? " part-btn--active" : ""}${hover && !active ? " part-btn--hover" : ""}`}
                      onClick={() => {
                        setSelectedId(id);
                        setSidebarFocusNonce((n) => n + 1);
                      }}
                      onPointerEnter={() => setHoveredId(id)}
                      onPointerLeave={() => setHoveredId(null)}
                    >
                      <span className="part-btn-label">{part.label}</span>
                      <span className="part-btn-short">{part.short}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="panel details">
            <h2 className="panel-title">Details</h2>
            {selected ? (
              <div className="details-content">
                <h3 className="details-heading">{selected.label}</h3>
                <p className="details-desc">{selected.description}</p>
                <h4 className="details-specs-title">Key points</h4>
                <ul className="details-specs">
                  {selected.specs.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
                <button type="button" className="clear-btn" onClick={() => setSelectedId(null)}>
                  Clear selection
                </button>
              </div>
            ) : (
              <p className="details-placeholder">
                Pick a component from the list to frame it and read what it does.
              </p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
