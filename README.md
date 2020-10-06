# Tiptap Extension: Collaboration
A library for collaborative editing with [tiptap](https://github.com/ueberdosis/tiptap).

[![Build Status][travis-image]][travis-url]
[![Codacy Badge][codacy-image]][codacy-url]

## Enhancements over tiptap's example
This library is based on the example provided by tiptap.
* Cursors and selections handling have been added.
* The socket server connection is handled inside the library.

### Socket server
For this library to work, you need to use a socket server run with this library :
[tiptap-collab-server](https://github.com/naept/tiptap-collab-server)

## Installation
```sh
npm install tiptap-extension-collaboration
```

## Basic Setup
```js
import { Collaboration, Cursors } from 'tiptap-extension-collaboration'

new Editor({
  extensions: [
    new Cursors(),
    new Collaboration({
      socketServerBaseURL: 'http://localhost:6002',
      namespace: 'Directory-A',
      room: 'Document-1',

      clientID: String(Math.floor(Math.random() * 0xFFFFFFFF)),
      joinOptions: {},

      debounce: 250,
      keepFocusOnBlur: false,

      onConnected: () => {},
      onConnectedFailed: (error) => {},
      onDisconnected: () => {},
      onClientsUpdate: ({clientsIDs, clientID}) => {},
      onSaving: () => {},
      onSaved: () => {},
    }),
  ],
})
```
Use of Cursors extension is optional

## Tests
Contributions are welcome

## Contributing
Installs dependencies
```sh
npm install
```

Builds library for publication
```sh
npm run build
```

Compiles and hot-reloads example app for development
```sh
npm run serve-example
```

[travis-image]: https://travis-ci.org/naept/tiptap-extension-collaboration.svg?branch=master
[travis-url]: https://travis-ci.org/naept/tiptap-extension-collaboration
[codacy-image]:https://app.codacy.com/project/badge/Grade/74a417aa23794c3c82c22acf2fb3965b
[codacy-url]:https://www.codacy.com/gh/naept/tiptap-extension-collaboration?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=naept/tiptap-extension-collaboration&amp;utm_campaign=Badge_Grade
