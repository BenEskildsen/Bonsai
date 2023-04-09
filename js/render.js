
const {config} = require('./config');

const render = (state) => {
  const {width, height, canvasMult} = config.gridSize;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "steelblue";
  ctx.fillRect(0, 0, width * canvasMult, height * canvasMult);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (!state.grid[x][y]) continue;

      const {color} = config.symbols[state.grid[x][y]];
      ctx.fillStyle = color;
      ctx.fillRect(x * canvasMult, y * canvasMult, canvasMult, canvasMult);
    }
  }
};

module.exports = {render}
