<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button v-show="params.data.declareStatus === 2"  type="text" size="mini" @click="editPreInfo(params.data,'edit')">{{$t('common.editBtn')}}</el-button>
    <el-button type="text" size="mini" @click="editPreInfo(params.data,'preview')">{{$t('common.viewBtn')}}</el-button>
  </div>
</template>
<script>
import {manifestDeclareStatusApi} from "@/api/charteredBoat/preManifest"

export default {
  name: 'PreManifestListOperationBtn',
  data() {
    return {

    }
  },
  beforeMount() {
  },
  methods: {
    async editPreInfo(_obj, type) { // 编辑
      if (type === 'edit') {
        const res = await manifestDeclareStatusApi({id: _obj.id})
        if (res.ok) {
          this.$router.push({name: 'PreManifestInfo', query: {id: _obj.id }})
        }
      } else {
        this.$router.push({name: 'PreManifestInfo', query: {id: _obj.id, type }})
      }
    }
  }
}
</script>
<style>
  .edi-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
