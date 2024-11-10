import { useRef, useEffect, useState } from "react";
import "./App.css";
import Circle from "./components/Circle";

import { createGrid } from "./utils/createGrid";

interface Coords {
  x: number;
  y: number;
}

const shiftInitialPosition = (size: number, { x, y }: Coords): Coords => {
  const shift = size / 2;
  return { x: x - shift, y: y - shift };
};

interface MovebaleElementProps {
  size: number;
  mapSchematic: Map<string, { x: number; y: number }>;
}

function LeftTeam({ mapSchematic, size }: MovebaleElementProps) {
  const LB = mapSchematic.get("1-2");
  const LCB = mapSchematic.get("3-2");
  const RCB = mapSchematic.get("5-2");
  const RB = mapSchematic.get("7-2");

  const LCM = mapSchematic.get("2-5");
  const CM = mapSchematic.get("4-5");
  const RCM = mapSchematic.get("6-5");

  const LW = mapSchematic.get("2-8");
  const ST = mapSchematic.get("4-8");
  const RW = mapSchematic.get("6-8");

  const GK = mapSchematic.get("4-0");

  return (
    <>
      {!!GK && (
        <Circle
          size={size}
          background="#2DFF19"
          {...shiftInitialPosition(size, GK)}
        />
      )}
      {[LB, LCB, RCB, RB, LCM, CM, RCM, LW, ST, RW].map((coords, i) =>
        coords ? (
          <Circle
            key={i}
            size={size}
            background="#9A0000"
            {...shiftInitialPosition(size, coords)}
          />
        ) : null
      )}
    </>
  );
}

function Ball({ mapSchematic, size }: MovebaleElementProps) {
  const position = mapSchematic.get("4-9");

  return (
    <Circle
      background="ball"
      size={size}
      {...shiftInitialPosition(size, position)}
    />
  );
}

function RightTeam({ mapSchematic, size }: MovebaleElementProps) {
  const LB = mapSchematic.get("7-16");
  const LCB = mapSchematic.get("3-16");
  const RCB = mapSchematic.get("5-16");
  const RB = mapSchematic.get("1-16");

  const LCM = mapSchematic.get("6-13");
  const CM = mapSchematic.get("4-13");
  const RCM = mapSchematic.get("2-13");

  const LW = mapSchematic.get("6-10");
  const ST = mapSchematic.get("4-10");
  const RW = mapSchematic.get("2-10");

  const GK = mapSchematic.get("4-18");

  return (
    <>
      {!!GK && (
        <Circle
          size={size}
          background="#2DFF19"
          {...shiftInitialPosition(size, GK)}
        />
      )}
      {[LB, LCB, RCB, RB, LCM, CM, RCM, LW, ST, RW].map((coords, i) =>
        coords ? (
          <Circle
            key={i}
            size={size}
            background="#0D009A"
            {...shiftInitialPosition(size, coords)}
          />
        ) : null
      )}
    </>
  );
}

enum Mode {
  Move,
  Draw,
  Erase,
}

function App() {
  const field = useRef();
  const canvasRef = useRef();
  const [isPointerEventsDisabled, setPointerEventsDisabled] = useState(true);

  const [grid, setGrid] = useState(null);

  const [mode, setMode] = useState(Mode.Move);

  useEffect(() => {
    if (field.current) {
      const fieldWidth = field.current.offsetWidth;
      const fieldHeight = field.current.offsetHeight;

      const grid = createGrid({ width: fieldWidth, height: fieldHeight });

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

    // Инициализация канваса
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    canvas.width = field.current.offsetWidth;
    canvas.height = field.current.offsetHeight;

    // Настроим канвас для рисования
    ctx.globalCompositeOperation = "source-over"; // Режим рисования по умолчанию

    // Устанавливаем начальную ширину линии для рисования
    ctx.lineWidth = 5; // Начальная ширина линии

    // Устанавливаем цвет рисования
    ctx.strokeStyle = "black"; // Начальный цвет маркера

    let drawing = false;

    // Начало рисования
    const startDrawing = (e) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect(); // Получаем размеры канваса относительно страницы
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top); // Используем смещение канваса
    };
    // Рисование линии
    const draw = (e) => {
      if (drawing) {
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    };

    // Окончание рисования
    const stopDrawing = () => {
      drawing = false;
    };

    // Обработчики событий для рисования
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Очистка событий при размонтировании компонента
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
    ctx.strokeStyle = "black"; // Обычный цвет для рисования
    ctx.lineWidth = 5;
  };

  const enableEraserMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out"; // Режим для стирания
    ctx.strokeStyle = "black"; // Стираем только нарисованное черное
    ctx.lineWidth = 50; // Размер "стерки"
  };

  return (
    <div>
      <div ref={field} id="field" className="field">
        {grid && <LeftTeam mapSchematic={grid} size={70} />}
        {grid && <RightTeam mapSchematic={grid} size={70} />}
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
      <div>
        <label>
          <input
            type="radio"
            name="move"
            checked={mode === Mode.Move}
            onClick={() => {
              setPointerEventsDisabled(true);
              setMode(Mode.Move);
            }}
            value={Mode.Move}
          />
          Move (default)
        </label>
        <label>
          <input
            type="radio"
            name="draw"
            checked={mode === Mode.Draw}
            onClick={() => {
              setMode(Mode.Draw);
              setPointerEventsDisabled(false);
              enableDrawMode();
            }}
            value={Mode.Draw}
          />
          Draw
        </label>
        <label>
          <input
            type="radio"
            name="erase"
            checked={mode === Mode.Erase}
            onClick={() => {
              setMode(Mode.Erase);
              setPointerEventsDisabled(false);
              enableEraserMode();
            }}
            value={Mode.Erase}
          />
          Erase
        </label>
      </div>
    </div>
  );
}

export default App;
