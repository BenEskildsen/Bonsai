const React = require('react');
const {
  Button, Modal,
  Canvas,
  useMouseHandler,
} = require('bens_ui_components');
const {useEnhancedReducer} = require('bens_ui_components');
const {config} = require('../config');
const {render} = require('../render');
const {floor, equals} = require('bens_utils').vectors;
const {rootReducer, initState} = require('../reducers/rootReducer');
const {encodePosition} = require('bens_utils').helpers;
const {useEffect, useState, useMemo} = React;

const normalizePos = (pos, worldSize, canvasSize) => {
  return {
    x: pos.x * worldSize.width / canvasSize.width,
    y: pos.y * worldSize.height / canvasSize.height,
  };
}

function Main(props) {
  const [state, dispatch, getState] = useEnhancedReducer(
    rootReducer, initState(),
  );
  window.getState = getState;
  window.dispatch = dispatch;

  useEffect(() => {
    render(getState());
  }, [state.time, state.grammar]);

  useMouseHandler(
    "canvas", {dispatch, getState},
    {
      leftDown: (state, dispatch, p) => {
        const pos = floor(normalizePos(
          p,
          {
            width: config.gridSize.width,
            height: config.gridSize.height,
          },
          {width: window.innerWidth, height: window.innerHeight},
        ));
        if (equals(pos, state.initialPosition)) return;
        dispatch({type: 'SNIP', pos});
      }
    },
  );

  let content = (
    <div
      style={{

      }}
    >
      <Canvas
        useFullScreen={true}
        width={config.gridSize.width * config.gridSize.canvasMult}
        height={config.gridSize.height * config.gridSize.canvasMult}
      />

    </div>
  );

  return (
    <React.Fragment>
      {content}
      {state.modal}
    </React.Fragment>
  )
}


module.exports = Main;
