<template>
	<span @click="viewFn" class="link">
    {{params.data.memberOrderNo}}
	</span>
</template>
<script>
export default {
	name: "MemberOrderNoComponent",
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

