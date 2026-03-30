import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { HOVER, SELECTION } from "../theme/selectionHighlight.js";

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

  const { surfaceColor, emissive, emissiveIntensity, metal, rough } = useMemo(() => {
    if (isSelected) {
      return {
        surfaceColor: SELECTION.surface,
        emissive: SELECTION.emissive,
        emissiveIntensity: SELECTION.emissiveIntensity,
        metal: SELECTION.metalnessSelected,
        rough: SELECTION.roughnessSelected,
      };
    }
    if (isHovered) {
      return {
        surfaceColor: HOVER.surface,
        emissive: HOVER.emissive,
        emissiveIntensity: HOVER.emissiveIntensity,
        metal: 0.32,
        rough: 0.48,
      };
    }
    return { surfaceColor: color, emissive: "#000000", emissiveIntensity: 0, metal: metalness, rough: roughness };
  }, [isSelected, isHovered, color, metalness, roughness]);

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
        metalness={metal}
        roughness={rough}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={transparent}
        opacity={opacity}
      />
    </RoundedBox>
  );
}
