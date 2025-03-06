<template>
	<span @click="viewFn" class="link">
    {{params.data.blNo}}
	</span>
</template>
<script>
export default {
	name: "UexpressOutboundNoComponent",
	data() {
		return {};
	},
  methods: {
    viewFn() {
      let blId = this.params.data.bolDto ? this.params.data.bolDto.id : this.params.data.id
      this.$router.push({
        name: 'UexpressBLDetail',
        params: {
          blId: blId
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

