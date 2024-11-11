import { Format } from "../constants";

interface Props {
  setFormat: (format: Format) => void;
}

function WelcomeScreen({ setFormat }: Props) {
  return (
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
          We provide the most basic starters out of the box, but general
          mechanics are the same
        </span>
        <span>It's just a whiteboard</span>
      </div>
      <div className="gaffer-title">
        <h1>GAFFER</h1>
      </div>
    </div>
  );
}

export default WelcomeScreen;
