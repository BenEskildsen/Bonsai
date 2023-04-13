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
const {randomIn} = require('bens_utils').stochastic;
const {rootReducer, initState} = require('../reducers/rootReducer');
const {doSnip} = require('../reducers/tick');
const {encodePosition} = require('bens_utils').helpers;
const {encodeGrammar} = require('../utils');
const {useEffect, useState, useMemo} = React;

const normalizePos = (pos, worldSize, canvasSize) => {
  return {
    x: pos.x * worldSize.width / canvasSize.width,
    y: pos.y * worldSize.height / canvasSize.height,
  };
}

function ValMain(props) {
  const [state, dispatch, getState] = useEnhancedReducer(
    rootReducer, initState(),
  );
  window.getState = getState;
  window.dispatch = dispatch;

  const [cursor, setCursor] = useState('pointer');

  // establish client ID
  useEffect(() => {
    const clientID = localStorage.getItem("bonsaiClientID");
    if (clientID != null) {
      dispatch({clientID: parseInt(clientID)});
    } else {
      fetch("https://api.val.town/eval/@beneskildsen.getClientID()")
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem("bonsaiClientID", res.data);
          dispatch({clientID: res.data});
        });
    }
  }, []);

  // fetch val grammar
  useEffect(() => {
    fetch("https://api.val.town/eval/@beneskildsen.getBonsaiState()")
      .then(res => res.json())
      .then((res) => {
        if (res.data.snips[getState().clientID]) setCursor('not-allowed');
        localStorage.setItem("bonsaiGrammar", JSON.stringify(res.data));
        dispatch({type: 'SET_GRAMMAR', ...res.data});
      });
  }, []);

  // render on updates
  useEffect(() => {
    render(getState());
  }, [state.time, state.grammar, state.gridMap, state.windTime]);

  // wind
  useEffect(() => {
    const windInterval = setInterval(() => {
      dispatch({type: 'WIND_TICK'});
    }, config.msPerWindTick);

    const windMagInterval = setInterval(() => {
      dispatch({windMagnitude: randomIn(0, 5) / 10});
    }, config.msPerWindMagnitude);

    return () => {
      clearInterval(windInterval);
      clearInterval(windMagInterval);
    }
  }, []);

  // mouse handling for snipping
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
        if (!state.gridMap[encodePosition(pos)]) return;
        if (!state.clientID) return;
        if (state.snips[state.clientID] && state.clientID != 1) return;
        if (equals(pos, state.initialPosition)) return; // don't snip at base
        // do the snip on the clientside to save compute
        const {grammar} = doSnip({...state}, pos);
        setCursor("wait");
        const args = `(${pos.x},${pos.y},${state.clientID},"${encodeGrammar(grammar)}")`;
        fetch('https://api.val.town/eval/@beneskildsen.snip' + args)
          .then(res => res.json())
          .then((res) => {
            console.log(res.data);
            setCursor("not-allowed");
            dispatch({type: 'SET_GRAMMAR', ...res.data});
          });
      }
    },
  );

  let content = (
    <div
    >
      <Canvas
        style={{
          cursor,
        }}
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


module.exports = ValMain;
