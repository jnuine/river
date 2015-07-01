// THE river

import React from 'react';

import ScrollableTabView from 'base/ScrollableTabView';
import ScrollView from 'base/ScrollView';

import RiverFlow from './RiverFlow';

class River {

  render () {
    // ScrollableTabs [Settings, RiverList, RiverAddNote]
    return (
      <ScrollableTabView>
        <RiverFlow />
        <ScrollView style={{height: '100%'}} />
      </ScrollableTabView>
    );
  }

}

export default River;
