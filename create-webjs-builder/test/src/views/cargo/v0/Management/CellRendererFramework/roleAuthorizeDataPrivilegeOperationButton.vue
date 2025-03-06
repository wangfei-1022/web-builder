<template>
  <div class="role-auth-data-privilege-button-in-aggrid">
    <template v-if="isNotGroupRow">
      <el-button size="mini" type="text" style="color:#67c23a" @click="invokeToAdd">添加</el-button>
      <el-button size="mini" type="text" style="color:#67c23a" @click="invokeToAddCurrent">添加{{ typeCurrent === 'OFFICE' ? '本公司' : typeCurrent === 'DEPARTMENT' ? '本部门' : '本人' }}</el-button>
    </template>
    <template v-else>
      <el-button size="mini" type="text" style="color:#f78989;" @click="invokeRemove">移除</el-button>
    </template>
  </div>
</template>
<script>
export default {
  name: 'RoleAuthorizeDataPrivilegeOperationButton',
  computed: {
    isNotGroupRow() {
      // 分组得到的行没有data，没分组但id为null的行 --- 这两种情况都显示<添加>按钮
      return !this.params.data || !this.params.data.id
    },
    typeCurrent() {
      const params = this.params
      const permissionDimension = params.data ? params.data.permissionDimension : params.node.allLeafChildren[0].data.permissionDimension
      return permissionDimension.split('_').pop()
    }
  },
  methods: {
    deConstruct(params) {
      const privilegeCode = params.data ? params.data.privilegeCode : params.node.allLeafChildren[0].data.privilegeCode
      const permissionDimension = params.data ? params.data.permissionDimension : params.node.allLeafChildren[0].data.permissionDimension
      const type = permissionDimension.split('_').pop()
      return { privilegeCode, permissionDimension, type }
    },
    invokeToAdd() {
      this.params.context.componentParent.toAddDataPrivilege(this.deConstruct(this.params))
    },
    invokeToAddCurrent() {
      this.params.context.componentParent.toGrantDataPrivilegeToCurrent(this.deConstruct(this.params))
    },
    invokeRemove() {
      // todo 待改
      this.params.context.componentParent.toRemoveDataPrivilege(this.params.data.id, this.params.data.privilegeCode)
    }
  }
}
</script>

<style>
  .role-auth-data-privilege-in-aggrid .el-button{
    padding: 0;
  }
</style>
