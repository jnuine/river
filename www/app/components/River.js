// THE river

import React, { Component } from 'react';

import ScrollableTabView from 'base/ScrollableTabView';
import ScrollView from 'base/ScrollView';
import View from 'base/View';

class River extends Component {

  render () {

    function generateRows () {
      var rows = [];
      for (var i= 0; i< 100; ++i) {
        rows.push(<View key={`row-${i}`} style={{height: 40, backgroundColor: '#F00'}}>Row {i}</View>);
      }
      return rows;
    }

    // ScrollableTabs [Settings, RiverList, RiverAddNote]
    return (
      <ScrollableTabView>
        <ScrollView style={{height: '100%'}}>
          {generateRows()}
        </ScrollView>
        <ScrollView style={{height: '100%'}}>
          {generateRows()}
        </ScrollView>
      </ScrollableTabView>
    );

  }

}

export default River;
