import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";

import tablet from "../assets/tablet.svg";
import display from "../assets/display.svg";
import lottieRotateJson from "../assets/lottieRotate.json";

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
      <Lottie
        loop
        animationData={lottieRotateJson}
        play
        className="screen-lock-container"
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
      />
    );
  }

  return null;
}

export default ScreenOrientationBlocker;
