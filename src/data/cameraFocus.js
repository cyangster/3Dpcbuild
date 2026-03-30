/**
 * Orbit camera presets in world space (matches PC root group at y = -0.15).
 * Each entry: where to look, and a camera position that frames that part.
 */
export const DEFAULT_CAMERA = {
  target: [0, 0.45, 0],
  position: [1.45, 0.72, 1.65],
};

/** @type {Record<string, { target: [number, number, number]; position: [number, number, number] }>} */
export const CAMERA_BY_PART = {
  case: {
    target: [0, 0.38, 0],
    position: [1.15, 0.55, 1.28],
  },
  motherboard: {
    target: [0.02, 0.38, -0.14],
    position: [0.62, 0.5, 0.52],
  },
  cpu: {
    target: [-0.065, 0.52, -0.13],
    position: [0.52, 0.64, 0.72],
  },
  cooler: {
    target: [-0.05, 0.58, -0.14],
    position: [0.48, 0.62, 0.58],
  },
  ram: {
    target: [0.14, 0.43, -0.15],
    position: [0.58, 0.48, 0.3],
  },
  gpu: {
    target: [0, 0.28, 0.05],
    position: [0.48, 0.36, 0.92],
  },
  storage: {
    target: [0.12, 0.47, -0.15],
    position: [-0.38, 0.55, 0.58],
  },
  psu: {
    target: [0, 0.08, -0.07],
    position: [0.98, 0.42, 0.82],
  },
  fans: {
    target: [0, 0.6, 0.22],
    position: [0.12, 0.52, 0.88],
  },
};

export function getCameraForPart(partId) {
  if (!partId || !CAMERA_BY_PART[partId]) return DEFAULT_CAMERA;
  return CAMERA_BY_PART[partId];
}
