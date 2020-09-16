# Tiptap Extension: Collaboration

## Install

NPM
```
$ npm install tiptap-extension-collaboration
```

## Usage

```js
import { Collaboration, Cursors } from 'tiptap-extension-collaboration'

new Editor({
  extensions: [
    new Collaboration({
            socketServerBaseURL: 'http://localhost:6000/',
            namespace: 'Directory-A',
            room: 'Document-1',

            clientID: Math.floor(Math.random() * 0xFFFFFFFF),
            
            debounce: 250,

            onStatusChanged: ({connected}) => {
            },
            onConnectedUsersChanged: ({count}) => {
            }
          }),
    new Cursors(),
  ],
})
```
