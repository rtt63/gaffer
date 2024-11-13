import Circle from "./Circle";
import { MovebaleElementProps, Coords } from "../constants";

import { shiftPosition } from "../utils/shiftPosition";

const defaultPosition: Coords = { x: 40, y: 40 };

type Props = {
  preset: string;
  scheme: string;
  width: number;
  height: number;
} & MovebaleElementProps;

function Ball({ mapSchematic, size, preset, scheme, width, height }: Props) {
  const position = mapSchematic.get("4-9") || defaultPosition;

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
