import { useEffect, useRef } from "react";

export function DetailOverlay({ part, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
  }, [part]);

  useEffect(() => {
    if (!part) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [part]);

  if (!part) return null;

  return (
    <div className="detail-overlay" role="presentation">
      <button
        type="button"
        className="detail-overlay-backdrop"
        aria-label="Close details"
        onClick={onClose}
      />
      <div
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-panel-title"
      >
        <div className="detail-panel-header">
          <h2 id="detail-panel-title" className="detail-panel-title">
            {part.label}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="detail-panel-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="detail-panel-short">{part.short}</p>
        <p className="detail-panel-desc">{part.description}</p>
        <h3 className="detail-panel-specs-h">Key points</h3>
        <ul className="detail-panel-specs">
          {part.specs.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
