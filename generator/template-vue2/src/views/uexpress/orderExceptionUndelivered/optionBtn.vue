<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" @click="params.context.componentParent.followFn(params.data)">
      {{$t('uexpressOrder.follow')}}
    </el-button>
    <el-button type="text" size="mini" @click="params.context.componentParent.viewTrackFn(params.data)">
      {{$t('uexpressOrder.viewTrack')}}
    </el-button>
  </div>
</template>

<script>
export default {
  name: "OrderExceptionUndeliveredOptionBtn",
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>

</style>

