'use strict';

import React from 'react';

import View from './View';
import Translate from './Translate';

import PanResponder from 'eventPlugins/PanResponder';

import rebound from 'rebound';

var SCROLLVIEW_STYLE = {
  overflow: 'hidden',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden'
};

var TRANSLATE_STYLE = {
  position: 'absolute',
  top: 0, right: 0, bottom: 0, left: 0
};

var REFRESH_INTERVAL = 350;

class ScrollView extends React.Component {

  constructor () {
    super();
    this.dimensions = {
      clientWidth: 0,
      clientHeight: 0,
      contentWidth: 0,
      contentHeight: 0
    };
    this.state = { top: 0 };
  }

  componentWillMount () {
    this.configured = false;
    this.springSystem = new rebound.SpringSystem();
    this._scrollSpring = this.springSystem.createSpring(10, 7);

    this._scrollSpring.setOvershootClampingEnabled(true);

    this._scrollSpring.addListener({
      onSpringUpdate: () => {
        var val = this._scrollSpring.getCurrentValue();
        val = Math.max(this.minVal, val);
        val = Math.min(this.maxVal, val);
        this.setState({
          top: val
        });
      }
    });

    this._panResponder = PanResponder.create({
      // Claim responder if it's a horizontal pan
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
          this._scrollStartOffset = this.state.top;
          return true;
        }
      },

      // Dragging, move the view with the touch
      onPanResponderMove: (e, gestureState) => {
        e.nativeEvent.preventDefault();
        this._scrollSpring.setEndValue(
          this._scrollStartOffset - gestureState.dy
        );
      },

      onPanResponderRelease: (e, gestureState) => {
        e.nativeEvent.preventDefault();
        var { dy, vy} = gestureState;
        this._scrollSpring.setEndValue(
          this._scrollStartOffset - (dy + vy * 200)
        );
      }
    });

  }

  componentDidMount () {
    this._scrollSpring.setEndValue(0);
    this.configure();
  }

  componentWillUnmount () {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  configure () {
    if (this.configured) {
      return;
    }
    this.configured = true;
    this.refreshScroller();
    this.refreshInterval = setInterval(
      this.refreshScroller.bind(this),
      REFRESH_INTERVAL
    );
  }

  // Costly, invoke with care
  getDimensions () {
    var node = React.findDOMNode(this);
    var contentNode = React.findDOMNode(this.contentComponent);
    return {
      clientWidth: node.clientWidth,
      clientHeight: node.clientHeight,
      contentWidth: contentNode.clientWidth,
      contentHeight: contentNode.clientHeight
    };
  }

  refreshScroller () {
    var dimensions = this.dimensions;
    var nextDimensions = this.getDimensions();

    var equals = (
      [
        'clientWidth',
        'clientHeight',
        'contentWidth',
        'contentHeight'
      ].every(
        d => dimensions[d] === nextDimensions[d]
      )
    );
    if (equals) {
      return;
    }

    this.setDimensions(nextDimensions);
  }

  setDimensions (dimensions) {
    this.dimensions = Object.assign(
      {},
      this.dimensions,
      dimensions
    );
    this.minVal = 0;
    this.maxVal = dimensions.contentHeight - dimensions.clientHeight;
  }

  handleScroll (left, top) {
    if (
      top >= 0 &&
      top < (this.dimensions.contentHeight - this.dimensions.clientHeight)
    ) {
      this.props.onScroll && this.props.onScroll(left, top);
    }
    this.setState({ top: top });
  }

  render () {
    var style = Object.assign(
      {},
      this.props.style,
      SCROLLVIEW_STYLE
    );

    return (
      <View
        style={style}
        {...this._panResponder.panHandlers}
        >
        <Translate
          style={TRANSLATE_STYLE}
          unitY="px"
          Y={-1 * this.state.top}>
          <View ref={(c) => this.contentComponent = c}>
            {this.props.children}
          </View>
        </Translate>
      </View>
    );
  }

}

export default ScrollView;
