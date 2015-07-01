// Adding a note to the river

import React, { Component, PropTypes } from 'react';

class RiverAddNote extends Component {
  static propTypes = {
    postNote: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { input: '' };
  }

  postNote (event) {
    event.preventDefault();
    const text = this.state.input;
    this.props.session.call('com.dasha.river.addNote', ['1234', text])
      .then(function (res) { console.log('addNote went through!', res); });
    this.setState({ input: '' });
  }

  onInputChange (event) {
    event.preventDefault();
    this.setState({ input: event.target.value });
  }

  render () {
    return (
      <form onSubmit={::this.postNote}>
        <input
          onChange={::this.onInputChange}
          value={this.state.input}
        />
      </form>
    );
  }

}

export default RiverAddNote;
