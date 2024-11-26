import { Format } from "../constants";
import ScreenOrientationBlocker from "./ScreenOrientationBlocker";

interface Props {
  setFormat: (format: Format) => void;
}

function WelcomeScreen({ setFormat }: Props) {
  return (
    <>
      <div className="welcome-container">
        <h2 className="formation-question">
          <b>How</b>
          <br />
          are you going to play?
        </h2>
        <div className="formation-select-group">
          <div className="formation-select-buttons">
            <button
              onClick={() => setFormat(Format.Eleven)}
              className="format-button eleven"
            >
              11x11
            </button>
            <button
              onClick={() => setFormat(Format.Seven)}
              className="format-button seven"
            >
              7x7
            </button>
            <button
              onClick={() => setFormat(Format.Five)}
              className="format-button five"
            >
              5x5
            </button>
          </div>
          <span className="mechanics-notification">
            Use big screens for the best experience
          </span>
          <span>
            Like a <b>real</b> whiteboard
          </span>
        </div>
        <div className="gaffer-title">
          <h1>GAFFFER</h1>
          <span className="watermark">
            built by&nbsp;
            <a target="_blank" href="https://rtt63.com">
              rtt63
            </a>
          </span>
        </div>
        <ScreenOrientationBlocker />
      </div>
    </>
  );
}

export default WelcomeScreen;
