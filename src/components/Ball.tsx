import Circle from "./Circle";
import { MovebaleElementProps, Coords } from "../constants";

import { shiftPosition } from "../utils/shiftPosition";

const defaultPosition: Coords = { x: 40, y: 40 };

type Props = { currentPreset: string } & MovebaleElementProps;

function Ball({ mapSchematic, size, currentPreset }: Props) {
  const position = mapSchematic.get("4-9") || defaultPosition;

  return (
    <Circle
      id={`${currentPreset}-ball`}
      background="ball"
      size={size}
      {...shiftPosition(size, position)}
    />
  );
}

export default Ball;
