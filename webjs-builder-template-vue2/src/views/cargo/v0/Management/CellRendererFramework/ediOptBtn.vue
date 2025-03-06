<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button v-permission="['sys:editemplate:add']" type="text" size="mini" @click="invokeAdd">新增</el-button>
    <template v-if="!isEmpty">
      <el-button v-permission="['sys:editemplate:copy']" type="text" size="mini" @click="invokeCopy">复制</el-button>
      <template v-if="!params.data.bSystem">
        <el-button v-permission="['sys:editemplate:view']" type="text" size="mini" @click="invokeEdit">编辑</el-button>
        <!--<el-button type="text" @click="invokeCopy">复制</el-button>-->
        <el-button v-permission="['sys:editemplate:del']" type="text" size="mini" style="color:#f78989" @click="invokeDel">删除</el-button>
        <el-button v-permission="['sys:editemplate:templatedesign']" type="text" size="mini" style="color:#67c23a" @click="invokeDesign">设计</el-button>
      </template>
      <el-button v-permission="['sys:editemplate:templateview']" type="text" size="mini" style="color:#e6a23c" @click="invokeView">预览</el-button>
    </template>
  </div>

</template>
<script>
export default {
  name: 'EdiOptBtn',
  data() {
    return {
      isEmpty: false
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
      }
    },
    invokeDel() {
      this.$confirm('确认删除该报表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.params.context.componentParent.delEdi(this.params.data.id)
      }).catch(() => {
        this.$message.error('取消删除')
      })
    },
    invokeAdd() {
      this.params.context.componentParent.popAddEdiFormDialog(this.params.data.templateTypeCode)
    },
    invokeCopy() {
      this.params.context.componentParent.popCopyEdiFormDialog(this.params.data)
    },
    invokeEdit() {
      this.params.context.componentParent.popEditEdiFormDialog(this.params.data)
    },
    invokeView() {
      this.params.context.componentParent.toShowEdi(this.params.data.id, 'view')
    },
    invokeDesign() {
      this.params.context.componentParent.toDesignEdi(this.params.data.id, 'edit')
    }
  }
}
</script>
<style>
  .edi-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
