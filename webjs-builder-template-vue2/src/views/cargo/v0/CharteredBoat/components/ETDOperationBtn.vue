<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button
      type="text"
      size="mini"
      @click="params.context.componentParent.edit(params.data.id)"
    >
      {{ $t('common.editBtn') }}
    </el-button>
    <el-button
      v-if="params.data.sailingStatus===-1"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.release(params.data.id)"
    >
      {{ $t('common.publishBtn') }}
    </el-button>
    <el-button
      v-if="params.data.sailingStatus==2"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.release(params.data.id)"
    >
      {{ $t('boatEtdList.onShelvesBtn') }}
    </el-button>
    <el-button
      v-if="params.data.sailingStatus==1"
      type="text"
      size="mini"
      style="color:#f78989"
      @click="params.context.componentParent.scheduleInfoUndercarriage(params.data.id)"
    >
      {{ $t('boatEtdList.offShelvesBtn') }}
    </el-button>
    <el-button
      v-if="params.data.sailingStatus==-1"
      type="text"
      size="mini"
      style="color:#f78989"
      @click="params.context.componentParent.del(params.data.id)"
    >
      {{ $t('common.deleteBtn') }}
    </el-button>
<!--    <el-button-->
<!--      type="text"-->
<!--      size="mini"-->
<!--      @click="params.context.componentParent.showfreeCabinet(params.data)"-->
<!--       {{$t('boatEtdList.withoutContainerConfig')}}-->
<!--    </el-button>-->
  </div>
</template>
<script>
export default {
  name: 'ETDOperationBtn',
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
