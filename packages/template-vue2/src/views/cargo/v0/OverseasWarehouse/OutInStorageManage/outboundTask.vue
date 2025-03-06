 <template>
	<div class="pd-16" v-loading="loading" style="padding-top: 0;">
        <el-tabs v-model="activeName" class="top-tabs">
            <el-tab-pane :label='$t("common.baseSearch")' name="BASE_SEARCH"></el-tab-pane>
            <el-tab-pane :label='$t("common.noSearch")' name="NO_SEARCH"></el-tab-pane>
        </el-tabs>
        <top-search-items-slot :searchFun="list" :resetFun="reset" class="mb-10" :visible="activeName === 'NO_SEARCH'">
            <template slot="multipleSearch">
                <div class="multiple-no-wrap">
                <el-form ref="formDataRef" :inline="true" :model="nosFormData" label-width="110px" size="mini" class="multipleNoSearch">
                    <el-form-item :label="getZH('customerOutboundNo')" prop="customerOutboundNos" class='multiple-no-item'>
                    <el-input v-model="nosFormData.customerOutboundNos" type="textarea" rows="3" resize="none" clearable />
                    </el-form-item>
                    <el-form-item :label="getZH('commercialInvoice')" prop="commercialInvoices" class='multiple-no-item'>
                    <el-input v-model="nosFormData.commercialInvoices" type="textarea" rows="3" resize="none" clearable />
                    </el-form-item>
                    <el-form-item :label="getZH('containerNumber')" prop="containerNumbers" class='multiple-no-item'>
                    <el-input v-model="nosFormData.containerNumbers" type="textarea" rows="3" resize="none" clearable />
                    </el-form-item>
                    <el-form-item :label="getZH('warehouse')" prop="warehouseIds">
                        <StorageWarehouseSelect v-model="nosFormData.warehouseIds" clearable :multiple="true" collapse-tags @change="list" class="item-form-select" :show-all-levels="false" />
                    </el-form-item>
					<el-form-item :label="getZH('orderTaskStatus')" prop="statusList">
						<ConstantSelect v-model="nosFormData.statusList" :isHasAll="false" multiple url="/api/ovl-service/omc/ovl/order/outbound/task/status/selections" @change="list"></ConstantSelect>
					</el-form-item>
                </el-form>
                </div>
            </template>
            </top-search-items-slot>
		<top-search-items-slot :filterType="'mutliple'" :searchFun="list"	:resetFun="reset"  class="mb-10" :visible="activeName === 'BASE_SEARCH'">
			<template slot="multipleSearch">
				<el-form :inline="true" :model="formData" label-width="130px" ref="formData">
					<el-form-item	:label="getZH('customerName', 'common')" prop="customerId">
            <TypeSelect v-model="formData.customerId" type="customer" @selected="list" clearable />
					</el-form-item>
					<el-form-item :label="getZH('customerOutboundNo')" prop="customerOutboundNo">
						<el-input	size="mini" v-model="formData.customerOutboundNo" :placeholder="inputZH('customerOutboundNo')"	@keyup.enter.native="list" clearable ></el-input>
					</el-form-item>
					<el-form-item :label="getZH('isPickup')" prop="pickup" >
            <el-select v-model="formData.pickup" :placeholder="selectZH('isPickup')" size="mini" @change="list">
              <el-option :label="getZH('all')" :value="null" />
              <el-option :label="getZH('isTrue')" :value="1" />
              <el-option :label="getZH('isFalse')" :value="0" />
            </el-select>
					</el-form-item>
          <el-form-item :label="getZH('abnormalFlag')" prop="abnormalFlag" >
            <el-select v-model="formData.abnormalFlag" :placeholder="selectZH('abnormalFlag')" size="mini" @change="list">
              <el-option :label="getZH('all')" :value="null" />
              <el-option :label="getZH('isTrue')" :value="true" />
              <el-option :label="getZH('isFalse')" :value="false" />
            </el-select>
					</el-form-item>
					<el-form-item :label="getZH('updateFlag')" prop="customerUpdate" >
            <el-select v-model="formData.customerUpdate" :placeholder="selectZH('updateFlag')" size="mini" @change="list">
              <el-option :label="getZH('all')" :value="null" />
              <el-option :label="getZH('isTrue')" :value="true" />
              <el-option :label="getZH('isFalse')" :value="false" />
            </el-select>
					</el-form-item>
					<el-form-item :label="getZH('warehouseName')" prop="warehouseId">
						<StorageWarehouseSelect v-model="formData.warehouseId"	clearable	@change="list"  class="item-form-select" />
					</el-form-item>
					<el-form-item :label="getZH('customerWarehouseCode')" prop="customerWarehouseCode">
						<el-input size="mini"	v-model="formData.customerWarehouseCode" :placeholder="inputZH('customerWarehouseCode')" @keyup.enter.native="list" clearable></el-input>
					</el-form-item>
					<el-form-item :label="getZH('commercialInvoice')" prop="commercialInvoice">
						<el-input size="mini"	v-model="formData.commercialInvoice" :placeholder="inputZH('commercialInvoice')" @keyup.enter.native="list" clearable></el-input>
					</el-form-item>
					<el-form-item :label="getZH('orderTaskStatus')" prop="orderStatus">
						<ConstantSelect v-model="formData.orderStatus" url="/api/ovl-service/omc/ovl/order/outbound/task/status/selections" @change="list"></ConstantSelect>
					</el-form-item>
					<el-form-item :label="getZH('containerNumber')" prop="containerNumber">
						<el-input size="mini"	v-model="formData.containerNumber" :placeholder="inputZH('containerNumber')" @keyup.enter.native="list" clearable></el-input>
					</el-form-item>
					<el-form-item :label="getZH('ediSendTime')">
            <el-select class="w-100"	v-model="queryZone" @change="list" size="mini">
             <el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
            </el-select>
           <el-date-picker size="mini"  v-model="ediSendTime"  type="datetimerange" :start-placeholder="getZH('startDate','common')" :end-placeholder="getZH('endDate','common')"
              value-format="timestamp"
              :default-time="['00:00:00','23:59:59']"
              @change="list" >
            </el-date-picker>
					</el-form-item>
          <el-form-item :label="getZH('planDeliverTime')">
            <el-select class="w-100"	v-model="queryZone3" @change="list" size="mini">
							<el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
						</el-select>
           <el-date-picker size="mini"  v-model="planDeliverTime"  type="datetimerange" :start-placeholder="getZH('startDate','common')" :end-placeholder="getZH('endDate','common')"
              value-format="timestamp"
              :default-time="['00:00:00','23:59:59']"
              @change="list" >
            </el-date-picker>
					</el-form-item>
          <el-form-item :label="getZH('planPickTime')">
            <el-select class="w-100"	v-model="queryZone1" @change="list" size="mini">
							<el-option v-for="(item,key) in zoneObj" :key="item" :label="getZH('zoneObj','putInStorageManage')[Number(item)]" :value="Number(key)" />
						</el-select>
           <el-date-picker size="mini"  v-model="planPickTime"  type="datetimerange" :start-placeholder="getZH('startDate','common')" :end-placeholder="getZH('endDate','common')"
              value-format="timestamp"
              :default-time="['00:00:00','23:59:59']"
              @change="list" >
            </el-date-picker>
					</el-form-item>
				</el-form>
			</template>
		</top-search-items-slot>
    <div class="mb-10 flex-box top-btn-wrap"  :style="{ visibility: activeName === 'BASE_SEARCH' ? 'visible' : 'hidden'}">
      <el-button type="primary" size='mini' @click="batchImportVisible = true">{{$t('common.batchImport')}}</el-button>
      <el-button type="primary" size='mini' @click="bathExport()">{{$t('common.bathExport')}}</el-button>
      <el-checkbox class="ml-20" v-model="isCurrentZone">{{getZH('isCurrentZone')}}</el-checkbox>
    </div>
		<div >
			<ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />
		</div>
    <callbackOutboundDialog :visible.sync="dialog.visible" :id="activeId" @saved='list'></callbackOutboundDialog>
    <updateOutboundInfoDialog :visible.sync="updateOutboundVisible" :id="activeId" @saved='list'></updateOutboundInfoDialog>
    <CommonImportDialog :visible.sync="batchImportVisible" :fn="importTaskOutboundApi" templateName="outboundTaskImportExcelTemplate.xlsx" @saved='batchImportSaved'></CommonImportDialog>
    <recallDialog :visible.sync="dialogVisible" :data="activeRow" :id="activeId" @saved='list'></recallDialog>
		<Pagination
			:total="total"
			:limit.sync="formData.pageSize"
			:page.sync="formData.pageNum"
			@pagination="list"
		/>
  </div>
</template>

<script>
import StorageWarehouseSelect from "../components/storageWarehouseSelect.vue"
import OperationTaskBtn from "./components/operationTaskBtn.vue"
import getZHMixin from './components/getZHMixin'
import { getTimeByQueryTimeZone } from '@/utils'
import { zoneObj } from './components/zoneObj'
import ConstantSelect from '@/components/Form/ConstantSelect'
import { getOutboundTaskPagesApi, getOutboundTaskPagesBatchApi, exportOutboundTaskApi, importTaskOutboundApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
import { formatDateStr } from '@/filters'
import callbackOutboundDialog from './components/callbackOutboundDialog'
import updateOutboundInfoDialog from './components/updateOutboundInfoDialog'
import recallDialog from './components/recallDialog'
import CommonImportDialog from '../components/CommonImportDialog.vue'
import outboundTaskTable from './table/outboundTaskTable'

export default {
	name: "OutboundTask",
	mixins: [getZHMixin],
	components: { StorageWarehouseSelect, OperationTaskBtn, ConstantSelect, updateOutboundInfoDialog, callbackOutboundDialog, recallDialog, CommonImportDialog },
	data() {
		return {
            activeName: 'BASE_SEARCH',
			importTaskOutboundApi,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			loading: false,
			dialogVisible: false,
			updateOutboundVisible: false,
			batchImportVisible: false,
			dataList: [],
			isCurrentZone: true,
			queryZone: -new Date().getTimezoneOffset() / 60,
			queryZone1: -new Date().getTimezoneOffset() / 60,
			queryZone2: -new Date().getTimezoneOffset() / 60,
			queryZone3: -new Date().getTimezoneOffset() / 60,
			zoneObj,
			tableHeight: document.documentElement.clientHeight - 520,
			total: 0,
			ediSendTime: [],
			planPickTime: [],
			planDeliverTime: [],
			statusList: [],
			activeId: null,
			activeRow: {},
			columnData: [
				{
					headerName: '',
					checkboxSelection: true,
					headerCheckboxSelection: true,
					minWidth: 35,
					maxWidth: 35,
					pinned: 'left'
				},
				{
					headerName: this.getZH('rowIndex', 'common'),
					minWidth: 70,
					maxWidth: 70,
					cellRenderer: params => params.rowIndex + 1

				},
				{
					headerName: this.getZH('customerName', 'common'),
					field: 'customerName',
					minWidth: 140
				},
				{
					headerName: this.getZH('userOutBoundNo'),
					field: 'customerOutboundNo',
					minWidth: 140
				},
				{
					headerName: this.getZH('orderTaskStatus'),
					field: 'orderStatusName',
					minWidth: 120
				},
				{
					headerName: this.getZH('orderOutboundStatus'),
					field: 'orderOutboundStatusName',
					minWidth: 100
				},
				{
					headerName: this.getZH('callbackStatus'),
					field: 'callbackStatusName',
					minWidth: 100
				},
				{
					field: 'abnormalFlag',
					headerName: this.getZH('abnormalFlag'),
					minWidth: 100,
					cellRenderer: params => params.value ? this.getZH('trueText', 'common') : this.getZH('falseText', 'common')
				},
				{
					field: 'customerUpdate',
					headerName: this.getZH('updateFlag'),
					minWidth: 100,
					cellRenderer: params => params.value ? this.getZH('trueText', 'common') : this.getZH('falseText', 'common')
				},
				{
					headerName: this.getZH('warehouseName'),
					field: 'warehouseName',
					minWidth: 120
				},
				{
					headerName: this.getZH('customerWarehouseCode'),
					field: 'customerWarehouseCode',
					minWidth: 160
				},
				{
					field: 'pickup',
					headerName: this.getZH('isPickup'),
					minWidth: 100,
					cellRenderer: params => params.value ? this.getZH('trueText', 'common') : this.getZH('falseText', 'common')
				},
				{
					headerName: this.getZH('commercialInvoice'),
					field: 'commercialInvoice',
					minWidth: 120
				},
				{
					headerName: this.getZH('containerNumber'),
					field: 'containerNumber',
					minWidth: 120

				},
				{
					headerName: this.getZH('palletqty'),
					field: 'trayCount',
					minWidth: 140
				},
				{
					headerName: this.getZH('cnt'),
					field: 'totalQuantity',
					minWidth: 120
				},
				{
					headerName: this.getZH('unpackFlag'),
					field: 'unpackFlag',
					minWidth: 120,
					cellRenderer: params => params.value ? 'Y' : 'N'

				},
				{
					headerName: this.getZH('ediSendTime'),
					field: 'ediSendTimeStr',
					minWidth: 220
				},
				{
					headerName: this.getZH('planDeliverTime'),
					field: 'planDeliverTimeStr',
					minWidth: 220
				},
				{
					headerName: this.getZH('planPickTime'),
					field: 'planPickTimeStr',
					minWidth: 220
				},
				{
					headerName: this.getZH('term'),
					field: 'term',
					minWidth: 160
				},
				{
					headerName: this.getZH('traceAppoint'),
					field: 'traceAppointFlag',
					minWidth: 140,
					cellRenderer: params => params.value ? 'Y' : 'N'
				},

				{
					field: 'abnormalMessage',
					headerName: this.getZH('abnormalMessage'),
					minWidth: 100
				},
				{
					headerName: this.getZH('operation'), pinned: 'right', field: `id`, minWidth: 220,
					cellRendererFramework: 'OperationBtn'
				}
			],
			formData: {
				customerUpdate: null,
				abnormalFlag: null,
				pickup: null,
				commercialInvoice: null,
				containerNumber: null,
				customerId: null,
				customerOutboundNo: null,
				ediSendTimeStart: null,
				ediSendTimeEnd: null,
				orderStatus: null,
				outTimeStart: null,
				outTimeEnd: null,
				planDeliverTimeStart: null,
				planDeliverTimeEnd: null,
				planPickTimeStart: null,
				planPickTimeEnd: null,
				warehouseId: null,
				customerWarehouseCode: null,
				pageNum: 1,
				pageSize: 50
			},
            nosFormData: {
                customerOutboundNos: '',
                containerNumbers: '',
                commercialInvoices: '',
                warehouseIds: [],
                statusList: []
            }
		}
	},

	created() {
		this.gridOptions = {
			context: {
				componentParent: this
			},
			rowSelection: 'multiple', // 设置多行可选
			animateRows: true,
			suppressRowClickSelection: true // 选中单元格后可以复制内容
			// suppressCellSelection: true, //点击不选中单元格
		}
        this.columnFields = outboundTaskTable;
		this.list()
	},
	computed: {
		filterDataList() {
			let arr = this.dataList
			arr.forEach(item => {
				let zone = this.isCurrentZone ? null : item.warehouseZone
				let ediSendTimeStr = formatDateStr(item.ediSendTime, zone)
				this.$set(item, 'ediSendTimeStr', ediSendTimeStr)
				let planDeliverTimeStr = formatDateStr(item.planDeliverTime, zone)
				this.$set(item, 'planDeliverTimeStr', planDeliverTimeStr)
				let planPickTimeStr = formatDateStr(item.planPickTime, zone)
				this.$set(item, 'planPickTimeStr', planPickTimeStr)
			})
			return this.$extends(true, [], arr)
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name === 'OutboundTaskDetail') {
				vm.list()
			}
		})
	},
	methods: {
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
		/**
		 * 回调隆基
		 */
		updateOutboundInfo(id) {
			this.activeId = id
			this.dialog.visible = true
		},
		/**
		 * 更新出库信息
		 */
		updateOutbound(id) {
			this.activeId = id
			this.updateOutboundVisible = true
		},

		/**
		 * 获取列表数据
		 */
		async list() {
			this.loading = true
			let filterForm = this.handlerQuery()
            let fn = null
             if (this.activeName === 'NO_SEARCH') {
                fn = getOutboundTaskPagesBatchApi
            } else {
                fn = getOutboundTaskPagesApi
            }
            let res = await fn(filterForm);
			if (res.ok) {
				this.dataList = res.content.list
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},
		batchImportSaved() {
			this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`, this.getZH('handlerTips1'), {
				dangerouslyUseHTMLString: true,
				confirmButtonText: this.getZH('theKnow', 'common'),
				callback: () => {
					this.list()
				}
			})
		},
		handlerQuery() {
             if (this.activeName === 'NO_SEARCH') {
                let data = {}
                data = this.nosFormData
                data.pageNum = this.formData.pageNum
                data.pageSize = this.formData.pageSize
                return data
            }
			this.formData.ediSendTimeStart = this.$isNotEmpty(this.ediSendTime) ? getTimeByQueryTimeZone(this.ediSendTime[0], this.queryZone) : null
			this.formData.ediSendTimeEnd = this.$isNotEmpty(this.ediSendTime) ? getTimeByQueryTimeZone(this.ediSendTime[1], this.queryZone) : null
			this.formData.planPickTimeStart = this.$isNotEmpty(this.planPickTime) ? getTimeByQueryTimeZone(this.planPickTime[0], this.queryZone1) : null
			this.formData.planPickTimeEnd = this.$isNotEmpty(this.planPickTime) ? getTimeByQueryTimeZone(this.planPickTime[1], this.queryZone1) : null
			this.formData.planDeliverTimeStart = this.$isNotEmpty(this.planDeliverTime) ? getTimeByQueryTimeZone(this.planDeliverTime[0], this.queryZone3) : null
			this.formData.planDeliverTimeEnd = this.$isNotEmpty(this.planDeliverTime) ? getTimeByQueryTimeZone(this.planDeliverTime[1], this.queryZone3) : null
			let queryForm = this.$extends(true, {}, this.formData)
			return queryForm
		},
		/**
		 * 处理异常
		 */
		async recall(row) {
			this.activeId = row.id
			this.activeRow = row
			this.dialogVisible = true
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
				saveData = { ...{ ids, type: this.formData.type }, ...data }
			} else {
				saveData = { ...this.handlerQuery(), ...data }
			}
			this.loading = true
			let res = await exportOutboundTaskApi(saveData)
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
		/**
		 * 查看详情
		 */
		detail(id, operate) {
			this.$router.push({ name: 'OutboundTaskDetail', query: { id: id, operate } })
		},
		/**
		 * 查看详情
		 */
		view(id, operate) {
			this.$router.push({ name: 'OutboundTaskView', query: { id: id, operate } })
		},
		/**
		 * 重置搜索条件
		 */
		reset() {
			this.ediSendTime = []
			this.planPickTime = []
			this.planDeliverTime = []
            this.$refs.formData && this.$refs.formData.resetFields();
            this.$refs.formDataRef && this.$refs.formDataRef.resetFields();
			this.list()
		}
	}
}
</script>

<style scoped lang="scss">
.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}
</style>
