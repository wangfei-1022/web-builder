
<template>
	<div class="edi-operation-button-in-aggrid">
		<span v-if="params.data.priceCardType === 10">
			<el-button  v-permission="['ovl:trans:cost:price:card:view']" v-if="params.data.status != 10"	type="text" size="mini"
				@click="params.context.componentParent.add(params.data.id,'1','0',params.data.productType)">
        {{$t('channelPriceCard.view')}}
			</el-button>
			<el-button  v-permission="['ovl:trans:cost:price:card:update']" v-if="params.data.status === 10  || params.data.status === 33"	type="text" size="mini"
				@click=" params.context.componentParent.add(	params.data.id,'0','1',	params.data.productType	)">
        {{$t('channelPriceCard.edit')}}
			</el-button>
			<el-button class="ml-10" v-permission="['ovl:trans:cost:price:card:publish']"	v-if="params.data.status === 20" type="text" size="mini"
				@click=" params.context.componentParent.publish(params.data.id,params.data.productType)">
        {{$t('common.publishBtn')}}
			</el-button>
		</span>
		<span v-if="params.data.priceCardType === 11 || params.data.priceCardType === 12">
			<el-button v-permission="['ovl:trans:base:price:card:view']"	v-if="params.data.status !== 10" type="text" size="mini"
				@click="params.context.componentParent.add(params.data.id,'1','0',params.data.productType)">
        {{$t('channelPriceCard.view')}}
			</el-button>
			<el-button v-permission="['ovl:trans:base:price:card:update']" v-if="params.data.status === 10  || params.data.status === 33" type="text" size="mini"
				@click="params.context.componentParent.add(params.data.id,'0','1',params.data.productType)">
        {{$t('channelPriceCard.edit')}}
			</el-button>
			<el-button class="ml-10" v-permission="['ovl:trans:base:price:card:publish']" v-if="params.data.status === 20" type="text" size="mini"
				@click="params.context.componentParent.publish(params.data.id,	params.data.productType)">
				{{$t('common.publishBtn')}}
			</el-button>
		</span>
		<span v-if="params.data.priceCardType === 13">
			<el-button v-permission="['ovl:trans:customer:price:card:view']" v-if="params.data.status !== 10" type="text" size="mini"
				@click="params.context.componentParent.add(params.data.id,'1','0',params.data.productType)">
        {{$t('channelPriceCard.view')}}
			</el-button>
			<el-button v-permission="['ovl:trans:customer:price:card:update']" v-if="params.data.status === 10 || params.data.status === 33" type="text" size="mini"
				@click="params.context.componentParent.add(params.data.id,'0','1',params.data.productType)">
        {{$t('channelPriceCard.edit')}}
			</el-button>
			<el-button class="ml-10" v-permission="['ovl:trans:customer:price:card:publish']" v-if="params.data.status === 20" type="text" size="mini"
				@click="params.context.componentParent.publish(params.data.id,params.data.productType)">
        {{$t('common.publishBtn')}}
			</el-button>
		</span>
    <span>
      <el-button class="ml-10" type="text"  v-if="postponeStatus.includes(params.data.status)" size="mini" @click="postpone(params.data)">{{$t('channelPriceCard.postpone')}}</el-button>
      <el-button class="fc-red ml-10"  v-if="delStatus.includes(params.data.status)" type="text" size="mini" @click="params.context.componentParent.del(params.data.id,params.data.priceCardType)">{{$t('common.deleteBtn')}}</el-button>
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
	beforeMount() {
	},
	methods: {
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
