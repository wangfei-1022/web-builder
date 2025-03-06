<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button type="text" size="mini" @click="params.context.componentParent.detailFn(params.data)">
      {{$t("rechargeRecord.view")}}
    </el-button>
    <el-button
      v-if="params.data.rechargeState === 10 || params.data.rechargeState === 30"
      type="text" size="mini"
      class="ml-10"
      @click="params.context.componentParent.relativeTransFn(params.data, true)">
      {{$t("rechargeRecord.relativeTrans")}}
    </el-button>
    <el-button
      v-if="params.data.rechargeState === 10 || params.data.rechargeState === 30"
      type="text" size="mini"
      class="ml-10"
      @click="params.context.componentParent.returnApplyFn(params.data, true)">
      {{$t("rechargeRecord.returnApply")}}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'RechargeRecordBtn',
  data() {
    return {

    }
  }
}
</script>
<style>

</style>
