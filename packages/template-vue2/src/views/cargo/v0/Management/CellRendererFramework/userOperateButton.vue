<template>
  <div class="user-management-buttons-in-aggrid">
    <el-button v-permission="['sys:user:view']" type="text" size="mini" style="" @click="invokeToEditUser">编辑</el-button>
    <el-button v-if="params.data.bActive" v-permission="['sys:user:enable']" type="text" size="mini" style="color:#e6a23c" @click="invokeDisableUser">停用</el-button>
    <el-button v-else v-permission="['sys:user:enable']" type="text" size="mini" style="color:#67c23a" @click="invokeEnableUser">启用</el-button>
    <el-button v-permission="['sys:user:assignrole']" type="text" size="mini" @click="invokeToAssignRole" v-if="!params.data.bAdministrator">分配角色</el-button>
    <!--<el-button v-permission="['sys:user:assignrule']" type="text" size="mini" @click="invokeToAssignRule">分配编号规则</el-button>-->
  </div>
</template>
<script>
export default {
  name: 'UserOperateButton',
  methods: {
    invokeToEditUser() {
      const data = this.params.data
      this.params.context.componentParent.toEditUser(data.id)
    },
    invokeEnableUser() {
      const data = this.params.data
      this.params.context.componentParent.enableUser(data.id)
    },
    invokeDisableUser() {
      const data = this.params.data
      this.params.context.componentParent.disableUser(data.id)
    },
    invokeToAssignRole() {
      this.params.context.componentParent.toAssignRole(this.params.data.id)
    },
    invokeToAssignRule() {
      this.params.context.componentParent.toAssignRule(this.params.data.id)
    }
  }
}
</script>
<style scoped>
  .user-management-buttons-in-aggrid .el-button--mini{
    padding: 0
  }
</style>
