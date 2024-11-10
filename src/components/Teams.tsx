import Circle from "./Circle";
import { shiftPosition } from "../utils/shiftPosition";
import { MovebaleElementProps } from "../constants";

import { Colors } from "../constants";

function LeftTeam({ mapSchematic, size }: MovebaleElementProps) {
  const LB = mapSchematic.get("1-2");
  const LCB = mapSchematic.get("3-2");
  const RCB = mapSchematic.get("5-2");
  const RB = mapSchematic.get("7-2");

  const LCM = mapSchematic.get("2-5");
  const CM = mapSchematic.get("4-5");
  const RCM = mapSchematic.get("6-5");

  const LW = mapSchematic.get("2-8");
  const ST = mapSchematic.get("4-8");
  const RW = mapSchematic.get("6-8");

  const GK = mapSchematic.get("4-0");

  return (
    <>
      {!!GK && (
        <Circle
          size={size}
          background={Colors.Yellow}
          {...shiftPosition(size, GK)}
        />
      )}
      {[LB, LCB, RCB, RB, LCM, CM, RCM, LW, ST, RW].map((coords, i) =>
        coords ? (
          <Circle
            key={i}
            size={size}
            background={Colors.Red}
            {...shiftPosition(size, coords)}
          />
        ) : null
      )}
    </>
  );
}

function RightTeam({ mapSchematic, size }: MovebaleElementProps) {
  const LB = mapSchematic.get("7-16");
  const LCB = mapSchematic.get("3-16");
  const RCB = mapSchematic.get("5-16");
  const RB = mapSchematic.get("1-16");

  const LCM = mapSchematic.get("6-13");
  const CM = mapSchematic.get("4-13");
  const RCM = mapSchematic.get("2-13");

  const LW = mapSchematic.get("6-10");
  const ST = mapSchematic.get("4-10");
  const RW = mapSchematic.get("2-10");

  const GK = mapSchematic.get("4-18");

  return (
    <>
      {!!GK && (
        <Circle
          size={size}
          background={Colors.Orange}
          {...shiftPosition(size, GK)}
        />
      )}
      {[LB, LCB, RCB, RB, LCM, CM, RCM, LW, ST, RW].map((coords, i) =>
        coords ? (
          <Circle
            key={i}
            size={size}
            background={Colors.SkyBlue}
            {...shiftPosition(size, coords)}
          />
        ) : null
      )}
    </>
  );
}

export { LeftTeam, RightTeam };
