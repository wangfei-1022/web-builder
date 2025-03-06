<template>
  <div class="option-btn-wrap">
    <el-link
      class="link"
			type="primary"
			size="mini"
      v-if="params.data.clearState == 3 || params.data.clearState == 2"
			@click="params.context.componentParent.showClearDetail(params.data)"
		>
			{{ params.data.clearStateName }}
		</el-link>
    <span v-else>{{ params.data.clearStateName }}</span>
  </div>
</template>
<script>
// 1 待入账
// 2 已入账
// 3 部分入账
// 10 不再入账

export default {
	name: "ClearStateCell",
	data() {
		return {}
	},
	methods: {
		noBill() {

		},
		recoverBill() {

		}
	}
}
</script>
<style lang="scss" scoped>
.link {
	font-size: 12px;
}
</style>

