<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
      <el-form slot="multipleSearch" ref="filterForm" :inline="true" :model="filterForm" size="mini"
        @submit.native.prevent>
        <el-form-item :label="getZH('customerName', 'common')" prop="customerId" label-width="80px">
          <TypeSelect v-model="filterForm.customerId" type="customer" />
        </el-form-item>
        <el-form-item :label="getZH('warehouseName')" prop="warehouseId" label-width="90px">
          <StorageWarehouseSelect v-model="filterForm.warehouseId" clearable @change="list" />
        </el-form-item>
        <el-form-item :label="getZH('billingDate')" prop="dateTime" label-width="100px">
          <CommonPicker class="input-date-picker" pikcerType="daterange" v-model="filterForm.dateTime"
            :parentRangeDate="filterForm.dateTime" clearable @change="list" :defaultTime="['00:00:00', '23:59:59']" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div>
    <el-tabs type="border-card" v-model="filterForm.stockType" class="tabs-padding top-tabs" @tab-click='list'>
      <el-tab-pane :label="getZH('storageCharge')" name="10" ></el-tab-pane>
      <el-tab-pane :label="getZH('returnStorageCharge')" name="11" ></el-tab-pane>
    </el-tabs>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs"
        :column-defs="columnFields" :row-data="rowData" :enable-col-resize="true" :enable-sorting="true"
        :grid-ready="onReady" :animate-rows="false" :style="gridHeight" class="ag-theme-balham" />
      <div class="pagination-wrap">
        <Pagination :total="totalData" :limit.sync="filterForm.pageSize" :page.sync="filterForm.pageNum"  @pagination="list" />
      </div>
    </div>
  </div>
</template>

<script>
import { getStockPagesApi, recalculateApi } from '@/api/inventory'
import StorageWarehouseSelect from '../components/storageWarehouseSelect'
import warehouseBillBtn from './components/warehouseBillBtn'
import getZHMixin from './components/getZHMixin'
import { toThousandsAndFixDecimalFilter, formatCurrencyName } from '@/utils'
export default {
	name: 'WarehouseBill',
	mixins: [getZHMixin],
	data() {
		return {
			loading: false,
			filterForm: {
				customerId: null,
				warehouseId: null,
				dateTime: [],
				stockType: '10',
				pageNum: 1,
				pageSize: 50
			},
			totalData: 0,
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			rowData: []
		}
	},
	components: { StorageWarehouseSelect, warehouseBillBtn },
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
			this.filterForm.beginTime = this.$isNotEmpty(this.filterForm.dateTime) ? this.filterForm.dateTime[0] : null
			this.filterForm.endTime = this.$isNotEmpty(this.filterForm.dateTime) ? this.filterForm.dateTime[1] : null
			const res = await getStockPagesApi(this.filterForm)
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
		 * 重置
		 */
		clearSearchForm() {
			this.$refs.filterForm.resetFields()
			this.list()
		},
		/**
		 * 重试计费
		 * @param {} id
		 */
		async retryBill(id) {
			this.loading = true
			let res = await recalculateApi(id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.$message.success(this.getZH('recalculateSuccess'))
				this.loading = false
				this.list()
			}
		}

	},
	mounted() { },
	created() {
		this.gridOptions = {
			context: {
				componentParent: this
			},
			rowSelection: 'single', // 设置多行可选
			animateRows: true,
			suppressRowClickSelection: true // 选中单元格后可以复制内容
			// suppressCellSelection: true, //点击不选中单元格
		}
		this.columnFields = [
			{
				field: 'customerName',
				headerName: this.getZH('customerName', 'common'),
				minWidth: 80
			},
			{
				field: 'warehouseName',
				headerName: this.getZH('warehouseName'),
				minWidth: 120
			},
			{
				field: 'beginTime',
				headerName: this.getZH('billingDate'),
				minWidth: 110,
				cellRenderer: params => this.formatDate(params.data.beginTime, "YYYY-MM-DD")
			},
			{
				field: 'unit1Name',
				headerName: this.getZH('billingUnit'),
				minWidth: 50
			},
			{
				field: 'chargeQuantity1',
				headerName: this.getZH('cnt'),
				minWidth: 50,
				cellRenderer(params) {
					return `<div style='text-align: right'>${params.value ? params.value : ''}</div>`
				}
			},
			{
				field: 'currency',
				headerName: this.getZH('currency'),
				minWidth: 80,
				cellRenderer: params => formatCurrencyName(params.data.currency)
			},
			{
				field: 'amount',
				headerName: this.getZH('estimatedAmount'),
				width: 100,
				align: 'right',
				cellRenderer(params) {
					return `<div style='text-align: right'>${toThousandsAndFixDecimalFilter(params.value)}</div>`
				}
			},
			{
				field: 'priceCardName',
				headerName: this.getZH('priceCardName'),
				width: 100
			},
			{
				field: 'chargeCalculateStateName',
				headerName: this.getZH('charge_calculate_state'),
				width: 100
			},
			{
				field: 'remarks',
				headerName: this.getZH('failureReason'),
				width: 100
			},
			// {
			// 	field: 'amount',
			// 	headerName: this.getZH('enterAmount'),
			// 	minWidth: 120,
			//   cellRenderer: params => toThousandsAndFixDecimalFilter(params.data.amount)
			// },
			{
				field: 'id',
				headerName: this.getZH('operation', 'common'),
				minWidth: 110,
				pinned: 'right',
				cellRendererFramework: 'warehouseBillBtn'
			}

		]
		this.list()
	},
	beforeRouteEnter(to, from, next) {
		next()
	}
}
</script>

<style lang='scss' >
.tabs-padding.el-tabs--border-card > .el-tabs__content {
	padding: 5px;
}
</style>
