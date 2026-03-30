import { useRef, useLayoutEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { DEFAULT_CAMERA } from "../data/cameraFocus.js";

/**
 * Orbit / zoom only. Sidebar selection does not move or lock the camera.
 */
export function CameraFocusControls() {
  const controlsRef = useRef(null);

  useLayoutEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    ctrl.target.fromArray(DEFAULT_CAMERA.target);
    ctrl.update();
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={0.06}
      maxPolarAngle={Math.PI - 0.06}
      minDistance={0.72}
      maxDistance={4.5}
    />
  );
}
