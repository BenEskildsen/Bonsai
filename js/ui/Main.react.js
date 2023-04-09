const React = require('react');
const {
  Button, Modal,
  Canvas,
} = require('bens_ui_components');
const {useEnhancedReducer} = require('bens_ui_components');
const {config} = require('../config');
const {render} = require('../render');
const {rootReducer, initState} = require('../reducers/rootReducer');
const {useEffect, useState, useMemo} = React;


function Main(props) {
  const [state, dispatch, getState] = useEnhancedReducer(
    rootReducer, initState(),
  );
  window.getState = getState;
  window.dispatch = dispatch;

  useEffect(() => {
    render(getState());
  }, [state.time]);

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
