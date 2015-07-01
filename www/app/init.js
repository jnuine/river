import injectEventPlugins from './injectEventPlugins';

function init () {
  injectEventPlugins();
  global.alert('lol, nothing here ');
}

export default init;
