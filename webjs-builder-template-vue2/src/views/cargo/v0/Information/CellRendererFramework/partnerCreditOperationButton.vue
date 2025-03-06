<template>
  <div class="partner-credit-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerCredit">编辑</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerCredit">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerCreditOperationButton',
  methods: {
    invokeToDeletePartnerCredit() {
      this.params.context.componentParent.toDeletePartnerCredit(this.params.data.id)
    },
    invokeToEditPartnerCredit() {
      this.params.context.componentParent.toEditPartnerCredit(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-credit-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
