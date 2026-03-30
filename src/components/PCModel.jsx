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

      {/* —— CPU (under cooler — pops forward when selected via arrow / sidebar) —— */}
      <group position={cpuTarget}>
        <PopOutOnSelect
          partId="cpu"
          selectedId={selectedId}
          offset={[0.035, 0.05, 0.16]}
          scaleBoost={0.22}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.021, 0.021, 0.011, 28]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.75} roughness={0.28} />
          </mesh>
        </PopOutOnSelect>
      </group>

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

      {/* —— GPU: invisible bounds + shroud / fans / backplate —— */}
      <ClickablePart
        partId="gpu"
        position={[0, 0.42, 0.028]}
        args={[0.38, 0.145, 0.24]}
        color="#15151c"
        transparent
        opacity={0}
        metalness={0.55}
        roughness={0.35}
        {...common}
      />

      <NoRaycastGroup>
        <mesh position={[0, 0.42, -0.075]} castShadow receiveShadow>
          <boxGeometry args={[0.32, 0.1, 0.012]} />
          <meshStandardMaterial color="#64748b" metalness={0.65} roughness={0.28} />
        </mesh>
        <RoundedBox
          args={[0.34, 0.118, 0.198]}
          radius={0.026}
          smoothness={4}
          position={[0, 0.42, 0.035]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#1e293b" metalness={0.55} roughness={0.42} />
        </RoundedBox>
        {/* GPU: blue accent + purple trim — reads as dual-slot card, not a flat SSD */}
        <mesh position={[0, 0.448, 0.138]} castShadow>
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
        <mesh position={[0, 0.418, 0.136]} castShadow>
          <boxGeometry args={[0.26, 0.012, 0.012]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#4c1d95"
            emissiveIntensity={0.35}
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>
        <GpuFanVisual position={[-0.1, 0.42, 0.132]} scale={0.92} />
        <GpuFanVisual position={[0, 0.42, 0.132]} scale={0.92} />
        <GpuFanVisual position={[0.1, 0.42, 0.132]} scale={0.92} />
      </NoRaycastGroup>

      {/* —— M.2 SSD (visual — slides out toward viewer when selected) —— */}
      <NoRaycastGroup>
        <group position={storageTarget} rotation={[0.12, 0, 0]}>
          <PopOutOnSelect
            partId="storage"
            selectedId={selectedId}
            offset={[0, 0.025, 0.13]}
            scaleBoost={0.18}
          >
            {/* M.2 “gumstick”: green PCB + gold fingers — clearly not the GPU shroud */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.11, 0.011, 0.022]} />
              <meshStandardMaterial color="#15803d" metalness={0.12} roughness={0.82} />
            </mesh>
            <mesh position={[-0.048, 0, 0.001]} castShadow>
              <boxGeometry args={[0.022, 0.009, 0.018]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.75} roughness={0.35} />
            </mesh>
            <mesh position={[0.028, 0.002, 0.002]} castShadow>
              <boxGeometry args={[0.038, 0.012, 0.018]} />
              <meshStandardMaterial color="#0f172a" metalness={0.15} roughness={0.88} />
            </mesh>
            <mesh position={[0.01, 0.007, 0.012]}>
              <boxGeometry args={[0.045, 0.002, 0.014]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.2} roughness={0.65} />
            </mesh>
          </PopOutOnSelect>
        </group>
      </NoRaycastGroup>

      {/* —— PSU (whole unit nudges forward when selected) —— */}
      <group position={psuTarget}>
        <PopOutOnSelect
          partId="psu"
          selectedId={selectedId}
          offset={[0, 0.04, 0.15]}
          scaleBoost={0.06}
        >
          <ClickableRoundedBox
            partId="psu"
            args={[0.37, 0.118, 0.245]}
            radius={0.018}
            position={[0, 0, 0]}
            color="#3d4a5c"
            metalness={0.42}
            roughness={0.5}
            {...common}
          />
          <NoRaycastGroup>
            {Array.from({ length: 6 }, (_, i) => (
              <mesh key={i} position={[0, -0.026 + i * 0.018, 0.121]}>
                <boxGeometry args={[0.28, 0.008, 0.006]} />
                <meshStandardMaterial color="#3d4858" metalness={0.32} roughness={0.58} />
              </mesh>
            ))}
            <mesh position={[0, 0, -0.125]} castShadow>
              <boxGeometry args={[0.32, 0.09, 0.02]} />
              <meshStandardMaterial color="#4a5568" metalness={0.38} roughness={0.52} />
            </mesh>
          </NoRaycastGroup>
        </PopOutOnSelect>
      </group>

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
