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

import { createGrid } from "./utils/createGrid";
import { getDeviceSize } from "./utils/getDeviceSize.ts";
import {
  Colors,
  Format,
  Scheme,
  Side,
  Coords,
  DeviceSize,
  Presets,
  CanvasMode,
} from "./constants";

import WelcomeScreen from "./screens/WelcomeScreen";
import InitialSchemeScreen from "./screens/InitialSchemeScreen";
import ScreenOrientationBlocker from "./screens/ScreenOrientationBlocker";
import Refresh from "./screens/Refresh";

import { isWideScreen } from "./utils/isWideScreen";
import {
  saveCanvasState,
  restoreCanvasState,
  savePresetCustomValue,
  restorePresetCustomValue,
} from "./utils/memo";

const getPlayerSize = (): number => {
  const size = getDeviceSize();

  if (size === DeviceSize.S) return 28;
  if (size === DeviceSize.M) return 44;
  return 54;
};

const getBallSize = () => getPlayerSize() / 2;

const playerSize = getPlayerSize();
const ballSize = getBallSize();

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
  const [l_scheme, set_l_scheme] = useState<Scheme | null>(null);
  const [r_scheme, set_r_scheme] = useState<Scheme | null>(null);

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

  if (
    setupProgress === SetupState.ChooseLeftTeamScheme &&
    format === Format.Seven
  ) {
    set_l_scheme("3-3");
    set_r_scheme("3-3");
    setSetupProgress(SetupState.Main);
  }

  if (setupProgress === SetupState.ChooseLeftTeamScheme && format !== null) {
    return (
      <InitialSchemeScreen
        side={Side.Left}
        format={format}
        setScheme={(scheme) => {
          set_l_scheme(scheme);
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
          set_r_scheme(scheme);
          setSetupProgress(SetupState.Main);
        }}
      />
    );
  }

  if (l_scheme && r_scheme && setupProgress === SetupState.Main) {
    return (
      <Main
        leftScheme={l_scheme}
        rightScheme={r_scheme}
        toHome={() => {
          setSetupProgress(SetupState.ChooseFormat);
        }}
        handleRefresh={handleRefresh}
      />
    );
  }

  return null;
}

interface MainButtonProps {
  isChecked: boolean;
  onClick: () => void;
}
const MenuButton = ({
  isChecked,
  onClick,
  children,
}: React.PropsWithChildren<MainButtonProps>) => {
  return (
    <button
      onClick={onClick}
      className={clsx([
        "menu-button",
        isChecked ? "menu-button-checked" : "menu-button-inactive",
      ])}
    >
      {children}
    </button>
  );
};

const PresetButton = ({
  preset,
  currentPreset,
  onClick,
  sl,
  sr,
  w,
  h,
}: {
  preset: Presets;
  currentPreset: Presets;
  onClick: () => void;
  sl: Scheme;
  sr: Scheme;
  w: number;
  h: number;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(
    restorePresetCustomValue({ preset, sl, sr, w, h })
  );
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        inputRef.current.blur();
        savePresetCustomValue({
          preset: preset,
          w,
          h,
          sr,
          sl,
          value,
        });
        setEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [h, sl, sr, w, preset, value]);

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
            savePresetCustomValue({
              preset: preset,
              w,
              h,
              sr,
              sl,
              value,
            });
          }}
        >
          <input
            ref={inputRef}
            className="preset-input"
            value={value}
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
  leftScheme: Scheme;
  rightScheme: Scheme;
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

function Main({ leftScheme, rightScheme, toHome, handleRefresh }: MainProps) {
  const field = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPointerEventsDisabled, setPointerEventsDisabled] = useState(true);

  const [fieldFixedSizes, setFieldFixedSizes] = useState<FieldFixedSizes>(
    isWideScreen()
      ? { minHeight: "90vh", height: "90vh", maxHeight: "90vh" }
      : { minWidth: "80vw", width: "80vw", maxWidth: "80vw" }
  );

  const [grid, setGrid] = useState<Map<string, Coords> | null>(null);

  const [mode, setMode] = useState(Mode.Move);

  const [preset, setPreset] = useState<Presets>(Presets.Preset1);

  useEffect(() => {
    if (field.current) {
      const fieldWidth = field.current.offsetWidth;
      const fieldHeight = field.current.offsetHeight;

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
        if (field.current) {
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

      if (field.current) {
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

  return (
    <div>
      <div ref={field} id="field" className={"field"} style={fieldFixedSizes}>
        {Boolean(field.current?.offsetWidth) && (
          <div className="presets">
            <PresetButton
              onClick={() => {
                setPreset(Presets.Preset1);
                setPointerEventsDisabled(true);
                setMode(Mode.Move);
              }}
              sl={leftScheme}
              sr={rightScheme}
              preset={Presets.Preset1}
              currentPreset={preset}
              w={Number(field.current?.offsetWidth)}
              h={Number(field.current?.offsetHeight)}
            />
            <PresetButton
              onClick={() => {
                setPreset(Presets.Preset2);
                setPointerEventsDisabled(true);
                setMode(Mode.Move);
              }}
              sl={leftScheme}
              sr={rightScheme}
              preset={Presets.Preset2}
              currentPreset={preset}
              w={Number(field.current?.offsetWidth)}
              h={Number(field.current?.offsetHeight)}
            />
            <PresetButton
              onClick={() => {
                setPreset(Presets.Preset3);
                setPointerEventsDisabled(true);
                setMode(Mode.Move);
              }}
              sl={leftScheme}
              sr={rightScheme}
              preset={Presets.Preset3}
              currentPreset={preset}
              w={Number(field.current?.offsetWidth)}
              h={Number(field.current?.offsetHeight)}
            />
          </div>
        )}

        {grid && (
          <>
            <LeftTeam
              mapSchematic={grid}
              size={playerSize}
              scheme={leftScheme}
              currentPreset={preset}
              width={Number(field.current?.offsetWidth)}
              height={Number(field.current?.offsetHeight)}
            />
            <RightTeam
              mapSchematic={grid}
              size={playerSize}
              scheme={rightScheme}
              currentPreset={preset}
              width={Number(field.current?.offsetWidth)}
              height={Number(field.current?.offsetHeight)}
            />
            <Ball
              key={preset} // force remount
              mapSchematic={grid}
              size={ballSize}
              preset={preset}
              scheme={`${leftScheme}_${rightScheme}`}
              width={Number(field.current?.offsetWidth)}
              height={Number(field.current?.offsetHeight)}
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

export default App;
