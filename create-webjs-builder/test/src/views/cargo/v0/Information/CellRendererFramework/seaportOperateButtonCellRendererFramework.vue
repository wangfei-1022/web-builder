<template>
  <div class="seaPort-management-buttons-in-aggrid">
    <el-button v-permission="['mdm:seaport:view']" size="mini" type="text" @click="invokePopSeaPortForm"> 编辑 </el-button>
    <!--<el-button v-permission="['mdm:seaport:del']" size="mini" type="text" class="button-in-grid-danger" @click="invokeDelSeaPortRow"> 删除 </el-button>-->
    <el-button v-permission="['mdm:seaport:enable']" :class="{'button-in-grid-success':!seaPortStatus,'button-in-grid-warning':seaPortStatus}" size="mini" type="text" @click="invokeSwitchSeaPortStatus">
      {{ seaPortStatusBtn() }}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'SeaportOperateButtonCellRendererFramework',
  data() {
    return {
      seaPortStatus: true // 启用状态
    }
  },
  created() {
  },
  methods: {
    seaPortStatusBtn() {
      let val = '停用'
      if (!this.params.value) {
        val = '启用'
        this.seaPortStatus = false
      }
      return val
    },
    invokePopSeaPortForm() {
      const data = this.params.data
      this.params.context.componentParent.popSeaPortFormDialog(data.id)
    },
    invokeDelSeaPortRow() {
      const data = this.params.data
      const self = this
      this.$confirm('你确定要删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.params.context.componentParent.delSeaPort(data.id)
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
    invokeSwitchSeaPortStatus() {
      const data = this.params.data
      this.params.context.componentParent.switchSeaPortStatus(data.id, !data.bActive)
    }
  }
}
</script>
<style scoped>
  .seaPort-management-buttons-in-aggrid .el-button{
    padding: 0;
  }
</style>

