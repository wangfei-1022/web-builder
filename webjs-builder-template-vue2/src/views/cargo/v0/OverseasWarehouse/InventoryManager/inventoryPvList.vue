<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="clearSearchForm" class="mb-10">
			<el-form	slot="multipleSearch" ref="filterForm" :inline="true" :model="filterForm" 	label-width="100px">
				<el-form-item :label="getZH('customerName', 'common')"	prop="customerId"  >
          <TypeSelect v-model="filterForm.customerId" type="customer" @selected='getList' />
				</el-form-item>
				<el-form-item	:label="getZH('SKUCategory')" prop="skuCode">
					<el-input v-model="filterForm.skuCode" @keyup.enter.native="getList" size="mini" clearable :placeholder="inputZH('SKUCategory')"></el-input>
				</el-form-item>
				<el-form-item	:label="getZH('stockNo')" prop="orderNo">
					<el-input v-model="filterForm.orderNo" @keyup.enter.native="getList" size="mini" clearable :placeholder="inputZH('stockNo')"></el-input>
				</el-form-item>
				<el-form-item	:label="getZH('warehouseId')"	prop="warehouseId">
					<StorageWarehouseSelect v-model="filterForm.warehouseId" clearable @change="getList" />
				</el-form-item>
        <el-form-item	:label="getZH('groundingNo')" prop="groundingNo">
					<el-input v-model="filterForm.groundingNo" @keyup.enter.native="getList" size="mini" clearable :placeholder="inputZH('groundingNo')"></el-input>
				</el-form-item>
        <el-form-item	:label="getZH('containerNo')" prop="containerNo">
					<el-input v-model="filterForm.containerNo" @keyup.enter.native="getList" size="mini" clearable :placeholder="inputZH('containerNo')"></el-input>
				</el-form-item>
        <el-form-item	:label="getZH('blNo')" prop="blNo">
					<el-input v-model="filterForm.blNo" @keyup.enter.native="getList"  size="mini" clearable :placeholder="inputZH('blNo')"></el-input>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
    <div class="top-btn-wrap mb-10">
      <el-button type="primary" @click="exportAll" size="mini">
        {{getZH('searchExport')}}
      </el-button>
      <el-button type="primary" @click="dialog.visible=true" size="mini">
        {{getZH('importMrnInfo')}}
      </el-button>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptions"
      :side-bar="sideBarDefs"
      :column-defs="columnFields"
      :row-data="rowData"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReady"
      :animate-rows="false"
      :style="gridHeight"
      class="ag-theme-balham"
    />
    <Pagination	:total="totalData" :limit.sync="filterForm.pageSize" :page.sync="filterForm.pageNum"	@pagination="getList" />
    <recordMrnInfoDialog :data='activeData' :visible.sync="recordMrnInfoVisible" @saved='getList'></recordMrnInfoDialog>
    <importMrnInfoDialog :visible.sync="dialog.visible" @saved='getList' />
  </div>
</template>

<script>
import { getStockPVListApi, exportInboundMrnApi } from '@/api/inventory'
import operationPV from './components/operationPV'
import StorageWarehouseSelect from '../components/storageWarehouseSelect'
import recordMrnInfoDialog from './components/recordMrnInfoDialog'
import importMrnInfoDialog from './components/importMrnInfoDialog'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'InventoryPvList',
	mixins: [getZHMixin],
	components: { operationPV, StorageWarehouseSelect, recordMrnInfoDialog, importMrnInfoDialog },
	data() {
		return {
			loading: false,
			filterForm: {
				orderNo: '',
				skuCode: '',
				customerId: '',
				warehouseId: '',
				groundingNo: '',
				containerNo: '',
				blNo: '',
				pageNum: 1,
				pageSize: 50
			},
			activeData: {},
			totalData: 0,
			recordMrnInfoVisible: false,
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			rowData: []
		}
	},

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
		async getList() {
			this.loading = true
			const res = await getStockPVListApi({ ...this.filterForm })
			if (res.ok) {
				this.rowData = res.content.list
				this.totalData = Number(res.content.total)
			} else {
				this.rowData = [{}]
				this.totalData = 0
			}
			this.loading = false
		},
		/**
	 * 补录MRN信息
	 */
		recordMrnInfo(row) {
			let activeData = {
				orderInboundNo: row.orderNo,
				mrnNo: row.mrnNo,
				mrnCreateTime: row.mrnCreateTime
			}
			this.activeData = activeData
			this.recordMrnInfoVisible = true
		},
		clearSearchForm() {
			this.$refs.filterForm.resetFields()
			this.getList()
		},
		async exportAll() {
			const _selectedRows = this.gridApi.getSelectedRows()
			let saveData = {}
			let ids = []
			if (this.$isNotEmpty(_selectedRows)) {
				_selectedRows.forEach(item => {
					ids.push(item.id)
				})
				saveData = { ids }
			} else {
				saveData = { ...this.filterForm }
			}
			this.loading = true
			const res = await exportInboundMrnApi(saveData)
			if (res.ok) {
				this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime', 'common')}</span><span class="fs-16">,${this.getZH('handlerRes', 'common')}</span></div>`, this.getZH('handlerExportTips', 'common'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.getZH('theKnow', 'common'),
					callback: () => {
					}
				})
			}
			this.loading = false
		}
	},
	mounted() { },
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
				headerName: this.getZH('rowIndex', 'common'),
				minWidth: 70,
				maxWidth: 70,
				cellRenderer: params => params.rowIndex + 1
			},
			{
				field: 'customerName',
				headerName: this.getZH('customerName', 'common'),
				minWidth: 140
			},
			{
				field: 'blNo',
				headerName: this.getZH('blNo'),
				minWidth: 120
			},
			{
				field: 'orderNo',
				headerName: this.getZH('stockNo'),
				minWidth: 120
			},
			{
				field: 'containerNo',
				headerName: this.getZH('containerNo'),
				minWidth: 120
			},

			{
				field: 'warehouseName',
				headerName: this.getZH('warehouseName'),
				minWidth: 160
			},
			{
				field: 'skuCode',
				headerName: this.getZH('SKUCategory'),
				minWidth: 140
			},
			{
				field: 'groundingNo',
				headerName: this.getZH('groundingNo'),
				minWidth: 120
			},
			{
				field: 'groundingTime',
				headerName: this.getZH('groundingTime'),
				minWidth: 140,
				cellRenderer: params => params.value ? this.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss') : '-'
			},
			{
				field: 'stockLocationCode',
				headerName: this.getZH('stockLocationCode'),
				minWidth: 100
			},
			{
				field: 'quantityGrounding',
				headerName: this.getZH('batchStockAmount'),
				minWidth: 140
			},
			{
				field: 'stock',
				headerName: this.getZH('batchCurrInventory'),
				minWidth: 140
			},
			{
				field: 'groundingAge',
				headerName: this.getZH('viewAge'),
				minWidth: 140
			},
			{
				field: 'damageQuantity',
				headerName: this.getZH('damageQuantity'),
				minWidth: 100
			},
			{
				field: 'mrnNo',
				headerName: this.getZH('mrnNo'),
				minWidth: 140,
				cellRenderer: params => params.value || '-'
			},
			{
				field: 'mrnCreateTime',
				headerName: this.getZH('mrnCreateTime'),
				minWidth: 140,
				cellRenderer: params => params.value ? this.formatDate(params.value, 'YYYY-MM-DD') : '-'
			},
			{
				field: 'id',
				headerName: this.getZH('operation', 'common'),
				minWidth: 180,
				pinned: 'right',
				cellRendererFramework: 'operationPV'
			}
		]
		this.getList()
	}
}
</script>

<style lang='scss' scoped>
.features-btn {
	margin-bottom: 10px;
}
</style>
