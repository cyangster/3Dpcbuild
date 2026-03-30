import { useEffect, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { ClickablePart } from "./ClickablePart";
import { ClickableRoundedBox } from "./ClickableRoundedBox";
import { PartArrow } from "./PartArrow";
import { PopOutOnSelect } from "./PopOutOnSelect.jsx";
import { HOVER, SELECTION } from "../theme/selectionHighlight.js";

function NoRaycastGroup({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    g.traverse((o) => {
      if (o.isMesh) o.raycast = () => {};
    });
  }, []);
  return <group ref={ref}>{children}</group>;
}

/** emphasis: idle | hover | selected — cyan glow for sidebar / click feedback */
function fanEmphasisMat(emphasis, baseRing, baseHub, baseBlade) {
  if (emphasis === "selected") {
    return {
      ring: { color: SELECTION.surface, emissive: SELECTION.emissive, emissiveIntensity: SELECTION.emissiveIntensity, metalness: SELECTION.metalnessSelected, roughness: SELECTION.roughnessSelected },
      hub: { color: "#38bdf8", emissive: SELECTION.emissive, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.42 },
      blade: { color: "#7dd3fc", emissive: "#0369a1", emissiveIntensity: 0.35, metalness: 0.3, roughness: 0.5 },
    };
  }
  if (emphasis === "hover") {
    return {
      ring: { color: HOVER.surface, emissive: HOVER.emissive, emissiveIntensity: HOVER.emissiveIntensity, metalness: 0.38, roughness: 0.45 },
      hub: { color: "#60a5fa", emissive: HOVER.emissive, emissiveIntensity: 0.32, metalness: 0.35, roughness: 0.46 },
      blade: { color: "#93c5fd", emissive: "#1d4ed8", emissiveIntensity: 0.22, metalness: 0.28, roughness: 0.52 },
    };
  }
  return {
    ring: { color: baseRing, emissive: "#000000", emissiveIntensity: 0, metalness: 0.45, roughness: 0.42 },
    hub: { color: baseHub, emissive: "#000000", emissiveIntensity: 0, metalness: 0.35, roughness: 0.48 },
    blade: { color: baseBlade, emissive: "#000000", emissiveIntensity: 0, metalness: 0.25, roughness: 0.55 },
  };
}

function partEmphasis(partId, selectedId, hoveredId) {
  if (selectedId === partId) return "selected";
  if (hoveredId === partId) return "hover";
  return "idle";
}

function coolerStackMat(emphasis) {
  if (emphasis === "selected") {
    return {
      fin: { color: SELECTION.surface, emissive: SELECTION.emissive, emissiveIntensity: 0.55, metalness: 0.3, roughness: 0.46 },
      pipe: { color: "#bae6fd", emissive: SELECTION.emissive, emissiveIntensity: 0.4, metalness: 0.7, roughness: 0.3 },
      base: { color: "#7dd3fc", emissive: SELECTION.emissive, emissiveIntensity: 0.45, metalness: 0.5, roughness: 0.42 },
    };
  }
  if (emphasis === "hover") {
    return {
      fin: { color: HOVER.surface, emissive: HOVER.emissive, emissiveIntensity: 0.32, metalness: 0.32, roughness: 0.5 },
      pipe: { color: "#e0f2fe", emissive: HOVER.emissive, emissiveIntensity: 0.25, metalness: 0.65, roughness: 0.34 },
      base: { color: "#93c5fd", emissive: HOVER.emissive, emissiveIntensity: 0.28, metalness: 0.48, roughness: 0.44 },
    };
  }
  return {
    fin: { color: "#8a94a4", emissive: "#000000", emissiveIntensity: 0, metalness: 0.35, roughness: 0.52 },
    pipe: { color: "#d8dee8", emissive: "#000000", emissiveIntensity: 0, metalness: 0.65, roughness: 0.32 },
    base: { color: "#5a6578", emissive: "#000000", emissiveIntensity: 0, metalness: 0.45, roughness: 0.48 },
  };
}

/** 120 mm–style fan facing +Z */
function CaseFanVisual({ position, scale = 1, emphasis = "idle" }) {
  const m = fanEmphasisMat(emphasis, "#5c6b7e", "#3d4a5c", "#4a5a6e");
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <torusGeometry args={[0.05, 0.007, 10, 40]} />
        <meshStandardMaterial {...m.ring} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <cylinderGeometry args={[0.024, 0.024, 0.016, 24]} />
        <meshStandardMaterial {...m.hub} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0.003]} castShadow>
          <boxGeometry args={[0.092, 0.022, 0.016]} />
          <meshStandardMaterial {...m.blade} />
        </mesh>
      ))}
    </group>
  );
}

/** Triple-fan style cluster for GPU shroud (faces +Z). */
function GpuFanVisual({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <torusGeometry args={[0.038, 0.0055, 8, 32]} />
        <meshStandardMaterial color="#4a5668" metalness={0.5} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0, 0.003]}>
        <cylinderGeometry args={[0.018, 0.018, 0.012, 20]} />
        <meshStandardMaterial color="#2d3848" metalness={0.4} roughness={0.48} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0.002]} castShadow>
          <boxGeometry args={[0.072, 0.018, 0.012]} />
          <meshStandardMaterial color="#3d4d60" metalness={0.28} roughness={0.52} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Mid-tower PC with recognizable real-world-inspired shapes (rounded case, tower cooler,
 * DIMMs, triple-fan GPU, PSU vents, 120 mm intakes). Y up; +Z is toward the viewer.
 */
export function PCModel({ selectedId, hoveredId, onSelect, onHover }) {
  const common = { selectedId, hoveredId, onSelect, onHover };

  /* Arrow targets + part positions (inside model group, before root y = -0.15). */
  const cpuTarget = [-0.068, 0.612, -0.148];
  const storageTarget = [0.13, 0.48, -0.176];
  const psuTarget = [0, 0.146, -0.12];

  const coolerEm = partEmphasis("cooler", selectedId, hoveredId);
  const coolerMat = coolerStackMat(coolerEm);
  const fansEm = partEmphasis("fans", selectedId, hoveredId);
  const fansBezelMat =
    fansEm === "selected"
      ? { color: SELECTION.surface, emissive: SELECTION.emissive, emissiveIntensity: 0.45, metalness: 0.4, roughness: 0.42 }
      : fansEm === "hover"
        ? { color: HOVER.surface, emissive: HOVER.emissive, emissiveIntensity: 0.28, metalness: 0.38, roughness: 0.46 }
        : { color: "#5a6a80", emissive: "#000000", emissiveIntensity: 0, metalness: 0.42, roughness: 0.48 };
  const fansRingMat =
    fansEm === "selected"
      ? { color: "#38bdf8", emissive: SELECTION.emissive, emissiveIntensity: 0.5, metalness: 0.35, roughness: 0.45, side: 2 }
      : fansEm === "hover"
        ? { color: "#60a5fa", emissive: HOVER.emissive, emissiveIntensity: 0.3, metalness: 0.32, roughness: 0.5, side: 2 }
        : { color: "#5a6a7e", emissive: "#000000", emissiveIntensity: 0, metalness: 0.32, roughness: 0.52, side: 2 };

  return (
    <group position={[0, -0.15, 0]}>
      {/* —— Case —— */}
      <ClickableRoundedBox
        partId="case"
        args={[0.54, 1.08, 0.5]}
        radius={0.032}
        smoothness={5}
        position={[0, 0.54, 0]}
        color="#4a5d78"
        metalness={0.42}
        roughness={0.38}
        transparent
        opacity={0.34}
        {...common}
      />

      <NoRaycastGroup>
        <mesh position={[0, 0.018, 0.248]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.035, 0.065]} />
          <meshStandardMaterial color="#5a6a80" metalness={0.4} roughness={0.48} />
        </mesh>
        <RoundedBox args={[0.5, 0.028, 0.06]} radius={0.012} position={[0, 1.074, 0.248]} castShadow receiveShadow>
          <meshStandardMaterial color="#5a6a80" metalness={0.4} roughness={0.46} />
        </RoundedBox>
        <mesh position={[0, 0.54, 0.252]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.008]} />
          <meshStandardMaterial color="#5c6d85" metalness={0.38} roughness={0.5} />
        </mesh>
      </NoRaycastGroup>

      {/* —— Motherboard —— */}
      <ClickableRoundedBox
        partId="motherboard"
        args={[0.41, 0.84, 0.02]}
        radius={0.008}
        position={[0, 0.52, -0.202]}
        color="#1f6b45"
        metalness={0.15}
        roughness={0.82}
        {...common}
      />

      <NoRaycastGroup>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.06 + i * 0.045, 0.38, -0.191]} castShadow>
            <boxGeometry args={[0.036, 0.008, 0.006]} />
            <meshStandardMaterial color="#1e293b" metalness={0.12} roughness={0.85} />
          </mesh>
        ))}
        <RoundedBox args={[0.07, 0.045, 0.028]} radius={0.006} position={[-0.12, 0.72, -0.186]} castShadow>
          <meshStandardMaterial color="#6b7588" metalness={0.5} roughness={0.42} />
        </RoundedBox>
        <mesh position={[-0.04, 0.55, -0.19]}>
          <boxGeometry args={[0.055, 0.055, 0.012]} />
          <meshStandardMaterial color="#3d4d63" metalness={0.25} roughness={0.68} />
        </mesh>
      </NoRaycastGroup>

      {/* —— CPU IHS: large + nudged toward case interior so it’s visible under cooler —— */}
      <mesh position={cpuTarget} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.022, 32]} />
        <meshStandardMaterial
          color={selectedId === "cpu" ? SELECTION.surface : "#fffbeb"}
          metalness={selectedId === "cpu" ? SELECTION.metalnessSelected : 0.55}
          roughness={selectedId === "cpu" ? SELECTION.roughnessSelected : 0.32}
          emissive={selectedId === "cpu" ? SELECTION.emissive : "#fbbf24"}
          emissiveIntensity={selectedId === "cpu" ? SELECTION.emissiveIntensity : 0.35}
        />
      </mesh>

      {/* —— Tower CPU cooler (visual) + invisible hit box —— */}
      <ClickablePart
        partId="cooler"
        position={[-0.045, 0.702, -0.172]}
        args={[0.24, 0.22, 0.16]}
        color="#4a4a52"
        transparent
        opacity={0}
        metalness={0.5}
        roughness={0.45}
        {...common}
      />

      <NoRaycastGroup>
        {Array.from({ length: 22 }, (_, i) => (
          <mesh key={i} position={[-0.152 + i * 0.0088, 0.706, -0.174]} castShadow>
            <boxGeometry args={[0.004, 0.132, 0.105]} />
            <meshStandardMaterial {...coolerMat.fin} />
          </mesh>
        ))}
        {[
          [-0.02, 0.628, -0.176, 0.32, 0.15],
          [0.01, 0.632, -0.178, 0.28, -0.1],
          [-0.05, 0.626, -0.172, 0.35, 0.05],
          [0.03, 0.63, -0.177, 0.3, -0.05],
        ].map(([x, y, z, rx, rz], i) => (
          <mesh
            key={`p-${i}`}
            position={[x, y, z]}
            rotation={[rx, 0, rz]}
            castShadow
          >
            <cylinderGeometry args={[0.0075, 0.0075, 0.12, 10]} />
            <meshStandardMaterial {...coolerMat.pipe} />
          </mesh>
        ))}
        <RoundedBox args={[0.055, 0.055, 0.038]} radius={0.012} position={[-0.068, 0.618, -0.184]} castShadow>
          <meshStandardMaterial {...coolerMat.base} />
        </RoundedBox>
        <CaseFanVisual position={[0.058, 0.702, -0.168]} scale={0.58} emphasis={coolerEm} />
      </NoRaycastGroup>

      {/* —— RAM (DIMM-style spreader + notch silhouette) —— */}
      {[
        [0.118, 0.58, -0.184],
        [0.158, 0.58, -0.184],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <ClickableRoundedBox
            partId="ram"
            args={[0.034, 0.34, 0.054]}
            radius={0.005}
            position={[0, 0, 0]}
            color="#3d4d63"
            metalness={0.4}
            roughness={0.5}
            {...common}
          />
          <NoRaycastGroup>
            <mesh position={[0, -0.168, 0]} castShadow>
              <boxGeometry args={[0.03, 0.028, 0.048]} />
              <meshStandardMaterial color="#c9a227" metalness={0.75} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.1, 0.029]}>
              <boxGeometry args={[0.028, 0.12, 0.008]} />
              <meshStandardMaterial color="#4a5568" metalness={0.42} roughness={0.45} />
            </mesh>
          </NoRaycastGroup>
        </group>
      ))}

      {/* —— GPU: slides out of the case when selected (same center as before) —— */}
      <group position={[0, 0.42, 0.028]}>
        <PopOutOnSelect
          partId="gpu"
          selectedId={selectedId}
          offset={[0, 0.05, 0.42]}
          scaleBoost={0.12}
        >
          <ClickablePart
            partId="gpu"
            position={[0, 0, 0]}
            args={[0.38, 0.145, 0.24]}
            color="#15151c"
            transparent
            opacity={0}
            metalness={0.55}
            roughness={0.35}
            {...common}
          />
          <NoRaycastGroup>
            <mesh position={[0, 0, -0.103]} castShadow receiveShadow>
              <boxGeometry args={[0.32, 0.1, 0.012]} />
              <meshStandardMaterial color="#64748b" metalness={0.65} roughness={0.28} />
            </mesh>
            <RoundedBox
              args={[0.34, 0.118, 0.198]}
              radius={0.026}
              smoothness={4}
              position={[0, 0, 0.007]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#1e293b" metalness={0.55} roughness={0.42} />
            </RoundedBox>
            <mesh position={[0, 0.028, 0.11]} castShadow>
              <boxGeometry args={[0.28, 0.028, 0.014]} />
              <meshStandardMaterial
                color={
                  selectedId === "gpu"
                    ? SELECTION.surface
                    : hoveredId === "gpu"
                      ? HOVER.surface
                      : "#2563eb"
                }
                emissive={selectedId === "gpu" ? SELECTION.emissive : hoveredId === "gpu" ? HOVER.emissive : "#1e40af"}
                emissiveIntensity={
                  selectedId === "gpu"
                    ? SELECTION.emissiveIntensity
                    : hoveredId === "gpu"
                      ? HOVER.emissiveIntensity
                      : 0.32
                }
                metalness={selectedId === "gpu" ? SELECTION.metalnessSelected : 0.35}
                roughness={selectedId === "gpu" ? SELECTION.roughnessSelected : 0.4}
              />
            </mesh>
            <mesh position={[0, -0.002, 0.108]} castShadow>
              <boxGeometry args={[0.26, 0.012, 0.012]} />
              <meshStandardMaterial
                color="#7c3aed"
                emissive="#4c1d95"
                emissiveIntensity={0.35}
                metalness={0.4}
                roughness={0.35}
              />
            </mesh>
            <GpuFanVisual position={[-0.1, 0, 0.104]} scale={0.92} />
            <GpuFanVisual position={[0, 0, 0.104]} scale={0.92} />
            <GpuFanVisual position={[0.1, 0, 0.104]} scale={0.92} />
          </NoRaycastGroup>
        </PopOutOnSelect>
      </group>

      {/* —— M.2 SSD: upper board area, bright green + glow so it reads from the default angle —— */}
      <NoRaycastGroup>
        <group position={storageTarget} rotation={[0.06, 0, 0]} scale={1.2}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.022, 0.038]} />
            <meshStandardMaterial
              color={selectedId === "storage" ? SELECTION.surface : "#4ade80"}
              metalness={selectedId === "storage" ? SELECTION.metalnessSelected : 0.08}
              roughness={selectedId === "storage" ? SELECTION.roughnessSelected : 0.72}
              emissive={selectedId === "storage" ? SELECTION.emissive : "#16a34a"}
              emissiveIntensity={selectedId === "storage" ? SELECTION.emissiveIntensity : 0.55}
            />
          </mesh>
          <mesh position={[-0.092, 0, 0.003]} castShadow>
            <boxGeometry args={[0.034, 0.016, 0.03]} />
            <meshStandardMaterial
              color="#facc15"
              metalness={0.85}
              roughness={0.22}
              emissive={selectedId === "storage" ? "#f59e0b" : "#ca8a04"}
              emissiveIntensity={selectedId === "storage" ? 0.55 : 0.4}
            />
          </mesh>
          <mesh position={[0.055, 0.003, 0.004]} castShadow>
            <boxGeometry args={[0.06, 0.02, 0.03]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.1}
              roughness={0.88}
              emissive={selectedId === "storage" ? "#38bdf8" : "#1e293b"}
              emissiveIntensity={selectedId === "storage" ? 0.45 : 0.2}
            />
          </mesh>
          <mesh position={[0.015, 0.014, 0.02]}>
            <boxGeometry args={[0.08, 0.004, 0.022]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.12}
              roughness={0.5}
              emissive={selectedId === "storage" ? "#e0f2fe" : "#f8fafc"}
              emissiveIntensity={selectedId === "storage" ? 0.35 : 0.15}
            />
          </mesh>
        </group>
      </NoRaycastGroup>

      {/* —— PSU (stays in case; zoom-out framing when selected from arrow/sidebar) —— */}
      <ClickableRoundedBox
        partId="psu"
        args={[0.37, 0.118, 0.245]}
        radius={0.018}
        position={psuTarget}
        color="#3d4a5c"
        metalness={0.42}
        roughness={0.5}
        {...common}
      />
      <NoRaycastGroup>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0, 0.12 + i * 0.018, psuTarget[2] + 0.121]}>
            <boxGeometry args={[0.28, 0.008, 0.006]} />
            <meshStandardMaterial color="#3d4858" metalness={0.32} roughness={0.58} />
          </mesh>
        ))}
        <mesh position={[0, psuTarget[1], psuTarget[2] - 0.125]} castShadow>
          <boxGeometry args={[0.32, 0.09, 0.02]} />
          <meshStandardMaterial color="#4a5568" metalness={0.38} roughness={0.52} />
        </mesh>
      </NoRaycastGroup>

      {/* —— Front intakes: invisible hit + dual 120 mm fans —— */}
      <ClickablePart
        partId="fans"
        position={[0, 0.74, 0.228]}
        args={[0.44, 0.4, 0.09]}
        color="#222830"
        transparent
        opacity={0}
        metalness={0.65}
        roughness={0.4}
        {...common}
      />

      <NoRaycastGroup>
        <RoundedBox args={[0.42, 0.38, 0.022]} radius={0.014} position={[0, 0.74, 0.218]} castShadow>
          <meshStandardMaterial {...fansBezelMat} />
        </RoundedBox>
        <CaseFanVisual position={[-0.115, 0.74, 0.242]} scale={1} emphasis={fansEm} />
        <CaseFanVisual position={[0.115, 0.74, 0.242]} scale={1} emphasis={fansEm} />
      </NoRaycastGroup>

      <NoRaycastGroup>
        <mesh position={[0, 0.74, 0.255]}>
          <ringGeometry args={[0.085, 0.098, 32]} />
          <meshStandardMaterial {...fansRingMat} />
        </mesh>
        <mesh position={[-0.115, 0.74, 0.255]} rotation={[0, 0, 0.25]}>
          <ringGeometry args={[0.085, 0.098, 32]} />
          <meshStandardMaterial {...fansRingMat} />
        </mesh>
        <mesh position={[0.115, 0.74, 0.255]} rotation={[0, 0, -0.2]}>
          <ringGeometry args={[0.085, 0.098, 32]} />
          <meshStandardMaterial {...fansRingMat} />
        </mesh>
      </NoRaycastGroup>

      <PartArrow
        partId="cpu"
        position={[0.26, 0.52, 0.12]}
        lookAt={cpuTarget}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelect={onSelect}
        onHover={onHover}
      />
      <PartArrow
        partId="storage"
        position={[-0.24, 0.5, 0.12]}
        lookAt={storageTarget}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelect={onSelect}
        onHover={onHover}
      />
    </group>
  );
}
