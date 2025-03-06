<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button
      v-if="params.data.status===2 || params.data.status===4"
      type="text"
      size="mini"
      @click="params.context.componentParent.edit(params.data.id,'examine')"
    >
      {{ $t('common.auditBtn') }}
    </el-button>
    <el-button
      v-if="params.data.status===3 || params.data.status===5 || params.data.status===7"
      type="text"
      size="mini"
      @click="params.context.componentParent.edit(params.data.id,'edit')"
    >
      {{ $t('common.editBtn') }}
    </el-button>
    <el-button
      v-if="params.data.status===3 || params.data.status===5 || params.data.status===6 || params.data.status===7"
      type="text"
      size="mini"
      @click="params.context.componentParent.showPrint(params.data)"
    >
      {{ $t('common.issue') }}
    </el-button>
    <el-button
      v-if="params.data.status===3 && params.data.declareType===1 && params.data.declareStatus!==3"
      type="text"
      size="mini"
      @click="params.context.componentParent.inputInfo(params.data)"
    >
      {{$t('boatBlList.recordMBL')}}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'BilOperationBtn',
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
