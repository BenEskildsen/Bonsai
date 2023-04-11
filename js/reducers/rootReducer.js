
const {modalReducer} = require('./modalReducer');
const {config} = require('../config');
const {tick, doSnip} = require('./tick');
const {encodePosition} = require('bens_utils').helpers;

const rootReducer = (state, action) => {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'SET_MODAL':
    case 'DISMISS_MODAL':
      return modalReducer(state, action);
    case 'START_TICK': {
      if (state.tickInterval != null) return state;
      return {
        ...state,
        tickInterval: setInterval(
          // HACK: dispatch is only available via window
          () => dispatch({type: 'TICK'}),
          config.msPerTick,
        ),
      };
    }
    case 'STOP_TICK':
      clearInterval(state.tickInterval);
      state.tickInterval = null;
      return state;
    case 'TICK': {
      return tick(state);
    }
    case 'SNIP': {
      const {pos} = action;
      return doSnip(state, pos);
    }
  }
  return state;
};


//////////////////////////////////////
// Initializations
const initState = () => {
  const state = {
    time: 0,
    rules: {
      'B': [
        {rule: 'T^B', weight: 8},
        {rule: 'T<L', weight: 5},
        {rule: 'T>R', weight: 5},
        {rule: 'T^[<L]T[>R]', weight: 10},
        {rule: 'F', weight: 2},
      ],
      'F': [
        {rule: 'F', weight: 20},
        {rule: 'S^S>SVSVS<S<S^S^F', weight: 1},
        {rule: 'SVS<S^S^S>S>SVSVF', weight: 1},
      ],
      'S': [
        {rule: 'S', weight: 100},
        // {rule: 'B', weight: 1},
      ],
      'T': [
        {rule: 'T', weight: 1000},
        {rule: 'B', weight: 1},
      ],
      'L': [
        {rule: 'T^L', weight: 3},
        {rule: 'T^B', weight: 5},
        {rule: 'T<L', weight: 8},
        {rule: 'F', weight: 2},
      ],
      'R': [
        {rule: 'T^B', weight: 3},
        {rule: 'T^R', weight: 5},
        {rule: 'T>R', weight: 8},
        {rule: 'F', weight: 2},
      ],
      'D': [
        {rule: 'D', weight: 1},
      ],
    },
    grammar: 'B',
    initialPosition: {x: 30, y: 35},
    gridMap: {[encodePosition({x: 30, y: 35})]: {index: 0, dir: 'UP', symbol: 'B', isEnd: true}},
  };

  return state;
}

module.exports = {rootReducer, initState};
