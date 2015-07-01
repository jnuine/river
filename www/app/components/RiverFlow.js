import React from 'react';
import { connect } from 'redux/react';
import Notes from './Notes';

@connect(state => ({
  notes: state.notes
}))
class RiverFlow {
  render() {
    const { notes, dispatch, session } = this.props;
    return (
      <Notes
        notes={notes}
        session={session}
        dispatch={dispatch}
      />
    );
  }
}

export default RiverFlow;
