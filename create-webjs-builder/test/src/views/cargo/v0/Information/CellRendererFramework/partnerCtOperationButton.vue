<template>
  <div class="partner-ct-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerCt">编辑</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerCt">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerCtOperationButton',
  methods: {
    invokeToDeletePartnerCt() {
      this.params.context.componentParent.toDeletePartnerCt(this.params.data.id)
    },
    invokeToEditPartnerCt() {
      this.params.context.componentParent.toEditPartnerCt(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-ct-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
