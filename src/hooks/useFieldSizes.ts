import { useContext } from "react";

import { MainContext } from "../utils/contextData";

type ReturnType = {
  w: number | null;
  h: number | null;
  setField: ({ w, h }: { w: number; h: number }) => void;
};

const useFieldSizes = (): ReturnType => {
  const context = useContext(MainContext);

  const setField = ({ w, h }: { w: number; h: number }) => {
    context?.setParams((p) => ({ ...p, w, h }));
  };
  const w = context?.params?.w || null;
  const h = context?.params?.h || null;

  return { w, h, setField };
};

export { useFieldSizes };
