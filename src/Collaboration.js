/* eslint-disable class-methods-use-this */
import { Extension } from 'tiptap';
import { Step } from 'prosemirror-transform';
import {
  collab,
  sendableSteps,
  getVersion,
  receiveTransaction,
} from 'prosemirror-collab';
import io from 'socket.io-client';

export default class Collaboration extends Extension {
  get name() {
    return 'collaboration';
  }

  init() {
    // Default version
    console.log('The ONE !');
    this.version = 0;
    this.initDone = false;

    this.getSendableSteps = this.debounce((state) => {
      const sendable = sendableSteps(state);
      console.log('sendableSteps', state);

      if (sendable) {
        console.log('socket emit update', sendable);
        this.socket.emit('update', {
          version: sendable.version,
          steps: sendable.steps.map((step) => step.toJSON()),
          clientID: sendable.clientID,
        });
      }
    }, this.options.debounce);

    this.editor.on('transaction', ({ state }) => {
      if (this.initDone) {
        this.getSendableSteps(state);
      } else {
        this.initDone = true;
      }
    });

    this.socket = io(`${this.options.socketServerBaseURL}/${this.options.namespace}`)
      // get the current document and its version
      .on('init', (data) => {
        console.log('socket on init', data);
        this.version = data.version;
        this.editor.setContent(data.doc);
        this.editor.registerPlugin(collab({
          version: this.version,
          clientID: this.options.clientID,
        }));
        // console.log('state after registerPlugin', this.editor.state)
        this.options.onStatusChanged({ loading: false });
      })
      // send all updates to the collaboration extension
      .on('update', (data) => {
        console.log('socket on update', data);
        this.update(data);
      })
      // get count of connected users
      .on('getCount', (count) => {
        console.log('on getCount', count);
        this.options.onConnectedUsersChanged({ count });
      });

    console.log('socket emit join', `${this.options.socketServerBaseURL}${this.options.namespace}`);
    this.socket.emit('join', this.options.room);
  }

  update({ steps, version }) {
    const { state, view, schema } = this.editor;

    if (getVersion(state) > version) {
      return;
    }

    view.dispatch(receiveTransaction(
      state,
      steps.map((item) => Step.fromJSON(schema, item.step)),
      steps.map((item) => item.clientID),
    ));
  }

  closeSocket() {
    console.log('closeSocket');
    this.socket.close();
  }

  get defaultOptions() {
    return {
      socketServerBaseURL: 'http://localhost:6000',
      namespace: '',
      room: '',
      clientID: Math.floor(Math.random() * 0xFFFFFFFF),
      debounce: 250,
      onStatusChanged: () => {},
      onConnectedUsersChanged: () => {},
    };
  }

  debounce(fn, delay) {
    let timeout;
    return function (...args) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        fn(...args);
        timeout = null;
      }, delay);
    };
  }
}
