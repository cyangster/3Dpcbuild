import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { DEFAULT_CAMERA } from "../data/cameraFocus.js";
import { PCModel } from "./PCModel";
import { CameraFocusControls } from "./CameraFocusControls.jsx";

export function PCScene({ selectedId, hoveredId, onSelect, onHover, sidebarFocusNonce }) {
  return (
    <Canvas
      shadows
      camera={{ position: DEFAULT_CAMERA.position, fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#e8edf5"]} />
      <ambientLight intensity={0.88} />
      <directionalLight
        position={[3.2, 5.2, 2.8]}
        intensity={1.65}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={8}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      <directionalLight position={[-2.2, 3.5, -1.2]} intensity={0.65} color="#ffffff" />
      <hemisphereLight args={["#ffffff", "#d4dce8", 0.55]} />

      <Suspense fallback={null}>
        <PCModel
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />

        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.24}
          scale={12}
          blur={2.4}
          far={4}
          color="#64748b"
        />

        <Environment preset="city" environmentIntensity={0.42} />
      </Suspense>

      <CameraFocusControls selectedId={selectedId} sidebarFocusNonce={sidebarFocusNonce} />
    </Canvas>
  );
}
