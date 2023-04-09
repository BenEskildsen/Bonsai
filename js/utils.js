
const initGrid = (width, height, initial) => {
  const grid = [];
  for (let x = 0; x < width; x++) {
    const row = [];
    for (let y = 0; y < height; y++) {
      row.push(initial);
    }
    grid.push(row);
  }
  return grid;
}

module.exports = {
  initGrid,
};

