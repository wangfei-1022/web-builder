<template>
  <div class="partner-operation-button-in-aggrid">
    <el-button v-if="params.data.bActive" v-permission="['mdm:partner:enable']" type="text" size="mini" style="color:#e6a23c" @click="invokeDisablePartner">停用</el-button>
    <el-button v-else v-permission="['mdm:partner:enable']" type="text" size="mini" style="color:#67c23a" @click="invokeEnablePartner">启用</el-button>
    <el-button v-if="params.data.acceptStatus === 0" v-permission="['mdm:partner:submit']" type="text" size="mini" @click="invokeSubmitPartner">提交</el-button>
    <el-button v-if="params.data.acceptStatus === 1" v-permission="['mdm:partner:submit']" type="text" size="mini" @click="invokeUnSubmitPartner">取消提交</el-button>
    <el-button v-if="params.data.acceptStatus === 1" v-permission="['mdm:partner:check']" type="text" size="mini" @click="invokeAcceptPartner">审核</el-button>
    <el-button v-if="params.data.acceptStatus === 2" v-permission="['mdm:partner:check']" type="text" size="mini" @click="invokeUnAcceptPartner">取消审核</el-button>
    <el-button v-permission="['mdm:partner:view']" type="text" size="mini" @click="invokeToEditPartner">编辑</el-button>
    <el-button v-permission="['mdm:partner:del']" type="text" size="mini" style="color:#f78989" @click="invokeToDeletePartner">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerOperationButton',
  methods: {
    invokeEnablePartner() {
      this.params.context.componentParent.enablePartner(this.params.data.id)
    },
    invokeDisablePartner() {
      this.params.context.componentParent.disablePartner(this.params.data.id)
    },
    invokeSubmitPartner() {
      this.params.context.componentParent.submitPartner(this.params.data.id)
    },
    invokeUnSubmitPartner() {
      this.params.context.componentParent.unSubmitPartner(this.params.data.id)
    },
    invokeAcceptPartner() {
      this.params.context.componentParent.acceptPartner(this.params.data.id)
    },
    invokeUnAcceptPartner() {
      this.params.context.componentParent.unAcceptPartner(this.params.data.id)
    },
    invokeToEditPartner() {
      this.params.context.componentParent.toEditPartner(this.params.data.id)
    },
    invokeToDeletePartner() {
      this.params.context.componentParent.toDeletePartner(this.params.data.id)
    }
  }
}
</script>
<style>
  .partner-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
