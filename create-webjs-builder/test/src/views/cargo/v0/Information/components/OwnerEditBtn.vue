<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="editOwner">编辑</el-button>
  </div>

</template>
<script>
export default {
  name: 'OwnerEditBtn',
  data() {
    return {
      showDialog: false
    }
  },
  beforeMount() {
  },
  methods: {
    editOwner() {
      this.params.showEditDialog(this.params.data.id)
    }
  }
}
</script>
<style>
</style>
