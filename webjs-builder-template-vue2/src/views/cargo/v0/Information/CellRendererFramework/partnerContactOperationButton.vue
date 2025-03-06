<template>
  <div class="partner-contact-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToEditPartnerContact">编辑</el-button>
    <el-button v-if="params.data.bActive" size="mini" type="text" style="color:#e6a23c" @click="invokeDisablePartnerContact">停用</el-button>
    <el-button v-else size="mini" type="text" style="color:#67c23a" @click="invokeEnablePartnerContact">启用</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerContact">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerContactOperationButton',
  methods: {
    invokeToDeletePartnerContact() {
      this.params.context.componentParent.toDeletePartnerContact(this.params.data.id)
    },
    invokeToEditPartnerContact() {
      this.params.context.componentParent.toEditPartnerContact(this.params.data.id)
    },
    invokeDisablePartnerContact() {
      this.params.context.componentParent.disablePartnerContact(this.params.data.id)
    },
    invokeEnablePartnerContact() {
      this.params.context.componentParent.enablePartnerContact(this.params.data.id)
    }
    //      invokeSubmitPartner() {
    //        this.params.context.componentParent.submitPartner(this.params.data.id)
    //      },
    //      invokeUnSubmitPartner() {
    //        this.params.context.componentParent.unSubmitPartner(this.params.data.id)
    //      },
    //      invokeAcceptPartner() {
    //        this.params.context.componentParent.acceptPartner(this.params.data.id)
    //      },
    //      invokeUnAcceptPartner() {
    //        this.params.context.componentParent.unAcceptPartner(this.params.data.id)
    //      },
    //      invokeToEditPartner() {
    //        this.params.context.componentParent.toEditPartner(this.params.data.id)
    //      }
  }
}
</script>
<style>
  .partner-contact-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
