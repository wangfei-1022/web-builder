<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button type="text" size="mini" @click="params.context.componentParent.detailFn(params.data)">
      {{$t("rechargeRecord.view")}}
    </el-button>
    <el-button
      v-if="params.data.rechargeState === 20"
      type="text" size="mini"
      class="ml-10"
      @click="params.context.componentParent.auditFn(params.data, true)">
      {{$t("rechargeRecord.audit")}}
    </el-button>
    <!-- handleFeeStatus === 0 未补充过手续费 -->
    <el-button
      v-if="params.data.rechargeState === 40 && params.data.handleFeeStatus === 0"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.supplyFn(params.data, true)">
      {{$t("rechargeRecord.supply")}}
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
