<template>
  <div class="partner-account-operation-button-in-aggrid">
    <el-button v-permission="['cfg:template:add']" type="text" size="mini" @click="invokeAdd">新增</el-button>
    <template v-if="!isEmpty">
      <el-button v-show="!bInit" v-permission="['cfg:template:update']" type="text" size="mini" @click="invokeEdit">编辑</el-button>
      <el-button v-permission="['cfg:template:copy']" type="text" size="mini" @click="invokeCopy">复制</el-button>
      <el-button v-permission="['cfg:template:reportview']" type="text" size="mini" style="color:#e6a23c" @click="invokeView">预览</el-button>
      <el-button v-permission="['cfg:template:reportdesign']" type="text" size="mini" style="color:#67c23a" @click="invokeDesign">设计</el-button>
      <el-button v-show="!bInit" v-permission="['cfg:template:del']" type="text" size="mini" style="color:#f78989" @click="invokeDel">删除</el-button>
    </template>
  </div>

</template>
<script>
export default {
  name: 'ReportOptBtn',
  data() {
    return {
      isEmpty: false,
      bInit: false
    }
  },
  beforeMount() {
    this.initData()
  },
  methods: {
    initData() {
      const data = this.params.data
      if (!data.id) {
        this.isEmpty = true
      } else {
        this.bInit = data.bInit
      }
    },
    invokeDel() {
      this.$confirm('确认删除该报表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.params.context.componentParent.delReport(this.params.data.id)
      }).catch(() => {
        this.$message.error('取消删除')
      })
    },
    invokeAdd() {
      this.params.context.componentParent.popAddReportFormDialog(this.params.data.templateTypeCode)
    },
    invokeCopy() {
      this.params.context.componentParent.popCopyReportFormDialog(this.params.data)
    },
    invokeEdit() {
      this.params.context.componentParent.popEditReportFormDialog(this.params.data)
    },
    invokeView() {
      this.params.context.componentParent.toShowReport(this.params.data.id, 'view')
    },
    invokeDesign() {
      this.params.context.componentParent.toDesignReport(this.params.data.id, 'edit')
    }
  }
}
</script>
<style>
  .partner-account-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
