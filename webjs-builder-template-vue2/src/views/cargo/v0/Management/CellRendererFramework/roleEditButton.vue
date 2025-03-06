<template>
  <div class="role-operation-button-in-aggrid" v-if="!params.data.bSystem">
    <el-button v-permission="['sys:privilege:add']" size="mini" type="text" @click="addRow">{{$t('common.addBtn')}}</el-button>
    <el-button v-permission="['sys:privilege:update']" size="mini" type="text" @click="editRow">{{$t('common.editBtn')}}</el-button>
    <el-button v-permission="['sys:privilege:delete']" size="mini" type="text" style="color:#f78989;" @click="delRow">{{$t('common.deleteBtn')}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'roleEditButton',
  methods: {
    addRow() {
      this.params.context.componentParent.addRow(this.params.data)
    },
    editRow() {
      this.params.context.componentParent.editRow(this.params.data)
    },
    delRow() {
      this.params.context.componentParent.delRow(this.params.data.id)
    },
  }
}
</script>

<style>
  .role-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
