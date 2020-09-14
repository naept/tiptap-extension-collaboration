<template>
  <div>
    <CollaborationEditor
      v-for="conf in editorsConf"
      :namespace="conf.namespace"
      :room="conf.room">
    </CollaborationEditor>
    <!-- <CollaborationEditor namespace="namespace1/project1" room="doc1"></CollaborationEditor> -->
    <!-- <editor projectPath="namespace1/project1" docName="doc6" class="col-6"></editor>
    <editor projectPath="namespace2/project3" docName="doc1" class="col-6"></editor> -->
    <input v-model="newNamespace">
    <input v-model="newRoom">
    <button @click="addEditor">Join Editor</button>
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
      newNamespace: "namespace1/project1",
      newRoom: "doc1",
    }
  },

  methods: {
    addEditor() {
      console.log('addEditor')
      this.editorsConf = [
        ...this.editorsConf,
        {
          namespace: this.newNamespace,
          room: this.newRoom,
        }
      ]
    }
  }
}
</script>
