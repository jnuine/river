import autobahn from 'autobahn';
import Datastore from 'nedb';
import path from 'path';
import promisify from 'es6-promisify'; // promisify-me has built in support for nedb..

const dbPath = path.resolve(path.join(__dirname, '..', 'database', 'notes.db'));
console.log('dbPath', dbPath);

var db = {
  notes: new Datastore({
    filename: dbPath,
    autoload: true
  })
};

var connection = new autobahn.Connection({
   url: 'wss://demo.crossbar.io/ws',
   realm: 'realm1'
});

var channels = [];
var lastChannelIndex = 0;

connection.onopen = function onOpen (session) {

  function sqrt([x], kwargs, details) {
    console.log('sqrt() called with', x);
    console.log('kwargs', kwargs);
    console.log('details', details);

    if (x === 0) {
      throw "don't ask foolish questions;)";
    }

    const res = Math.sqrt(x);
    if (res !== res) {
      //throw "cannot take sqrt of negative";
      throw new autobahn.Error('com.dasha.river.error', ['fuck'], { a: 23, b: 9 });
    }

    return res;
  }

  session.register('com.dasha.river.sqrt', sqrt).then(
    (registration) => { console.log(registration.procedure, 'registered'); },
    (error) => {
      console.log('com.dasha.river.sqrt', 'registration failure:', error);
    }
  );

  function pickChannel () {
    console.log(lastChannelIndex, channels.length);
    lastChannelIndex = (lastChannelIndex + 1) % channels.length;
    console.log(lastChannelIndex);
    return lastChannelIndex;
  }

  function createChannel (sessionId) {
    channels.push(sessionId);
    return channels.length - 1;
  }

  function loadLast10FromChannel (channel) {
    let cursor = (
      db.notes.find({ channel }).sort({ creationDate: -1 }).limit(10)
    );
    return promisify(cursor.exec.bind(cursor))();
  }

  function clientConnect ([sessionId]) {
    const channel = createChannel(sessionId);
    return loadLast10FromChannel(channel).then((notes) => ({ channel, notes }));
  }

  session.register('com.dasha.river.connect', clientConnect).then(
    (registration) => { console.log(registration.procedure, 'registered'); },
    (error) => {
      console.log('com.dasha.river.connect', 'registration failure:', error);
    }
  );

  function addNote ([clientId, text]) {
    console.log('addNote() called with', clientId, text);
    const channel = pickChannel(); // pick the channel..
    const note = { channel, text, clientId, creationDate: new Date() };

    let insertAndNotify = (
      promisify(db.notes.insert.bind(db.notes))(note)
        .then(
          (savedNote) => {
            session.publish(
              'com.dasha.river.newNote.' + channel,
              [savedNote]
            );
            console.log(
              'just published com.dasha.river.newNote.' + channel,
              savedNote
            );
            return savedNote;
          },
          (err) => { console.error('errrorrr', err); }
        )
    );

    return insertAndNotify;
  }

  session.register('com.dasha.river.addNote', addNote).then(
    (registration) => { console.log(registration.procedure, 'registered'); },
    (error) => {
      console.log('com.dasha.river.addNote', 'registration failure:', error);
    }
  );

  // session.publish('com.example.oncounter', [counter]);
  // console.log('published to "oncounter" with counter ' + counter);
};

connection.onclose = function (reason, details) {
  console.log('autobahn connection onclose reason', reason);
  console.log('autobahn connection onclose details', details);
};

connection.open();
