<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10"	>
			<el-form	slot="multipleSearch"	ref="filterForm" :inline="true" :model="filterForm">
				<el-form-item :label="getZH('customerName', 'common')" prop="customerId">
          <TypeSelect v-model="filterForm.customerId" type="customer" @selected="list"></TypeSelect>
				</el-form-item>
        <el-form-item :label="getZH('takeStockNo')"	prop="cyclecountNo">
					<el-input size="mini" v-model="filterForm.cyclecountNo" clearable @keyup.enter.native="list" :placeholder="inputZH('takeStockNo')"></el-input>
				</el-form-item>
				<el-form-item :label="getZH('warehouseId')" prop="warehouseId" >
					<StorageWarehouseSelect	v-model="filterForm.warehouseId" @change="list" clearable />
				</el-form-item>
				<el-form-item :label="getZH('status')" prop="orderStatus" >
					<el-select v-model="filterForm.orderStatus" :label="selectZH('status')" size="mini" @change="list">
            <el-option :label="getZH('all','common')" :value="null" />
            <el-option :label="getZH('received')" :value="1" />
            <el-option :label="getZH('inProcess')" :value="2" />
            <el-option :label="getZH('failure')" :value="3" />
            <el-option :label="getZH('completed')" :value="4" />
          </el-select>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
    <div class="top-btn-wrap mb-10">
      <el-button type="primary" @click="exportAll" size="mini">
        {{getZH('searchExport')}}
      </el-button>
      <el-button type="primary" size="mini" @click="importItem">
        {{getZH('batchUpdate')}}
      </el-button>
      <el-checkbox class="ml-20" v-model="isCurrentZone">{{getZH('isCurrentZone')}}</el-checkbox>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptions"
      :side-bar="sideBarDefs"
      :column-defs="columnFields"
      :row-data="filterDataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReady"
      :animate-rows="false"
      :style="gridHeight"
      class="ag-theme-balham"
    />
    <Pagination :total="totalData" :limit.sync="filterForm.pageSize" :page.sync="filterForm.pageNum" @pagination="list" />
    <BatchUpdate :visible.sync="dialog.visible" :id="activeId" @saved="list"></BatchUpdate>
  </div>
</template>

<script>
import { getTakeStockListApi, exportTakeStockApi, deliverTakeStockApi } from '@/api/inventory'
import StorageWarehouseSelect from '../components/storageWarehouseSelect'
import getZHMixin from './components/getZHMixin'
import TakeStockBtn from './components/takeStockBtn'
import BatchUpdate from './components/batchUpdate'
import { handlerTimeStr } from '@/utils'
export default {
	name: 'TakeStock',
	mixins: [getZHMixin],
	components: { StorageWarehouseSelect, TakeStockBtn, BatchUpdate },
	data() {
		return {
			loading: false,
			filterForm: {
				cyclecountNo: null,
				orderStatus: null,
				warehouseId: '',
				customerId: '',
				planCheckStartTime: '',
				planCheckEndTime: '',
				pageNum: 1,
				pageSize: 50
			},
			totalData: 0,
			activeId: null,
			isCurrentZone: true,
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			rowData: []
		}
	},
	computed: {},
	methods: {
		onReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			this.gridApi.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		async list() {
			this.loading = true
			const res = await getTakeStockListApi({ ...this.filterForm })
			if (res.ok) {
				this.rowData = res.content.list
				this.totalData = res.content.total
			} else {
				this.rowData = []
				this.totalData = 0
			}
			this.loading = false
		},
		//重新下发
		async deliverTakeStock(id) {
			if (this.$isEmpty(id)) {
				return
			}
			this.loading = true
			let res = await deliverTakeStockApi(id)
			if (res.ok) {
				this.$message.success(this.getZH('deliverSuccess'))
				this.list()
			}
			this.loading = false

		},
		clearSearchForm() {
			this.$refs.filterForm.resetFields()
			this.list()
		},
		/**
		 * 批量导出
		 */
		async exportAll() {
			let _selectedRows = this.gridApi.getSelectedRows()
			_selectedRows = _selectedRows.filter(item => item.orderStatus === 1)
			let id = null
			if (_selectedRows.length === 1) {
				id = _selectedRows[0].id
			} else {
				this.$message.error(this.getZH('selectOneError'))
				return
			}
			this.loading = true
			const res = await exportTakeStockApi({ id })
			if (res.ok) {
				// 添加日志 记录数据
				this.logBtnSend({
					origin: this.logOrigin.SYSTEM_OPERATION,
					logCode: this.pointOvl.OVL_TAKE_STOCK_EXPORT,
					serviceName: this.logServiceName.OVL_SERVICE,
					businessType: this.pointOvl.OVL_TAKE_STOCK_EXPORT,
					content: {
						id: id
					}
				})
				this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime', 'common')}</span><span class="fs-16">,${this.getZH('handlerRes', 'common')}</span></div>`, this.getZH('handlerExportTips', 'common'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.getZH('theKnow', 'common'),
					callback: () => {

					}
				})
			}
			this.loading = false
		},
		/**
		 * 批量更新
		 */
		importItem() {
			let _selectedRows = this.gridApi.getSelectedRows()
			if (_selectedRows.length !== 1) {
				this.$message.error(this.getZH('selectOneError'))
				return
			}
			if ((_selectedRows[0].orderStatus === 1 || _selectedRows[0].orderStatus === 3) && _selectedRows[0].importStatus !== 1) {
				this.activeId = _selectedRows[0].id
				this.dialog.visible = true
			} else {
				this.$message.error(this.getZH('selectError'))
				return
			}
		},
	},
	computed: {
		filterDataList() {
			let arr = this.rowData
			let currentZone = -new Date().getTimezoneOffset() / 60
			arr.forEach(item => {
				let zone = this.isCurrentZone ? currentZone : (item.warehouseZone || currentZone)
				let planCheckStartTimeStr = handlerTimeStr(item.planCheckStartTime, zone)
				this.$set(item, 'planCheckStartTimeStr', planCheckStartTimeStr)
				let planCheckEndTimeStr = handlerTimeStr(item.planCheckEndTime, zone)
				this.$set(item, 'planCheckEndTimeStr', planCheckEndTimeStr)
			})
			return this.$extends(true, [], arr)
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
		}
		this.columnFields = [
			{
				headerName: '',
				checkboxSelection: true,
				headerCheckboxSelection: true,
				minWidth: 35,
				maxWidth: 35,
				pinned: 'left'
			},
			{
				field: 'customerName',
				headerName: this.getZH('customerName', 'common'),
				minWidth: 140
			},

			{
				field: 'cyclecountNo',
				headerName: this.getZH('takeStockNo'),
				minWidth: 120
			},
			{
				field: 'warehouseName',
				headerName: this.getZH('warehouseName'),
				minWidth: 120
			},

			{
				field: 'planCheckStartTimeStr',
				headerName: this.getZH('plannedInventoryStartTime'),
				minWidth: 160,
			},
			{
				field: 'planCheckEndTimeStr',
				headerName: this.getZH('plannedInventoryEndTime'),
				minWidth: 160,
			},
			{
				field: 'blindFlag',
				headerName: this.getZH('blindFlag'),
				minWidth: 110,
				cellRenderer: params => params.data.blindFlag ? 'Y' : 'N'
			},
			{
				field: 'orderStatusName',
				headerName: this.getZH('status'),
				minWidth: 100,
			},
			{
				field: 'importStatusName',
				headerName: this.getZH('importStatus'),
				minWidth: 100,
			},
			{
				field: 'id',
				headerName: this.getZH('operation', 'common'),
				width: 220,
				pinned: 'right',
				cellRendererFramework: 'TakeStockBtn'
			}
		]
	},
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.list()
		})
	}
}
</script>

<style lang='scss' scoped>
.features-btn {
	margin-bottom: 10px;
}
::v-deep.table-text {
	&.reduce {
		color: #e42e2f;
	}
	&.add {
		color: #099e2c;
	}
}
</style>
