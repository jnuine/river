'use strict';

import React from 'react';

var STYLE = {
  display: 'inline-block',
  backgroundColor: 'rgb(253, 249, 248)',
  color: 'rgb(53, 63, 57)',
  height: '1.5rem',
  fontSize: '0.9rem',
  borderRadius: '0.2rem',
  border: '0.1rem solid rgb(223, 219, 216)',
  lineHeight: '1.5rem',
  verticalAlign: 'middle',
  padding: '0 0.3rem'
};

var TOUCHED_STYLE = {
  backgroundColor: 'rgb(24, 114, 126)',
  color: 'rgb(253, 249, 248)',
  border: '0.1rem solid rgb(243, 240, 239)'
};

// var DISABLED_STYLE {
//   borderColor: 'rgb(185, 183, 197)',
//   backgroundColor: var(white),
//   color: var(main-text-color),
// };

import setStyle from 'jnuine-utils/lib/setStyle';

import Touchable from './Touchable';

class Button extends React.Component {

  render () {
    var { style, ...props } = this.props;

    var computedStyle = setStyle(STYLE, style);

    return (
      <Touchable
        {...props}
        style={computedStyle}
        touchedStyle={TOUCHED_STYLE}>
        {this.props.children}
      </Touchable>
    );
  }

}

export default Button;
