<template>
  <div class="bank-buttons-in-aggrid">
    <el-button type="text" @click="invokePopBankAddForm()"> 新增 </el-button>
    <template v-if="!isEmptyAtOneRow">
      <el-button type="text" @click="invokePopBankEditForm()"> 编辑 </el-button>
      <el-button type="text" class="button-in-grid-danger" @click="invokeDelBankRow"> 删除 </el-button>
      <el-button :class="{'button-in-grid-success':!bankStatus,'button-in-grid-warning':bankStatus}" type="text" @click="invokeSwitchBankStatus">
        {{ bankStatusBtn }}
      </el-button>
    </template>
  </div>
</template>
<script>
export default {
  name: 'BankOfCompanyDetailsOperateButton',
  data() {
    return {
      enableEdit: false,
      bankStatus: true, // 启用状态
      bankStatusBtn: '停用',
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
      if (!data.id) {
        this.isEmptyAtOneRow = true
      }
      if (!this.params.value) {
        this.bankStatusBtn = '启用'
        this.bankStatus = false
      }
    },
    invokePopBankAddForm() {
      this.params.context.componentParent.popBankFormDialog()
    },
    invokePopBankEditForm() {
      const data = this.params.data
      this.params.context.componentParent.popBankFormDialog(data.id)
    },
    invokeDelBankRow() {
      const data = this.params.data
      const self = this
      this.$confirm('你确定要删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.params.context.componentParent.delBank(data.id)
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
    invokeSwitchBankStatus() {
      const data = this.params.data
      this.params.context.componentParent.switchBankStatus(data.id, !data.bActive)
    }
  }
}
</script>
<style scoped>
  .bank-buttons-in-aggrid  .el-button{
    padding: 0;
  }
</style>

