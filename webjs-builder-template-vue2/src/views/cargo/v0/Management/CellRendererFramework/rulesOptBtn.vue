<template>
  <div class="rules-management-buttons-in-aggrid">
    <el-button v-permission="['sys:rules:copy']" size="mini" type="text" @click="invokePopRulesForm(true)"> 复制 </el-button>
    <el-button v-permission="['sys:rules:view']" size="mini" type="text" @click="invokePopRulesForm()"> 编辑 </el-button>
    <el-button v-permission="['sys:rules:del']" size="mini" type="text" class="button-in-grid-danger" @click="invokeDelRulesRow"> 删除 </el-button>
    <el-button v-permission="['sys:rules:enable']" :class="{'button-in-grid-success':!rulesStatus,'button-in-grid-warning':rulesStatus}" size="mini" type="text" @click="invokeSwitchRulesStatus">
      {{ rulesStatusBtn() }}
    </el-button>
    <!--<el-button v-show="params.data.bShowAssignUser" v-permission="['sys:rules:enable']" size="mini" type="text" @click="invokeToAssignUser"> 分配用户 </el-button>-->
  </div>
</template>
<script>
export default {
  name: 'RuleOptBtn',
  data() {
    return {
      rulesStatus: true // 启用状态
    }
  },
  created() {
  },
  methods: {
    rulesStatusBtn() {
      let val = '停用'
      if (!this.params.value) {
        val = '启用'
        this.rulesStatus = false
      }
      return val
    },
    invokePopRulesForm(isCopy) {
      const data = this.params.data
      this.params.context.componentParent.popRulesFormDialog(data.id, isCopy)
    },
    invokeDelRulesRow() {
      const data = this.params.data
      const self = this
      this.$confirm('你确定要删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.params.context.componentParent.delRules(data.id)
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
    invokeSwitchRulesStatus() {
      const data = this.params.data
      this.params.context.componentParent.switchRulesStatus(data.id, !data.bActive)
    },
    invokeToAssignUser() {
      this.params.context.componentParent.toAssignUser(this.params.data.id)
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
  .rules-management-buttons-in-aggrid .el-button{
    padding: 0;
  }
</style>

