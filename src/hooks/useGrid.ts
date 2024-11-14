import { useContext } from "react";

import { Coords } from "../constants";

import { MainContext } from "../utils/contextData";

type ReturnType = {
  grid: Map<string, Coords> | null;
  setGrid: (grid: Map<string, Coords>) => void;
};

const useGrid = (): ReturnType => {
  const context = useContext(MainContext);

  const grid = context?.params?.grid || null;

  const setGrid = (grid: Map<string, Coords>) => {
    context?.setParams((p) => ({ ...p, grid }));
  };

  return { grid, setGrid };
};

export { useGrid };
