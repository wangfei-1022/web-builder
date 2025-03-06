<template>
	<span @click="viewFn" class="link">
    {{params.data.boxNo}}
	</span>
</template>
<script>
export default {
	name: "UexpressBoxNoComponent",
	data() {
		return {};
	},
  methods: {
    viewFn() {
      this.$router.push({
        name: 'UexpressBoxDetail',
        params: {
          boxId: this.params.data.id,
          shardingKey: this.params.data.shardingKey
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

