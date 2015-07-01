'use strict';

import React from 'react';

import View from './View';
import Translate from './Translate';

import Scroller from 'zynga/scroller';

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
    this.scroller = new Scroller(
      this.handleScroll.bind(this),
      {
        scrollingY: true,
        scrollingX: false
      }
    );
  }

  componentDidMount () {
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
    if (equals) return;

    this.setDimensions(nextDimensions);
  }

  setDimensions (dimensions) {
    this.dimensions = Object.assign(
      {},
      this.dimensions,
      dimensions
    );

    this.scroller.setDimensions(
      this.dimensions.clientWidth,
      this.dimensions.clientHeight,
      this.dimensions.contentWidth,
      this.dimensions.contentHeight
    );
  }

  shouldUpdateScrollPosition () {
    var dimensions = this.dimensions;
    return !(
      (dimensions.clientWidth >= dimensions.contentWidth) &&
      (dimensions.clientHeight >= dimensions.contentHeight)
    );
  }

  handleTouchStart (e) {
    e.preventDefault();
    this.scroller.doTouchStart(e.touches, e.timeStamp);
  }

  handleTouchMove (e) {
    e.preventDefault();
    this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
  }

  handleTouchEnd (e) {
    e.preventDefault();
    this.scroller.doTouchEnd(e.timeStamp);
  }

  handleScroll (left, top) {
    if (
      top >= 0 &&
      top < (this.dimensions.contentHeight - this.dimensions.clientHeight)
    ) {
      this.props.onScroll && this.props.onScroll(left, top);
    }
    if (!this.shouldUpdateScrollPosition()) {
      return;
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
        onTouchStart={e => this.handleTouchStart(e)}
        onTouchMove={e => this.handleTouchMove(e)}
        onTouchEnd={e => this.handleTouchEnd(e)}
        onTouchCancel={e => this.handleTouchEnd(e)}
        ref={(c) => this.scrollerComponent = c}
        style={style}
        >
        <Translate
          style={TRANSLATE_STYLE}
          easing="linear"
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
