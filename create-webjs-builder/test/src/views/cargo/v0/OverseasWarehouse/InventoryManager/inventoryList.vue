<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="clearSearchForm"  class="mb-10">
			<el-form slot="multipleSearch" ref="filterForm" :inline="true" :model="filterForm"	size="mini">
				<el-form-item	:label="getZH('systemCategory')"	prop="systemBarCode"	label-width="80px">
					<el-input	v-model="filterForm.systemBarCode"	@keyup.enter.native="getList"	clearable	:placeholder="inputZH('systemCategory')"></el-input>
				</el-form-item>
				<el-form-item :label="getZH('SKUCategory')" prop="skuCode"	label-width="100px">
					<el-input	v-model="filterForm.skuCode"	@keyup.enter.native="getList"	clearable	:placeholder="inputZH('SKUCategory')"></el-input>
				</el-form-item>
				<el-form-item :label="getZH('customerName', 'common')" prop="customerId"	label-width="80px"	>
          <type-select type="customer" v-model="filterForm.customerId" @selected="getList"></type-select>
				</el-form-item>
				<el-form-item	:label="getZH('warehouseId')"	prop="warehouseId"	label-width="50px">
					<StorageWarehouseSelect v-model="filterForm.warehouseId" clearable	@change="getList" />
				</el-form-item>
				<el-form-item	:label="getZH('saleCountryCodes')"	prop="saleCountryCodes" label-width="80px">
					<el-select	v-model="filterForm.saleCountryCodes"	filterable clearable	@change="getList">
						<el-option v-for="item in countryList" :key="item.id" :label="item.chineseShortname" :value="item.code2" />
					</el-select>
				</el-form-item>
				<el-form-item	:label="getZH('stockNameZh')" prop="name"	label-width="80px">
					<el-input	v-model="filterForm.name"	:placeholder="inputZH('stockNameZh')"	@keyup.enter.native="getList" clearable></el-input>
				</el-form-item>
				<el-form-item :label="getZH('stockNameEn')"	prop="englishName" label-width="100px">
					<el-input	v-model="filterForm.englishName" :placeholder="inputZH('stockNameEn')"	@keyup.enter.native="getList" clearable ></el-input>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
    <div class="top-btn-wrap mb-10">
      <el-button type="primary" @click="exportAll" size="mini">
        {{getZH('searchExport')}}
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
    <div class="page-total" >
      <span>{{getZH('inventoryStatistics')}}：</span>
      <span class="page-total-item" v-show="$isNotEmpty(filterForm.warehouseId) || $isNotEmpty(filterForm.customerId)">
        <span>
          <span class="value-item">
            <span class='value'>{{getZH('skuKindsAvailableCount')}}：</span>
            <span>{{amountTotalMap['skuKindsAvailableCount'] || 0}}</span>
          </span>
          <span class="value-item">
            <span class='value'>{{getZH('justInTimeInventory')}}：</span>
            <span>{{amountTotalMap['stockCount'] || 0 }}</span>
          </span>
          <span class="value-item">
            <span class='value'>{{getZH('stockAvailable')}}：</span>
            <span>{{amountTotalMap['stockAvailableCount'] || 0 }}</span>
          </span>
          <!-- <span class="value-item">
            <span class='value'>{{getZH('stockInventory')}}：</span>
            <span>{{amountTotalMap['stockInventoryCount'] || 0 }}</span>
          </span> -->
          <span class="value-item">
            <span class='value'>{{getZH('stockFrozen')}}：</span>
            <span>{{amountTotalMap['stockFrozenCount'] || 0 }}</span>
          </span>
        </span>
      </span>
    </div>
    <Pagination	:total="totalData" :limit.sync="filterForm.pageSize" :page.sync="filterForm.pageNum"	@pagination="getList" />
  </div>
</template>

<script>
import { getCountryListApi } from '@/api/OverseasWarehouse/goodsManager'
import { getInventoryListApi, exportInventoryApi, getStockCountApi } from '@/api/inventory'
import InventoryListBtn from './components/InventoryListBtn'
import StorageWarehouseSelect from '../components/storageWarehouseSelect'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'InventoryList',
	mixins: [getZHMixin],
	data() {
		return {
			loading: false,
			countryList: [],
			memberList: [],
			filterForm: {
				systemBarCode: '',
				skuCode: '',
				customerId: '',
				warehouseId: '',
				saleCountryCodes: '',
				name: null,
				englishName: null,
				pageNum: 1,
				pageSize: 50
			},
			totalData: 0,
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			rowData: [],
			amountTotalMap: {}
		}
	},
	components: {
		InventoryListBtn,
		StorageWarehouseSelect
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
		async getCountryList() {
			const res = await getCountryListApi()
			if (res.ok) {
				this.countryList = res.content
			}
		},
		// 获取库存统计
		async getStockCount() {
			let filterData = {
				customerId: this.filterForm.customerId,
				warehouseId: this.filterForm.warehouseId
			}
			let res = await getStockCountApi(filterData)
			if (res.ok) {
				this.amountTotalMap = res.content || {}
			}
		},
		async getList() {
			this.loading = true
			if (this.$isNotEmpty(this.filterForm.warehouseId || this.$isNotEmpty(this.filterForm.customerId))) {
				this.getStockCount()
			}
			const res = await getInventoryListApi({ ...this.filterForm })
			if (res.ok) {
				this.rowData = res.content.list
				this.totalData = Number(res.content.total)
			} else {
				this.rowData = []
				this.totalData = 0
			}
			this.loading = false
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
			const res = await exportInventoryApi(saveData)
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
				field: 'customerName',
				headerName: this.getZH('customerName', 'common'),
				minWidth: 140
			},
			{
				field: 'systemBarCode',
				headerName: this.getZH('systemCategory'),
				minWidth: 120
			},
			{
				field: 'skuCode',
				headerName: this.getZH('SKUCategory'),
				minWidth: 120
			},
			{
				field: 'warehouseName',
				headerName: this.getZH('warehouseId'),
				minWidth: 120
			},
			{
				field: 'stock',
				headerName: this.getZH('justInTimeInventory'),
				minWidth: 100
			},
			{
				field: 'stockAvailable',
				headerName: this.getZH('stockAvailable'),
				minWidth: 100
			},
			{
				field: 'stockFrozen',
				headerName: this.getZH('stockFrozen'),
				minWidth: 100
			},
			{
				field: 'stockInventory',
				headerName: this.getZH('stockInventory'),
				minWidth: 100
			},
			{
				field: 'stockDestroy',
				headerName: this.getZH('stockDestroy'),
				minWidth: 100
			},
			{
				field: 'stockUnsalable',
				headerName: this.getZH('stockUnsalable'),
				minWidth: 100
			},
			{
				field: 'quantityGrounding',
				headerName: this.getZH('quantityGrounding'),
				minWidth: 100
			},
			{
				field: 'quantityOutbound',
				headerName: this.getZH('quantityOutbound'),
				minWidth: 100
			},
			{
				field: 'name',
				headerName: this.getZH('stockNameZh'),
				minWidth: 100
			},
			{
				field: 'englishName',
				headerName: this.getZH('stockNameEn'),
				minWidth: 100
			},
			{
				field: 'saleCountryNames',
				headerName: this.getZH('saleCountryCodes'),
				minWidth: 100
			},
			{
				field: 'goodsTypeName',
				headerName: this.getZH('goodsTypeName'),
				minWidth: 100
			},

			{
				field: 'id',
				headerName: this.getZH('operation', 'common'),
				minWidth: 180,
				pinned: 'right',
				cellRendererFramework: 'InventoryListBtn'
			}
		]
		this.getCountryList()
	}
}
</script>

<style lang='scss' scoped>
.features-btn {
	margin-bottom: 10px;
}
.page-total {
	min-height: 40px;
}
</style>
