import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";

export function ClickableRoundedBox({
  partId,
  args,
  radius = 0.02,
  smoothness = 4,
  position,
  rotation = [0, 0, 0],
  color = "#2a3344",
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  metalness = 0.35,
  roughness = 0.55,
  transparent = false,
  opacity = 1,
}) {
  const isSelected = selectedId === partId;
  const isHovered = hoveredId === partId && !isSelected;

  const { surfaceColor, emissive, emissiveIntensity } = useMemo(() => {
    if (isSelected) {
      return { surfaceColor: "#5cb3ff", emissive: "#1a3a5c", emissiveIntensity: 0.35 };
    }
    if (isHovered) {
      return { surfaceColor: "#3d8bfd", emissive: "#0f2844", emissiveIntensity: 0.2 };
    }
    return { surfaceColor: color, emissive: "#000000", emissiveIntensity: 0 };
  }, [isSelected, isHovered, color]);

  return (
    <RoundedBox
      args={args}
      radius={radius}
      smoothness={smoothness}
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
      <meshStandardMaterial
        color={surfaceColor}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={transparent}
        opacity={opacity}
      />
    </RoundedBox>
  );
}
