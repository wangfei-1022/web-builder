<template>
  <div class="edi-operation-button-in-aggrid">
    <!--      订舱状态-1草稿1待审核2已通过3已驳回4已取消    -->
    <el-button v-if="params.data.status===2" type="text" size="mini" @click="params.context.componentParent.edit(params.data)">
      {{$t('common.editBtn')}}
    </el-button>
    <el-button v-if="params.data.status===1" type="text" size="mini" @click="params.context.componentParent.audit(params.data)">
      {{$t('common.auditBtn')}}
    </el-button>
    <el-button v-if="params.data.status===2" type="text" size="mini" @click="params.context.componentParent.download(params.data)">
      {{$t('common.download')}}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'BookOperationBtn',
  data() {
    return {

    }
  },
  beforeMount() {
  },
  methods: {

  }
}
</script>
<style>
  .edi-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
