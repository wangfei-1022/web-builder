<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
      <el-form :inline="true" :model="formData" slot="multipleSearch" label-width="80px" ref="formData">
        <el-form-item :label="getZH('customerName', 'common')" prop="customerId">
          <type-select type="customer" v-model="formData.customerId" @selected="list"></type-select>
				</el-form-item>
        <el-form-item :label="getZH('orderInboundNo')" prop="orderInboundNo">
          <el-input	class="w-140" size="mini" v-model="formData.orderInboundNo"	:placeholder="inputZH('orderInboundNo')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('warehouseId')" prop="warehouseIds">
          <StorageWarehouseSelect @change="list" v-model="formData.warehouseIds" clearable :multiple="true" :show-all-levels="false" />
        </el-form-item>
        <el-form-item	:label="getZH('deliveryMethod')" prop="deliverModeType">
          <el-select	size="mini"	v-model="formData.deliverModeType" :placeholder="selectZH('deliveryMethod')" @change="list" class="w-140">
            <el-option :label="getZH('all')" :value="null"></el-option>
            <el-option v-for="item in constant.deliveryMethod" :key="item.value" :label="getZH(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="getZH('carrier')" prop="carrierId">
          <SelectFilter v-model="formData.carrierId"  size="mini" :placeholder="selectZH('carrier')" name-key="scacCode" @change="list" value-key="id" :options="companyList" :filter-keys="['shortname', 'chineseName','scacCode','englishName']" />
        </el-form-item>
        <el-form-item :label="getZH('logisticsNo')" prop="shipmentNo">
          <el-input	class="w-140" size="mini" v-model="formData.shipmentNo"	:placeholder="inputZH('logisticsNo')"></el-input>
        </el-form-item>
        <el-form-item :label="getZH('firstPutawayTime')" prop="firstPutawayTime" label-width="100px">
          <el-select class="w-100 mr-10"	v-model="queryZone" @change="list" size="mini">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
          </el-select>
          <CommonPicker
            class="input-date-picker"
            size="mini"
            :pikcerType="'daterange'"
            :pickerFormat="'yyyy-MM-dd'"
            :parentRangeDate="formData.firstPutawayTime"
            v-model="formData.firstPutawayTime"
            @change="list"
            :clearable="true"
            :placeholder="selectZH('firstPutawayTime')"
            :defaultTime="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item :label="getZH('putawayCompleteAllTime')"	prop="putawayCompleteTime" label-width="100px">
          <el-select class="w-100 mr-10"	v-model="queryZone1" @change="list" size="mini">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
          </el-select>
          <CommonPicker
            class="input-date-picker"
            size="mini"
            :pikcerType="'daterange'"
            :pickerFormat="'yyyy-MM-dd'"
            :parentRangeDate="formData.putawayCompleteTime"
            v-model="formData.putawayCompleteTime"
            @change="list"
            :clearable="true"
            :placeholder="selectZH('putawayCompleteTime')"
            :defaultTime="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item	:label="getZH('createTime')" prop="createTime">
          <el-select class="w-100 mr-10"	v-model="queryZone2" @change="list" size="mini">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
          </el-select>
          <CommonPicker
            class="input-date-picker"
            size="mini"
            :pikcerType="'daterange'"
            :pickerFormat="'yyyy-MM-dd'"
            :parentRangeDate="formData.createTime"
            v-model="formData.createTime"
            @change="list"
            :clearable="true"
            :placeholder="selectZH('createTime')"
            :defaultTime="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item	:label="getZH('submitTime')" prop="submitTime">
          <el-select class="w-100 mr-10"	v-model="queryZone3" @change="list" size="mini">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
          </el-select>
          <CommonPicker
            class="input-date-picker"
            size="mini"
            :pikcerType="'daterange'"
            :pickerFormat="'yyyy-MM-dd'"
            :parentRangeDate="formData.submitTime"
            v-model="formData.submitTime"
            @change="list"
            :clearable="true"
            :placeholder="selectZH('submitTime')"
            :defaultTime="['00:00:00', '23:59:59']"
          />
        </el-form-item>
      </el-form>
		</top-search-items-slot>
    <div class="mb-10 flex-box top-btn-wrap">
      <el-button type="primary" size='mini' @click="batchExportVisible=true">{{$t('common.bathExport')}}</el-button>
      <el-button type="primary" size='mini' @click="batchAudit()">{{getZH('batchAudit')}}</el-button>
       <el-checkbox class="ml-20" v-model="isCurrentZone">{{getZH('isCurrentZone')}}</el-checkbox>
    </div>
		<div>
      <el-tabs type="card" class="top-tabs" size="mini" @tab-click="list" v-model="formData.orderState">
        <el-tab-pane  :label="`${getZH('all')}（${countTabMap['allCount'] || 0}）`" name="all"></el-tab-pane>
        <el-tab-pane v-for="item in orderStateList" :key="item.value" :label="`${getZH(item.label)}（${getCount(item.value)}）`"  :name="String(item.value)"></el-tab-pane>
        <el-tab-pane :label="`${getZH('abnormal')}（${countTabMap['abnormalCount'] || 0}）`" name="abnormal" ></el-tab-pane>
        <el-tab-pane v-for="item in otherStateList" :key="item.value" :label="`${getZH(item.label)}（${getCount(item.value)}）`" :name="String(item.value)"></el-tab-pane>
      </el-tabs>
			<ag-grid-vue-pro :data="filterDataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />
			<div class="pagination-wrap">
				<Pagination
					:total="totalData"
					:limit.sync="formData.pageSize"
					:page.sync="formData.pageNum"
					@pagination="list"
				/>
			</div>
      <BatchExportDialog :visible.sync="batchExportVisible" @saved="bathExport" />
      <BatchAduitDialog :visible.sync="batchVisible" :ids="activeIds" @saved="list" />
		</div>
	</div>
</template>

<script>
import StorageWarehouseSelect from "../components/storageWarehouseSelect.vue"
import { getPackageInboundListApi, exportPackageInboundApi, getPackageInboundStatusCountApi } from '@/api/OverseasWarehouse/GRNManager'
import ParcelStorageBtn from './components/parcelStorageBtn'
import constant from './components/constant'
import getZHMixin from './components/getZHMixin'
import BatchExportDialog from './components/batchExportDialog'
import BatchAduitDialog from './components/batchAduitDialog'
import { getTimeByQueryTimeZone, handlerTimeStr } from '@/utils'
import { zoneObj } from '../OutInStorageManage/components/zoneObj'
import { getLogisticsCompanyApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
import parcelStorageTable from './table/parcelStorageTable'

export default {
	name: 'ParcelStorage',
	mixins: [getZHMixin],
	data() {
		return {
			constant,
			loading: false,
			loading1: false,
			isCurrentZone: true,
			currentZone: -new Date().getTimezoneOffset() / 60,
			queryZone: -new Date().getTimezoneOffset() / 60,
			queryZone1: -new Date().getTimezoneOffset() / 60,
			queryZone2: -new Date().getTimezoneOffset() / 60,
			queryZone3: -new Date().getTimezoneOffset() / 60,
			userList: [],
			stockList: [],
			activeId: '',
			activeIds: [],
			companyList: [],
			zoneObj,
			activeType: null,
			batchExportVisible: false,
			batchVisible: false,
			deliveryList: constant.deliverTypeStatus,
			inWarehouseTypeList: constant.receiveTypes,
			orderStateList: constant.orderStatus,
			formData: {
				customerId: null,
				orderInboundNo: null,
				orderState: 'all',
				warehouseIds: [],
				deliverModeType: null,
				carrierId: null,
				shipmentNo: null,
				firstPutawayTime: [],
				putawayCompleteTime: [],
				firstPutawayStartTime: null,
				firstPutawayEndTime: null,
				putawayCompleteStartTime: null,
				putawayCompleteEndTime: null,
				createTime: [],
				createTimeStart: null,
				createTimeEnd: null,
				submitTime: [],
				submitTimeStart: null,
				submitTimeEnd: null,
				pageSize: 50,
				pageNum: 1
			},
			totalData: 0,
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			rowData: [],
			otherStateList: [{
				label: 'cancel',
				value: 14
			},
			{
				label: 'warehouseReceiving',
				value: 15
			},
			{
				label: 'startReceiving',
				value: 9
			},
			{
				label: 'goodsFinish',
				value: 10
			},
			{
				label: 'startOn',
				value: 11
			}],
			countTabMap: {},
			countTabKeyMap: {
				2: 'waitingCount',
				3: 'rejectCount',
				4: 'receivingCount',
				5: 'submitWarehouseCount',
				6: 'warehouseConfirmCount',
				7: 'warehouseRejectCount',
				8: 'headOnPassageCount',
				12: 'partGroundingCount',
				13: 'allGroundingCount',
				14: 'cancelCount',
				15: 'warehouseReceiveCount',
				9: 'startReceivingGoodsCount',
				10: 'completeReceivingGoodsCount',
				11: 'startGroundingCount'
			}
		}
	},
	components: {
		ParcelStorageBtn, StorageWarehouseSelect, BatchExportDialog, BatchAduitDialog
	},
	computed: {
		filterDataList() {
			let arr = this.rowData
			arr.forEach(item => {
				let zone = this.isCurrentZone ? this.currentZone : item.warehouseZone
				let createTimeStr = handlerTimeStr(item.createTime, zone)
				this.$set(item, 'createTimeStr', createTimeStr)
				let expectArriveWarehouseTimeStr = handlerTimeStr(item.expectArriveWarehouseTime, zone)
				this.$set(item, 'expectArriveWarehouseTimeStr', expectArriveWarehouseTimeStr)
				let firstPutawayTimeStr = handlerTimeStr(item.firstPutawayTime, zone)
				this.$set(item, 'firstPutawayTimeStr', firstPutawayTimeStr)
				let putawayCompleteTimeStr = handlerTimeStr(item.putawayCompleteTime, zone)
				this.$set(item, 'putawayCompleteTimeStr', putawayCompleteTimeStr)
				let submitTimeStr = handlerTimeStr(item.submitTime, zone)
				this.$set(item, 'submitTimeStr', submitTimeStr)
			})
			return this.$extends(true, [], arr)
		}
	},
	watch: {
	},
	methods: {
		async init() {
			let res = await getLogisticsCompanyApi()
			if (res.ok) {
				this.companyList = res.content || []
			}
		},
		// 统计数量
		async initCount() {
			let res = await getPackageInboundStatusCountApi()
			if (res.ok) {
				this.countTabMap = res.content
			}
		},
		// 获取数量显示
		getCount(val) {
			return this.countTabMap[this.countTabKeyMap[val]] || 0
		},
		onReady(params) {
			this.gridApi = params.api
			// this.columnApi = params.columnApi
			// this.gridApi.sizeColumnsToFit()
			// window.addEventListener('resize', function () {
			// 	setTimeout(function () {
			// 		params.api.sizeColumnsToFit()
			// 	})
			// })
		},
		// 处理查询条件
		handlerQuery() {
			let data = this.$extends(true, {}, this.formData)
			data.firstPutawayStartTime = this.$isNotEmpty(data.firstPutawayTime) ? getTimeByQueryTimeZone(data.firstPutawayTime[0], this.queryZone) : null
			data.firstPutawayEndTime = this.$isNotEmpty(data.firstPutawayTime) ? getTimeByQueryTimeZone(data.firstPutawayTime[1], this.queryZone) : null
			data.putawayCompleteStartTime = this.$isNotEmpty(data.putawayCompleteTime) ? getTimeByQueryTimeZone(data.putawayCompleteTime[0], this.queryZone1) : null
			data.putawayCompleteEndTime = this.$isNotEmpty(data.putawayCompleteTime) ? getTimeByQueryTimeZone(data.putawayCompleteTime[1], this.queryZone1) : null
			data.createTimeStart = this.$isNotEmpty(data.createTime) ? getTimeByQueryTimeZone(data.createTime[0], this.queryZone2) : null
			data.createTimeEnd = this.$isNotEmpty(data.createTime) ? getTimeByQueryTimeZone(data.createTime[1], this.queryZone2) : null
			data.submitTimeStart = this.$isNotEmpty(data.submitTime) ? getTimeByQueryTimeZone(data.submitTime[0], this.queryZone3) : null
			data.submitTimeEnd = this.$isNotEmpty(data.submitTime) ? getTimeByQueryTimeZone(data.submitTime[1], this.queryZone3) : null
			data.abnormalFlag = data.orderState === 'abnormal' ? true : null
			data.orderState = ['abnormal', 'all'].includes(data.orderState) ? null : Number(data.orderState)
			delete data.firstPutawayTime
			delete data.putawayCompleteTime
			delete data.createTime
			delete data.submitTime
			return data
		},
		// 获取列表
		async list() {
			this.initCount()
			let query = this.handlerQuery()
			this.loading = true
			const res = await getPackageInboundListApi({ ...query })
			if (res.ok) {
				this.rowData = res.content.list
				this.totalData = Number(res.content.total)
			} else {
				this.rowData = []
				this.totalData = 0
			}
			this.loading = false
		},
		/**
		 * 批量导出
		 */
		async bathExport(data) {
			const _selectedRows = this.gridApi.getSelectedRows()
			let saveData = {}
			let ids = []
			if (this.$isNotEmpty(_selectedRows)) {
				_selectedRows.forEach(item => {
					ids.push(item.id)
				})
				saveData = { ...{ ids }, ...data }
			} else {
				saveData = { ...this.handlerQuery(), ...data }
			}
			this.loading = true
			let res = await exportPackageInboundApi(saveData)
			if (res.ok) {
				this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`, this.getZH('handlerTips'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.getZH('theKnow', 'common'),
					callback: () => {
						// this.$router.push({ name: `TaskList`, query: { time: new Date().getTime() } })
						this.loading = false
					}
				})
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
		 * 批量审核
		 */
		batchAudit() {
			const _selectedRows = this.gridApi.getSelectedRows()
			if (this.$isNotEmpty(_selectedRows)) {
				let list = _selectedRows.filter(item => item.orderState === 2)
				if (this.$isNotEmpty(list)) {
					let ids = []
					list.forEach(item => {
						ids.push(item.id)
					})
					this.activeIds = ids
					this.batchVisible = true
				} else {
					this.$message.error(this.getZH('batchAuditEmpty'))
					return
				}
			} else {
				this.$message.error(this.getZH('batchAuditEmpty'))
			}

		},
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.formData.orderState = 'all'
			this.list()
		}
	},
	mounted() { },
	created() {
		this.init()
		this.gridOptions = {
			context: {
				componentParent: this
			},
			rowSelection: 'multiple', // 设置多行可选
			animateRows: true,
			suppressRowClickSelection: true // 选中单元格后可以复制内容
			// suppressCellSelection: true, //点击不选中单元格
		}
        this.columnFields = parcelStorageTable
		// this.columnFields = [
		// 	{
		// 		headerName: '',
		// 		checkboxSelection: true,
		// 		headerCheckboxSelection: true,
		// 		minWidth: 35,
		// 		maxWidth: 35,
		// 		pinned: 'left'
		// 	},
		// 	{
		// 		field: 'customerName',
		// 		headerName: this.getZH('customerName', 'common'),
		// 		minWidth: 100,
		// 		pinned: 'left'
		// 	},
		// 	{
		// 		field: 'orderInboundNo',
		// 		headerName: this.getZH('orderInboundNo'),
		// 		minWidth: 160,
		// 		pinned: 'left'
		// 	},
		// 	{
		// 		field: 'warehouseName',
		// 		headerName: this.getZH('warehouseId'),
		// 		minWidth: 100
		// 	},
		// 	{
		// 		field: 'deliverModeTypeName',
		// 		headerName: this.getZH('deliveryMethod'),
		// 		minWidth: 100
		// 	},
		// 	{
		// 		field: 'expectArriveWarehouseTimeStr',
		// 		headerName: this.getZH('expectArriveWarehouseTime'),
		// 		minWidth: 230
		// 	},
		// 	{
		// 		field: 'orderStateName',
		// 		headerName: this.getZH('orderState'),
		// 		minWidth: 100
		// 	},
		// 	{
		// 		field: 'abnormalFlag',
		// 		headerName: this.getZH('abnormalFlag'),
		// 		minWidth: 100,
		// 		cellRenderer: params => params.value ? this.$t('common.YES') : this.$t('common.NO')
		// 	},
		// 	{
		// 		field: 'boxQuantity',
		// 		headerName: this.getZH('parcelQuantity'),
		// 		minWidth: 160
		// 	},
		// 	{
		// 		field: 'skuKindQuantity',
		// 		headerName: this.getZH('forecastSKUTypes'),
		// 		minWidth: 120,
		// 		cellRenderer: params => params.value || '-'
		// 	},
		// 	{
		// 		field: 'skuQuantity',
		// 		headerName: this.getZH('forecastSKUTotal'),
		// 		minWidth: 120,
		// 		cellRenderer: params => params.value || '-'
		// 	},
		// 	{
		// 		field: 'createTimeStr',
		// 		headerName: this.getZH('createTime'),
		// 		minWidth: 230
		// 	},
		// 	{
		// 		field: 'submitTimeStr',
		// 		headerName: this.getZH('submitTime'),
		// 		minWidth: 230
		// 	},
		// 	{
		// 		field: 'firstPutawayTimeStr',
		// 		headerName: this.getZH('firstPutawayTime'),
		// 		minWidth: 120,
		// 		cellRenderer: params => params.value || '-'
		// 	},
		// 	{
		// 		field: 'putawayCompleteTimeStr',
		// 		headerName: this.getZH('putawayCompleteTime'),
		// 		minWidth: 160,
		// 		cellRenderer: params => params.value || '-'
		// 	},
		// 	{
		// 		field: 'putawaySkuKindsQuantity',
		// 		headerName: this.getZH('groupingSkuKindQuantity'),
		// 		minWidth: 160,
		// 		cellRenderer: params => params.value || '-'
		// 	},
		// 	{
		// 		field: 'putawaySkuQuantity',
		// 		headerName: this.getZH('groupingSkuQuantity'),
		// 		minWidth: 100,
		// 		cellRenderer: params => params.value || '-'
		// 	},
		// 	{
		// 		field: 'reason',
		// 		headerName: this.getZH('refuseReason'),
		// 		minWidth: 100,
		// 		cellRenderer: params => {
		// 			if (params.data.orderState === 3 || params.data.pushState === 4 || params.data.orderState === 7) {
		// 				return params.data.reason
		// 			}
		// 			return '-'
		// 		}
		// 	},
		// 	{
		// 		field: 'abnormalMessage',
		// 		headerName: this.getZH('abnormalMessage'),
		// 		minWidth: 160,
		// 		cellRenderer: params => params.value || '-'
		// 	},
		// 	{
		// 		field: 'remarks',
		// 		headerName: this.getZH('remark'),
		// 		minWidth: 160,
		// 		cellRenderer: params => params.value || '-'
		// 	},
		// 	{
		// 		field: 'id',
		// 		headerName: this.getZH('operation', 'common'),
		// 		minWidth: 200,
		// 		pinned: 'right',
		// 		cellRendererFramework: 'ParcelStorageBtn'
		// 	}
		// ]
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.list()
		})
	}
}
</script>

<style lang='scss' scoped>
.features-btn {
	margin-bottom: 10px;
}
::v-deep .table-setting {
    top: -90px!important; 
}
</style>
