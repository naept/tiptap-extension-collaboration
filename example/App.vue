<template>
  <div>
    <CollaborationEditor
      v-if="connect"
      :namespace="namespace"
      :room="room">
    </CollaborationEditor>
    <div v-else>
      <input v-model="namespace">
      <input v-model="room">
      <button @click="connectEditor">Join Editor</button>
    </div>
  </div>
</template>

<script>
import CollaborationEditor from './CollaborationEditor.vue'
export default {
  components: {
    CollaborationEditor,
  },

  data() {
    return {
      editorsConf: [],
      namespace: "namespace1/project1",
      room: "doc1",
      connect: false,
    }
  },

  methods: {
    connectEditor() {
      this.connect = true
    }
  }
}
</script>
