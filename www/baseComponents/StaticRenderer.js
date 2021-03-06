'use strict';

import React from 'react';

class StaticRenderer extends React.Component {

  shouldComponentUpdate (nextProps) {
    return nextProps.shouldUpdate;
  }

  render () {
    return this.props.render();
  }

}

StaticRenderer.propTypes = {
  shouldUpdate: React.PropTypes.bool.isRequired,
  render: React.PropTypes.func.isRequired
};

export default StaticRenderer;
