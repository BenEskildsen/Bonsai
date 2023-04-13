
const {config} = require('./config');
const {decodePosition} = require('bens_utils').helpers;

const render = (state) => {
  const {width, height, canvasMult} = config.gridSize;
  const s = canvasMult;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");

  const blue = Math.sin(((state.windTime * 5) % 360) / 180 * Math.PI) * 15 + 130;
  ctx.fillStyle = 'rgb(70,' + blue + ',180)'; // hue around steelblue
  ctx.fillRect(0, 0, width * canvasMult, height * canvasMult);

  for (const p in state.gridMap) {
    const sq = state.gridMap[p];
    const symbol = config.symbols[sq.symbol];
    const pos = decodePosition(p);

    ctx.save();
    if (sq.symbol == 'F' || sq.symbol == 'S') {
      let windRadians = ((state.windTime + sq.parenLevel)) //  % 360) / 180 * Math.PI;
      ctx.translate(
        Math.sin(windRadians) * state.windMagnitude,
        Math.cos(windRadians) * sq.parenLevel * state.windMagnitude,
      );
    }

    ctx.fillStyle = symbol.color;
    ctx.fillRect(pos.x * s, pos.y * s, s, s);

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    if (sq.dir == 'UP') {
      ctx.moveTo(pos.x * s, pos.y * s + s);
      let lineFn = sq.nextDir.includes('LEFT') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s, pos.y * s);
      lineFn = sq.nextDir.includes('UP') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s + s, pos.y * s);
      lineFn = sq.nextDir.includes('RIGHT') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s + s, pos.y * s + s);
    } else if (sq.dir == 'DOWN') {
      ctx.moveTo(pos.x * s, pos.y * s);
      let lineFn = sq.nextDir.includes('LEFT') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s, pos.y * s + s);
      lineFn = sq.nextDir.includes('DOWN') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s + s, pos.y * s + s);
      lineFn = sq.nextDir.includes('RIGHT') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s + s, pos.y * s);
    } else if (sq.dir == 'RIGHT') {
      ctx.moveTo(pos.x * s, pos.y * s);
      let lineFn = sq.nextDir.includes('UP') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s + s, pos.y * s);
      lineFn = sq.nextDir.includes('RIGHT') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s + s, pos.y * s + s);
      lineFn = sq.nextDir.includes('DOWN') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s, pos.y * s + s);
    } else if (sq.dir == 'LEFT') {
      ctx.moveTo(pos.x * s + s, pos.y * s);
      let lineFn = sq.nextDir.includes('UP') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s, pos.y * s);
      lineFn = sq.nextDir.includes('LEFT') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s, pos.y * s + s);
      lineFn = sq.nextDir.includes('DOWN') ? 'moveTo' : 'lineTo';
      ctx[lineFn](pos.x * s + s, pos.y * s + s);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }

};

module.exports = {render}
