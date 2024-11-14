import { useRef, useEffect, useState } from "react";
import getStroke from "perfect-freehand";
import clsx from "clsx";
import "./App.css";
import Ball from "./components/Ball";
import { LeftTeam, RightTeam } from "./components/Teams";
import circleSvg from "./assets/circle.svg";
import pencilSvg from "./assets/pencil.svg";
import eraserSvg from "./assets/eraser.svg";
import homeSvg from "./assets/home.svg";
import resetSvg from "./assets/reset.svg";

import { useSchemes } from "./hooks/useSchemes";
import { usePresets } from "./hooks/usePresets";
import { useGrid } from "./hooks/useGrid";
import { useFieldSizes } from "./hooks/useFieldSizes";

import { createGrid } from "./utils/createGrid";
import { Colors, Format, Side, Presets, CanvasMode } from "./constants";

import MenuButton from "./components/MenuButton";
import ContextProvider from "./components/Context";

import WelcomeScreen from "./screens/WelcomeScreen";
import InitialSchemeScreen from "./screens/InitialSchemeScreen";
import ScreenOrientationBlocker from "./screens/ScreenOrientationBlocker";
import Refresh from "./screens/Refresh";

import { isWideScreen } from "./utils/isWideScreen";
import { playerSize, ballSize } from "./utils/getSizes";
import {
  saveCanvasState,
  restoreCanvasState,
  savePresetCustomValue,
  restorePresetCustomValue,
} from "./utils/memo";

enum Mode {
  Move,
  Draw,
  Erase,
}

enum SetupState {
  ChooseFormat,
  ChooseLeftTeamScheme,
  ChooseRightTeamScheme,
  Refreshing,
  Main,
}

type Points = [number, number, number];

let points: Points[] = [];

type Width = number;

function App() {
  const [setupProgress, setSetupProgress] = useState(SetupState.ChooseFormat);
  const [format, setFormat] = useState<Format | null>(null);

  const { left, right, updateLeft, updateRight } = useSchemes();

  const handleRefresh = () => {
    localStorage.clear();
    setSetupProgress(SetupState.Refreshing);
    setTimeout(() => {
      setSetupProgress(SetupState.Main);
    }, 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  if (setupProgress === SetupState.Refreshing) {
    return <Refresh />;
  }

  if (setupProgress === SetupState.ChooseFormat) {
    return (
      <WelcomeScreen
        setFormat={(fmt) => {
          setFormat(fmt);
          setSetupProgress(SetupState.ChooseLeftTeamScheme);
        }}
      />
    );
  }

  if (setupProgress === SetupState.ChooseLeftTeamScheme && format !== null) {
    return (
      <InitialSchemeScreen
        side={Side.Left}
        format={format}
        setScheme={(scheme) => {
          updateLeft(scheme);
          setSetupProgress(SetupState.ChooseRightTeamScheme);
        }}
      />
    );
  }

  if (setupProgress === SetupState.ChooseRightTeamScheme && format !== null) {
    return (
      <InitialSchemeScreen
        side={Side.Right}
        format={format}
        setScheme={(scheme) => {
          updateRight(scheme);
          setSetupProgress(SetupState.Main);
        }}
      />
    );
  }

  if (left && right && setupProgress === SetupState.Main) {
    return (
      <Main
        toHome={() => {
          setSetupProgress(SetupState.ChooseFormat);
        }}
        handleRefresh={handleRefresh}
      />
    );
  }

  return null;
}

const PresetButton = ({
  preset,
  onClick,
}: {
  preset: Presets;
  onClick: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { left, right } = useSchemes();
  const { w, h } = useFieldSizes();
  const [value, setValue] = useState(
    restorePresetCustomValue({ preset, sl: left, sr: right, w, h })
  );
  const [isEditing, setEditing] = useState(false);

  const { current: currentPreset } = usePresets();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        right &&
        left &&
        h &&
        w
      ) {
        inputRef.current.blur();
        savePresetCustomValue({
          preset: preset,
          w,
          h,
          sr: right,
          sl: left,
          value: value || preset,
        });
        if (!value.trim()) {
          setValue(preset);
        }

        setEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [h, w, left, right, preset, value]);

  return (
    <button
      className={clsx([
        "preset-button",
        preset === currentPreset && "preset-button-active",
      ])}
      onClick={onClick}
      onDoubleClick={() => setEditing(true)}
    >
      {isEditing ? (
        <form
          className="preset-form"
          onSubmit={(e) => {
            e.preventDefault();
            setEditing(false);

            if (w && h) {
              savePresetCustomValue({
                preset: preset,
                w,
                h,
                sr: right,
                sl: left,
                value: value || preset,
              });
            }

            if (!value.trim()) {
              setValue(preset);
            }
          }}
        >
          <input
            ref={inputRef}
            className="preset-input"
            value={value}
            autoFocus={true}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const updValue = e.target.value;
              if (updValue.length > 12) {
                return;
              }
              setValue(e.target.value);
            }}
          />
        </form>
      ) : (
        value
      )}
    </button>
  );
};

interface MainProps {
  toHome: () => void;
  handleRefresh: () => void;
}

type FixedHeightStyles = {
  minHeight: string;
  height: string;
  maxHeight: string;
};
type FixedWidthStyles = {
  minWidth: string;
  width: string;
  maxWidth: string;
};
type FixedWidthAndHeightStyles = FixedWidthStyles & FixedHeightStyles;
type FieldFixedSizes =
  | FixedWidthStyles
  | FixedHeightStyles
  | FixedWidthAndHeightStyles;

function Main({ toHome, handleRefresh }: MainProps) {
  const field = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPointerEventsDisabled, setPointerEventsDisabled] = useState(true);

  const { left: leftScheme, right: rightScheme } = useSchemes();

  const [fieldFixedSizes, setFieldFixedSizes] = useState<FieldFixedSizes>(
    isWideScreen()
      ? { minHeight: "90vh", height: "90vh", maxHeight: "90vh" }
      : { minWidth: "80vw", width: "80vw", maxWidth: "80vw" }
  );

  const { grid, setGrid } = useGrid();

  const [mode, setMode] = useState(Mode.Move);
  const { setField } = useFieldSizes();

  const { current: preset, updatePreset: setPreset } = usePresets();

  useEffect(() => {
    if (field.current) {
      const fieldWidth = field.current.offsetWidth;
      const fieldHeight = field.current.offsetHeight;

      setField({ w: fieldWidth, h: fieldHeight });

      const grid = createGrid({ width: fieldWidth, height: fieldHeight });

      setFieldFixedSizes({
        minWidth: fieldWidth + "px",
        width: fieldWidth + "px",
        maxWidth: fieldWidth + "px",
        minHeight: fieldHeight + "px",
        height: fieldHeight + "px",
        maxHeight: fieldHeight + "px",
      });

      setGrid(grid);
    }

    const canvas = canvasRef.current;

    const ctx = canvas?.getContext("2d");
    if (canvas && field.current) {
      canvas.width = field.current?.offsetWidth;
      canvas.height = field.current?.offsetHeight;
    }

    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      const event = e as PointerEvent | TouchEvent;

      if (!canvas) {
        return;
      }

      const rect = canvas!.getBoundingClientRect();

      const x =
        "touches" in event
          ? event.touches[0].clientX - rect.left
          : event.clientX - rect.left;
      const y =
        "touches" in event
          ? event.touches[0].clientY - rect.top
          : event.clientY - rect.top;

      points = [
        [x, y, event instanceof MouseEvent ? event.pressure || 0.5 : 0.5],
      ];
    };

    const drawPath = (path: number[][], ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      path.forEach(([x, y], i) => {
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    };

    const getStrokeOptions = {
      size: 0.1,
      thinning: 2,
      smoothing: 9,
      streamline: 0.5,
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      const event = e as PointerEvent | TouchEvent;

      if (points.length > 0 && canvas) {
        const rect = canvas.getBoundingClientRect();

        const x =
          "touches" in event
            ? event.touches[0].clientX - rect.left
            : event.clientX - rect.left;
        const y =
          "touches" in event
            ? event.touches[0].clientY - rect.top
            : event.clientY - rect.top;

        points.push([
          x,
          y,
          event instanceof MouseEvent ? event.pressure || 0.5 : 0.5,
        ]);

        const path = getStroke(points, getStrokeOptions);

        if (ctx) {
          ctx.strokeStyle = Colors.Green;
          drawPath(path, ctx);
        }
      }
    };

    const stopDrawing = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (ctx && ctx?.globalCompositeOperation && ctx?.lineWidth) {
        const new_list: [CanvasMode, Width, Points[]] = [
          ctx?.globalCompositeOperation as CanvasMode,
          ctx?.lineWidth as Width,
          points as Points[],
        ];
        if (field.current && leftScheme && rightScheme) {
          const w = field.current.offsetWidth;
          const h = field.current.offsetHeight;
          saveCanvasState({
            preset,
            sl: leftScheme,
            sr: rightScheme,
            w,
            h,
            points: new_list,
          });
        }
      }

      points = [];
    };

    const restoreDrawing = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (field.current && leftScheme && rightScheme) {
        const w = field.current.offsetWidth;
        const h = field.current.offsetHeight;

        const restoredPreset = restoreCanvasState({
          sl: leftScheme,
          sr: rightScheme,
          preset,
          h,
          w,
        });

        if (restoredPreset) {
          const preset = restoredPreset;

          for (const [type, width, points] of preset) {
            const path = getStroke(points, getStrokeOptions);

            if (ctx) {
              if (type === CanvasMode.Pencil) {
                ctx.strokeStyle = Colors.Green;
                ctx.globalCompositeOperation = type;
                ctx.imageSmoothingQuality = "high";
                ctx.lineWidth = width;
              } else if (type === CanvasMode.EraserTool) {
                ctx.globalCompositeOperation = type;
                ctx.lineWidth = width;
              }

              drawPath(path, ctx);
            }
          }
        }
      }
    };

    restoreDrawing();

    canvas?.addEventListener("mousedown", startDrawing);
    canvas?.addEventListener("mousemove", draw);
    canvas?.addEventListener("mouseup", stopDrawing);
    canvas?.addEventListener("mouseout", stopDrawing);

    canvas?.addEventListener("touchstart", startDrawing);
    canvas?.addEventListener("touchmove", draw);
    canvas?.addEventListener("touchend", stopDrawing);
    canvas?.addEventListener("touchcancel", stopDrawing);

    return () => {
      canvas?.removeEventListener("mousedown", startDrawing);
      canvas?.removeEventListener("mousemove", draw);
      canvas?.removeEventListener("mouseup", stopDrawing);
      canvas?.removeEventListener("mouseout", stopDrawing);

      canvas?.removeEventListener("touchstart", startDrawing);
      canvas?.removeEventListener("touchmove", draw);
      canvas?.removeEventListener("touchend", stopDrawing);
      canvas?.removeEventListener("touchcancel", stopDrawing);
    };
  }, [preset, leftScheme, rightScheme]);

  const enableDrawMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = CanvasMode.Pencil;
      ctx.imageSmoothingQuality = "high";
      ctx.lineWidth = 4;
    }
  };

  const enableEraserMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = CanvasMode.EraserTool;
      ctx.lineWidth = 50;
    }
  };

  const handleSetPresetClick = (prst: Presets): void => {
    setPreset(prst);
    setPointerEventsDisabled(true);
    setMode(Mode.Move);
  };

  return (
    <div>
      <div ref={field} id="field" className={"field"} style={fieldFixedSizes}>
        {Boolean(field.current?.offsetWidth) && (
          <div className="presets">
            <PresetButton
              onClick={() => {
                handleSetPresetClick(Presets.Preset1);
              }}
              preset={Presets.Preset1}
            />
            <PresetButton
              onClick={() => {
                handleSetPresetClick(Presets.Preset2);
              }}
              preset={Presets.Preset2}
            />
            <PresetButton
              onClick={() => {
                handleSetPresetClick(Presets.Preset3);
              }}
              preset={Presets.Preset3}
            />
          </div>
        )}

        {grid && (
          <>
            <LeftTeam size={playerSize} />
            <RightTeam size={playerSize} />
            <Ball
              key={preset} // force remount
              size={ballSize}
            />
          </>
        )}

        <canvas
          ref={canvasRef}
          id="drawCanvas"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 900,
            pointerEvents: isPointerEventsDisabled ? "none" : "auto",
          }}
          className={clsx([
            mode === Mode.Draw && "pencil-cursor",
            mode === Mode.Erase && "erase-cursor",
          ])}
        ></canvas>
      </div>

      <div className="menu">
        <MenuButton
          isChecked={mode === Mode.Move}
          onClick={() => {
            setPointerEventsDisabled(true);
            setMode(Mode.Move);
          }}
        >
          <img src={circleSvg} />
        </MenuButton>
        <MenuButton
          isChecked={mode === Mode.Draw}
          onClick={() => {
            setMode(Mode.Draw);
            setPointerEventsDisabled(false);
            enableDrawMode();
          }}
        >
          <img src={pencilSvg} />
        </MenuButton>
        <MenuButton
          isChecked={mode === Mode.Erase}
          onClick={() => {
            setMode(Mode.Erase);
            setPointerEventsDisabled(false);
            enableEraserMode();
          }}
        >
          <img src={eraserSvg} />
        </MenuButton>
      </div>
      <ScreenOrientationBlocker />
      <button className="home-button" onClick={toHome}>
        <img src={homeSvg} />
      </button>
      <button className="reset" onClick={handleRefresh}>
        <img src={resetSvg} />
      </button>
    </div>
  );
}

const ContainerApp = () => {
  return (
    <ContextProvider>
      <App />
    </ContextProvider>
  );
};
export default ContainerApp;
