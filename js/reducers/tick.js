
const {initGrid} = require('../utils');
const {weightedOneOf} = require('bens_utils').stochastic;
const {encodePosition} = require('bens_utils').helpers;
const {config} = require('../config');
const {getParenLevel, getNextDir} = require('../utils');

const tick = (state) => {
  const {width, height, grid, rules} = state;
  state.time++;

  let nextGrammar = '';
  let gridMap = state.gridMap;
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

  return {...state, grammar: nextGrammar, gridMap: genGrid({...state, grammar: nextGrammar})};
};

// if symbolFn returns true, then this bails out and returns false
const genGrid = (state) => {
  const locStack = [];
  let loc = {...state.initialPosition}
  let gridMap = {};
  let dir = 'UP';

  let i = 0;
  for (let c of state.grammar) {
    switch (c) {
      case '[':
        locStack.push({...loc});
        break;
      case ']':
        loc = locStack.pop();
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
        const isEnd = i == state.grammar.length - 1 || state.grammar[i + 1] == ']';
        let nextDir = getNextDir(state.grammar, i);
        if (nextDir) dir = nextDir;
        if (symbol) {
          gridMap[encodePosition(loc)] = {index: i, dir, symbol: c, isEnd};
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
  while (endIndex < state.grammar.length) {
    if (state.grammar[endIndex] == '[') numOpens++;
    if (state.grammar[endIndex] == ']') numOpens--;
    if (numOpens < parenLevel) {
      nextGrammar += state.grammar.slice(endIndex);
      break;
    }
    endIndex++;
  }
  return {...state, grammar: nextGrammar, gridMap: genGrid({...state, grammar: nextGrammar})};
}

module.exports = {tick, genGrid, doSnip};
