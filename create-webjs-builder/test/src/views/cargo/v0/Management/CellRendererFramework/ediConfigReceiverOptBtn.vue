<template>
  <div class="edi-config-buttons-in-aggrid">
    <el-button type="text" @click="invokeAdd">新增</el-button>
    <template v-if="!isEmpty">
      <!--<el-button size="mini" type="text" @click="invokeEdit"> 编辑 </el-button>-->
      <el-button size="mini" type="text" @click="invokeDel"> 删除 </el-button>
    </template>
  </div>
</template>
<script>
export default {
  name: 'EdiConfigReceiverOptBtn',
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
    invokeAdd() {
      this.params.context.componentParent.addEdiReceiver()
    },
    invokeDel() {
      this.params.context.componentParent.delEdiReceiver(this.params.data.id, this.params.node.rowIndex)
    },
    invokeEdit() {
      // this.params.context.componentParent.popEditEdiConfigFormDialog(this.params.data)
    }
  }
}
</script>
<style scoped>
  .edi-config-buttons-in-aggrid .el-button{
    padding: 0;
  }
</style>

