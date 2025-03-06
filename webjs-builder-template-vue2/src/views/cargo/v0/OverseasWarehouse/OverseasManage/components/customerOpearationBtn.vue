<template>
	<div>
		<el-button type="text" size="mini" @click="params.context.componentParent.setBaseConfig(params.data.id)" v-permission="['ovl:customer:base:config']" >{{ $t("overseasManage.base_config") }}</el-button>
		<el-button type="text" class="ml-10" size="mini" @click="params.context.componentParent.setBusinessConfig(params.data.id)" v-permission="['ovl:customer:business:config']" >{{ $t("overseasManage.business_config") }}</el-button>
		<el-button type="text" class="ml-10" size="mini" @click="params.context.componentParent.lookWallet(params.data.id)" >{{ $t("overseasManage.lookWallet") }}</el-button>
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
