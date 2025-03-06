<template>
	<div>
		<el-button type="text" size="mini" class="fc-red" @click="params.context.componentParent.del(params.data)" v-permission="['ovl:channel:priceCard:template:matching:delete']" >{{ $t("common.deleteBtn") }}</el-button>
	</div>
</template>
<script>
export default {
	name: 'CustomerOpearationBtn',
	data() {
		return {

		}
	},
	beforeMount() {
	},
	methods: {

	}
}
</script>
<style>
</style>
