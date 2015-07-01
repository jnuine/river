console.info('Waiting for env to be ready');

import init from './app/init';

if (typeof cordova !== 'undefined') {
  // deviceready always after document ready
  document.addEventListener('deviceready', init, false);
}
else if (/complete|loaded|interactive/.test(document.readyState)) {
  init();
}
else {
  document.addEventListener('DOMContentLoaded', init, false);
}
