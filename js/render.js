
const {config} = require('./config');
const {decodePosition} = require('bens_utils').helpers;

const render = (state) => {
  const {width, height, canvasMult} = config.gridSize;
  const s = canvasMult;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "steelblue";
  ctx.fillRect(0, 0, width * canvasMult, height * canvasMult);
    // ctx.globalAlpha = 0.7;

  for (const p in state.gridMap) {
    const sq = state.gridMap[p];
    const symbol = config.symbols[sq.symbol];
    const pos = decodePosition(p);

    ctx.fillStyle = symbol.color;
    ctx.fillRect(pos.x * s, pos.y * s, s, s);

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    if (sq.dir == 'UP') {
      ctx.moveTo(pos.x * s, pos.y * s + s);
      ctx.lineTo(pos.x * s, pos.y * s);
      let lineFn = sq.isEnd ? 'lineTo' : 'moveTo';
      ctx[lineFn](pos.x * s + s, pos.y * s);
      ctx.lineTo(pos.x * s + s, pos.y * s + s);
    } else if (sq.dir == 'DOWN') {
      ctx.moveTo(pos.x * s, pos.y * s);
      ctx.lineTo(pos.x * s, pos.y * s + s);
      let lineFn = sq.isEnd ? 'lineTo' : 'moveTo';
      ctx[lineFn](pos.x * s + s, pos.y * s + s);
      ctx.lineTo(pos.x * s + s, pos.y * s);
    } else if (sq.dir == 'RIGHT') {
      ctx.moveTo(pos.x * s, pos.y * s);
      ctx.lineTo(pos.x * s + s, pos.y * s);
      let lineFn = sq.isEnd ? 'lineTo' : 'moveTo';
      ctx[lineFn](pos.x * s + s, pos.y * s + s);
      ctx.lineTo(pos.x * s, pos.y * s + s);
    } else if (sq.dir == 'LEFT') {
      ctx.moveTo(pos.x * s + s, pos.y * s);
      ctx.lineTo(pos.x * s, pos.y * s);
      let lineFn = sq.isEnd ? 'lineTo' : 'moveTo';
      ctx[lineFn](pos.x * s, pos.y * s + s);
      ctx.lineTo(pos.x * s + s, pos.y * s + s);
    }
    ctx.stroke();
    ctx.closePath();
  }

};

module.exports = {render}
