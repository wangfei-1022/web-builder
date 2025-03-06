<template>
    <div class="page-edit-container bg-white full-page" v-loading="loading">
      <div class="page-edit-content" v-if="initEnd">
        <OutboundTaskBaseInfo :detailContent="detailContent" :title="getZH('detailOutbound')"></OutboundTaskBaseInfo>

        <OutBoundSelectInfo :detailContent="detailContent"></OutBoundSelectInfo>
        <OutBoundInfo :detailContent="detailContent">
          <div class="mr-20" slot="totalNetWeight">
            <span>{{getZH('netWeightTotal')}}：</span>
            <span>{{detailContent.totalNetWeight || '-'}}</span>
          </div>
        </OutBoundInfo>
        <OutboundInfoDetail :detailContent='detailContent'></OutboundInfoDetail>
      </div>
      <div class="page-edit-footer">
        <el-button type="default" size="mini" @click="backToList()">{{getZH('backList','common')}}</el-button>
      </div>
    </div>
</template>

<script>
import getZHMixin from './components/getZHMixin'
import { detailOutboundTaskApi } from '@/api/OverseasWarehouse/outInStorageManage.js'
import OutboundTaskBaseInfo from './components/outboundTaskBaseInfo'
import OutBoundSelectInfo from './components/outBoundSelectInfo'
import OutboundInfoDetail from './components/outboundInfoDetail'
import OutBoundInfo from './components/outBoundInfo'
export default {
	name: 'OutboundTaskView',
	mixins: [getZHMixin],
	components: { OutboundTaskBaseInfo, OutBoundSelectInfo, OutboundInfoDetail, OutBoundInfo },
	data() {
		return {
			loading: false,
			initEnd: false,
			detailContent: {},
			lastLegServiceListMap: {}
		};
	},
	created() {
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.getDetail(this.$route.query.id)
		}
	},
	computed: {


	},
	methods: {
		async getDetail(id) {
			this.initEnd = false
			this.loading = true
			let res = await detailOutboundTaskApi(id)
			if (res.ok) {
				if (this.$isNotEmpty(res.content.outboundDetailList)) {
					res.content.outboundDetailList.forEach(dataItem => {
						if (this.$isNotEmpty(dataItem.serviceList)) {
							dataItem.serviceList.forEach(item => {
								let data = JSON.parse(item.serviceContentJson)
								let serviceItemValues = ''
								let serviceItemNames = ''
								let serviceItemCurrency = ''
								let serviceItemAmount = ''
								if (this.$isNotEmpty(data)) {
									let names = data.names
									let values = data.values
									let insureAmounts = data.insureAmounts
									serviceItemNames = names.join(",")
									serviceItemValues = values.join(",")
									if (this.$isNotEmpty(insureAmounts)) {
										serviceItemCurrency = insureAmounts.map(item => item.currency).join(',')
										serviceItemAmount = insureAmounts.map(item => item.amount).join(',')
									}
								}
								item.serviceItemValues = serviceItemValues
								item.serviceItemNames = serviceItemNames
								item.serviceItemCurrency = serviceItemCurrency
								item.serviceItemAmount = serviceItemAmount
							})
						}
					})
				}
				if (this.$isEmpty(res.content.arrivalAddress)) {
					res.content.arrivalAddress = res.content.address
				}
				this.detailContent = res.content
			}
			this.loading = false
			this.initEnd = true

		},
		// 返回列表
		backToList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `OutboundTask` })
		}

	}
};
</script>

<style scoped lang="less">
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
