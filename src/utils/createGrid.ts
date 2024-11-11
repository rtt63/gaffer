interface params {
  width: number;
  height: number;
}

type ReturnMap = Map<string, { x: number; y: number }>;

const createGrid = ({ width, height }: params): ReturnMap => {
  const h_step = height / 10;
  const w_step = width / 20;

  const h_list = [];
  const w_list = [];

  let cur_h = h_step;
  for (let i = 0; i < 9; i += 1) {
    h_list.push(cur_h);
    cur_h += h_step;
  }

  let cur_w = w_step;
  for (let i = 0; i < 19; i += 1) {
    w_list.push(cur_w);
    cur_w += w_step;
  }

  const addresses: ReturnMap = new Map();

  for (let row_i = 0; row_i < h_list.length; row_i += 1) {
    for (let col_i = 0; col_i < w_list.length; col_i += 1) {
      addresses.set(`${row_i}-${col_i}`, {
        x: w_list[col_i],
        y: h_list[row_i],
      });
    }
  }

  return addresses;
};

export { createGrid };
