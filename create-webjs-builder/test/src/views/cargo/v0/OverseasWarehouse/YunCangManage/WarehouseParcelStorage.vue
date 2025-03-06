<template>
	<div class="pd-16" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
			<el-form	slot="multipleSearch"	ref="formData" :inline="true" :model="formData"	size="mini"	label-width="110px">
				<el-form-item	class="el-form-item" :label="getZH('customerName', 'common')"	prop="customerId"	>
          <TypeSelect v-model="formData.customerId"  type="customer"  @selected="list" />
				</el-form-item>
        <el-form-item 	:label="getZH('orderInboundNo', 'putInStorageManage')"	prop="orderNo">
					<el-input	v-model="formData.orderNo"	@keyup.enter.native="list" clearable :placeholder="inputZH('orderInboundNo', 'putInStorageManage')"	></el-input>
				</el-form-item>
				<el-form-item :label="getZH('warehouse', 'putInStorageManage')" prop="warehouseId">
					<StorageWarehouseSelect	v-model="formData.warehouseId"	@change="list"	:data="{ dockingWay: 4 }"	clearable	/>
				</el-form-item>
				<el-form-item :label="getZH('deliveryMethod', 'putInStorageManage')"	prop="deliveryMethod">
					<el-select v-model="formData.orderState" size="mini" class="w-100" @change="list">
            <el-option :label="getZH('all', 'putInStorageManage')" :value="null" />
            <el-option :label="getZH('deliveryMethod', 'putInStorageManage')" :value="1" />
            <el-option :label="getZH('deliveryMethod', 'putInStorageManage')" :value="2" />
          </el-select>
				</el-form-item>
				<el-form-item :label="getZH('orderState', 'putInStorageManage')"	prop="orderState">
					<el-select v-model="formData.orderState" size="mini" class="w-100" @change="list">
            <el-option :label="getZH('all', 'putInStorageManage')" :value="null" />
            <el-option :label="getZH('firstLegInTransit', 'putInStorageManage')" :value="8" />
            <el-option :label="getZH('partOfTheShelf', 'putInStorageManage')" :value="12" />
          </el-select>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
		<div>
			<div class="mb-10 flex-box top-btn-wrap">
				<el-button size="mini" type="primary" @click="exportData">
					{{ getZH("exportBtn", "common") }}
				</el-button>
				<el-button
					v-permission="['ovl:cloud:warehouse:in:grounding']"
					size="mini"
					type="primary"
					class="ml-10"
					@click="dialog.visible = true"
				>
					{{getZH('batchUpdate')}}
				</el-button>
        <el-checkbox class="ml-20" v-model="isCurrentZone">{{getZH('isCurrentZone')}}</el-checkbox>
			</div>
			<ag-grid-vue
				:locale-text-func="_i18nGridLocalText"
				:grid-options="gridOptionsRight"
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
			<ImportDialog :visible.sync="dialog.visible" @saved="list" :batchType='5' />
			<HandlerGrounding  :visible.sync="dialogVisible" :id='orderId' @saved="list"  />
			<div class="pagination-wrap">
				<Pagination :total="totalData" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
			</div>
		</div>
	</div>
</template>

<script>
import ImportDialog from './components/importDialog'
import { getGridSelected } from '@/utils/gridChoose'
import StorageWarehouseSelect from "../components/storageWarehouseSelect.vue"
import { getCloudPackageboundApi, exportCloudPackageInboundApi, completeCloudInboundApi } from "@/api/OverseasWarehouse/YunCangManage"
import getZHMixin from './components/getZHMixin'
import operationBtn from './components/operation.vue'
import HandlerGrounding from './components/handlerGrounding'
import { formatDateStr } from '@/filters'
export default {
	name: 'WarehouseEntry',
	components: { StorageWarehouseSelect, ImportDialog, operationBtn, HandlerGrounding },
	mixins: [getZHMixin],
	data() {
		return {
			loading: false,
			fileList: [],
			formData: {
				orderNo: '',
				warehouseId: '',
				customerId: '',
				customerSystemNo: '',
				orderState: null,
				deliveryMethod: null,
				pageNum: 1,
				pageSize: 50
			},
			gridOptionsRight: {
				rowSelection: 'multiple',
				rowMultiSelectWithClick: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			totalData: 0,
			orderId: null,
			isCurrentZone: false,
			dialogVisible: false,
			gridApi: null,
			columnApi: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			dataList: []
		}
	},
	computed: {
		filterDataList() {
			let arr = this.dataList
			arr.forEach(item => {
				let zone = this.isCurrentZone ? null : item.warehouseZone
				let firstPutawayTimeStr = formatDateStr(item.firstPutawayTime, zone)
				this.$set(item, 'firstPutawayTimeStr', firstPutawayTimeStr)
				let createTimeStr = formatDateStr(item.createTime, zone)
				this.$set(item, 'createTimeStr', createTimeStr)
			})
			return this.$extends(true, [], arr)
		}
	},
	watch: {
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
		/**
		 * 部分上架
		 */
		partialShelf(id) {
			this.orderId = id
			this.dialogVisible = true
		},
		/**
		 * 更新单条数据
		 */
		shelfCompleted(id) {
			this.$confirm(this.getZH('shelfCompletedTips', 'putInStorageManage'), this.$t('common.tips'), {
				confirmButtonText: this.getZH('confirmSuccess', 'putInStorageManage'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				completeCloudInboundApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('shelfCompleted', 'putInStorageManage'))
						this.list()
					}
					this.loading = false
				})

			}).catch(() => { })
		},
		/**
	 * 获取表格选中的数据集合
	 */
		getSelectData() {
			const rows = getGridSelected(this.gridOptionsRight)
			return rows
		},
		/**
		 * 获取列表
		 */
		async list() {
			this.loading = true
			let res = await getCloudPackageboundApi(this.formData)
			if (res.ok) {
				this.dataList = res.content.list || []
				this.totalData = res.content.total
				this.loading = false
			}
		},
		/**
		 * 文件导出
		 */
		async exportData() {
			this.loading = true
			let filterForm = this.$extends({}, this.formData)
			let selected = this.getSelectData()
			if (this.$isNotEmpty(selected)) {
				let ids = []
				selected.forEach(item => {
					ids.push(item.id)
				})
				filterForm.ids = ids.join(",")
			}
			let res = await exportCloudPackageInboundApi(filterForm)
			if (res.ok) {
				this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`, this.getZH('handlerTips'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.getZH('theKnow', 'common'),
					callback: () => {
						this.$router.push({ name: `TaskList`, query: { time: new Date().getTime() } })
					}
				})
				this.loading = false
			} else {
				this.loading = false
			}
		},
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.list()
		}
	},
	mounted() { },
	created() {
		this.columnFields = [
			{
				headerName: '', width: 55, pinned: 'left',
				suppressSorting: true, checkboxSelection: true, headerCheckboxSelection: true,
				suppressMenu: true, suppressSizeToFit: true, suppressResize: true
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
				minWidth: 100
			},
			{
				field: 'orderNo',
				headerName: this.getZH('orderInboundNo', 'putInStorageManage'),
				minWidth: 120
			},
			{
				field: 'warehouseName',
				headerName: this.getZH('warehouse', 'putInStorageManage'),
				minWidth: 120
			},
			{
				field: 'deliverModeTypeName',
				headerName: this.getZH('deliveryMethod', 'putInStorageManage'),
				minWidth: 120
			},
			{
				field: 'statusName',
				headerName: this.getZH('orderState', 'putInStorageManage'),
				minWidth: 130
			},
			{
				field: 'boxQuantity',
				headerName: this.getZH('parcelQuantity', 'putInStorageManage'),
				minWidth: 130
			},
			{
				field: 'skuKindQuantity',
				headerName: this.getZH('forecastSKUTypes', 'putInStorageManage'),
				minWidth: 130
			},
			{
				field: 'skuQuantity',
				headerName: this.getZH('forecastSKUTotal', 'putInStorageManage'),
				minWidth: 130
			},
			{
				field: 'putawaySkuKindsQuantity',
				headerName: this.getZH('groupingSkuKindQuantity', 'putInStorageManage'),
				minWidth: 120
			},
			{
				field: 'putawaySkuQuantity',
				headerName: this.getZH('groupingSkuQuantity', 'putInStorageManage'),
				minWidth: 120
			},
			{
				field: 'createTimeStr',
				headerName: this.getZH('createTime', 'putInStorageManage'),
				minWidth: 200
			},
			{
				field: 'firstPutawayTimeStr',
				headerName: this.getZH('firstPutawayTime', 'putInStorageManage'),
				minWidth: 200
			},

			{
				headerName: this.getZH('operation', 'common'), pinned: 'right', field: `id`, minWidth: 180,
				cellRendererFramework: 'operationBtn'
			}
		]
		this.list()
	},
	beforeRouteEnter(to, from, next) {
		next()

	}
}
</script>

<style lang='scss' scoped>
</style>
