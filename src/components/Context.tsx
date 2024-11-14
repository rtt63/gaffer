import { useState } from "react";

import { MainContext, ContextState } from "../utils/contextData";

import { Presets } from "../constants";

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useState<ContextState>({
    sl: "none",
    sr: "none",

    preset: Presets.Preset1,

    grid: null,

    w: 0,
    h: 0,
  });

  return (
    <MainContext.Provider value={{ params, setParams }}>
      {children}
    </MainContext.Provider>
  );
};

export default MainProvider;
