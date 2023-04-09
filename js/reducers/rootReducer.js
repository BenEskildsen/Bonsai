
const {modalReducer} = require('./modalReducer');
const {config} = require('../config');
const {tick} = require('./tick');
const {initGrid} = require('../utils');

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
  }
  return state;
};


//////////////////////////////////////
// Initializations
const initState = () => {
  const state = {
    time: 0,
    grid: initGrid(config.gridSize.width, config.gridSize.height, null),
    width: config.gridSize.width,
    height: config.gridSize.height,
    rules: {
      'B': [
        {rule: 'T^T^T^B', weight: 8},
        {rule: 'T^T<B', weight: 4},
        {rule: 'T>T^B', weight: 4},
        {rule: 'T>T>B', weight: 5},
        {rule: 'T<T<B', weight: 5},
        {rule: 'T^<B>>B', weight: 3},
        {rule: 'L^L>L<<L', weight: 5},
      ],
      'D': [
        {rule: 'D', weight: 1},
      ],
      'T': [
        {rule: 'T', weight: 50},
        {rule: 'D>T<<T', weight: 2},
        {rule: 'B', weight: 1},
        {rule: '', weight: 1},
      ],
      'L': [
        {rule: 'L', weight: 20},
      ],
    },
  };

  state.grid[25][35] = 'B';

  return state;
}

module.exports = {rootReducer, initState};
