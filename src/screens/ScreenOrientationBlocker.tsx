import { useEffect, useState } from "react";

import turnarrow from "../assets/turnarrow.svg";
import tablet from "../assets/tablet.svg";
import display from "../assets/display.svg";

function ScreenOrientationBlocker() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerWidth < window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  if (isPortrait) {
    return (
      <div className="screen-lock-container">
        <h2>You need a landscape mode like this</h2>
        <img className="lock-screen-icon-size" src={`${display}`} />
        <span>or this</span>
        <img
          className="lock-screen-icon-size transform-90-deg"
          src={`${tablet}`}
        />
        <img
          src={`${turnarrow}`}
          className="lock-screen-icon-size space-around"
        />
        <span>Not like this</span>
        <img className="lock-screen-icon-size" src={`${tablet}`} />
      </div>
    );
  }

  return null;
}

export default ScreenOrientationBlocker;
