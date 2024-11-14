import { useContext } from "react";

import { Scheme } from "../constants";

import { MainContext } from "../utils/contextData";

type ReturnType = {
  left: Scheme;
  right: Scheme;
  updateLeft: (s: Scheme) => void;
  updateRight: (s: Scheme) => void;
};

const useSchemes = (): ReturnType => {
  const context = useContext(MainContext);

  const left = context?.params?.sl || "none";
  const right = context?.params?.sr || "none";

  const updateLeft = (sl: Scheme) => {
    context?.setParams((p) => ({ ...p, sl }));
  };

  const updateRight = (sr: Scheme) => {
    context?.setParams((p) => ({ ...p, sr }));
  };

  return { left, right, updateLeft, updateRight };
};

export { useSchemes };
