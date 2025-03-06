<template>
  <div class="role-operation-button-in-aggrid" v-if="!params.data.bSystem">
    <el-button v-permission="['sys:role:view']" size="mini" type="text" @click="invokeToEditRole">编辑</el-button>
    <el-button v-permission="['sys:role:del']" size="mini" type="text" style="color:#f78989;" @click="invokeToDeleteRole">删除</el-button>
    <el-button v-if="params.data.bActive" v-permission="['sys:role:enable']" size="mini" type="text" style="color:#e6a23c" @click="invokeDisableRole">停用</el-button>
    <el-button v-else v-permission="['sys:role:enable']" size="mini" type="text" style="color:#67c23a" @click="invokeEnableRole">启用</el-button>
    <el-button v-permission="['sys:role:viewprivilege']" size="mini" type="text" style="" @click="invokeToAuthorizeRole">权限</el-button>
    <el-button v-permission="['sys:role:copy']" size="mini" type="text" style="" @click="invokeToCopyRole">复制</el-button>
    <el-button v-permission="['sys:role:assignuser']" size="mini" type="text" style="" @click="invokeToAssignUser">分配用户</el-button>
  </div>
</template>
<script>
export default {
  name: 'RoleOperationButton',
  methods: {
    invokeToEditRole() {
      this.params.context.componentParent.toEditRole(this.params.data.id)
    },
    invokeToDeleteRole() {
      this.params.context.componentParent.toDeleteRole(this.params.data.id)
    },
    invokeEnableRole() {
      this.params.context.componentParent.enableRole(this.params.data.id)
    },
    invokeDisableRole() {
      this.params.context.componentParent.disableRole(this.params.data.id)
    },
    invokeToAuthorizeRole() {
      this.params.context.componentParent.toAuthorizeRole(this.params.data.id, this.params.data.name, this.params.data.description)
    },
    editRole() {
      this.params.context.componentParent.toEditRolePage(this.params.data.id, this.params.data.name, this.params.data.description)
    },
    invokeToAssignUser() {
      this.params.context.componentParent.toAssignUser(this.params.data.id)
    },
    invokeToCopyRole() {
      this.params.context.componentParent.toCopyRole(this.params.data.id, this.params.data.name)
    }
  }
}
</script>

<style>
  .role-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
