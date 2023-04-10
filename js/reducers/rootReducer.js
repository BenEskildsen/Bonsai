
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
        {rule: 'T^T^B', weight: 8},
        // {rule: 'T^T<B', weight: 4},
        // {rule: 'T>T^B', weight: 4},
        // {rule: 'T>T>B', weight: 5},
        {rule: 'T<T<B', weight: 5},
        {rule: 'T>T>B', weight: 5},
        {rule: 'T^[<B]T[>B]', weight: 5},
        // {rule: 'L^L>L<<L', weight: 5},
      ],
      'D': [
        {rule: 'D', weight: 1},
      ],
      'T': [
        {rule: 'T', weight: 50},
      ],
      'L': [
        {rule: 'L', weight: 20},
        {rule: 'B', weight: 2},
      ],
    },
    grammar: 'B',
    initialPosition: {x: 25, y: 35},
    gridMap: {[encodePosition({x: 25, y: 35})]: {index: 0, dir: 'UP', symbol: 'B', isEnd: true}},
  };

  return state;
}

module.exports = {rootReducer, initState};
