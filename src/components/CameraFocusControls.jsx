import { useRef, useEffect, useLayoutEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { DEFAULT_CAMERA, getCameraForPart } from "../data/cameraFocus.js";

/**
 * Orbit controls with smooth camera + target interpolation when `selectedId` changes.
 * While tweening, controls are disabled so drei's internal `update()` does not run — that
 * `update()` rebuilds the camera from spherical coords and clamps polar/distance, which
 * fights `position.lerp` and can prevent convergence (felt as a "locked" view on CPU/RAM).
 */
export function CameraFocusControls({ selectedId }) {
  const controlsRef = useRef(null);
  const { camera } = useThree();
  const goalTarget = useRef(new THREE.Vector3().fromArray(DEFAULT_CAMERA.target));
  const goalPosition = useRef(new THREE.Vector3().fromArray(DEFAULT_CAMERA.position));
  const animating = useRef(false);

  useLayoutEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    ctrl.target.fromArray(DEFAULT_CAMERA.target);
    ctrl.update();
  }, []);

  useEffect(() => {
    const ctrl = controlsRef.current;
    if (selectedId === "fans") {
      animating.current = false;
      if (ctrl) ctrl.enabled = true;
      return;
    }
    const cfg = getCameraForPart(selectedId);
    goalTarget.current.set(cfg.target[0], cfg.target[1], cfg.target[2]);
    goalPosition.current.set(cfg.position[0], cfg.position[1], cfg.position[2]);
    animating.current = true;
    if (ctrl) ctrl.enabled = false;
  }, [selectedId]);

  useFrame((_, delta) => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    if (!animating.current) return;

    const k = 1 - Math.exp(-4.2 * delta);
    ctrl.target.lerp(goalTarget.current, k);
    camera.position.lerp(goalPosition.current, k);
    if (
      ctrl.target.distanceTo(goalTarget.current) < 0.025 &&
      camera.position.distanceTo(goalPosition.current) < 0.04
    ) {
      ctrl.target.copy(goalTarget.current);
      camera.position.copy(goalPosition.current);
      animating.current = false;
      ctrl.enabled = true;
      ctrl.update();
    }
  });

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
