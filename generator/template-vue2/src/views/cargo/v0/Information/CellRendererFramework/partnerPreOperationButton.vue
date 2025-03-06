<template>
  <div class="partner-pre-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerPre">编辑</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerPre">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerPreOperationButton',
  methods: {
    invokeToDeletePartnerPre() {
      this.params.context.componentParent.toDeletePartnerPre(this.params.data.id)
    },
    invokeToEditPartnerPre() {
      this.params.context.componentParent.toEditPartnerPre(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-pre-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
