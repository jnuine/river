import React, { Component } from 'react';

function handleNewNote (dispatch, [note]) {
  console.log('newNote', note);
  dispatch({ type: 'NEW_NOTE', note });
}

function subscribeToNewNotes (dispatch, session, channel) {
  const channelUri = 'com.dasha.river.newNote.' + channel;
  session.subscribe(channelUri, handleNewNote.bind(null, dispatch)).then(
    function () {
      console.log('subscribed to topic', channelUri);
    },
    function (err) {
      console.log('failed to subscribe to topic', channelUri, err);
    }
  );
}

function handleInitNotes (dispatch, channel, notes) {
  dispatch({ type: 'INIT_NOTES', channel, notes });
}

function initConnection (dispatch, session) {
  session
    .call('com.dasha.river.connect', [session.id])
    .then(
      (res) => {
        console.log('com.dasha.river.connect', res);
        handleInitNotes(dispatch, res.channel, res.notes);
        subscribeToNewNotes(dispatch, session, res.channel);
      },
      ({ error, args, kwargs }) => {
        console.log('com.dasha.river.connect error:', error, args, kwargs);
      }
    );
}

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = { input: '' };
  }

  componentWillMount () {
    initConnection(this.props.dispatch, this.props.session);
  }

  onInputChange (event) {
    event.preventDefault();
    this.setState({ input: event.target.value });
  }

  render() {
    return (
      <div>
        <h2>the notes</h2>
        <ul>
          {this.props.notes.map((note) => <li>{note.text}</li>)}
        </ul>
      </div>
    );
  }
}
