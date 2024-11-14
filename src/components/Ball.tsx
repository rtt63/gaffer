import Circle from "./Circle";
import { MovebaleElementProps, Coords } from "../constants";

import { shiftPosition } from "../utils/shiftPosition";
import { useGrid } from "../hooks/useGrid";
import { usePresets } from "../hooks/usePresets";
import { useSchemes } from "../hooks/useSchemes";

const defaultPosition: Coords = { x: 40, y: 40 };

type Props = {
  width: number;
  height: number;
} & MovebaleElementProps;

function Ball({ size, width, height }: Props) {
  const { grid } = useGrid();
  const { current: preset } = usePresets();
  const { left, right } = useSchemes();
  const scheme = `${left}_${right}`;

  if (!grid) {
    return null;
  }
  const position = grid.get("4-9") || defaultPosition;

  return (
    <Circle
      id={`${preset}-ball-${scheme}-${width}-${height}`}
      background="ball"
      size={size}
      {...shiftPosition(size, position)}
    />
  );
}

export default Ball;
