<template>
  <div class="option-btn-wrap">
    <el-button
      size="mini"
      type="text"
      v-if="params.data.abnormalityState === 1"
      @click="params.context.componentParent.redeliveryFn(params.data)"
    >
      {{$t('uexpressOrder.redelivery')}}
    </el-button>

  </div>
</template>
<script>
import { cancelOrderApi } from '@/api/uexpress/orderManager'
export default {
  name: "OrderListOptionBtn",
  data() {
    return {};
  },
  computed: {
    showCancel() {
      return this.params.data.orderState === 100 || this.params.data.orderState === 110
    }
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
  span {
    cursor: pointer;
  }
}
</style>

