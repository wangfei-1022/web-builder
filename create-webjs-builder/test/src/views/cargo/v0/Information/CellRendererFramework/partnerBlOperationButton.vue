<template>
  <div class="partner-bl-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerBl">编辑</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerBl">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerBlOperationButton',
  methods: {
    invokeToDeletePartnerBl() {
      this.params.context.componentParent.toDeletePartnerBl(this.params.data.id)
    },
    invokeToEditPartnerBl() {
      this.params.context.componentParent.toEditPartnerBl(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-bl-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
