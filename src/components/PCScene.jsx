import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { PCModel } from "./PCModel";

export function PCScene({ selectedId, hoveredId, onSelect, onHover }) {
  return (
    <Canvas
      shadows
      camera={{ position: [1.45, 0.72, 1.65], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#dce3ed"]} />
      <ambientLight intensity={0.62} />
      <directionalLight
        position={[3, 5, 2.5]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={8}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      <directionalLight position={[-2.5, 3, -1.5]} intensity={0.45} color="#ffffff" />
      <hemisphereLight args={["#f0f4fc", "#c5d0e0", 0.35]} />

      <Suspense fallback={null}>
        <PCModel
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />

        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.32}
          scale={12}
          blur={2.4}
          far={4}
          color="#1e293b"
        />

        <Environment preset="city" environmentIntensity={0.28} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.06}
        maxPolarAngle={Math.PI - 0.06}
        minDistance={1.05}
        maxDistance={4.25}
        target={[0, 0.45, 0]}
      />
    </Canvas>
  );
}
