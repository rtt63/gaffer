import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import "../App.css";

import { Coords } from "../constants";

type Background = string;

type CircleProps = {
  background: Background;
  size: number;
  id: string;
} & Coords;

function Circle({ background, size, x, y, id }: CircleProps) {
  const [position, setPosition] = useState<Coords>({ x, y });
  const [isEditing, setEditing] = useState(false);
  const [formValue, setFormValue] = useState("");
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const startDrag: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    dragging.current = true;

    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const startTouchDrag: React.TouchEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    dragging.current = true;

    const touch = e.touches[0];

    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    requestAnimationFrame(() => {
      setPosition({
        x: clientX - offset.current.x,
        y: clientY - offset.current.y,
      });
    });
  };

  useEffect(() => {
    const prefedinedPosition = localStorage.getItem(id);
    if (prefedinedPosition) {
      setPosition(JSON.parse(prefedinedPosition));
    }
  }, [id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        inputRef.current.blur();
        setEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const stopDrag = () => {
      dragging.current = false;
      localStorage.setItem(id, JSON.stringify(position));
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);

    window.addEventListener("touchmove", onDrag, { passive: false });
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);

      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [id, position]);

  return (
    <div
      onDoubleClick={() => {
        setEditing(true);
      }}
      style={{
        backgroundColor: background === "ball" ? `#e2e2e2` : background,
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: size,
        height: size,
      }}
      onMouseDown={startDrag}
      onTouchStart={startTouchDrag}
      className={clsx(["obj", background === "ball" && "ball-img"])}
    >
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEditing(false);
          }}
        >
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
