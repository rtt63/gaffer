import { DeviceSize } from "../constants";
import { getDeviceSize } from "./getDeviceSize";

const getPlayerSize = (): number => {
  const size = getDeviceSize();

  if (size === DeviceSize.S) return 24;
  if (size === DeviceSize.M) return 34;

  return 40;
};

const getBallSize = () => getPlayerSize() / 2;

const playerSize = getPlayerSize();
const ballSize = getBallSize();

export { playerSize, ballSize };
