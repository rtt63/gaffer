interface Coords {
  x: number;
  y: number;
}

const shiftPosition = (size: number, { x, y }: Coords): Coords => {
  const shift = size / 2;
  return { x: x - shift, y: y - shift };
};

export { shiftPosition };
