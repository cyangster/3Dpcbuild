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

/** 120 mm–style fan facing +Z (toward viewer when mounted on front panel). */
function CaseFanVisual({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <torusGeometry args={[0.05, 0.007, 10, 40]} />
        <meshStandardMaterial color="#5c6b7e" metalness={0.45} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <cylinderGeometry args={[0.024, 0.024, 0.016, 24]} />
        <meshStandardMaterial color="#3d4a5c" metalness={0.35} roughness={0.48} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0.003]} castShadow>
          <boxGeometry args={[0.092, 0.022, 0.016]} />
          <meshStandardMaterial color="#4a5a6e" metalness={0.25} roughness={0.55} />
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

  /* World-ish reference points for arrows (inside model group, before root offset). */
  const cpuTarget = [-0.068, 0.618, -0.184];
  const storageTarget = [0.09, 0.382, -0.182];
  const psuTarget = [0, 0.146, -0.12];

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

      {/* —— CPU (under cooler — zoom + highlight via camera; no pop-out) —— */}
      <mesh position={cpuTarget} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.012, 28]} />
        <meshStandardMaterial
          color={selectedId === "cpu" ? SELECTION.surface : "#f1f5f9"}
          metalness={selectedId === "cpu" ? SELECTION.metalnessSelected : 0.75}
          roughness={selectedId === "cpu" ? SELECTION.roughnessSelected : 0.28}
          emissive={selectedId === "cpu" ? SELECTION.emissive : "#000000"}
          emissiveIntensity={selectedId === "cpu" ? SELECTION.emissiveIntensity : 0}
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
            <meshStandardMaterial color="#8a94a4" metalness={0.35} roughness={0.52} />
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
            <meshStandardMaterial color="#d8dee8" metalness={0.65} roughness={0.32} />
          </mesh>
        ))}
        <RoundedBox args={[0.055, 0.055, 0.038]} radius={0.012} position={[-0.068, 0.618, -0.184]} castShadow>
          <meshStandardMaterial color="#5a6578" metalness={0.45} roughness={0.48} />
        </RoundedBox>
        <CaseFanVisual position={[0.058, 0.702, -0.168]} scale={0.58} />
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

      {/* —— M.2 SSD (larger + vivid; zoom-out camera + cyan highlight when selected) —— */}
      <NoRaycastGroup>
        <group position={storageTarget} rotation={[0.12, 0, 0]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.016, 0.03]} />
            <meshStandardMaterial
              color={selectedId === "storage" ? SELECTION.surface : "#22c55e"}
              metalness={selectedId === "storage" ? SELECTION.metalnessSelected : 0.1}
              roughness={selectedId === "storage" ? SELECTION.roughnessSelected : 0.78}
              emissive={selectedId === "storage" ? SELECTION.emissive : "#14532d"}
              emissiveIntensity={selectedId === "storage" ? SELECTION.emissiveIntensity : 0.18}
            />
          </mesh>
          <mesh position={[-0.068, 0, 0.002]} castShadow>
            <boxGeometry args={[0.028, 0.012, 0.024]} />
            <meshStandardMaterial
              color={selectedId === "storage" ? "#fde047" : "#eab308"}
              metalness={0.8}
              roughness={0.28}
              emissive={selectedId === "storage" ? "#ca8a04" : "#000000"}
              emissiveIntensity={selectedId === "storage" ? 0.35 : 0}
            />
          </mesh>
          <mesh position={[0.042, 0.002, 0.003]} castShadow>
            <boxGeometry args={[0.048, 0.016, 0.024]} />
            <meshStandardMaterial
              color={selectedId === "storage" ? "#1e293b" : "#0f172a"}
              metalness={0.12}
              roughness={0.85}
              emissive={selectedId === "storage" ? "#0ea5e9" : "#000000"}
              emissiveIntensity={selectedId === "storage" ? 0.25 : 0}
            />
          </mesh>
          <mesh position={[0.012, 0.01, 0.016]}>
            <boxGeometry args={[0.062, 0.003, 0.018]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.15}
              roughness={0.55}
              emissive={selectedId === "storage" ? "#e0f2fe" : "#000000"}
              emissiveIntensity={selectedId === "storage" ? 0.2 : 0}
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
          <meshStandardMaterial color="#5a6a80" metalness={0.42} roughness={0.48} />
        </RoundedBox>
        <CaseFanVisual position={[-0.115, 0.74, 0.242]} scale={1} />
        <CaseFanVisual position={[0.115, 0.74, 0.242]} scale={1} />
      </NoRaycastGroup>

      <NoRaycastGroup>
        <mesh position={[0, 0.74, 0.255]}>
          <ringGeometry args={[0.085, 0.098, 32]} />
          <meshStandardMaterial color="#5a6a7e" metalness={0.32} roughness={0.52} side={2} />
        </mesh>
        <mesh position={[-0.115, 0.74, 0.255]} rotation={[0, 0, 0.25]}>
          <ringGeometry args={[0.085, 0.098, 32]} />
          <meshStandardMaterial color="#5a6a7e" metalness={0.32} roughness={0.52} side={2} />
        </mesh>
        <mesh position={[0.115, 0.74, 0.255]} rotation={[0, 0, -0.2]}>
          <ringGeometry args={[0.085, 0.098, 32]} />
          <meshStandardMaterial color="#5a6a7e" metalness={0.32} roughness={0.52} side={2} />
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
        position={[-0.24, 0.44, 0.12]}
        lookAt={storageTarget}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelect={onSelect}
        onHover={onHover}
      />
      <PartArrow
        partId="psu"
        position={[0.26, 0.12, 0.14]}
        lookAt={psuTarget}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelect={onSelect}
        onHover={onHover}
      />
    </group>
  );
}
