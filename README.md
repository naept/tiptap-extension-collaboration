# Tiptap Extension: Collaboration
A library for collaborative editing with [tiptap](https://github.com/ueberdosis/tiptap).

## Enhancements over tiptap's example
This library is based on the example provided by tiptap.
* Cursors and selections handling have been added.
* The socket server connection is handled inside the library.

### Socket server
For this library to work, you need to use a socket server run with this library :
[tiptap-collab-server](https://github.com/naept/tiptap-collab-server)

## Installation
```
$ npm install tiptap-extension-collaboration
```

## Basic Setup
```js
import { Collaboration, Cursors } from 'tiptap-extension-collaboration'

new Editor({
  extensions: [
    new Cursors(),
    new Collaboration({
      socketServerBaseURL: 'http://localhost:6000',
      namespace: 'Directory-A',
      room: 'Document-1',

      clientID: String(Math.floor(Math.random() * 0xFFFFFFFF)),
      joinOptions: {}
      
      debounce: 250,
      keepFocusOnBlur: false,

      onConnected: () => {
      },
      onConnectedFailed: (error) => {},
      onClientsUpdate: ({clientsIDs, clientID}) => {}
    }),
  ],
})
```
Use of Cursors extension is optional

## Tests
Contributions are welcome

## Contributing
Installs dependencies
```
npm install
```
Builds library for publication
```
npm run build
```
Compiles and hot-reloads example app for development
```
npm run serve-example
```

