import { ClickablePart } from "./ClickablePart";

/**
 * Stylized mid-tower built from boxes. Y is up; case opening faces +Z (toward camera by default).
 */
export function PCModel({ selectedId, hoveredId, onSelect, onHover }) {
  const common = { selectedId, hoveredId, onSelect, onHover };

  return (
    <group position={[0, -0.15, 0]}>
      {/* Outer case — semi-transparent so interior reads */}
      <ClickablePart
        partId="case"
        position={[0, 0.55, 0]}
        args={[0.52, 1.05, 0.48]}
        color="#1c2433"
        transparent
        opacity={0.22}
        metalness={0.9}
        roughness={0.15}
        {...common}
      />
      {/* Solid frame hints: feet + top rail */}
      <mesh position={[0, 0.02, 0.22]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.04, 0.06]} />
        <meshStandardMaterial color="#252e3d" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.06, 0.22]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.04, 0.06]} />
        <meshStandardMaterial color="#252e3d" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Motherboard tray (back, -Z) */}
      <ClickablePart
        partId="motherboard"
        position={[0, 0.55, -0.2]}
        args={[0.38, 0.85, 0.03]}
        color="#0d2818"
        metalness={0.15}
        roughness={0.85}
        {...common}
      />

      {/* CPU + cooler stack */}
      <ClickablePart
        partId="cpu"
        position={[-0.06, 0.62, -0.16]}
        args={[0.09, 0.09, 0.04]}
        color="#3a3a42"
        metalness={0.85}
        roughness={0.25}
        {...common}
      />
      <ClickablePart
        partId="cooler"
        position={[-0.06, 0.72, -0.16]}
        args={[0.14, 0.16, 0.14]}
        color="#4a4a52"
        metalness={0.5}
        roughness={0.45}
        {...common}
      />

      {/* RAM sticks */}
      <ClickablePart
        partId="ram"
        position={[0.12, 0.58, -0.16]}
        args={[0.028, 0.32, 0.045]}
        color="#1a1a22"
        metalness={0.4}
        roughness={0.5}
        {...common}
      />
      <ClickablePart
        partId="ram"
        position={[0.155, 0.58, -0.16]}
        args={[0.028, 0.32, 0.045]}
        color="#1a1a22"
        metalness={0.4}
        roughness={0.5}
        {...common}
      />

      {/* GPU */}
      <ClickablePart
        partId="gpu"
        position={[0, 0.42, 0.02]}
        args={[0.32, 0.12, 0.18]}
        color="#15151c"
        metalness={0.55}
        roughness={0.35}
        {...common}
      />
      {/* GPU accent — same hit target as GPU for clicks */}
      <mesh
        position={[0, 0.42, 0.11]}
        castShadow
        userData={{ partId: "gpu" }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("gpu");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover("gpu");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[0.26, 0.04, 0.02]} />
        <meshStandardMaterial
          color={selectedId === "gpu" || hoveredId === "gpu" ? "#6ec0ff" : "#3d8bfd"}
          emissive="#1a4a8a"
          emissiveIntensity={selectedId === "gpu" ? 0.55 : hoveredId === "gpu" ? 0.4 : 0.35}
        />
      </mesh>

      {/* M.2 SSD on board */}
      <ClickablePart
        partId="storage"
        position={[0.08, 0.38, -0.175]}
        rotation={[0.15, 0, 0]}
        args={[0.1, 0.012, 0.035]}
        color="#2a2a32"
        metalness={0.7}
        roughness={0.35}
        {...common}
      />

      {/* PSU shroud area */}
      <ClickablePart
        partId="psu"
        position={[0, 0.14, -0.12]}
        args={[0.34, 0.12, 0.22]}
        color="#121218"
        metalness={0.5}
        roughness={0.55}
        {...common}
      />

      {/* Front intake fans */}
      <ClickablePart
        partId="fans"
        position={[0, 0.75, 0.22]}
        args={[0.34, 0.34, 0.04]}
        color="#222830"
        metalness={0.65}
        roughness={0.4}
        {...common}
      />
      <mesh position={[0, 0.75, 0.241]} rotation={[0, 0, Math.PI / 6]}>
        <circleGeometry args={[0.12, 24]} />
        <meshStandardMaterial
          color="#1a1e28"
          metalness={0.3}
          roughness={0.7}
          side={2}
        />
      </mesh>
    </group>
  );
}
