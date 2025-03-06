<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button v-show="params.data.declareStatus === 2"  type="text" size="mini" @click="params.context.componentParent.confirm(params.data.id)">{{$t('common.confirmBtn')}}</el-button>
  </div>
</template>
<script>
import {manifestDeclareStatusApi} from "@/api/charteredBoat/preManifest"

export default {
  name: 'ReleaseBillListOperationBtn',
  data() {
    return {

    }
  },
  beforeMount() {
  },
  methods: {
    async editPreInfo(_obj, type) {

    }
  }
}
</script>
<style>
.edi-operation-button-in-aggrid .el-button{
  padding: 0;
}
</style>
