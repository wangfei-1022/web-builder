<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button
      v-permission="['edi:mapping:update']"
      type="text"
      size="mini"
      class="ml-10"
      @click="edit()"
    >
      编辑
    </el-button>
    <el-button
      v-permission="['edi:mapping:delete']"
      type="text"
      size="mini"
      style="color:#f78989"
      @click="del()"
    >
      删除
    </el-button>
    <el-button
      type="text"
      size="mini"
      @click="copyAdd()"
    >
      复制新增
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'EdiMappingBtn',
  data() {
    return {

    }
  },
  beforeMount() {
  },
  methods: {
    // 复制新增
    copyAdd() {
      const data = this.params.data
      this.params.context.componentParent.copyAdd(data)
    },
    // 编辑
    edit() {
      const data = this.params.data
      this.params.context.componentParent.edit(data.id)
    },
    // 删除
    del() {
      const data = this.params.data
      this.params.context.componentParent.del(data.id)
    }

  }
}
</script>
<style>
  .edi-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
