enum Side {
  Left,
  Right,
}

type Formation = "4-3-3";
interface MovebaleElementProps {
  size: number;
  mapSchematic: Map<string, { x: number; y: number }>;
}

interface Coords {
  x: number;
  y: number;
}

enum Colors {
  Red = "#9A0000",
  Blue = "00047B",
  Yellow = "#D4DF00",
  Green = "#00C728",
  SkyBlue = "#0051FF",
  Orange = "#FF9D00",
  Black = "#001320",
}

export { Side, Colors };
export type { Coords, Formation, MovebaleElementProps };
