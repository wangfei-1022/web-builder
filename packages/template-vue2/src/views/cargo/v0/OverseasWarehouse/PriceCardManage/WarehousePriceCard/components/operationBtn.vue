
<template>
	<div class="edi-operation-button-in-aggrid">
		<span v-if="params.data.priceCardType === 13">
			<el-button type="text" size="mini" @click="detailFn(params.data)" v-permission="['ovl:warehouse:customer:price:card:view']">{{$t('warehousePriceCard.view')}}</el-button>
			<el-button class="ml-10" v-if="params.data.status === 10 || params.data.status === 33" type="text" size="mini" @click="editFn(params.data)" v-permission="['ovl:warehouse:customer:price:card:update']">{{$t('warehousePriceCard.edit')}}</el-button>
			<el-button class="ml-10" v-if="params.data.status === 20" type="text" size="mini" @click="params.context.componentParent.publish(params.data.id)" v-permission="['ovl:warehouse:customer:price:card:publish']">{{$t('common.publishBtn')}}</el-button>
		</span>
		<span v-else>
			<el-button class="ml-10" type="text" size="mini" @click="detailFn(params.data)" v-permission="['ovl:warehouse:base:price:card:view']">{{$t('warehousePriceCard.view')}}</el-button>
			<el-button class="ml-10" v-if="params.data.status === 10 || params.data.status === 33" type="text" size="mini" @click="editFn(params.data)" v-permission="['ovl:warehouse:base:price:card:publish']">{{$t('warehousePriceCard.edit')}}</el-button>
			<el-button class="ml-10" v-if="params.data.status === 20" type="text" size="mini" @click="params.context.componentParent.publish(params.data.id)" v-permission="['ovl:warehouse:base:price:card:update']">{{$t('common.publishBtn')}}</el-button>
		</span>
    <span>
      <el-button class="ml-10" type="text"  v-if="params.data.priceCardType === 13 && postponeStatus.includes(params.data.status)" size="mini" @click="postpone(params.data)">{{$t('channelPriceCard.postpone')}}</el-button>
      <el-button class="fc-red ml-10" v-if="delStatus.includes(params.data.status)" type="text" size="mini" @click="params.context.componentParent.del(params.data.id)">{{$t('common.deleteBtn')}}</el-button>
    </span>
	</div>
</template>
<script>
export default {
	name: 'OperationBtn',
	data() {
		return {
			delStatus: [10, 20, 33],
			postponeStatus: [32, 41, 42]
		}
	},
	methods: {
		detailFn(data) {
			this.$router.push({ name: 'WarehousePriceCardDetail', query: { id: data.id, priceCardType: data.priceCardType } })
		},
		editFn(data) {
			this.$router.push({ name: 'WarehousePriceCardEdit', query: { id: data.id, priceCardType: data.priceCardType } })
		},
		// 延期功能
		async postpone(data) {
			this.params.context.componentParent.postponeVisible = true
			this.params.context.componentParent.postponeData = data
		}
	}
}
</script>
<style>
.edi-operation-button-in-aggrid .el-button {
	padding: 0;
}
</style>
