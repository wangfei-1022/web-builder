<template>
  <div class="partner-position-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerPosition">编辑</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerPosition">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerPositionOperationButton',
  methods: {
    invokeToDeletePartnerPosition() {
      this.params.context.componentParent.toDeletePartnerPosition(this.params.data.id)
    },
    invokeToEditPartnerPosition() {
      this.params.context.componentParent.toEditPartnerPosition(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-position-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
