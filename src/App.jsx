import { useState, useCallback } from "react";
import { PCScene } from "./components/PCScene.jsx";
import { DetailOverlay } from "./components/DetailOverlay.jsx";
import { PC_PARTS } from "./data/pcParts.js";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const onSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const onHover = useCallback((id) => {
    setHoveredId(id);
  }, []);

  const onCloseDetail = useCallback(() => {
    setSelectedId(null);
  }, []);

  const selected = selectedId ? PC_PARTS[selectedId] : null;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1 className="title">Interactive 3D PC</h1>
          <p className="subtitle">
            The build stays centered — drag to look around it like a display model. Tap any part
            to learn what it does.{" "}
            <span className="subtitle-hint">
              Red arrows mark pieces that are hidden or hard to tap (CPU, SSD, PSU).
            </span>
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
      </main>

      <DetailOverlay part={selected} onClose={onCloseDetail} />

      <footer className="footer">
        <span>Built with React, Vite, and React Three Fiber — deploys on Vercel as a static site.</span>
      </footer>
    </div>
  );
}
