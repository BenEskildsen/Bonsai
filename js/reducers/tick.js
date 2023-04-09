
const {initGrid} = require('../utils');
const {weightedOneOf} = require('bens_utils').stochastic;

const tick = (state) => {
  const {width, height, grid, rules} = state;
  state.time++;
  const nextGrid = initGrid(width, height, null);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (!grid[x][y]) continue;
      const rules = state.rules[grid[x][y]];
      if (!rules) continue;
      const rule = weightedOneOf(rules, rules.map(r => r.weight)).rule;
      doRule(nextGrid, rule, {x, y});
    }
  }

  state.grid = nextGrid;

  return {...state};
};

const doRule = (grid, rule, pos) => {
  const loc = {...pos};
  for (let c of rule) {
    switch (c) {
      case '^':
        loc.y -= 1;
        break;
      case 'V':
        loc.y += 1;
        break;
      case '<':
        loc.x -=1;
        break;
      case '>':
        loc.x += 1;
        break;
      default:
        if (
          loc.x >= 0 && loc.y >= 0 &&
          loc.x < grid.length && loc.y < grid[loc.x].length
        ) {
          grid[loc.x][loc.y] = c;
        }
    }
  }
  return grid;
}

module.exports = {tick};
