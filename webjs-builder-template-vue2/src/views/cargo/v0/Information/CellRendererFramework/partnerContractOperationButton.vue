<template>
  <div class="partner-contract-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerContract">编辑</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerContract">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerContractOperationButton',
  methods: {
    invokeToDeletePartnerContract() {
      this.params.context.componentParent.toDeletePartnerContract(this.params.data.id)
    },
    invokeToEditPartnerContract() {
      this.params.context.componentParent.toEditPartnerContract(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-contract-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
