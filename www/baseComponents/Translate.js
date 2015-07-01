'use strict';

import React from 'react';
import tweenState from 'react-tween-state';

import View from './View';
import StaticRenderer from './StaticRenderer';

// Using createClass for mixins
var Translate = React.createClass({

  mixins: [tweenState.Mixin],

  animating: 0,

  getDefaultProps () {
    return {
      easing: 'easeInOutQuad',
      unitX: '%',
      unitY: '%',
      unitZ: 'px',
      X: 0,
      Y: 0,
      Z: 0
    };
  },

  componentWillReceiveProps (nextProps) {
    var props = this.props;
    ['X', 'Y', 'Z'].forEach(
      axis => {
        this.animating = (
          nextProps[axis] !== undefined &&
          nextProps[axis] !== props[axis]
        );
        if (this.animating) {
          setTimeout(
            () => this.animating = false,
            25
          );
        }
      }
    );
  },

  shouldComponentUpdate (nextProps) {
    var props = this.props;
    return !this.animating || nextProps.children !== props.children;
  },

  render () {

    var style = Object.assign(
      {},
      {
        transform: `translate3d(${this.props.X}${this.props.unitX},${this.props.Y}${this.props.unitY},${this.props.Z}${this.props.unitZ})`
      },
      this.props.style
    );

    return (
      <View style={style}>
        <StaticRenderer
          shouldUpdate={!this.animating}
          render={() => <View>{this.props.children}</View>}
        />
      </View>
    );
  }
});

module.exports = Translate;
