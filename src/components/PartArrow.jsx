import { useRef, useLayoutEffect, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RED = "#dc2626";
const RED_BRIGHT = "#ef4444";
const RED_DEEP = "#991b1b";

/**
 * Clickable indicator pointing at a part that is hard to see or hit (e.g. CPU under a cooler).
 * `position` and `lookAt` are in the same local space as the parent group (PC case group).
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
    const s = 1 + Math.sin(clock.elapsedTime * 2.8) * 0.07;
    p.scale.setScalar(s);
  });

  const active = selectedId === partId;
  const hover = hoveredId === partId;

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

  const matProps = {
    color: active || hover ? RED_BRIGHT : RED,
    emissive: RED_DEEP,
    emissiveIntensity: active ? 0.45 : hover ? 0.28 : 0.15,
    metalness: 0.25,
    roughness: 0.45,
  };

  return (
    <group ref={orientRef}>
      <group ref={pulseRef} rotation={[0, Math.PI, 0]}>
        {/* Single hit target so hover/click don’t flicker across child meshes */}
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
          <meshStandardMaterial {...matProps} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
