import { DeviceSize } from "../constants";

const getDeviceSize = (): DeviceSize => {
  const w = window.innerWidth;

  if (w < 900) {
    return DeviceSize.S;
  }

  if (w < 1400) {
    return DeviceSize.M;
  }

  return DeviceSize.L;
};

export { getDeviceSize };
