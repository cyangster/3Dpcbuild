import { useMemo, useRef } from "react";

const baseColor = "#2a3344";
const hoverColor = "#3d8bfd";
const selectedColor = "#5cb3ff";

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
    if (isSelected) return "#1a3a5c";
    if (isHovered) return "#0f2844";
    return "#000000";
  }, [isSelected, isHovered]);

  const surfaceColor = useMemo(() => {
    if (isSelected) return selectedColor;
    if (isHovered) return hoverColor;
    return color;
  }, [isSelected, isHovered, color]);

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
        metalness={metalness}
        roughness={roughness}
        emissive={emissive}
        emissiveIntensity={isSelected ? 0.35 : isHovered ? 0.2 : 0}
        transparent={transparent}
        opacity={opacity}
      />
    </mesh>
  );
}
