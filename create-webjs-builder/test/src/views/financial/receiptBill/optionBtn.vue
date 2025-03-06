<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.view(params.data)" v-permission="['fms:receive:bill:view']">
			{{$t('receiveFms.view')}}
		</el-button>
		<el-button type="text" size="mini" class="ml-10" v-if="false" @click="params.context.componentParent.download(params.data)" v-permission="['fms:receive:bill:view']">
			{{$t('receiveFms.export_bill')}}
		</el-button>
		<el-button v-if="params.data.billState === 1 && params.data.batchEntryChargeFinished" type="text" size="mini" class="ml-10" @click="params.context.componentParent.confirm(params.data)" v-permission="['fms:receive:bill:confirm']">
			{{$t('receiveFms.fms_bill_confirm')}}
		</el-button>
		<el-button v-if="params.data.billState === 1" type="text" size="mini" class="ml-10" @click="params.context.componentParent.recall(params.data)" v-permission="['fms:receive:bill:revert']">
			{{$t('receiveFms.bill_recall')}}
		</el-button>
    <!--撤回对账-->
		<el-button v-if="params.data.billState === 2" type="text" size="mini" class="ml-10" @click="params.context.componentParent.recallBillConfirm(params.data)">
				{{$t('receiveFms.bill_recall_check')}}
		</el-button>

    <!--待内部确认---撤回确认-->
    <!-- 非-海外仓配业务③ -->
		<el-button v-if="params.data.businessType === 'OVERSEAS_WAREHOUSE' && params.data.entityType !== 1614 && params.data.billState === 1 && params.data.arAp === 1" type="text" size="mini" class="ml-10" @click="params.context.componentParent.recallBillInnerConfirm(params.data)" >
      {{$t('receiveFms.bill_recall_confirm')}}
		</el-button>
    <!--下载账单-->
		<el-button v-if="params.data.businessType === 'OVERSEAS_WAREHOUSE' && params.data.entityType !== 1614 && params.data.type === 'AR'" type="text" size="mini" class="ml-10" @click="params.context.componentParent.downloadBillFile(params.data)">
				{{$t('receiveFms.download_bill')}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "OptionBtnBill",
	data() {
		return {};
	},
	methods: {}
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

