<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner" >

    <div class="operate-buttons" style="display: flex; justify-content: space-between; padding: 8px;border-bottom:5px solid #fff" >
      <div class="operate-buttons-left" style="display: flex;">
        <el-button type="primary" plain size="small" @click="returnToList">{{$t('sea.returnList')}}</el-button>
        <el-button v-if="orderDetailsData.orderLockState === 20" type="primary" size="small" @click="adjustConfirmFn(orderDetailsData)">{{$t('sea.lockOrder')}}</el-button>
<!--        <el-button v-if="Number(editableTabsValue) === 4 && customerBlType === 'list'" type="primary"  size="small" @click="addCustomerBill">{{$t('sea.addCustomerBill')}}</el-button>-->
        <el-button v-if="Number(editableTabsValue) === 4 && customerBlType === 'list'" type="primary"  size="small" @click="batchExportCustomerBill">{{$t('sea.batchExportCustomerBill')}}</el-button>

        <div class="BLstatus" :class="orderDetailsData.orderState | blStatusFilter">{{ orderDetailsData.orderStateName }}</div>
      </div>
    </div>
    <div style=" padding: 8px;">
      <el-tabs class="el_tabs" v-model="editableTabsValue" type="border-card" @tab-click="handleClick" :before-leave="beforeHandle">
        <el-tab-pane v-for="(item,index) in editableTabs" :key="item.name" :label="item.title" :name="item.name"
                     :disabled="(orderDetailsData.orderState === 100 && !([1,6,7,8,9].indexOf(Number(item.name)) >-1) ) || item.orderState > orderDetailsData.orderState || item.disabled || (Number(item.name) === 6 && orderDetailsData.chargeCategoryType === 2 ) || (Number(item.name) === 7 && orderDetailsData.chargeCategoryType === 1 )">
            <OrderDetails v-if="index === 0 && Number(editableTabsValue) === 1 && $isNotEmpty(orderDetailsData)" :orderDetailsData="orderDetailsData"
                          @change="tabPaneChange" @restOrderData="restOrderData" @returnshipBossBlListLen="returnshipBossBlListLen"
                          @bookingConfirmCallBack="bookingConfirmCallBack"
                          @bookingEdit="bookingEdit"
            ></OrderDetails>
            <!--      订舱-->
            <BookingAdd  v-if="index === 1 && Number(editableTabsValue) === 2 && Number(orderDetailsData.bookingJobMethod) === 1&& $isNotEmpty(orderDetailsData)" :orderDetailsData="orderDetailsData"  @change="tabPaneChange"></BookingAdd>
            <!--      自动  -->
            <BookingAddAuto v-if="index === 1 && Number(editableTabsValue) === 2 && Number(orderDetailsData.bookingJobMethod) === 2&& $isNotEmpty(orderDetailsData)"  :orderDetailsData="orderDetailsData"  @change="tabPaneChange"></BookingAddAuto>
            <Packing  v-if="index === 2 && Number(editableTabsValue) === 3 && $isNotEmpty(orderDetailsData)" :orderDetailsData="orderDetailsData"  @change="tabPaneChange"></Packing>
            <CustomerBlDetail
              key="editableTabsValue4"
              :orderDetailsData="orderDetailsData"
              v-if="index === 3 && Number(editableTabsValue) === 4 && $isNotEmpty(orderDetailsData)"
              :type="customerBlType"
              @typeChange="typeChange"
              :propsBlId="propsBlId"
              ref="customerBlDetail"
              @returnshipBossBlListLen="returnshipBossBlListLen"
              @tabPaneChange="tabPaneChange"
            ></CustomerBlDetail>

            <CustomerBlDetail key="editableTabsValue5"
                              :orderDetailsData="orderDetailsData"
                              v-if="index === 4 && Number(editableTabsValue) === 5 && $isNotEmpty(orderDetailsData)"
                              :type="customerBlType"
                              @typeChange="typeChange"
                              :editableTabsValue="editableTabsValue"
                              :customSelect="customSelect"
                              :propsBlId="propsBlId"
                              @returnshipBossBlListLen="returnshipBossBlListLen"
            ></CustomerBlDetail>
          <ExpensesCost v-if="index === 5 && Number(editableTabsValue) === 6 && $isNotEmpty(orderDetailsData)" :orderDetailsData="orderDetailsData" @typeChange="typeChange"></ExpensesCost>
          <PayableCost v-if="index === 6 && Number(editableTabsValue) === 7 && $isNotEmpty(orderDetailsData)" :orderDetailsData="orderDetailsData" @typeChange="typeChange"></PayableCost>
          <ChargeList v-if="index === 7 && Number(editableTabsValue) === 8 && $isNotEmpty(orderDetailsData)"></ChargeList>
          <electronic-file v-if="index === 8 && Number(editableTabsValue) === 9&& $isNotEmpty(orderDetailsData)" ref="electronicFile" :job="job" />
        </el-tab-pane>
      </el-tabs>

    </div>
    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />


    <el-dialog :visible.sync="infoVisible" :close-on-click-modal="false" width="500px" title="调整确认">
      <div style="line-height: 24px;" v-if="infoMsg">{{infoMsg}}</div>
      <div v-else>
         <div>
              <p>请确认订单是否调整完成</p>
              <p>1、如需继续调整，请点击“<span style="color: red">继续调整</span>”</p>
              <p>2、如已调整完成，请点击“<span style="color: red">锁定订单</span>”，锁定订单后内容将无法变更</p>
              <p>3、未确认费用同步自动确认</p>
            </div>
      </div>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="infoVisible = false">继续调整</el-button>
        <el-button size="mini" type="primary" @click="confirmFn">锁定订单</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import URL from '@/api/urlTranslator'
import DataImport from '@/components/DataImport'
import OrderDetails from './components/order/orderDetails'
import BookingAdd from './components/order/bookingAdd'
import BookingAddAuto from './components/order/bookingAddAuto'
import Packing from './components/order/packing'
import CustomerBlDetail from './components/order/customerBlDetail'
import ElectronicFile from './components/order/electronicFile'
import { seaOrderDetailApi } from "@/api/seaExportOrder"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import ExpensesCost from "./components/order/expensesCost"
import PayableCost from "./components/order/payableCost"
import ChargeList from "./components/order/chargeList"
import orderMixin from './components/order/orderMixin'

export default {
	name: "SeaExportOrderView",
	components: {
		DataImport, OrderDetails, BookingAdd, BookingAddAuto, Packing, CustomerBlDetail, ElectronicFile, reportListDialog, ExpensesCost, ChargeList,
		PayableCost
	},
  mixins: [orderMixin],
	filters: {
		blStatusFilter(status, name) {
			return `status-text${status}`
		}
	},
	data() {
		return {
			loading: false,
			id: this.$route.query.id,
			bookingJobId: this.$route.query.bookingJobId,
			editableTabsValue: this.$route.query.page || '1',
			editableTabsValueCopy: null,
			// <!--  ULL COMMENT '订单状态:1o-草稿,2o-待订舱, 3o-待制单, 4o-待补料, 5o-待签发，60-已签发，100-已取消'，LLCOMMENT'提交时间·,-->
			editableTabs: [{ title: this.$t('sea.order'), name: '1', disabled: false, orderState: 0 },
			{ title: this.$t('sea.booking'), name: '2', disabled: false, orderState: 20 },
			{ title: this.$t('sea.packing'), name: '3', disabled: false, orderState: 30 }, // 装箱
			{ title: this.$t('sea.memberBlNo'), name: '4', disabled: false, orderState: 30 }, // 客户提单
			{ title: this.$t('sea.carrierBlNo'), name: '5', disabled: false, orderState: 200 },
			{ title: this.$t('sea.receivableExpenseConfirmationDocument'), name: '6', disabled: false, orderState: 30 }, // 应收费用确认单
			{ title: this.$t('sea.payableExpenseConfirmation'), name: '7', disabled: false, orderState: 30 }, // 应付费用确认单
			{ title: this.$t('sea.cost'), name: '8', disabled: false, orderState: 0 }, // 费用
			{ title: this.$t('sea.electronicDocuments'), name: '9', disabled: false, orderState: 0 } // 电子文件
			],
			isJump: false,
			orderDetailsData: {},
			job: {
				jobState: -10,
				// -----bus passengers------
				configParams: { // 部分配置参数
					vesselVoyageInputMode: 0 // 航次录入方式：0-手工录入，1-弹框选择
				},
				os: {},
				doc: {},
				op: {},
				bus: {},
				cs: {},
				sale: {},
				serviceCodeList: [],
				customerList: [], // 委托页签-下拉列表of委托单位
				carrierList: [],
				seaPortList: [], // 起运港/POL、卸货港、目的港、目的地
				staffList: [], // todo 目前是全都查出来，待分类
				fclLclList: [
					{ code: 1, chineseName: '整箱', englishName: 'FCL' },
					{ code: 3, chineseName: '货代自拼箱小票', englishName: 'LCL' },
					{ code: 4, chineseName: '客户加拼主票', englishName: 'M-B/C' },
					{ code: 6, chineseName: '委托外拼', englishName: 'Co-load' },
					{ code: 7, chineseName: '散杂货', englishName: 'Bulk' },
					{ code: 2, chineseName: '货代自拼箱', englishName: 'Consol' },
					{ code: 5, chineseName: '客户加拼小票', englishName: 'S-B/C' }
				], // todo
				// consol, s-b/c 不能动，只展示
				// FCL, LCL, M-B/C, Co-load, bulk可以互改
				// -----------
				fclLcl: '',
				bCoLoad: false,
				bBuyerConsol: false,
				bDirectBl: false,
				bMaster: false,
				baseFormVO: {
					customerContractNo: ''
				},
				cargoType: 0,
				omsSeJobSpecial: {
					exceedOverBack: '',
					exceedOverFront: '',
					exceedOverHeight: '',
					exceedOverLeft: '',
					exceedOverRight: '',
					exceedSize: '',
					exceedWeight: '',
					frozenContainerYard: '',
					frozenDeliverDock: '',
					frozenHeat: '',
					frozenHighestTemp: '',
					frozenHumidity: '',
					frozenLowestTemp: '',
					frozenPti: '',
					frozenVentilation: '',
					gohHanger: '',
					gohKnots: '',
					gohReformCost: '',
					gohRopes: '',
					gohTier: '',
					remark: ''
				},
				omsSeJobFirst: {
					bargeVessel: '',
					bargeVoyage: '',
					bargeEtd: '',
					bargeEta: '',
					bargePol: '',
					bargePod: '',
					bargeCarrier: '',
					bargeLineCode: '',
					bargeCloseCustoms: '',
					bargeRemark: ''
				}, // 驳船
				omsSeJobSecond: {
					secondVessel: '',
					secondVoyage: '',
					secondEtd: '',
					secondEta: '',
					secondShipper: '',
					secondConsignee: '',
					secondNotify: '',
					secondCarrier: '',
					secondAgent: '',
					secondMemoBl: '',
					secondRemark: ''
				}, // 二程
				bookingFormVO: {
					bookingNo: ''
				},
				seJobCtnrList: [],
				preManifest: {
					list: []
				},
				manifest: {
					list: []
				},
				encasement: {
					containerList: [],
					ladingNoList: []
				},
				truck: {
					list: []
				},
				warehouse: {
					detail: {
						bTurn: false,
						bFumigation: false,
						orderQuantity: 0,
						orderGrossWeight: 0,
						orderVolume: 0,
						quantity: 0,
						grossWeight: 0,
						volume: 0
					},
					inRecordList: []
				},
				hbl: {
					blList: [],
					jobList: []
				},
				mbl: {
					blList: [],
					jobList: []
				},
				electronicFile: {
					list: []
				},
				dangerousCargo: {
					list: []
				}
			},
			customerBlType: 'list',
			customSelect: null,
			propsBlId: null,
			reportDialog: { // 打印报表对话框
				isShow: false,
				typeCode: '',
				data: {
					jobId: '',
					assistInfo: '',
					definedInfo: '',
					entityIdList: [],
					remark: ''
				}
			},
			batchPrintMultipleForm: {}
		}
	},
	watch: {
		'$route'(to, from) {
			if (to.name === 'SeaExportOrderView') {
				this.getSeaOrderDetail(this.id)
			}
		}
	},
	created() {
		this.editableTabsValueCopy = this.editableTabsValue
		this.getSeaOrderDetail(this.id)
	},
	computed: {
		url() {
			return URL
		}
	},
	methods: {
		// 订舱选择人工自动
		bookingConfirmCallBack(val) {
			this.$set(this.orderDetailsData, 'bookingChannel', val.bookingChannel)
			this.$set(this.orderDetailsData, 'bookingJobMethod', val.bookingJobMethod)
		},
		// 订舱编辑
		async bookingEdit() {
			this.getSeaOrderDetail(this.id, 'bookingEdit')
		},
		async getSeaOrderDetail(id, type) {
			this.loading = true
			const res = await seaOrderDetailApi(id)
			this.loading = false
			if (res.ok) {
				// res.content.orderState = 80
				// 订舱编辑 订单状态“待订舱”时
				let isBookingEditError
				if (type === 'bookingEdit') {
					if (this.orderDetailsData.orderState === 20 && [1, 3].indexOf(this.orderDetailsData.jobState) > -1) {
						if (res.content.jobState === 2 || this.orderDetailsData.orderState > 20) {
							this.$message.error(this.$t('sea.bookingHasBeenSubmitted'))
							isBookingEditError = true
						}
					}
					if ([30, 40].indexOf(this.orderDetailsData.orderState) > -1) {
						if ([30, 40].indexOf(this.orderDetailsData.orderState) < 0) {
							this.$message.error(this.$t('sea.orderStatusChanged'))
							isBookingEditError = true
						}
					}

				}
				if (res.content.orderState === 20 && (res.content.jobState === 0 || !res.content.jobState)) {
					this.$set(this.editableTabs[1], 'disabled', true)
				} else {
					this.$set(this.editableTabs[1], 'disabled', false)
				}
				if (this.$route.query.bookingChannel && !res.content.bookingChannel) {
					res.content.bookingChannel = this.$route.query.bookingChannel
				}
				if (this.$route.query.bookingJobMethod && !res.content.bookingJobMethod) {
					res.content.bookingJobMethod = this.$route.query.bookingJobMethod
				}
        res.content.isUnlocked = res.content.orderLockState === 0 || res.content.orderLockState === 20
				this.orderDetailsData = res.content
				if (type === 'bookingEdit' && !isBookingEditError) {
					this.tabPaneChange('2')
				}

			}
		},
		returnshipBossBlListLen(val) {
			if (val) {
				this.$set(this.editableTabs[4], 'orderState', 0)
			}
		},
		restOrderData() {
			this.getSeaOrderDetail(this.id)
		},
		returnToList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: 'SeaExportOrderList' })
		},
		addCustomerBill() {
			this.customerBlType = 'create'
		},

		beforeHandle(activeName, oldActiveName) {
			if ([2, 3, 4, 5, 6, 7].indexOf(Number(oldActiveName)) > -1 && !this.isJump) {
				this.$confirm(this.$t('sea.notYetSaved'), this.$t('sea.tips'), {
					confirmButtonText: this.$t('sea.determine'),
					cancelButtonText: this.$t('sea.cancel'),
					type: 'warning'
				}).then(() => {
					this.goTabs(activeName)
				}).catch(() => {

				})
			} else {
				this.isJump = false
				return true
			}
			this.isJump = false
			return false
		},
		goTabs(e) {
			this.isJump = true
			this.editableTabsValue = e
			if (e === '1') {
				this.getSeaOrderDetail(this.id)
			}
			this.customerBlType = 'list'
			this.$nextTick(() => {
				this.isJump = false
			})
		},
		handleClick(tab, event) {
			// console.log(this.editableTabsValue)
		},
		tabPaneChange(e, isTpis, type, select) {
			this.isJump = isTpis
			this.editableTabsValue = e
			if (type === 'carrierCreate') {
				this.customerBlType = 'create'
				this.propsBlId = null
				console.log('select,', select)
				this.customSelect = select
			}
			if (type === 'addCustomBl') {
				this.customerBlType = 'create'
				this.propsBlId = null
			}
			if (type === 'billList') {
				this.customerBlType = 'list'
			}
			if (type === 'editBl') {
				this.customerBlType = 'edit'
				// this.customSelect = select
				this.propsBlId = select.id
			}
			if (isTpis) {
				if (e === '1') {
					this.getSeaOrderDetail(this.id)
				}
			}

		},
		typeChange(val) {
			if (val === 'list') {
				this.getSeaOrderDetail(this.id)
			}
			this.customerBlType = val
		},

		// * 打印
		batchExportCustomerBill() {
			let getCustomerBlList = this.$refs.customerBlDetail.getCustomerBlList
			if (this.$isNotEmpty(getCustomerBlList) && Number(getCustomerBlList[0].blSignType) === 1) { // MBL
				this.$confirm(this.$t('sea.whetherToContinueExporting'), this.$t('common.tips'), {
					confirmButtonText: this.$t('common.confirmBtn'),
					cancelButtonText: this.$t('common.cancelBtn'),
					type: 'warning'
				}).then(() => {
					this.batchExportCustomerBillFun()
				})
			} else {
				this.batchExportCustomerBillFun()
			}

		},
		batchExportCustomerBillFun() {
			this.reportDialog.typeCode = 'CUSTOMER_BL'
			const queryConditionJson = { jobId: '', orderId: this.id }
			this.reportDialog.data = { queryConditionJson: queryConditionJson }
			// this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
			this.reportDialog.isShow = true
		}

	}
}
</script>
<style  lang="scss" scoped>
.icon {
	font-size: 24px;
	transition: all 0.2s ease 0s;
	cursor: pointer;
	user-select: none;
	&:hover {
		transform: scale(1.1);
	}
}
::v-deep .icon {
	width: auto;
	height: auto;
}
.blue {
	color: #1890ff;
}
::v-deep.el-button.is-disabled {
	&.blue,
	&.red {
		color: #c0c4cc;
	}
}
.red {
	color: #ff4949;
}
.BLstatus {
	font-size: 20px;
	margin-left: 20px;
	line-height: 32px;
}
.el_tabs {
	//::v-deep .el-tabs__content{ display: none;}
}
.status-text20 {
	color: #e6a23c;
}
.status-text30 {
	color: (90, 156, 255);
}
.status-text40 {
	color: rgb(222, 90, 255);
}
.status-text50 {
	color: rgb(0, 0, 255);
}
.status-text60 {
	color: #67c23a;
}
.status-text100 {
	color: #f56c6c;
}
</style>
