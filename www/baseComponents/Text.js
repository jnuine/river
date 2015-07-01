import React from 'react';

import View from './View';

var TEXT_STYLE = {
  display: 'inline-block'
};

class Text extends React.Component {

  render () {

    var { style, ...props } = this.props;

    var computedStyle = Object.assign(
      {}
      style,
      TEXT_STYLE
    );

    return (
      <View {...props} style={computedStyle} >
        {this.props.children}
      </View>
    );
  }

}

export default Text;
