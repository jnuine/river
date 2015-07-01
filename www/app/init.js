import React from 'react';

import injectEventPlugins from './injectEventPlugins';

import getAppDOMNode from'./getAppDOMNode';
import River from './components/River';

function init () {
  injectEventPlugins();
  React.render(
    <River />,
    getAppDOMNode()
  );
}

export default init;
