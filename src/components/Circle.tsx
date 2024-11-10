import { useState, useEffect, useRef } from "react";
import "../App.css";
import ball from "../ball.svg";

/*
 * Палитра
 *
 * Синий #0D009A
 * Красный #9A0000
 * Зеленый #1D982D
 * */

type CirclePosition = {
  x: number;
  y: number;
};

type Background = string;

interface CircleProps {
  background: Background;
  size: number;
  x: number;
  y: number;
}

function Circle({ background = "#0D009A", size, x, y }: CircleProps) {
  const [position, setPosition] = useState<CirclePosition>({ x, y });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;

    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    requestAnimationFrame(() => {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    });
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);

    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: background === "ball" ? `#e2e2e2` : background,
        backgroundImage: background === "ball" ? `url(${ball})` : "none",
        backgroundSize: "contain",
        backgroundPosition: "center",

        left: `${position.x}px`,
        top: `${position.y}px`,
        width: size,
        height: size,
      }}
      onMouseDown={startDrag}
      className="obj"
    ></div>
  );
}

export default Circle;
