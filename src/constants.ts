enum Side {
  Left = "Left",
  Right = "Right",
}

enum Format {
  Five,
  Seven,
  Eleven,
}
interface Coords {
  x: number;
  y: number;
}
interface MovebaleElementProps {
  size: number;
  mapSchematic: Map<string, Coords>;
}

enum DeviceSize {
  S,
  M,
  L,
}
enum Presets {
  Preset1 = "Preset1",
  Preset2 = "Preset2",
  Preset3 = "Preset3",
}
type Scheme =
  | "4-3-3"
  | "4-2-3-1"
  | "4-4-2"
  | "3-4-3"
  | "1-2-1"
  | "2-2"
  | "3-3"
  | "none";

enum Colors {
  Red = "#9A0000",
  Blue = "00047B",
  Yellow = "#D4DF00",
  Green = "#00C728",
  SkyBlue = "#0051FF",
  Orange = "#FF9D00",
  Black = "#001320",
}
enum CanvasMode {
  EraserTool = "destination-out",
  Pencil = "source-over",
}

export { Side, Colors, Format, DeviceSize, Presets, CanvasMode };
export type { Coords, MovebaleElementProps, Scheme };
