<template>
    <div class="page-edit-container bg-white full-page" v-loading="loading">
      <div class="page-edit-content">
        <div class="top-box ">
          <div class="flex-between mb-10">
            <div>{{getZH('orderInboundNo')}} <span class="ml-10">{{detailContent.inboundNo || '-'}}</span></div>
            <span class="state-box" :class="getStatus()">{{detailContent.orderStatusName || '-'}}</span>
          </div>
        </div>
        <div class="info-title">{{ getZH("baseInfo") }}</div>
        <div class="page-content mt-20 mb-10 flex-box">
          <div class="mr-20">
            <span>{{getZH('customerName','common')}}：</span>
            <span>{{detailContent.customerName || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('memberNo')}}：</span>
            <span>{{detailContent.customerInboundNo || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('warehouseName')}}：</span>
            <span>{{detailContent.warehouseName || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('costomerWarehouseCode')}}：</span>
            <span>{{detailContent.customerWarehouseCode || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('commercialinvoice')}}：</span>
            <span>{{detailContent.commercialInvoice || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('unpackFlag')}}：</span>
            <span>{{detailContent.unpackFlag ? this.$t('common.YES') : this.$t('common.NO')}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('containerNo')}}：</span>
            <span>{{detailContent.containerNumber || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('containerType')}}：</span>
            <span>{{detailContent.containerType || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('sealNumber')}}：</span>
            <span>{{detailContent.sealNumber || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('blNo')}}：</span>
            <span>{{detailContent.blNumber || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('shippingLine')}}：</span>
            <span>{{detailContent.shippingLine || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('vesselOrVoyage')}}：</span>
            <span>{{detailContent.vessel || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('terminal')}}：</span>
            <span>{{detailContent.terminal || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('ownerCode')}}：</span>
            <span>{{detailContent.ownerName || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('ediSendTime')}}：</span>
            <span v-if='detailContent.ediSendTime'>{{detailContent.ediSendTime | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
            <span v-else>-</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('planReceiveTime')}}：</span>
            <span v-if='detailContent.planReceiveTime'>{{detailContent.planReceiveTime | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="info-title mb-20">{{ getZH("inboundInfo") }}</div>
        <el-form ref="formData" :model="formData" label-width="85px" :rules="rules" label-position="left" :inline="true">
          <el-form-item :label="getZH('invoiceCurrency')" prop="currency">
            <el-select v-model="formData.currency" size="mini" :disabled="isDisabled" :placeholder="selectZH('invoiceCurrency')">
              <el-option label="USD" value="USD"></el-option>
              <el-option label="EUR" value="EUR"></el-option>
              <el-option label="GBP" value="GBP"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('totalValueImports')" prop="importTotalAmount">
            <el-input v-model="formData.importTotalAmount" v-input-limit="[-9, 2]" size="mini" :disabled="isDisabled" :placeholder="inputZH('totalValueImports')"></el-input>
          </el-form-item>
          <el-form-item :label="getZH('goodsType')" prop="goodsType">
            <el-select v-model="formData.goodsType" size="mini" :disabled="isDisabled" :placeholder="selectZH('invoiceCurrency')">
              <el-option :label="getZH('normalGodos')" :value="1"></el-option>
              <el-option :label="getZH('electrifyGodos')" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('term')" prop="tradeTerms">
            <el-select v-model="formData.tradeTerms" size="mini" :disabled="isDisabled" :placeholder="selectZH('term')">
              <el-option :label="item.englishName" :value="item.code" v-for="item in tradeTermList" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`${getZH('clearanceType')}：`" prop="clearanceType">
            <el-select v-model="formData.clearanceType" size="mini" :disabled="isDisabled" class="w-full" :placeholder="selectZH('clearanceType')">
              <el-option label="BONDED" value="BONDED"></el-option>
              <el-option label="FREE" value="FREE"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`${getZH('importType')}：`" prop="importType">
            <el-select v-model="formData.importType" size="mini" :disabled="isDisabled" class="w-full" :placeholder="selectZH('importType')">
              <el-option label="NORMAL" value="NORMAL"></el-option>
              <el-option label="FISCAL" value="FISCAL"></el-option>
              <el-option label="EXPORT" value="EXPORT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('vessel')" prop="shipName">
            <el-input v-model="formData.shipName" size="mini" :disabled="isDisabled" :placeholder="inputZH('vessel')"></el-input>
          </el-form-item>
          <el-form-item :label="getZH('voyage')" prop="voyage">
            <el-input v-model="formData.voyage" size="mini" :disabled="isDisabled" :placeholder="inputZH('voyage')"></el-input>
          </el-form-item>
        </el-form>
        <div class="info-title">{{ getZH("trayInfo") }} 
          <span class="fc-blue ml-10 fs-12 pointer" @click="exportDetail()">{{getZH('exportBtn','common')}}</span>
          <span class="fc-blue ml-10 fs-12 pointer" @click="dialog.visible=true" v-if="!isDisabled">{{getZH('batchUpdateData')}}</span>
        </div>
        <div class="page-content mt-20 flex-box">
          <div class="mr-20">
            <span>{{getZH('torus')}}：</span>
            <span>{{detailContent.trayCount || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('GW')}}：</span>
            <span>{{detailContent.sumGw || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('goods')}}：</span>
            <span>{{detailContent.productName || '-'}}</span>
          </div>
        </div>
        <el-table :data="detailContent.orderInboundTaskDetailList || []" stripe>
          <el-table-column :label="getZH('number')" width="50">
            <template slot-scope="{$index}">
              <span>{{$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="traceId" :label="getZH('trayNo')" showOverflowTooltip></el-table-column>
          <el-table-column prop="productCode" :label=" detailContent.productType === 2 ? getZH('productCode') : getZH('specifications')" min-width="120">
            <template slot-scope="{row}">
              <div>{{detailContent.productType === 2 ? (row.productCode || '-') : (row.specifications || '-')}}
              <el-tooltip effect="dark" placement="top" v-if="!row.skuAvailableFlag">
                <div slot="content">{{getZH('goodsEmptyTips')}}</div>
                <i class="el-icon-warning fc-yellow ml-10"></i></el-tooltip>
            </div>
            </template>
          </el-table-column>
          <el-table-column  prop="skuDescr" :label="getZH('skuDescr')" showOverflowTooltip></el-table-column>
          <el-table-column  prop="blockNumber" :label="getZH('blockNumber')" showOverflowTooltip></el-table-column>
          <el-table-column  prop="monopoly" :label="getZH('monopoly')" showOverflowTooltip></el-table-column>
          <el-table-column  prop="grossWeight" :label="getZH('grossWeight')" showOverflowTooltip></el-table-column>
          <el-table-column  prop="netWeight" :label="getZH('netWeight')" showOverflowTooltip></el-table-column>
          <el-table-column  prop="ownerCode" :label="getZH('ownerCode')" showOverflowTooltip></el-table-column>
          <el-table-column  prop="customerName" :label="getZH('customerName', 'common')" showOverflowTooltip></el-table-column>
          <el-table-column  prop="itemSize" :label="getZH('itemSize')" width="300">
            <template slot-scope="{row}">
              <div>
                <el-input size="mini" v-model="row.length" v-input-limit="[-9,3]"  class="w-80" :disabled="isDisabled || $isNotEmpty(row.lengthVal)" :placeholder="getZH('lengthTip')"></el-input>
                <el-input size="mini" v-model="row.width" v-input-limit="[-9,3]" class="w-80" :disabled="isDisabled || $isNotEmpty(row.widthVal)" :placeholder="getZH('widthTip')"></el-input>
                <el-input size="mini" v-model="row.height" v-input-limit="[-9,3]" class="w-80" :disabled="isDisabled || $isNotEmpty(row.heightVal)" :placeholder="getZH('heightTip')"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column  prop="itemGw" :label="getZH('itemGw')" width="90" showOverflowTooltip></el-table-column>
          <el-table-column  prop="trayNetWeight" :label="getZH('itemNw')" width="100">
              <template slot-scope="{row}">
                 <el-input v-model="row.trayNetWeight" :disabled="isDisabled" class="w-80" v-input-limit="[-9,3]" size="mini" :placeholder="getZH('itemNw')"></el-input>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <div class="page-edit-footer">
        <el-button type="default" size="mini" @click="backToList()">{{getZH('backList','common')}}</el-button>
        <el-button type="primary" size="mini" @click="confirmForm('formData')" v-if="operate === 'confirm'">{{getZH('confirmBtns','common')}}</el-button>
        <el-button type="danger" size="mini" @click="handlerResult(0)" v-if="operate === 'cancel'">{{getZH('reject','common')}}</el-button>
        <el-button type="primary" size="mini" @click="handlerResult(1)" v-if="operate === 'cancel'">{{getZH('refuse','common')}}</el-button>
      </div>
			<importDialog :visible.sync="dialog.visible" :batchType='4' :paramsData="{inboundTaskId:this.detailContent.id}" @saved="list" />
    </div>
</template>

<script>
import getZHMixin from './components/getZHMixin'
import { getDropdownlistApi } from '@/api/OverseasWarehouse/goodsManager'
import { detailInboundTaskApi, confirmInboundTaskApi, cancelInboundTaskApi, rejectInboundTaskApi, exportDetailInboundTaskApi, getInboundTaskDetailListApi, importInboundTaskDetailListApi } from '@/api/OverseasWarehouse/GRNManager'
import ImportDialog from '../YunCangManage/components/importDialog'
export default {
	name: 'InboundTaskDetail',
	mixins: [getZHMixin],
	components: { ImportDialog },
	data() {
		return {
			loading: false,
			operate: null,
			detailContent: {},
			tradeTermList: [],
			formData: {
				id: null,
				currency: 'EUR',
				importTotalAmount: null,
				goodsType: 1,
				tradeTerms: 'FOB',
				voyage: '',
				shipName: '',
				clearanceType: '',
				importType: '',
				orderInboundTaskDetailList: []
			},
			rules: {
				currency: [{ required: true, message: this.selectZH('invoiceCurrency') }],
				importTotalAmount: [{ required: true, message: this.inputZH('totalValueImports') }],
				shipName: [{ required: true, message: this.inputZH('vessel') }],
				voyage: [{ required: true, message: this.inputZH('voyage') }],
				goodsType: [{ required: true, message: this.selectZH('goodsType') }],
				clearanceType: [{ required: true, message: this.selectZH('clearanceType') }],
				importType: [{ required: true, message: this.selectZH('importType') }],
				tradeTerms: [{ required: true, message: this.selectZH('term') }]
			}
		};
	},
	created() {
		// this.id = this.$route.query.id
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.getDetail(this.$route.query.id)
		}
		this.operate = this.$route.query.operate
		this.init()
	},
	mounted() {

	},
	computed: {
		isDisabled() {
			return this.operate === 'view'
		}
	},
	methods: {
		// 初始化接口
		async init() {
			// TRADEMODE
			const res1 = await getDropdownlistApi({ termCode: 'TRADEMODE' })
			if (res1 && res1.ok) {
				this.tradeTermList = res1.content || []
			}
		},
		/**
		 * 获取列表
		 */
		async list() {
			this.loading = true
			let res = await getInboundTaskDetailListApi(this.detailContent.id)
			if (res.ok) {
				res.content.forEach(item => {
					item.lengthVal = item.length
					item.widthVal = item.width
					item.heightVal = item.height
				})
				this.detailContent.orderInboundTaskDetailList = res.content
			}
			this.loading = false
		},
		// 获取详情
		async getDetail(id) {
			this.loading = true
			let res = await detailInboundTaskApi(id)
			if (res.ok) {
				res.content.orderInboundTaskDetailList.forEach(item => {
					item.lengthVal = item.length
					item.widthVal = item.width
					item.heightVal = item.height
				})
				if (this.operate === 'confirm') {
					res.content.goodsType = res.content.goodsType ? res.content.goodsType : 1
					res.content.tradeTerms = res.content.tradeTerms ? res.content.tradeTerms : 'FOB'
					res.content.currency = res.content.currency ? res.content.currency : 'EUR'
				}
				this.$copyProps(this.formData, res.content)
				this.$nextTick(() => {
					this.$refs.formData.clearValidate()
				})
				this.detailContent = res.content
			}
			this.loading = false

		},
		/**
		 * 确认
		 */
		confirmForm(refName) {
			// this.confirmTips(this.getZH('publicConfirmTip', 'common')).then(() => {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					return false
				}
				this.confirmTips(this.getZH('publicConfirmTip', 'common')).then(() => {
					// 检验长宽高是否维护完整
					let errorData = ''
					let emptyata = ''
					if (this.$isNotEmpty(this.detailContent.orderInboundTaskDetailList)) {
						this.detailContent.orderInboundTaskDetailList.forEach(item => {
							if (this.$isEmpty(item.width) || this.$isEmpty(item.length) || this.$isEmpty(item.height)) {
								errorData += `【${item.traceId}】`
							}
							if (this.$isEmpty(item.trayNetWeight)) {
								emptyata += `【${item.traceId}】`
							}
						})
					}
					if (this.$isNotEmpty(errorData) || this.$isNotEmpty(emptyata)) {
						let tip = ''
						if (this.$isNotEmpty(errorData)) {
							tip = this.getZH('errorTips') + errorData + this.getZH('errorTips1')
						}
						if (this.$isNotEmpty(emptyata)) {
							tip += this.getZH('errorTips') + emptyata + this.getZH('errorTips2')
						}
						this.$alert(tip, {
							confirmButtonText: this.$t('common.theKnow')
						})
						return
					}
					let saveForm = this.$extends(true, {}, this.formData)
					saveForm.orderInboundTaskDetailList = this.handlerOrderInboundTaskDetailList()
					this.loading = true
					confirmInboundTaskApi(saveForm).then(res => {
						if (res.ok) {
							this.$message.success(this.getZH('confirmSuccess', 'common'))
							this.backToList()
						}
						this.loading = false
					})
				}).catch(() => { })
			})

			// }).catch(() => { })
		},
		/**
		 * 处理总货值
		 */
		handlerOrderInboundTaskDetailList() {
			let Decimal = require('decimal');
			let arr = this.detailContent.orderInboundTaskDetailList
			if (this.$isNotEmpty(this.formData.importTotalAmount)) {
				let totalVal = Number(this.formData.importTotalAmount) // 总货值
				let totalNum = 0 // 总块数
				let num = 0 // 已分配总货值
				let averageNum = 0 // 平均货值
				arr.forEach(item => {
					totalNum += Number(item.blockNumber)
				})
				averageNum = new Decimal(Number(totalVal)).div(new Decimal(Number(totalNum))).internal
				averageNum = Number(averageNum).toFixed(2)
				arr.forEach((item, index) => {
					// 如果是最后一条数据
					let importTotalAmount = null
					if (index === arr.length - 1) {
						importTotalAmount = (totalVal - num).toFixed(2)
					} else {
						importTotalAmount = new Decimal(Number(item.blockNumber)).mul(new Decimal(Number(averageNum))).internal
						importTotalAmount = Number(importTotalAmount).toFixed(2)
						num += Number(importTotalAmount)
					}
					this.$set(item, 'importTotalAmount', importTotalAmount)
				})
			}
			return arr
		},
		/**
		 * 处理结果 type  1同意 0拒绝
		 */
		async handlerResult(type) {
			this.confirmTips(this.getZH('publicConfirmTip', 'common')).then(() => {
				let fn = type ? cancelInboundTaskApi : rejectInboundTaskApi
				this.loading = true
				fn(this.detailContent.id).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('handlerSuccess'))
						this.backToList()
					}
					this.loading = false
				})
			}).catch(() => { })
		},
		/**
		 * 导出明细
		 */
		async exportDetail() {
			this.loading = true
			let res = await exportDetailInboundTaskApi(this.detailContent.id)
			if (res.ok) {
				this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`, this.getZH('handlerTips'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.getZH('theKnow', 'common'),
					callback: () => {
						this.loading = false
					}
				})
				this.loading = false
			} else {
				this.loading = false
			}
		},
		// 返回列表
		backToList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `InboundTask` })
		},
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
