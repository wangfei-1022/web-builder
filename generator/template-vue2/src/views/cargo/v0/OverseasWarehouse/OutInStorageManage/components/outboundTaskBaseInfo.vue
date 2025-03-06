<template>
  <div>
    <div class="top-box ">
    <div class="flex-between mb-10">
      <div>{{title}}</div>
      <span class="state-box" :class="getStatus()">{{detailContent.orderStatusName || '-'}}</span>
    </div>
    </div>
    <div class="info-title">{{ getZH("baseInfo") }}</div>
    <div class="page-content mt-20  flex-box">
      <div class="mr-20">
        <span>{{getZH('customerName','common')}}：</span>
        <span>{{detailContent.customerName || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('customerOutboundNo')}}：</span>
        <span>{{detailContent.customerOutboundNo || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('warehouseName')}}：</span>
        <span>{{detailContent.warehouseName || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('customerWarehouseCode')}}：</span>
        <span>{{detailContent.customerWarehouseCode || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('lspcode')}}：</span>
        <span>{{detailContent.lspCode || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('lspwhscode')}}：</span>
        <span>{{detailContent.lspWhsCode || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('commercialInvoice')}}：</span>
        <span>{{detailContent.commercialInvoice || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('unpackFlag')}}：</span>
        <span>{{detailContent.unpackFlag ? this.$t('common.YES') : this.$t('common.NO')}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('term')}}：</span>
        <span>{{detailContent.term || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('traceAppoint')}}：</span>
        <span>{{detailContent.traceAppointFlag ? 'Y' :'N'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('isPickup')}}：</span>
        <span>{{detailContent.pickup ? 'Y' :'N'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('goods')}}：</span>
        <span>{{detailContent.productTypeName || '-' }}</span>
      </div>
    </div>
    <div class="page-content mb-10 flex-box">
      <div class="mr-20">
        <span>{{getZH('ediSendTime')}}：</span>
        <span v-if='detailContent.ediSendTime'>{{detailContent.ediSendTime | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
        <span v-else>-</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('planDeliverTime')}}：</span>
        <span v-if='detailContent.planDeliverTime'>{{detailContent.planDeliverTime | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
        <span v-else>-</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('planPickTime')}}：</span>
        <span v-if='detailContent.planPickTime'>{{detailContent.planPickTime | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
        <span v-else>-</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('aptraceidTime')}}：</span>
        <span v-if='detailContent.pickStartTime'>{{detailContent.pickStartTime | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
        <span v-else>-</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('planPickendTime')}}：</span>
        <span v-if='detailContent.pickEndTime'>{{detailContent.pickEndTime | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
        <span v-else>-</span>
      </div>
    </div>
    <div class="info-title">{{ getZH("consigneeInfo") }}</div>
    <div class="page-content mt-20 flex-box">
      <div class="mr-20">
        <span>{{getZH('arrivalNormalized')}}：</span>
        <span>{{detailContent.address || '-'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import getZHMixin from './getZHMixin'
export default {
	name: 'OutboundTaskBaseInfo',
	mixins: [getZHMixin],
	props: {
		detailContent: {
			type: Object,
			default: () => { }
		},
		title: String
	},
	data() {
		return {

		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		getStatus() {
			let state = this.detailContent.orderStatus
			switch (state) {
				case 4:
					return 'green-state'
				case 5:
					return 'yellow-state'
				case 6:
					return 'danger-state'
				default:
					return 'blue-state'
			}
		}
	}
};
</script>

<style scoped lang="less">
.state-box {
	padding: 6px 8px;
	border: 1px solid;
	margin-right: 30px;
	border-radius: 4px;
}
.danger-state {
	color: #e81e19;
	border-color: #e81e19;
}
.green-state {
	color: #67c23a;
	border-color: #67c23a;
}
.blue-state {
	color: #3e84e9;
	border-color: #3e84e9;
}
.grey-state {
	color: #aaa;
	border-color: #aaa;
}
.yellow-state {
	color: #e6a23c;
	border-color: #e6a23c;
}
.top-box {
	height: 40px;
	border-bottom: 1px solid #999;
	margin-bottom: 20px;
}
.page-content {
	color: #606266;
	font-size: 14px;
	flex-wrap: wrap;
	& > div {
		white-space: nowrap;
		margin-bottom: 22px;
		min-width: 300px;
	}
}
</style>
