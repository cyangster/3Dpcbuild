import { useRef, useEffect, useLayoutEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { DEFAULT_CAMERA, getCameraForPart } from "../data/cameraFocus.js";

/**
 * Orbit controls. When `sidebarFocusNonce` increments (sidebar pick), smoothly frames that part
 * from the current view, then re-enables orbit. Clicks in the 3D scene only change selection and
 * do not trigger this tween.
 */
export function CameraFocusControls({ selectedId, sidebarFocusNonce }) {
  const controlsRef = useRef(null);
  const { camera } = useThree();
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

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
    if (sidebarFocusNonce === 0) return;

    const id = selectedIdRef.current;
    const ctrl = controlsRef.current;
    if (id == null || !ctrl) return;

    const cfg = getCameraForPart(id);
    goalTarget.current.set(cfg.target[0], cfg.target[1], cfg.target[2]);
    goalPosition.current.set(cfg.position[0], cfg.position[1], cfg.position[2]);
    animating.current = true;
    ctrl.enabled = false;
  }, [sidebarFocusNonce]);

  useFrame((_, delta) => {
    const ctrl = controlsRef.current;
    if (!ctrl || !animating.current) return;

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
