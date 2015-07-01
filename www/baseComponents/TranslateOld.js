'use strict';

import logger from 'jnuine-utils/lib/logger';

var log = logger(__filename);

import React from 'react';
import prefixr from 'react-prefixr';
import tweenState from 'react-tween-state';
import setStyle from 'jnuine-utils/lib/setStyle';

import View from './View';
import StaticRenderer from './StaticRenderer';

var transId = 0;

// Using createClass for mixins
var Translate = React.createClass({

  mixins: [tweenState.Mixin],

  animating: 0,

  getDefaultProps () {
    return {
      easing: 'easeInOutQuad',
      unitX: '%',
      unitY: '%',
      unitZ: 'px'
    }
  },

  getInitialState () {
    return {
      X: 0,
      Y: 0,
      Z: 0
    };
  },

  componentDidMount () {
    this.setState({
      X: this.props.X || 0,
      Y: this.props.Y || 0,
      Z: this.props.Z || 0
    });
  },

  componentWillReceiveProps (nextProps) {
    var props = this.props;
    ['X', 'Y', 'Z'].forEach(
      axis => (
        nextProps[axis] !== undefined &&
        nextProps[axis] !== props[axis] &&
        this.translateTo(axis, nextProps[axis])
      )
    );
  },

  translateTo (axis, value) {
    this.tweenState(
      axis,
      {
        duration: 50,
        endValue: value,
        onEnd: () => {
          this.animating--;
          if (this.animating === 0) {
            this.forceUpdate();
          }
        },
        easing: tweenState.easingTypes[this.props.easing]
      }
    );
    this.animating++;
  },

  shouldComponentUpdate (nextProps, nextState) {
    var props = this.props;
    var state = this.state;
    return !['X', 'Y', 'Z'].every(
      axis => (
        nextProps[axis] === props[axis] &&
        nextState[axis] === state[axis]
      )
    ) || nextProps.children !== props.children;
  },

  render () {

    var style = setStyle(
      prefixr({
        transform: `translate3d(${this.getTweeningValue('X')}${this.props.unitX},${this.getTweeningValue('Y')}${this.props.unitY},${this.getTweeningValue('Z')}${this.props.unitZ})`
      }),
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
