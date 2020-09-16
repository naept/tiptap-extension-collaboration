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

  get defaultOptions() {
    return {
      socketServerBaseURL: 'http://localhost:6000',
      namespace: '',
      room: '',
      clientID: String(Math.floor(Math.random() * 0xFFFFFFFF)),
      joinOptions: {},
      debounce: 250,
      keepFocusOnBlur: false,
      onConnected: () => {},
      onConnectionRefused: () => {},
      onClientsUpdate: () => {},
    };
  }

  init() {
    // Default version
    this.version = 0;
    this.initDone = false; // Prevent sending update on init setContent

    this.getSendableSteps = this.debounce((state) => {
      const sendable = sendableSteps(state);

      if (sendable) {
        this.socket.emit('update', {
          version: sendable.version,
          steps: sendable.steps.map((step) => step.toJSON()),
          clientID: sendable.clientID,
        });
      }
    }, this.options.debounce);

    this.getSendableSelection = this.debounce((state) => {
      const selection = (this.options.keepFocusOnBlur || this.editor.focused) ? {
        from: state.selection.from,
        to: state.selection.to,
      } : null;

      this.socket.emit('updateSelection', {
        clientID: this.options.clientID,
        selection,
      });
    }, this.options.debounce);

    this.editor.on('transaction', ({ state }) => {
      if (this.initDone) {
        this.getSendableSteps(state);
        this.getSendableSelection(state);
      } else {
        this.initDone = true;
      }
    });

    this.socket = io(`${this.options.socketServerBaseURL}/${this.options.namespace}`)
      .on('init', (data) => {
        this.version = data.version;
        this.editor.setContent(data.doc);
        this.editor.registerPlugin(collab({
          version: this.version,
          clientID: this.options.clientID,
        }));
        this.options.onConnected();
      })
      .on('initFailed', (error) => {
        this.options.onConnectionRefused(error);
      })
      .on('update', (data) => {
        this.update(data);
      })
      .on('getSelections', (data) => {
        this.updateSelections(data);
      })
      .on('getClients', (clientsIDs) => {
        this.options.onClientsUpdate({
          clientsIDs,
          clientID: this.options.clientID,
        });
      });

    this.socket.emit('join', {
      room: this.options.room,
      clientID: this.options.clientID,
      options: this.options.joinOptions,
    });
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

  updateSelections(cursors) {
    const cursorExtension = this.editor.extensions.extensions.find((e) => e.name === 'cursors');
    if (cursorExtension) cursorExtension.update(cursors);
  }

  closeSocket() {
    this.socket.close();
  }

  debounce(fn, delay) {
    let timeout;
    return (...args) => {
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
