<template>
  <div class="partner-address-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerAddress">编辑</el-button>
    <el-button v-if="params.data.bActive" size="mini" type="text" style="color:#e6a23c" @click="invokeDisablePartnerAddress">停用</el-button>
    <el-button v-else size="mini" type="text" style="color:#67c23a" @click="invokeEnablePartnerAddress">启用</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerAddress">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerAddressOperationButton',
  methods: {
    invokeToDeletePartnerAddress() {
      this.params.context.componentParent.toDeletePartnerAddress(this.params.data.id)
    },
    invokeToEditPartnerAddress() {
      this.params.context.componentParent.toEditPartnerAddress(this.params.data.id)
    },
    invokeDisablePartnerAddress() {
      this.params.context.componentParent.disablePartnerAddress(this.params.data.id)
    },
    invokeEnablePartnerAddress() {
      this.params.context.componentParent.enablePartnerAddress(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-address-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
