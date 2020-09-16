<template>
  <div class="editor">
    <template v-if="editor && !loading">
      <div class="clientsIDs">
        &bull; {{ clientsIDs.length }} {{ clientsIDs.length === 1 ? 'user' : 'users' }} connected to {{ namespace }}/{{ room }}
      </div>
      <editor-content class="editor__content" :editor="editor"  />
    </template>
    <em v-else>
      Connecting to socket server …
    </em>
  </div>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
import {
  HardBreak,
  Heading,
  Bold,
  Code,
  Italic,
  History,
} from 'tiptap-extensions'
import {Cursor, Collaboration} from 'tiptap-extension-collaboration'
// import {Cursor, Collaboration} from '../src'
import randomColor from 'randomColor'

export default {
  components: {
    EditorContent,
  },

  props: {
    namespace: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: true,
      editor: new Editor({
        content: 'Rien encore',
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Code(),
          new Italic(),
          new History(),
          new Collaboration({
            socketServerBaseURL: 'http://localhost:6002',
            namespace: this.namespace,
            room: this.room,
            clientID: String(Math.floor(Math.random() * 0xFFFFFFFF)),

            debounce: 250,
            keepFocusOnBlur: false,

            onConnected: () => {
              this.loading = false
            },
            onClientsUpdate: ({clientsIDs, clientID}) => {
              this.clientsIDs = clientsIDs
              this.mapClientsToColors(clientID)
              this.makeClientColorStyles()
            }
          }),
          new Cursor()
        ]
      }),
      clientsIDs: [],
      colorsMap: {}
    }
  },

  methods: {
    mapClientsToColors(clientID) {
      this.clientsIDs
        .filter((id) => id !== clientID)
        .filter((id) => !Object.keys(this.colorsMap).includes(id))
        .forEach((id) => {
          this.colorsMap[id] = randomColor()
        })
    },

    makeClientColorStyles() {
      let clientsColorsStyle = document.getElementById('client-colors')
      if (clientsColorsStyle) clientsColorsStyle.remove()
      
      clientsColorsStyle = document.createElement('style')
      clientsColorsStyle.type = 'text/css'
      clientsColorsStyle.id = 'client-colors'

      Object.entries(this.colorsMap).forEach(([clientID, color]) => {
        clientsColorsStyle.innerHTML += `.cursor.client-${clientID}::before { background-color: ${color} }\n`
        clientsColorsStyle.innerHTML += `.selection.client-${clientID} { background-color: ${color}20 }\n`
      })

      document.getElementsByTagName('head')[0].appendChild(clientsColorsStyle)
    },
  },

  beforeDestroy() {
    this.editor.destroy()
    this.editor.extensions.extensions.find((e) => e.name === 'collaboration').closeSocket()
  },
}
</script>

<style>

html {
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: #000000;
  line-height: 1.5;
}

.clientsIDs {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #27b127;
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-size: 0.7rem;
  line-height: 1;
}

.editor {
  position: relative;
  max-width: 30rem;
  margin: 0 auto 5rem auto;

}

.cursor {
  position: relative;
}

.cursor::before {
  content: '';
  display: block;
  width: 2px;
  height: 120%;
  position: absolute;
  top: -1em;
  left: -1px;
  z-index: 1;
}

.selection {
  position: relative;
}
</style>
