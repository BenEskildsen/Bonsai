import Main from './UI/Main.react';
import ValMain from './UI/ValMain.react';
import React from 'react';
import ReactDOM from 'react-dom/client';

function renderUI(root) {
  root.render(
    <ValMain />
  );
}


const root = ReactDOM.createRoot(document.getElementById('container'));
renderUI(root);

