<template>
  <div class="partner-invoice-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerInvoice">编辑</el-button>
    <el-button v-if="params.data.bActive" size="mini" type="text" style="color:#e6a23c" @click="invokeDisablePartnerInvoice">停用</el-button>
    <el-button v-else size="mini" type="text" style="color:#67c23a" @click="invokeEnablePartnerInvoice">启用</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerInvoice">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerInvoiceOperationButton',
  methods: {
    invokeToDeletePartnerInvoice() {
      this.params.context.componentParent.toDeletePartnerInvoice(this.params.data.id)
    },
    invokeToEditPartnerInvoice() {
      this.params.context.componentParent.toEditPartnerInvoice(this.params.data.id)
    },
    invokeDisablePartnerInvoice() {
      this.params.context.componentParent.disablePartnerInvoice(this.params.data.id)
    },
    invokeEnablePartnerInvoice() {
      this.params.context.componentParent.enablePartnerInvoice(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-invoice-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
