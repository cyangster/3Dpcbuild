import { useMemo, useRef } from "react";
import { HOVER, SELECTION } from "../theme/selectionHighlight.js";

const baseColor = "#2a3344";

export function ClickablePart({
  partId,
  position,
  rotation = [0, 0, 0],
  args,
  color = baseColor,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  metalness = 0.35,
  roughness = 0.55,
  transparent = false,
  opacity = 1,
}) {
  const ref = useRef(null);
  const isSelected = selectedId === partId;
  const isHovered = hoveredId === partId && !isSelected;

  const emissive = useMemo(() => {
    if (isSelected) return SELECTION.emissive;
    if (isHovered) return HOVER.emissive;
    return "#000000";
  }, [isSelected, isHovered]);

  const surfaceColor = useMemo(() => {
    if (isSelected) return SELECTION.surface;
    if (isHovered) return HOVER.surface;
    return color;
  }, [isSelected, isHovered, color]);

  const metal = isSelected ? SELECTION.metalnessSelected : isHovered ? 0.32 : metalness;
  const rough = isSelected ? SELECTION.roughnessSelected : isHovered ? 0.48 : roughness;
  const emissiveIntensity = isSelected ? SELECTION.emissiveIntensity : isHovered ? HOVER.emissiveIntensity : 0;

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      userData={{ partId }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(partId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(partId);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={surfaceColor}
        metalness={metal}
        roughness={rough}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={transparent}
        opacity={opacity}
      />
    </mesh>
  );
}
