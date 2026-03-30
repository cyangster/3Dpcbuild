import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/** Higher = reaches “outside the case” pose faster */
const EASE = 6.4;

/**
 * Smoothly translates and scales children when `selectedId === partId` (e.g. arrow or sidebar).
 * Large +Z offset pulls parts past the case opening (~ z ≈ 0.25) so they float in front for inspection.
 */
export function PopOutOnSelect({ partId, selectedId, offset = [0, 0, 0.12], scaleBoost = 0.1, children }) {
  const ref = useRef(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    const goal = selectedId === partId ? 1 : 0;
    t.current += (goal - t.current) * (1 - Math.exp(-EASE * delta));
    const k = t.current;
    if (!ref.current) return;
    ref.current.position.set(offset[0] * k, offset[1] * k, offset[2] * k);
    const s = 1 + scaleBoost * k;
    ref.current.scale.set(s, s, s);
  });

  return <group ref={ref}>{children}</group>;
}
