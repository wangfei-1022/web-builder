<template>
	<div class="edit-btn-wrap">
		<el-button type="text" size="mini" @click="viewLog">
			{{ $t("inventoryManager.viewLog") }}
		</el-button>
		<el-button type="text" size="mini" @click="viewAge">
			{{ $t("inventoryManager.libraryAgeLog") }}
		</el-button>
	</div>
</template>
<script>
export default {
	name: 'InventoryListBtn',
	data() {
		return {
			statusChange: false
		}
	},
	beforeMount() {
	},
	methods: {
		viewLog() {
			this.$router.push({ name: 'LogGoods', query: { skuCode: this.params.data.skuCode, systemBarCode: this.params.data.systemBarCode } })
		},
		viewAge() {
			this.$router.push({ name: 'BatchList', query: { skuCode: this.params.data.skuCode } })
		}
	}
}
</script>
<style>
</style>
