<template>
  <div class="option-btn-wrap">
    <el-button
			type="text"
			size="mini"
			class="ml-10"
      v-if="(params.data.clearState === 1 || params.data.clearState === 2) && params.data.entryState !== 11 && false"
			@click="params.context.componentParent.partClear(params.data)"
      v-permission="['fms:receive:confirmation:view']"
		>
			{{ $t("receiveFms.receive_cleard") }}
		</el-button>
  </div>
</template>
<script>
// 1 待入账
// 2 已入账
// 3 部分入账
// 10 不再入账

export default {
	name: "OptionBtnCharge",
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
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

