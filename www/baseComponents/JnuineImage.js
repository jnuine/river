'use strict';

import React from 'react';

import View from './View';

const STYLE = {
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};

class JnuineImage extends React.Component {

  render () {
    var { style, ...props } = this.props;

    style = Object.assign(
      {},
      STYLE,
      style,
      { backgroundImage: 'url(' + this.props.src + ')' }
    );

    return (
      <View {...props} style={style} />
    );
  }

}

JnuineImage.propTypes = {
  style: React.PropTypes.object,
  src: React.PropTypes.string.isRequired
};

export default JnuineImage;
