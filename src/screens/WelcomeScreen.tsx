import { Format } from "../constants";

interface Props {
  setFormat: (format: Format) => void;
}

function WelcomeScreen({ setFormat }: Props) {
  return (
    <div className="welcome-container">
      <button
        onClick={() => setFormat(Format.Eleven)}
        className="format-button eleven"
      >
        11x11
      </button>
      <button
        // onClick={() => setFormat(Format.Seven)}
        className="format-button seven"
      >
        7x7
      </button>
      <button
        // onClick={() => setFormat(Format.Five)}
        className="format-button five"
      >
        5x5
      </button>
    </div>
  );
}

export default WelcomeScreen;
