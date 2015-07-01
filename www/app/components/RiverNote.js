// THE river

import React, { Component } from 'react';

import Translate from 'base/Translate';

var TRANSLATE_STYLE = {
  position: 'absolute',
  top: 0, right: 0, bottom: 0, left: 0
};


class RiverFlow extends Component {

  constructor () {
    super();
    this.state = {
      offsetY: 0
    };
  }

  componentDidMount () {
    setInterval(
      () => {
        this.setState({
          offsetY: this.state.offsetY + 10
        });
      },
      100
    );
  }

  render () {

    return (
      <Translate
        {...this.props}
        unitY="px"
        Y={this.props.offsetY}>
        {this.props.children}
      </Translate>
    );

  }

}

export default RiverFlow;
