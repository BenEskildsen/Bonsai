
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

const getParenLevel = (grammar, index) => {
  let numOpens = 0;
  for (let i = 0; i < index; i++) {
    if (grammar[i] == '[') numOpens++;
    if (grammar[i] == ']') numOpens--;
  }
  return numOpens;
}

const getNextDir = (grammar, index) => {
  if (grammar[index + 1] == '^') return 'UP';
  if (grammar[index + 1] == 'V') return 'DOWN';
  if (grammar[index + 1] == '<') return 'LEFT';
  if (grammar[index + 1] == '>') return 'RIGHT';
  if (grammar[index + 1] == ']') return false;
  return false;
}

module.exports = {
  initGrid,
  getParenLevel,
  getNextDir,
};

