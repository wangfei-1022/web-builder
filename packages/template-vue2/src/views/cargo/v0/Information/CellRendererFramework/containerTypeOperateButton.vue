<template>
  <div class="container-management-buttons-in-aggrid">
    <el-button v-permission="['mdm:container:enable']" :class="{'button-in-grid-success':!containerStatus,'button-in-grid-warning':containerStatus}" size="mini" type="text" @click="invokeSwitchContainerStatus">
      {{ containerStatusBtn() }}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'ContainerManagementOperateButtonCellRendererFramework',
  data() {
    return {
      containerStatus: true // 启用状态
    }
  },
  created() {
  },
  methods: {
    containerStatusBtn() {
      let val = '停用'
      if (!this.params.value) {
        val = '启用'
        this.containerStatus = false
      }
      return val
    },
    invokeSwitchContainerStatus() {
      const data = this.params.data
      this.params.context.componentParent.switchContainerTypeStatus(data.id, !data.bActive)
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
  .container-management-buttons-in-aggrid .el-button{
    padding: 0;
  }
</style>

