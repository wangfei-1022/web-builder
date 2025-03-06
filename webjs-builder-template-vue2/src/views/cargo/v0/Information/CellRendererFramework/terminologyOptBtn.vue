<template>
  <div class="terminology-management-buttons-in-aggrid">
    <el-button v-permission="['mdm:term:add']" size="mini" type="text" @click="invokePopTerminologyAddForm()"> 新增 </el-button>
    <template v-if="enableEdit">
      <el-button v-permission="['mdm:term:view']" size="mini" type="text" @click="invokePopTerminologyEditForm()"> 编辑 </el-button>
      <el-button v-permission="['mdm:term:del']" size="mini" type="text" class="button-in-grid-danger" @click="invokeDelTerminologyRow"> 删除 </el-button>
      <el-button v-permission="['mdm:term:enable']" :class="{'button-in-grid-success':!terminologyStatus,'button-in-grid-warning':terminologyStatus}" size="mini" type="text" @click="invokeSwitchTerminologyStatus">
        {{ terminologyStatusBtn }}
      </el-button>
    </template>
  </div>
</template>
<script>
export default {
  name: 'TerminologyOptBtn',
  data() {
    return {
      enableEdit: false,
      terminologyStatus: true, // 启用状态
      terminologyStatusBtn: '停用'
    }
  },
  created() {
  },
  beforeMount() {
    this.initData()
  },
  methods: {
    initData() {
      if (!this.params.value) {
        this.terminologyStatusBtn = '启用'
        this.terminologyStatus = false
      }
      if (this.params.data.id && this.params.data.bUserDefined) {
        this.enableEdit = true
      }
    },
    invokePopTerminologyAddForm() {
      // const data = this.params.data
      this.params.context.componentParent.popTerminologyFormDialog()
    },
    invokePopTerminologyEditForm() {
      const data = this.params.data
      this.params.context.componentParent.popTerminologyFormDialog(data.id)
    },
    invokeDelTerminologyRow() {
      const data = this.params.data
      const self = this
      this.$confirm('你确定要删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.params.context.componentParent.delTerminology(data.id)
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
    invokeSwitchTerminologyStatus() {
      const data = this.params.data
      this.params.context.componentParent.switchTerminologyStatus(data.id, !data.bActive)
    }
  }
}
</script>
<style scoped>
  .terminology-management-buttons-in-aggrid .el-button{
    padding: 0;
  }
</style>

