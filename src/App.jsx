import { useState, useCallback } from "react";
import { PCScene } from "./components/PCScene.jsx";
import { PC_PARTS, PART_IDS } from "./data/pcParts.js";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

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
            Click parts in the view or use the list. Drag to orbit, scroll to zoom.
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
          />
        </section>

        <aside className="sidebar" aria-label="Part details and list">
          <div className="panel parts-list">
            <h2 className="panel-title">Components</h2>
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
                      onClick={() => setSelectedId(id)}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
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
                Select a component in the 3D view or from the list to see an overview and
                practical notes for builders.
              </p>
            )}
          </div>
        </aside>
      </main>

      <footer className="footer">
        <span>Built with React, Vite, and React Three Fiber — deploys on Vercel as a static site.</span>
      </footer>
    </div>
  );
}
