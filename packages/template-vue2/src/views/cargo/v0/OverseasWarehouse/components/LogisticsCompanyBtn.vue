<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button
      type="text"
      size="mini"
      @click="params.context.componentParent.edit(params.data.id,true)"
    >
      {{$t('logisticsCompany.view')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      @click="params.context.componentParent.edit(params.data.id,false)"
    >
      {{$t('logisticsCompany.edit')}}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'LogisticsCompanyBtn',
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
