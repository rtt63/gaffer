import Circle from "./Circle";
import { shiftPosition } from "../utils/shiftPosition";
import { MovebaleElementProps } from "../constants";

import { Colors, Coords } from "../constants";

enum Side {
  Left,
  Right,
}

type Scheme = "4-3-3" | "4-2-3-1" | "4-4-2" | "3-4-3";

const getPositionsForScheme = (
  map: Map<string, Coords>,
  scheme: Scheme,
  side: Side
): Coords[] => {
  if (scheme === "4-3-3") {
    if (side === Side.Left) {
      const LB = map.get("1-2");
      const LCB = map.get("3-2");
      const RCB = map.get("5-2");
      const RB = map.get("7-2");

      const LCM = map.get("2-5");
      const CM = map.get("4-5");
      const RCM = map.get("6-5");

      const LW = map.get("2-8");
      const ST = map.get("4-8");
      const RW = map.get("6-8");

      return [LB, LCB, RCB, RB, LCM, CM, RCM, LW, ST, RW].filter((v) => !!v);
    }

    if (side === Side.Right) {
      const LB = map.get("1-16");
      const LCB = map.get("3-16");
      const RCB = map.get("5-16");
      const RB = map.get("7-16");

      const LCM = map.get("2-13");
      const CM = map.get("4-13");
      const RCM = map.get("6-13");

      const LW = map.get("2-10");
      const ST = map.get("4-10");
      const RW = map.get("6-10");

      return [LB, LCB, RCB, RB, LCM, CM, RCM, LW, ST, RW].filter((v) => !!v);
    }
  }

  if (scheme === "4-2-3-1") {
    if (side === Side.Left) {
      const LB = map.get("7-2");
      const LCB = map.get("3-2");
      const RCB = map.get("5-2");
      const RB = map.get("1-2");

      const LDM = map.get("5-4");
      const RDM = map.get("3-4");

      const LM = map.get("6-6");
      const CAM = map.get("4-6");
      const RM = map.get("2-6");

      const ST = map.get("4-8");

      return [LB, LCB, RCB, RB, LDM, RDM, LM, CAM, RM, ST].filter((v) => !!v);
    }

    if (side === Side.Right) {
      const LB = map.get("7-16");
      const LCB = map.get("3-16");
      const RCB = map.get("5-16");
      const RB = map.get("1-16");

      const LDM = map.get("5-14");
      const RDM = map.get("3-14");

      const LM = map.get("6-12");
      const CAM = map.get("4-12");
      const RM = map.get("2-12");

      const ST = map.get("4-10");

      return [LB, LCB, RCB, RB, LDM, RDM, LM, CAM, RM, ST].filter((v) => !!v);
    }
  }

  if (scheme === "4-4-2") {
    if (side === Side.Left) {
      const LB = map.get("1-2");
      const LCB = map.get("3-2");
      const RCB = map.get("5-2");
      const RB = map.get("7-2");

      const LCM = map.get("1-5");
      const CM = map.get("3-5");
      const CM2 = map.get("5-5");
      const RCM = map.get("7-5");

      const LST = map.get("3-8");
      const RST = map.get("5-8");

      return [LB, LCB, RCB, RB, LCM, CM, CM2, RCM, LST, RST].filter((v) => !!v);
    }
    if (side === Side.Right) {
      const LB = map.get("1-16");
      const LCB = map.get("3-16");
      const RCB = map.get("5-16");
      const RB = map.get("7-16");

      const LCM = map.get("1-13");
      const CM = map.get("3-13");
      const CM2 = map.get("5-13");
      const RCM = map.get("7-13");

      const LST = map.get("3-10");
      const RST = map.get("5-10");

      return [LB, LCB, RCB, RB, LCM, CM, CM2, RCM, LST, RST].filter((v) => !!v);
    }
  }

  if (scheme === "3-4-3") {
    if (side === Side.Left) {
      const LB = map.get("6-2");
      const CB = map.get("4-2");
      const RB = map.get("2-2");

      const LCM = map.get("7-5");
      const CM = map.get("5-5");
      const CM2 = map.get("3-5");
      const RCM = map.get("1-5");

      const LST = map.get("2-8");
      const ST = map.get("4-8");
      const RST = map.get("6-8");

      return [LB, CB, RB, LCM, CM, CM2, RCM, LST, ST, RST].filter((v) => !!v);
    }
    if (side === Side.Right) {
      const LB = map.get("6-16");
      const CB = map.get("4-16");
      const RB = map.get("2-16");

      const LCM = map.get("7-13");
      const CM = map.get("5-13");
      const CM2 = map.get("3-13");
      const RCM = map.get("1-13");

      const LST = map.get("2-10");
      const ST = map.get("4-10");
      const RST = map.get("6-10");

      return [LB, CB, RB, LCM, CM, CM2, RCM, LST, ST, RST].filter((v) => !!v);
    }
  }

  return [{ x: 0, y: 0 }];
};

type TeamProps = MovebaleElementProps & { scheme: Scheme };

function LeftTeam({ mapSchematic, size, scheme = "4-3-3" }: TeamProps) {
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
      {getPositionsForScheme(mapSchematic, scheme, Side.Left).map(
        (coords, i) => (
          <Circle
            key={i}
            size={size}
            background={Colors.Red}
            {...shiftPosition(size, coords)}
          />
        )
      )}
    </>
  );
}

function RightTeam({ mapSchematic, size, scheme = "4-2-3-1" }: TeamProps) {
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
      {getPositionsForScheme(mapSchematic, scheme, Side.Right).map(
        (coords, i) => (
          <Circle
            key={i}
            size={size}
            background={Colors.SkyBlue}
            {...shiftPosition(size, coords)}
          />
        )
      )}
    </>
  );
}

export { LeftTeam, RightTeam };
