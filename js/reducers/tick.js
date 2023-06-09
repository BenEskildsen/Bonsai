
const {initGrid} = require('../utils');
const {weightedOneOf} = require('bens_utils').stochastic;
const {encodePosition} = require('bens_utils').helpers;
const {config} = require('../config');
const {
  getParenLevel, getNextDir, getPrevSymbol,
  cleanupGrammar,
} = require('../utils');

const tick = (state) => {
  const {width, height, grid, rules} = state;
  state.time++;

  let nextGrammar = '';
  let i = 0;
  for (let c of state.grammar) {
    if (!state.rules[c]) {
      nextGrammar += c;
      continue;
    };
    const rule = weightedOneOf(state.rules[c], state.rules[c].map(r => r.weight)).rule;
    nextGrammar += rule;
    i++;
  }

  return {...state, grammar: nextGrammar, gridMap: genGrid(state.initialPosition, nextGrammar)};
};

const genGrid = (initialPosition, grammar) => {
  const locStack = [];
  const dirStack = [];
  let loc = {...initialPosition}
  let gridMap = {};
  let dir = 'UP';

  let i = 0;
  for (let c of grammar) {
    switch (c) {
      case '[':
        locStack.push({...loc});
        dirStack.push(dir);
        break;
      case ']':
        loc = locStack.pop();
        dir = dirStack.pop();
        break;
      case '^':
        dir = 'UP';
        loc.y -= 1;
        break;
      case 'V':
        dir = 'DOWN';
        loc.y += 1;
        break;
      case '<':
        dir = 'LEFT';
        loc.x -= 1;
        break;
      case '>':
        dir = 'RIGHT';
        loc.x += 1;
        break;
      default:
        const symbol = config.symbols[c];
        if (symbol) {
          gridMap[encodePosition(loc)] = {
            index: i,
            dir,
            nextDir: getNextDir(grammar, i),
            symbol: c,
            parenLevel: getParenLevel(grammar, i),
          };
        }
    }
    i++
  }
  return gridMap;
}

const doSnip = (state, pos) => {
  const symbol = state.gridMap[encodePosition(pos)];
  if (!symbol) return state;
  const index = symbol.index;

  let nextGrammar = state.grammar.slice(0, index);
  const parenLevel = getParenLevel(state.grammar, index);
  let numOpens = parenLevel;
  let endIndex = index;
  // cut things out until we're at the parent parenLevel
  while (endIndex < state.grammar.length) {
    if (state.grammar[endIndex] == '[') numOpens++;
    if (state.grammar[endIndex] == ']') numOpens--;
    if (numOpens < parenLevel) {
      nextGrammar += state.grammar.slice(endIndex);
      break;
    }
    endIndex++;
  }
  const prevSymbol = getPrevSymbol(nextGrammar, index);
  if (prevSymbol && prevSymbol.symbol == 'T') {
    nextGrammar =
      nextGrammar.slice(0, prevSymbol.index) + 'B' + nextGrammar.slice(prevSymbol.index + 1);
  }
  nextGrammar = cleanupGrammar(nextGrammar);
  return {...state, grammar: nextGrammar, gridMap: genGrid(state.initialPosition, nextGrammar)};
}

module.exports = {tick, genGrid, doSnip};
