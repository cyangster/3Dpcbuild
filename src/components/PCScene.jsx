import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { PCModel } from "./PCModel";

export function PCScene({ selectedId, hoveredId, onSelect, onHover }) {
  return (
    <Canvas
      shadows
      camera={{ position: [1.35, 0.85, 1.55], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#0a0e14"]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={8}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      <directionalLight position={[-2, 2, -1]} intensity={0.25} color="#a8c4ff" />

      <Suspense fallback={null}>
        <PCModel
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />

        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.45}
          scale={12}
          blur={2.2}
          far={4}
        />

        <Environment preset="city" environmentIntensity={0.4} />
      </Suspense>

      <OrbitControls
        enablePan
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2 - 0.08}
        minDistance={0.85}
        maxDistance={4}
        target={[0, 0.45, 0]}
      />
    </Canvas>
  );
}
