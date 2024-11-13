// canvas -> scheme-left _ scheme-right _ preset _ width _ height
// circle -> scheme _ side _ preset _ id _  width _ height
//
// kill for preset -> look for every key has preset in the name and delete it
import { Scheme, Presets, CanvasMode } from "../constants";

type Points = [number, number, number];
type Width = number;
type CanvasStateParams = {
  preset: Presets;
  sl: Scheme;
  sr: Scheme;
  w: number;
  h: number;
};

type SaveOnly = {
  points: [CanvasMode, Width, Points[]];
};

function saveCanvasState({
  preset,
  sl,
  sr,
  w,
  h,
  points,
}: CanvasStateParams & SaveOnly) {
  const key = `${preset}_${sl}_${sr}_${w}_${h}`;
  const prev = localStorage.getItem(key) || "[]";
  const trPrev = JSON.parse(prev);
  const upd = [...trPrev, points];
  const strUpd = JSON.stringify(upd);
  localStorage.setItem(key, strUpd);
}

function restoreCanvasState({ preset, sl, sr, w, h }: CanvasStateParams) {
  const key = `${preset}_${sl}_${sr}_${w}_${h}`;
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
}

export { saveCanvasState, restoreCanvasState };
