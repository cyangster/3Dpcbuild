/**
 * Default camera position + orbit focus targets in world space (PC root at y = -0.15).
 * Sidebar picks only shift where the orbit pivots (target); the camera stays put and swivels.
 */
export const DEFAULT_CAMERA = {
  target: [0.08, 0.46, -0.06],
  position: [1.32, 0.69, 1.48],
};

/** @type {Record<string, [number, number, number]>} */
export const FOCUS_TARGET_BY_PART = {
  case: [0, 0.38, 0],
  motherboard: [0.02, 0.38, -0.14],
  cpu: [-0.065, 0.52, -0.13],
  cooler: [-0.05, 0.58, -0.14],
  ram: [0.14, 0.43, -0.15],
  gpu: [0, 0.28, 0.05],
  storage: [0.13, 0.48, -0.176],
  psu: [0, 0.08, -0.07],
  fans: [0, 0.6, 0.22],
};

/** World point the orbit target should ease toward for a sidebar selection. */
export function getFocusTargetForPart(partId) {
  if (!partId || !FOCUS_TARGET_BY_PART[partId]) return DEFAULT_CAMERA.target;
  return FOCUS_TARGET_BY_PART[partId];
}
