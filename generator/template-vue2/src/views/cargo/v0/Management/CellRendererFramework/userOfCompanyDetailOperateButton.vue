<template>
  <div class="user-buttons-in-aggrid">
    <el-button type="text" @click="invokePopUserAddForm()"> 新增 </el-button>
    <template v-if="!isEmptyAtOneRow">
      <el-button type="text" @click="invokePopUserEditForm()"> 编辑 </el-button>
      <el-button type="text" class="button-in-grid-danger" @click="invokeDelUserRow"> 删除 </el-button>
      <el-button :class="{'button-in-grid-success':!userStatus,'button-in-grid-warning':userStatus}" type="text" @click="invokeSwitchUserStatus">
        {{ userStatusBtn }}
      </el-button>
    </template>
  </div>
</template>
<script>
export default {
  name: 'UserOfCompanyDetailsOperateButton',
  data() {
    return {
      enableEdit: false,
      userStatus: true, // 启用状态
      userStatusBtn: '停用',
      isEmptyAtOneRow: false
    }
  },
  created() {
  },
  beforeMount() {
    this.initData()
  },
  methods: {
    initData() {
      const data = this.params.data
      if (!this.params.value) {
        this.userStatusBtn = '启用'
        this.userStatus = false
      }
      if (!data.id) {
        this.isEmptyAtOneRow = true
      }
    },
    invokePopUserAddForm() {
      const data = this.params.data
      this.params.context.componentParent.addUser(data.id, data.departmentId)
    },
    invokePopUserEditForm() {
      const data = this.params.data
      this.params.context.componentParent.editUser(data.id)
    },
    invokeDelUserRow() {
      const data = this.params.data
      const self = this
      this.$confirm('你确定要删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.params.context.componentParent.delUser(data.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    invokeSwitchUserStatus() {
      const data = this.params.data
      this.params.context.componentParent.switchUserStatus(data.id, !data.bActive)
    }
  }
}
</script>
<style scoped>
  .enable{
    color:#7EBA0D;
  }
  .disable{
    color:#F03442;
  }
  .user-buttons-in-aggrid .el-button{
    padding: 0;
  }
</style>

