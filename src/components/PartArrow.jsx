import { useRef, useLayoutEffect, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Resting arrow — deep red */
const IDLE = { color: "#b91c1c", emissive: "#7f1d1d", emissiveIntensity: 0.12 };
/** Pointer or sidebar hover — clearly different warm amber/orange */
const HOVER = { color: "#f59e0b", emissive: "#c2410c", emissiveIntensity: 0.55 };
/** Selected from sidebar / scene — matches 3D part cyan highlight */
const ACTIVE = { color: "#7dd3fc", emissive: "#0369a1", emissiveIntensity: 0.78 };

/**
 * Clickable indicator pointing at a part that is hard to see or hit (e.g. CPU under a cooler).
 * Hover (pointer on arrow or same part highlighted in the sidebar) uses a distinct orange shade.
 */
export function PartArrow({
  partId,
  position,
  lookAt,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}) {
  const orientRef = useRef(null);
  const pulseRef = useRef(null);
  const shaftRef = useRef(null);
  const headRef = useRef(null);
  const targetVec = useRef(new THREE.Vector3());

  useLayoutEffect(() => {
    const g = orientRef.current;
    if (!g) return;
    targetVec.current.set(lookAt[0], lookAt[1], lookAt[2]);
    g.position.set(position[0], position[1], position[2]);
    g.lookAt(targetVec.current);
  }, [position, lookAt]);

  useEffect(() => {
    const noop = () => {};
    if (shaftRef.current) shaftRef.current.raycast = noop;
    if (headRef.current) headRef.current.raycast = noop;
  }, []);

  useFrame(({ clock }) => {
    const p = pulseRef.current;
    if (!p) return;
    const active = selectedId === partId;
    const hover = hoveredId === partId && !active;
    const amp = hover ? 0.11 : active ? 0.09 : 0.07;
    const s = 1 + Math.sin(clock.elapsedTime * 2.8) * amp;
    p.scale.setScalar(s);
  });

  const active = selectedId === partId;
  const hover = hoveredId === partId && !active;

  const matProps = useMemo(() => {
    const src = active ? ACTIVE : hover ? HOVER : IDLE;
    return {
      color: src.color,
      emissive: src.emissive,
      emissiveIntensity: src.emissiveIntensity,
      metalness: hover ? 0.35 : active ? 0.2 : 0.22,
      roughness: hover ? 0.38 : active ? 0.42 : 0.48,
    };
  }, [active, hover]);

  const setPointer = (down) => {
    document.body.style.cursor = down ? "pointer" : "auto";
  };

  const onPick = (e) => {
    e.stopPropagation();
    onSelect(partId);
  };

  const onOver = (e) => {
    e.stopPropagation();
    onHover(partId);
    setPointer(true);
  };

  const onOut = (e) => {
    e.stopPropagation();
    onHover(null);
    setPointer(false);
  };

  return (
    <group ref={orientRef}>
      <group ref={pulseRef} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, 0.1]} onClick={onPick} onPointerOver={onOver} onPointerOut={onOut}>
          <sphereGeometry args={[0.095, 20, 20]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <mesh
          ref={shaftRef}
          position={[0, 0, 0.07]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.018, 0.11, 12]} />
          <meshStandardMaterial {...matProps} />
        </mesh>

        <mesh
          ref={headRef}
          position={[0, 0, 0.15]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <coneGeometry args={[0.038, 0.095, 16]} />
          <meshStandardMaterial {...matProps} metalness={matProps.metalness * 0.85} roughness={matProps.roughness * 0.92} />
        </mesh>
      </group>
    </group>
  );
}
