// THE river

import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'redux/react';
import * as reducers from '../reducers';

const store = createStore(reducers);

import ScrollableTabView from 'base/ScrollableTabView';
import RiverAddNote from './RiverAddNote';
import RiverFlow from './RiverFlow';

class River {

  render () {
    // ScrollableTabs [Settings, RiverList, RiverAddNote]
    return (
      <Provider store={store}>
        {
          () => (
            <ScrollableTabView>
              <RiverFlow session={this.props.session} />
              <RiverAddNote session={this.props.session} />
            </ScrollableTabView>
          )
        }
      </Provider>
    );
  }

}

export default River;
