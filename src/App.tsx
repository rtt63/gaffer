import { useRef, useEffect, useState } from "react";
import "./App.css";
import Circle from "./components/Circle";
import { Side } from "./constants";

const size = 70;

//*
// Нужно поле поделить на зоны, чтобы получить набор точек. При инициализации эти точки будут фиксироваться в размер в пикселях
// Получаем что каждая точка это как бы перекрестие, у нее есть свой адрес
//
// Соответственно в разных схемах по дефолту ставятся разные адреса
// Такая хуйня по дефолту максимально должна давать 5, но так же 4, 3, 2 и 1. Важно что 5, 3 и 1 например имеют точку по середину, а 4 и 2 - нет, и надо чтобы такая точка тоже попадала и они были как бы равноудалены от центра. То есть детализация сетки должна быть достаточно мелкая
//
//

function generateGrid(
  width: number,
  height: number,
  rows: number,
  cols: number
) {
  const grid = {};
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  // Создаём сетку
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const address = `${String.fromCharCode(65 + col)}${rows - row}`;
      grid[address] = {
        x: col * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2,
      };
    }
  }

  return grid;
}

const getLeftTeamPositions = ({ height, width }) => {
  // defenders
  const hStep = height / 5;
  const wStep = width / 4;

  const defsArray = new Array(4).fill(null).map((_, i) => ({
    y: Math.floor(i * hStep + hStep),
    x: Math.floor(1 * wStep),
  }));

  const h2s = height / 4;

  const midsArray = new Array(3).fill(null).map((_, i) => ({
    y: Math.floor(i * h2s + h2s),
    x: Math.floor(2 * wStep),
  }));

  const forwardsArray = new Array(3).fill(null).map((_, i) => ({
    y: Math.floor(i * h2s + h2s),
    x: Math.floor(3 * wStep),
  }));

  const gk = { y: height / 2, x: 7 };

  const team = [...defsArray, ...midsArray, ...forwardsArray];
  return { gk, team };
};

type Formation = "4-3-3";

function App() {
  const field = useRef();
  const canvasRef = useRef();
  const [teamPositions, setPositions] = useState(null);
  const [isPointerEventsDisabled, setPointerEventsDisabled] = useState(true);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (field.current) {
      const team = getLeftTeamPositions({
        height: field.current.offsetHeight,
        width: field.current.offsetWidth / 2,
      });

      console.log(
        generateGrid(
          field.current.offsetWidth,
          field.current.offsetHeight,
          4,
          3
        )
      );

      setPositions(team);
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

  const togglePointerEvents = () => {
    setPointerEventsDisabled(!isPointerEventsDisabled);
  };
  const toggleEraserMode = () => {
    setErasing(!erasing);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (erasing) {
      ctx.globalCompositeOperation = "source-over"; // Режим рисования поверх
      ctx.strokeStyle = "black"; // Обычный цвет для рисования
      ctx.lineWidth = 5;
    } else {
      ctx.globalCompositeOperation = "destination-out"; // Режим для стирания
      ctx.strokeStyle = "black"; // Стираем только нарисованное черное
      ctx.lineWidth = 50; // Размер "стерки"
    }
  };

  return (
    <div>
      <div ref={field} className="field">
        {teamPositions?.team?.map((props) => (
          <Circle color="#9A0000" size={size} {...props} />
        ))}
        {teamPositions?.gk?.x && (
          <Circle
            color="#F3EB00"
            size={size}
            x={teamPositions?.gk?.x}
            y={teamPositions?.gk?.y}
          />
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
        ></canvas>
      </div>
      <label>
        <input
          type="checkbox"
          checked={isPointerEventsDisabled}
          onChange={togglePointerEvents}
        />
        Отключить взаимодействие с канвасом
      </label>
      <button onClick={toggleEraserMode}>
        {erasing ? "Выключить стерку" : "Включить стерку"}
      </button>
    </div>
  );
}

export default App;
