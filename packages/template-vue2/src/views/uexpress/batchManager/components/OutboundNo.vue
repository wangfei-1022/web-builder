<template>
	<div @click="viewFn" class="link">
    {{params.data.outboundNo}}
	</div>
</template>
<script>
export default {
	name: "UexpressOutboundNoComponent",
	data() {
		return {};
	},
  methods: {
    viewFn() {
      let outboundId = this.params.data.outboundDto ? this.params.data.outboundDto.id : this.params.data.id
      let shardingKey = this.params.data.outboundDto ? this.params.data.outboundDto.shardingKey : this.params.data.shardingKey
      this.$router.push({
        name: 'UexpressBatchDetail',
        params: {
          outboundId: outboundId,
          shardingKey: shardingKey
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.link{
  color: '#1890ff';
  cursor: pointer;
}
</style>

