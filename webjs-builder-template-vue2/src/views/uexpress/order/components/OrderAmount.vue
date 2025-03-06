<template>
	<div>
    <span v-for="(item, index) in (params.data.totalAmounts || [])" :key="index">
      <span>{{item.currency}}&nbsp;{{item.value | numberToThousands}}</span>
    </span>
  </div>
</template>
<script>
export default {
	name: "OrderAmount",
	data() {
		return {};
	},
  methods: {

  }
};
</script>
<style lang="scss" scoped>

</style>

