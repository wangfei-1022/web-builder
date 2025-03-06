<template>
  <div class="edi-config-buttons-in-aggrid">
    <el-button v-permission="['sys:ediconfig:add']" type="text" size="mini" @click="invokeAdd">新增</el-button>
    <template v-if="!isEmpty">
      <el-button v-permission="['sys:ediconfig:view']" size="mini" type="text" @click="invokeEdit"> 编辑 </el-button>
      <el-button v-permission="['sys:ediconfig:del']" size="mini" type="text" @click="invokeDel"> 删除 </el-button>
    </template>
  </div>
</template>
<script>
import { deleteConfirm } from '@/utils/utilBaseElement'

export default {
  name: 'EdiConfigOptBtn',
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
      this.params.context.componentParent.popAddEdiConfigFormDialog()
    },
    invokeDel() {
      deleteConfirm(this, () => {
        this.params.context.componentParent.delEdiConfig(this.params.data.id)
      })
    },
    invokeEdit() {
      this.params.context.componentParent.popEditEdiConfigFormDialog(this.params.data)
    }
  }
}
</script>
<style scoped>
  .edi-config-buttons-in-aggrid .el-button{
    padding: 0;
  }
</style>

