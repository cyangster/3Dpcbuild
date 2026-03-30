/**
 * Default + per-part orbit poses in world space (PC root group at y = -0.15).
 * Used when framing a part after a sidebar pick (3D clicks do not trigger a tween).
 */
export const DEFAULT_CAMERA = {
  target: [0.08, 0.46, -0.06],
  position: [1.32, 0.69, 1.48],
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
    target: [0.13, 0.48, -0.176],
    position: [0.92, 0.58, 0.44],
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

const ORBIT_MIN_DIST = 0.72;
const ORBIT_MAX_DIST = 4.5;

function clampPoseToOrbitLimits(cfg) {
  const [tx, ty, tz] = cfg.target;
  const [px, py, pz] = cfg.position;
  const dx = px - tx;
  const dy = py - ty;
  const dz = pz - tz;
  const lenSq = dx * dx + dy * dy + dz * dz;
  if (lenSq < 1e-12) return cfg;
  const len = Math.sqrt(lenSq);
  if (len >= ORBIT_MIN_DIST && len <= ORBIT_MAX_DIST) return cfg;
  const clamped = Math.min(ORBIT_MAX_DIST, Math.max(ORBIT_MIN_DIST, len));
  const s = clamped / len;
  return {
    target: [tx, ty, tz],
    position: [tx + dx * s, ty + dy * s, tz + dz * s],
  };
}

export function getCameraForPart(partId) {
  const raw =
    !partId || !CAMERA_BY_PART[partId] ? DEFAULT_CAMERA : CAMERA_BY_PART[partId];
  return clampPoseToOrbitLimits(raw);
}
