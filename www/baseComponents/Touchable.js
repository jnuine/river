'use strict';

import React from 'react';

import View from './View';

class Touchable extends React.Component {

  constructor () {
    super();
    this.state = {
      pressed: false
    };
  }

  onTouchStart () {
    if (this.endPress) {
      clearTimeout(this.endPress);
    }
    this.setState({ pressed: true });
  }

  onTouchEnd () {
    if (this.endPress) {
      clearTimeout(this.endPress);
    }
    this.endPress = setTimeout(
      () => this.setState({ pressed: false }),
      150
    );
  }

  render () {

    var { style, ...props } = this.props;

    style = Object.assign(
      {},
      style,
      this.state.pressed ? this.props.touchedStyle : {},
    );

    return (
      <View
        {...props}
        style={style}
        should
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => false}
        onResponderGrant={this.onResponderGrant.bind(this)}
        onResponderEnd={this.onResponderEnd.bind(this)}
        onResponderTerminationRequest={() => true}
        onResponderTerminate={this.onResponderEnd.bind(this)}>
        {this.props.children}
      </View>
    );
  }

}

export default Touchable;
