<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button
      v-permission="['cfg:template:scheme:update']"
      type="text"
      size="mini"
      @click="add()"
    >
      新增
    </el-button>
    <el-button
      v-permission="['cfg:template:scheme:update']"
      type="text"
      size="mini"
      class="ml-10"
      @click="edit()"
    >
      编辑
    </el-button>
    <!-- <el-button
      v-permission="['cfg:template:scheme:del']"
      type="text"
      size="mini"
      style="color:#f78989"
      @click="del()"
    >
      删除
    </el-button> -->
  </div>
</template>
<script>
export default {
  name: 'SchemeOptBtn',
  data() {
    return {

    }
  },
  beforeMount() {
  },
  methods: {
    // 新增
    add() {
      this.params.context.componentParent.edit()
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
