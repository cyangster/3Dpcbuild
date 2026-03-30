import { useRef, useEffect, useLayoutEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { DEFAULT_CAMERA, getCameraForPart } from "../data/cameraFocus.js";

/**
 * Orbit controls with smooth camera + target interpolation when a **part** is selected.
 * Tween always starts from the current pose (no fly-back when selection is cleared).
 * While tweening, controls are disabled so drei's `update()` does not fight the lerp.
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
    if (!ctrl) return;

    /* No “rest” tween: clearing selection leaves the camera where it is. */
    if (selectedId == null) {
      animating.current = false;
      ctrl.enabled = true;
      return;
    }

    if (selectedId === "fans") {
      animating.current = false;
      ctrl.enabled = true;
      return;
    }

    const cfg = getCameraForPart(selectedId);
    goalTarget.current.set(cfg.target[0], cfg.target[1], cfg.target[2]);
    goalPosition.current.set(cfg.position[0], cfg.position[1], cfg.position[2]);
    animating.current = true;
    ctrl.enabled = false;
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
