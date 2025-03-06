<template>
  <div class="option-btn-wrap">
    <span
      class="item-api"
      v-for="item in params.data.availableVsersion"
      :key="item.id"
      @click="params.context.componentParent.updateFn(item)">
      {{item.apiVersion}}
    </span>
  </div>
</template>
<script>
export default {
	name: "AvailableVsersion",
	data() {
		return {}
	},
	methods: {

	}
}
</script>
<style lang="scss" scoped>
.item-api {
	margin-right: 10px;
}
</style>

