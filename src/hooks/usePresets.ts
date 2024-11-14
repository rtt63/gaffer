import { useContext } from "react";

import { Presets } from "../constants";

import { MainContext } from "../utils/contextData";

type ReturnType = {
  current: Presets;
  updatePreset: (preset: Presets) => void;
};

const usePresets = (): ReturnType => {
  const context = useContext(MainContext);

  const current = context?.params?.preset || Presets.Preset1;

  const updatePreset = (preset: Presets) => {
    context?.setParams((p) => ({ ...p, preset }));
  };

  return { current, updatePreset };
};

export { usePresets };
