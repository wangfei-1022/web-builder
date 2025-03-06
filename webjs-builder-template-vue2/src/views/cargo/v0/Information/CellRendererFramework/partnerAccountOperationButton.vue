<template>
  <div class="partner-account-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerAccount">编辑</el-button>
    <el-button v-if="params.data.bActive" size="mini" type="text" style="color:#e6a23c" @click="invokeDisablePartnerAccount">停用</el-button>
    <el-button v-else size="mini" type="text" style="color:#67c23a" @click="invokeEnablePartnerAccount">启用</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerAccount">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerAccountOperationButton',
  methods: {
    invokeToDeletePartnerAccount() {
      this.params.context.componentParent.toDeletePartnerAccount(this.params.data.id)
    },
    invokeToEditPartnerAccount() {
      this.params.context.componentParent.toEditPartnerAccount(this.params.data.id)
    },
    invokeDisablePartnerAccount() {
      this.params.context.componentParent.disablePartnerAccount(this.params.data.id)
    },
    invokeEnablePartnerAccount() {
      this.params.context.componentParent.enablePartnerAccount(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-account-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
