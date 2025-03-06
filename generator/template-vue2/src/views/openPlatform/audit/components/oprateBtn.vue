<template>
  <div class="option-btn-wrap">
    <el-button
      type="text"
      size="mini"
      class="fc-red"
      v-if="params.data.signStatus === 3"
      @click="params.context.componentParent.failureData(params.data.id)"
    >
      {{$t("openPlatform.failure")}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.signStatus === 2"
      @click="params.context.componentParent.viewFn(params.data.id)"
    >
      {{$t("openPlatform.aduit")}}
    </el-button>
  </div>
</template>
<script>
export default {
	name: "OpenPlatformProductOptionBtn",
	data() {
		return {}
	},
	methods: {

	}
}
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

