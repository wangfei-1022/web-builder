<template>
  <div class="option-btn-wrap">
    <el-button
      v-if="params.data.status == 0"
      type="text"
      size="mini"
      class="ml-10"
      v-permission="['dmn:fee:item:draft:update']"
      @click="params.context.componentParent.editFn(params.data)"
    >
      {{ $t("feeItem.edit") }}
    </el-button>
    <el-button
      v-if="params.data.status == 0"
      type="text"
      size="mini"
      class="ml-10"
      v-permission="['dmn:fee:item:draft:delete']"
      @click="params.context.componentParent.deleteFn(params.data)"
    >
      {{ $t("feeItem.delete") }}
    </el-button>
    <el-button
      v-if="params.data.status == 10"
      type="text"
      size="mini"
      class="ml-10"
      v-permission="['dmn:fee:item:view']"
      @click="params.context.componentParent.detailFn(params.data)"
    >
      {{ $t("feeItem.view") }}
    </el-button>
  </div>
</template>
<script>
export default {
	name: "OptionBtn",
	data() {
		return {}
	},
	created() { },
	beforeMount() { },
	methods: {

	}
}
</script>
<style lang="scss" scoped>
</style>

