<template>
	<span @click="viewFn" class="link">
    {{params.data.channelOrderNo || params.data.orderChannelNo || params.data.chancelOrderNo}}
	</span>
</template>
<script>
export default {
	name: "OrderChannelNoComponent",
	data() {
		return {};
	},
  methods: {
    viewFn() {
      this.$router.push({
        name: 'UexpressOrderDetail',
        params: {
          orderId: this.params.data.salesOrderId || this.params.data.orderId,
          shardingKey: this.params.data.shardingKey || this.params.data.orderSk
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.link{
  color: #1890ff;
  cursor: pointer;
}
</style>

