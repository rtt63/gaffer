import Circle from "./Circle";
import { MovebaleElementProps, Coords } from "../constants";

import { shiftPosition } from "../utils/shiftPosition";
import { useGrid } from "../hooks/useGrid";
import { usePresets } from "../hooks/usePresets";
import { useSchemes } from "../hooks/useSchemes";
import { useFieldSizes } from "../hooks/useFieldSizes";

const defaultPosition: Coords = { x: 40, y: 40 };

function Ball({ size }: MovebaleElementProps) {
  const { grid } = useGrid();
  const { current: preset } = usePresets();
  const { left, right } = useSchemes();
  const { w, h } = useFieldSizes();

  if (!w || !h) {
    return null;
  }

  if (!grid) {
    return null;
  }

  const scheme = `${left}_${right}`;
  const position = grid.get("4-9") || defaultPosition;

  return (
    <Circle
      id={`${preset}-ball-${scheme}-${w}-${h}`}
      background="ball"
      size={size}
      {...shiftPosition(size, position)}
    />
  );
}

export default Ball;
