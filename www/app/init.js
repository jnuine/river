import React from 'react';

import injectEventPlugins from './injectEventPlugins';

import getAppDOMNode from'./getAppDOMNode';
import River from './components/River';

function initReact (session) {
  injectEventPlugins();
  React.render(
    <River session={session} />,
    getAppDOMNode()
  );
}

function initAutobahn (initReact) {
  var connection = new window.autobahn.Connection({
    url: 'wss://demo.crossbar.io/ws',
    realm: 'realm1'
  });

  connection.onopen = function (session, details) {
    console.log('autobahn connection onopen session', session);
    console.log('autobahn connection onopen details', details);
    window.session = session;

    const dl = [2, 0, -2].map((val) => (
      session
        .call('com.dasha.river.sqrt', [val])
        .then(
          (res) => { console.log('sqrt(' + val + ') :', res); },
          ({ error, args, kwargs }) => {
            console.log('sqrt(' + val + ') error:', error, args, kwargs);
          }
        )
    ));

    Promise.all(dl).then(() => { console.log('All finished.'); });

    initReact(session);
  };

  connection.onclose = function (reason, details) {
    console.log('autobahn connection onclose reason', reason);
    console.log('autobahn connection onclose details', details);
  };

  connection.open();
}

function init () {
  initAutobahn(initReact);
}

export default init;
