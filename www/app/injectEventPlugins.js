import EventPluginHub from 'react/lib/EventPluginHub';
import ResponderEventPlugin from 'eventPlugins/ResponderEventPlugin';
import TapEventPlugin from 'eventPlugins/TapEventPlugin';

function injectEventPlugins () {

  EventPluginHub.injection.injectEventPluginsByName({
    'ResponderEventPlugin': ResponderEventPlugin,
    'TapEventPlugin': TapEventPlugin
  });
}

export default injectEventPlugins;
