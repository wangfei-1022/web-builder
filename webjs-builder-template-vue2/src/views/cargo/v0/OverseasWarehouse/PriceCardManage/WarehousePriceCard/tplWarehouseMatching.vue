<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
			<el-form
				slot="multipleSearch"
				ref="filterForm"
				:inline="true"
				:model="filterForm"
				size="mini"
				@submit.native.prevent
			>
        <el-form-item :label="getZH('warehouse_name')" label-width="70px" prop="warehouseId">
					<StorageWarehouseSelect
						v-model="filterForm.warehouseId"
						clearable
						@change="list"
					/>
				</el-form-item>
			</el-form>
		</top-search-items-slot>
    <div class="mb-10 top-btn-wrap">
			<el-button icon="el-icon-plus" size="mini" type="primary" @click="add()" v-permission="['ovl:warehouse:priceCard:template:matching:add']">
        {{$t('common.addBtn')}}
			</el-button>
		</div>
		<div >
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
      <priceCardTemplateAdd :visible.sync="dialog.visible" @saved="list" :type="'10'" />
			<div class="pagination-wrap">
				<Pagination
					:total="totalData"
					:limit.sync="filterForm.pageSize"
					:page.sync="filterForm.pageNum"
					@pagination="list"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import priceCardTemOperation from './components/priceCardTemOperation'
import { getWarehousePriceCardBusinessTempApi, delWarehousePriceCardsTemplateApi } from '@/api/OverseasWarehouse/overseasManage.js'
import priceCardTemplateAdd from '../components/priceCardTemplateAdd'
import StorageWarehouseSelect from '../../components/storageWarehouseSelect'
export default {
	name: 'PriceCardTemplateMatching',
	data() {
		return {
			loading: false,
			filterForm: {
				warehouseId: null,
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
	components: { priceCardTemOperation, priceCardTemplateAdd, StorageWarehouseSelect },
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
		/**
		 * 删除
		 */
		del(row) {
			this.$confirm(this.getZH('delTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				delWarehousePriceCardsTemplateApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})

			}).catch(() => {
				// do nothing
			})
		},
		/**
		 * 获取列表
		 */
		async list() {
			this.loading = true
			const res = await getWarehousePriceCardBusinessTempApi(this.filterForm)
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
		 * 新增
		 */
		add() {
			this.dialog.visible = true
		},
		/**
		 * 下拉框
		 */
		selectZH(key, obj) {
			return this.getZH("selectPlaceholder", "common") + this.getZH(key, obj);
		},
		/**
		 * 输入框
		 */
		inputZH(key, obj) {
			return this.getZH("placeholder", "common") + this.getZH(key, obj);
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || "overseasManage";
			let str = obj + "." + key;
			return this.$t(str);
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
				field: 'priceCardName',
				headerName: this.getZH('templateName'),
				minWidth: 120
			},
			{
				field: 'version',
				headerName: this.getZH('version'),
				minWidth: 120,
				cellRenderer: params => `V${params.data.version}${params.data.latestFlag ? '<span class="label-data">NEW</span>' : ''}`
			},
			{
				field: 'warehouseName',
				headerName: this.getZH('warehouse_name'),
				minWidth: 50

			},
			{
				field: 'id',
				headerName: this.getZH('operation', 'common'),
				minWidth: 80,
				maxWidth: 110,
				pinned: 'right',
				cellRendererFramework: 'priceCardTemOperation'
			}

		]
		let route = this.$route.query
		if (this.$isNotEmpty(route)) {
			this.$copyProps(this.filterForm, route)
		}
		this.list()
	},
	beforeRouteEnter(to, from, next) {
		next()
	}
}
</script>

<style lang='scss' scoped>
::v-deep.label-data {
	padding: 1px;
	border-radius: 4px;
	border: 1px solid #666;
	margin-left: 20px;
	color: #666;
	font-size: 12px;
}
</style>
