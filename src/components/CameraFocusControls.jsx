import { useRef, useEffect, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { DEFAULT_CAMERA, getFocusTargetForPart } from "../data/cameraFocus.js";

/**
 * Orbit controls. Sidebar picks only ease the orbit *target* toward the part (pivot / look-at
 * point). Camera world position is not translated—view swings to center the component. 3D clicks
 * do not trigger this. Controls stay enabled (no lock).
 */
export function CameraFocusControls({ selectedId, sidebarFocusNonce }) {
  const controlsRef = useRef(null);
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  const goalTarget = useRef(new THREE.Vector3().fromArray(DEFAULT_CAMERA.target));
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

    const t = getFocusTargetForPart(id);
    goalTarget.current.set(t[0], t[1], t[2]);
    animating.current = true;
  }, [sidebarFocusNonce]);

  useFrame((_, delta) => {
    const ctrl = controlsRef.current;
    if (!ctrl || !animating.current) return;

    const k = 1 - Math.exp(-5.5 * delta);
    ctrl.target.lerp(goalTarget.current, k);
    ctrl.update();

    if (ctrl.target.distanceTo(goalTarget.current) < 0.018) {
      ctrl.target.copy(goalTarget.current);
      ctrl.update();
      animating.current = false;
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
