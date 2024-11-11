import { useState, useEffect, useRef } from "react";
import "../App.css";
import ball from "../ball.svg";

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
  const [isEditing, setEditing] = useState(false);
  const [formValue, setFormValue] = useState("");
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const inputRef = useRef();

  const startDrag = (e: MouseEvent) => {
    e.preventDefault();
    dragging.current = true;

    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onDrag = (e: MouseEvent) => {
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
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        inputRef.current.blur();
        setEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      onDoubleClick={() => {
        setEditing(true);
      }}
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
    >
      {isEditing ? (
        <form type="submit" onSubmit={() => setEditing(false)}>
          <input
            ref={inputRef}
            autoFocus={true}
            type="text"
            className="obj-input"
            value={formValue}
            onChange={(e) => {
              if (e.target.value.length > 4) {
                return;
              }
              setFormValue(e.target.value);
            }}
          />
        </form>
      ) : (
        formValue
      )}
    </div>
  );
}

export default Circle;
