'use strict';

import React from 'react';

import View from './View';
import Text from './Text';

const STYLE = {
  position: 'absolute',
  top: 0, right: 0, bottom: 0, left: 0,
  backgroundColor: 'rgb(41, 196, 217)',
  borderBottom: '1px solid rgb(21, 166, 187)'
};

const COMMON_STYLE = {
  position: 'absolute',
  top: 0, bottom: 0,
  textAlign: 'center',
  lineHeight: '49px',
  display: 'inline-block',
  verticalAlign: 'middle'
};

const LEFT_COMP_STYLE = Object.assign(
  {},
  {
    width: 80,
    left: 0
  },
  COMMON_STYLE
);

const RIGHT_COMP_STYLE = Object.assign(
  {},
  {
    width: 80,
    right: 0
  },
  COMMON_STYLE
);

const TITLE_STYLE = Object.assign(
  {},
  {
    right: 80, left: 80,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  COMMON_STYLE
);

class Header extends React.Component {

  displayName = 'Header'

  static propTypes = {
    leftComponent: React.PropTypes.node,
    title: React.PropTypes.string.isRequired,
    rightComponent: React.PropTypes.node
  }

  render () {
    return (
      <View style={STYLE}>
        <View style={LEFT_COMP_STYLE}>
          {this.props.leftComponent}
        </View>
        <Text style={TITLE_STYLE}>
          {this.props.title}
        </Text>
        <View style={RIGHT_COMP_STYLE}>
          {this.props.rightComponent}
        </View>
      </View>
    );
  }

}

export default Header;
