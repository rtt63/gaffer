import Circle from "./Circle";
import { MovebaleElementProps, Coords } from "../constants";

import { shiftPosition } from "../utils/shiftPosition";

const defaultPosition: Coords = { x: 40, y: 40 };

function Ball({ mapSchematic, size }: MovebaleElementProps) {
  const position = mapSchematic.get("4-9") || defaultPosition;

  return (
    <Circle background="ball" size={size} {...shiftPosition(size, position)} />
  );
}

export default Ball;
