import clsx from "clsx";
import { Format, Scheme, Side, Colors } from "../constants.ts";
import ScreenOrientationBlocker from "./ScreenOrientationBlocker";

interface Props {
  format: Format;
  setScheme: (s: Scheme) => void;
  side: Side;
}

function InitialSchemeScreen({ format, setScheme, side }: Props) {
  return (
    <div
      className={clsx([
        "initial-screen-scheme-container",
        side === Side.Left && "left-side",
        side === Side.Right && "right-side",
      ])}
    >
      <div
        className={clsx([
          "scheme-choose-form",
          side === Side.Left && "left-scheme-choose",
          side === Side.Right && "right-scheme-choose",
        ])}
      >
        <h1 className="side-choose-title">
          Choose the scheme
          <br />
          for the{" "}
          <b
            style={{ color: side === Side.Left ? Colors.Red : Colors.SkyBlue }}
          >
            {side}
          </b>{" "}
          side
        </h1>

        {format === Format.Eleven && (
          <>
            <button
              onClick={() => setScheme("4-3-3")}
              className="choose-format-button"
            >
              4-3-3
            </button>
            <button
              onClick={() => setScheme("4-2-3-1")}
              className="choose-format-button"
            >
              4-2-3-1
            </button>
            <button
              onClick={() => setScheme("4-4-2")}
              className="choose-format-button"
            >
              4-4-2
            </button>
            <button
              onClick={() => setScheme("3-4-3")}
              className="choose-format-button"
            >
              3-4-3
            </button>
            <button
              className="choose-format-button"
              onClick={() => setScheme("none")}
            >
              Blank
            </button>
          </>
        )}

        {format === Format.Seven && (
          <>
            <button
              onClick={() => setScheme("3-3")}
              className="choose-format-button"
            >
              3-3
            </button>
            <button
              onClick={() => setScheme("2-3-1")}
              className="choose-format-button"
            >
              2-3-1
            </button>
            <button
              className="choose-format-button"
              onClick={() => setScheme("none")}
            >
              Blank
            </button>
          </>
        )}

        {format === Format.Five && (
          <>
            <button
              onClick={() => setScheme("1-2-1")}
              className="choose-format-button"
            >
              1-2-1
            </button>
            <button
              onClick={() => setScheme("2-2")}
              className="choose-format-button"
            >
              2-2
            </button>
            <button
              className="choose-format-button"
              onClick={() => setScheme("none")}
            >
              Blank
            </button>
          </>
        )}
      </div>
      <ScreenOrientationBlocker />
    </div>
  );
}

export default InitialSchemeScreen;
