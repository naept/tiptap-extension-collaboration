<template>
  <div class="editor">
    <template v-if="editor && !loading">
      <div class="count">
        &bull; {{ count }} {{ count === 1 ? 'user' : 'users' }} connected to {{ namespace }}/{{ room }}
      </div>
      <editor-content class="editor__content" :editor="editor"  />
    </template>
    <em v-else>
      Connecting to socket server …
    </em>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { Editor, EditorContent } from 'tiptap'
import {
  HardBreak,
  Heading,
  Bold,
  Code,
  Italic,
  History,
  // Collaboration,
} from 'tiptap-extensions'
import Collaboration from 'tiptap-extension-collaboration'

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
            socketServerBaseURL: 'http://localhost:6002/',
            namespace: this.namespace,
            room: this.room,
            // debounce changes so we can save some requests
            debounce: 250,

            onStatusChanged: ({loading}) => {
              this.loading = loading
            },
            onConnectedUsersChanged: ({count}) => {
              this.count = count
            }
          }),
        ]
      }),
      // socket: null,
      count: 0,
    }
  },

  methods: {
  },

  mounted() {
  },

  beforeDestroy() {
    console.log("destroying editor", this.editor.extensions)
    this.editor.destroy()
    // this.editor.extensions.extensions.collaboration.closeSocket()
    this.editor.extensions.extensions.find(e => e.name === "collaboration").closeSocket()
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

.count {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: rgba(#000000, 0.5);
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

</style>
