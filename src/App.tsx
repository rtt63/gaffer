import { useRef, useEffect, useState } from "react";
import getStroke from "perfect-freehand";
import clsx from "clsx";
import "./App.css";
import Ball from "./components/Ball";
import { LeftTeam, RightTeam } from "./components/Teams";
import circleSvg from "./assets/circle.svg";
import pencilSvg from "./assets/pencil.svg";
import eraserSvg from "./assets/eraser.svg";

import { createGrid } from "./utils/createGrid";
import { Colors, Format, Scheme, Side } from "./constants";

import WelcomeScreen from "./screens/WelcomeScreen";
import InitialSchemeScreen from "./screens/InitialSchemeScreen";

enum Mode {
  Move,
  Draw,
  Erase,
}

enum SetupState {
  ChooseFormat,
  ChooseLeftTeamScheme,
  ChooseLeftTeamColor,
  ChooseRightTeamScheme,
  ChooseRightTeamColor,
  Main,
}

let points = [];

function App() {
  const [setupProgress, setSetupProgress] = useState(SetupState.ChooseFormat);
  const [format, setFormat] = useState<Format>(null);
  const [l_scheme, set_l_scheme] = useState<Scheme>(null);
  const [r_scheme, set_r_scheme] = useState<Scheme>(null);

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

  if (setupProgress === SetupState.ChooseLeftTeamScheme) {
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

  if (setupProgress === SetupState.ChooseRightTeamScheme) {
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

  return <Main leftScheme={l_scheme} rightScheme={r_scheme} />;
}

const MenuButton = ({ isChecked, onClick, children }) => {
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

function Main({ leftScheme, rightScheme }) {
  const field = useRef<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const [isPointerEventsDisabled, setPointerEventsDisabled] = useState(true);

  const [fieldW, setFieldW] = useState("80vw");

  const [grid, setGrid] = useState(null);

  const [mode, setMode] = useState(Mode.Move);

  useEffect(() => {
    if (field.current) {
      const fieldWidth = field.current.offsetWidth;
      const fieldHeight = field.current.offsetHeight;

      const grid = createGrid({ width: fieldWidth, height: fieldHeight });

      setFieldW(`${fieldWidth}px`);
      //
      //
      // DEV
      // grid.forEach(({ x, y }, key) => {
      //   const field = document.getElementById("field");
      //   const elem = document.createElement("div");
      //   elem.style.position = "absolute";
      //   elem.style.width = "3px";
      //   elem.style.height = "3px";
      //   elem.innerText = key;
      //   elem.style.backgroundColor = "black";
      //   elem.style.left = `${x}px`;
      //   elem.style.top = `${y}px`;
      //   field?.appendChild(elem);
      // });

      setGrid(grid);
    }

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    canvas.width = field.current?.offsetWidth;
    canvas.height = field.current?.offsetHeight;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const startDrawing = (e) => {
      const canvasRect = canvas.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      points = [[x, y, e.pressure || 0.5]];
    };

    const draw = (e) => {
      if (points.length > 0) {
        const canvasRect = canvas.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        points.push([x, y, e.pressure || 0.5]);

        const path = getStroke(points, {
          size: 3,
          thinning: 0.7,
          smoothing: 0.9,
          streamline: 0.5,
        });

        ctx.strokeStyle = Colors.Green;

        ctx.beginPath();
        path.forEach(([x, y], i) => {
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    };

    const stopDrawing = () => {
      points = [];
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, []);

  const enableDrawMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over"; // Режим рисования поверх
    ctx.lineWidth = 5;
  };

  const enableEraserMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out"; // Режим для стирания
    ctx.lineWidth = 50;
  };

  return (
    <div>
      <div
        ref={field}
        id="field"
        className="field"
        style={{
          minWidth: fieldW,
          width: fieldW,
          maxWidth: fieldW,
        }}
      >
        {grid && <LeftTeam mapSchematic={grid} size={54} scheme={leftScheme} />}
        {grid && (
          <RightTeam mapSchematic={grid} size={54} scheme={rightScheme} />
        )}
        {grid && <Ball mapSchematic={grid} size={30} />}

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
          <img src={circleSvg} width="60" height="60" />
        </MenuButton>
        <MenuButton
          isChecked={mode === Mode.Draw}
          onClick={() => {
            setMode(Mode.Draw);
            setPointerEventsDisabled(false);
            enableDrawMode();
          }}
        >
          <img src={pencilSvg} width="60" height="60" />
        </MenuButton>
        <MenuButton
          isChecked={mode === Mode.Erase}
          onClick={() => {
            setMode(Mode.Erase);
            setPointerEventsDisabled(false);
            enableEraserMode();
          }}
        >
          <img src={eraserSvg} width="60" height="60" />
        </MenuButton>
      </div>
    </div>
  );
}

export default App;
