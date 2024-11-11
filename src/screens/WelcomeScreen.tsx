import { Format } from "../constants";

interface Props {
  setFormat: (format: Format) => void;
}

function WelcomeScreen({ setFormat }: Props) {
  return (
    <div className="welcome-container">
      <h2 className="formation-question">What's your formation?</h2>
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
      <div className="gaffer-title">
        <h1>GAFFER</h1>
        <span>Online football tactic whiteboard</span>
      </div>
    </div>
  );
}

export default WelcomeScreen;
