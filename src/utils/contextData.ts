import { createContext } from "react";

import { Scheme, Presets, Coords } from "../constants";

type ContextState = {
  sl: Scheme | "none";
  sr: Scheme | "none";

  preset: Presets;

  // To find the initial position for each play there's so chess-alike grid
  // field having row and cols, each cross has it's "address" like 4-7 (4 row, 7 col)
  // Coords is an object { x: num in px, y: num in px }
  // It stored in this grid like
  // '4-7': { x: 23, 7: 34}
  // null by default
  grid: Map<string, Coords> | null;

  w: number | null; // width of the field in pixels
  h: number | null; // height of the field in pixels
};

type MainContextType = {
  params: ContextState;
  setParams: React.Dispatch<React.SetStateAction<ContextState>>;
};

const MainContext = createContext<MainContextType | null>(null);

export type { ContextState };
export { MainContext };
