const config = {
  gridSize: {width: 60, height: 40, canvasMult: 10},
  symbols: {
    T: {color: 'rgb(134,89,63)'}, // trunk
    D: {color: 'rgb(96,58,50)'}, // dead
    L: {color: 'green'}, // Left branch
    R: {color: 'green'}, // Right branch
    B: {color: 'green'}, // branch
    F: {color: 'green'}, // leaf
    S: {color: 'green'}, // Stem leaf
  },
  msPerTick: 1500,
}

module.exports = {
  config,
};
