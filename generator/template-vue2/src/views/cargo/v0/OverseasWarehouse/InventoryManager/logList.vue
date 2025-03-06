<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot
			:searchFun="getList"
			:resetFun="clearSearchForm"
       class="mb-10"
		>
			<el-form
				slot="multipleSearch"
				ref="filterForm"
				:inline="true"
				:model="filterForm"
				size="mini"
				@submit.native.prevent
			>
				<el-form-item
					:label="getZH('systemCategory')"
					prop="systemBarCode"
					label-width="80px"
				>
					<el-input
						v-model="filterForm.systemBarCode"
						@keyup.enter.native="getList"
						clearable
						:placeholder="inputZH('systemCategory')"
					></el-input>
				</el-form-item>
				<el-form-item
					:label="getZH('SKUCategory')"
					prop="skuCode"
					label-width="100px"
				>
					<el-input
						v-model="filterForm.skuCode"
						@keyup.enter.native="getList"
						clearable
						:placeholder="inputZH('SKUCategory')"
					></el-input>
				</el-form-item>

				<el-form-item :label="getZH('customerName', 'common')" prop="customerId" label-width="60px">
					<MemberList
						v-model="filterForm.customerId"
						@change="getList"
						clearable
					/>
				</el-form-item>
				<el-form-item
					:label="getZH('warehouseId')"
					prop="warehouseId"
					label-width="50px"
				>
					<StorageWarehouseSelect
						v-model="filterForm.warehouseId"
						@change="getList"
						clearable
					/>
				</el-form-item>
				<el-form-item
					:label="getZH('groundingNo')"
					prop="groundingNo"
					label-width="50px"
					v-if="type === 1"
				>
					<el-input
						size="mini"
						v-model="filterForm.groundingNo"
						clearable
						@keyup.enter.native="getList"
						:placeholder="inputZH('groundingNo')"
					></el-input>
				</el-form-item>
				<el-form-item
					:label="getZH('saleCountryCodes')"
					prop="saleCountryCodes"
					label-width="80px"
				>
					<el-select
						v-model="filterForm.saleCountryCodes"
						filterable
						clearable
						@change="getList"
					>
						<el-option
							v-for="item in countryList"
							:key="item.id"
							:label="item.chineseShortname"
							:value="item.code2"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					:label="getZH('operatorDate')"
					prop="dateTime"
					label-width="100px"
				>
					<CommonPicker
						pikcerType="daterange"
						v-model="dateTime"
						:parentRangeDate="dateTime"
						clearable
						@change="getList"
					/>
				</el-form-item>
				<el-form-item
					:label="getZH('stockType')"
					prop="stockType"
					label-width="100px"
				>
					<el-select
						v-model="filterForm.stockType"
						size="mini"
						filterable
						clearable
						@change="getList"
					>
						<el-option :label="getZH('stockInventory')" :value="1" />
						<el-option :label="getZH('justInTimeInventory')" :value="2" />
						<el-option :label="getZH('stockAvailable')" :value="3" />
						<el-option :label="getZH('stockFrozen')" :value="4" />
						<el-option :label="getZH('frozenStock')" :value="6" />
						<el-option :label="getZH('outgoingStock')" :value="9" />
						<el-option :label="getZH('stockUnsalable')" :value="10" />
						<el-option :label="getZH('stockDestroy')" :value="11" />
					</el-select>
				</el-form-item>
        <el-form-item :label="getZH('associatedNo')"	prop="associatedNo" label-width="80px">
					<el-input size="mini" v-model.trim="filterForm.associatedNo"	clearable @keyup.enter.native="getList" :placeholder="inputZH('associatedNo')"></el-input>
				</el-form-item>
        <el-form-item :label="getZH('stockNo')"	prop="orderInboundNo" label-width="80px" v-if='type !== 2'>
					<el-input size="mini" v-model.trim="filterForm.orderInboundNo"	clearable @keyup.enter.native="getList" :placeholder="inputZH('stockNo')"></el-input>
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
    <Pagination :total="totalData" :limit.sync="filterForm.pageSize" :page.sync="filterForm.pageNum" @pagination="getList" />
  </div>
</template>

<script>
import { getCountryListApi } from '@/api/OverseasWarehouse/goodsManager'
import { getLogListApi, exportLogApi, getLogGoodsApi, exportGoodsLogApi } from '@/api/inventory'
import { getMemberListApi } from '@/api/orderManager'
import StorageWarehouseSelect from '../components/storageWarehouseSelect'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'LogList',
	mixins: [getZHMixin],
	data() {
		return {
			loading: false,
			type: 1,
			countryList: [],
			memberList: [],
			dateTime: [],
			filterForm: {
				systemBarCode: '',
				skuCode: '',
				warehouseId: '',
				customerId: '',
				groundingNo: '',
				optStartTime: '',
				optEndTime: '',
				stockType: null,
				associatedNo: null,
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
	components: { StorageWarehouseSelect },
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
		async getCountryList() {
			const res = await getCountryListApi()
			if (res.ok) {
				this.countryList = res.content
			}
		},
		async getMemberList() {
			const res = await getMemberListApi()
			if (res.ok) {
				this.memberList = res.content
			}
		},
		async getList() {
			this.loading = true
			this.filterForm.optStartTime = this.$isEmpty(this.dateTime) ? null : this.dateTime[0]
			this.filterForm.optEndTime = this.$isEmpty(this.dateTime) ? null : this.dateTime[1] + 24 * 60 * 60 * 1000
			let fn = this.type === 1 ? getLogListApi : getLogGoodsApi
			const res = await fn({ ...this.filterForm })
			if (res.ok) {
				res.content.list.forEach(item => {
					item.beforeOptQuantity = Number(item.beforeOptQuantity)
					item.afterOptQuantity = Number(item.afterOptQuantity)
				})
				this.rowData = res.content.list
				this.totalData = res.content.total
			} else {
				this.rowData = []
				this.totalData = 0
			}
			this.loading = false
		},
		clearSearchForm() {
			this.dateTime = []
			this.$refs.filterForm.resetFields()
			this.getList()
		},
		/**
		 * 批量导出
		 */
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
				this.filterForm.optStartTime = this.$isEmpty(this.dateTime) ? null : this.dateTime[0]
				this.filterForm.optEndTime = this.$isEmpty(this.dateTime) ? null : this.dateTime[1] + 24 * 60 * 60 * 1000
				saveData = { ...this.filterForm }
			}
			this.loading = true
			let fn = Number(this.type) === 1 ? exportLogApi : exportGoodsLogApi
			const res = await fn(saveData)
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
		this.type = this.$route.meta.status
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
				minWidth: 80
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
				field: 'groundingNo',
				headerName: this.getZH('groundingNo'),
				minWidth: 150,
				hide: this.type === 2
			},
			{
				field: 'orderInboundNo',
				headerName: this.getZH('stockNo'),
				minWidth: 170,
				hide: this.type === 2
			},
			{
				field: 'stockTypeName',
				headerName: this.getZH('stockType'),
				minWidth: 50
			},
			{
				field: 'beforeOptQuantity',
				headerName: this.getZH('beforeOptQuantity'),
				minWidth: 50,
			},
			{
				field: 'quantity',
				headerName: this.getZH('quantity'),
				minWidth: 50,
				cellRenderer: params => {
					if (params.data.quantity) {
						if (params.data.changeDirection === 1) {
							return `<span class="table-text reduce">	-${params.data.quantity}</span>`
						} else {
							return `<span class="table-text add">+${params.data.quantity}</span>`
						}
					}
				}
			},
			{
				field: 'afterOptQuantity',
				headerName: this.getZH('afterOptQuantity'),
				minWidth: 50
			},
			{
				field: 'associatedNo',
				headerName: this.getZH('associatedNo'),
				minWidth: 50
			},
			{
				field: 'changeTypeName',
				headerName: this.getZH('changeTypeName'),
				minWidth: 50
			},
			{
				field: 'createTime',
				headerName: this.getZH('operatorDate'),
				minWidth: 120,
				cellRenderer: params => this.formatDate(params.data.createTime, "YYYY-MM-DD HH:mm:ss")
			},
			{
				field: 'happenTime',
				headerName: this.getZH('happenTime'),
				minWidth: 120,
				cellRenderer: params => this.formatDate(params.data.happenTime, "YYYY-MM-DD HH:mm:ss")
			}
		]
		let route = this.$route.query
		if (this.$isNotEmpty(route)) {
			this.$copyProps(this.filterForm, route)
		}
		this.getCountryList()
		this.getList()
	},
	beforeRouteEnter(to, from, next) {
		next()
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
