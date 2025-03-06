<template>
	<div class="edit-btn-wrap">
		<el-button type="text" size="mini" @click="viewLog">{{
			$t("inventoryManager.viewBatchLog")
		}}</el-button>
	</div>
</template>
<script>
export default {
	name: 'BatchListBtn',
	data() {
		return {
			statusChange: false
		}
	},
	beforeMount() {
	},
	methods: {
		viewLog() {
			this.$router.push({ name: 'LogList', query: { skuCode: this.params.data.skuCode, systemBarCode: this.params.data.systemBarCode } })
		}
	}
}
</script>
<style>
</style>
