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
				<el-form-item :label="getZH('warehouseCode')" prop="code"	label-width="100px">
          <el-input size='mini' v-model="filterForm.code" :placeholder="inputZH('warehouseCode')" @keyup.enter.native="list" />
				</el-form-item>
				<el-form-item :label="getZH('country')" prop="countryCode"	label-width="100px">
          <NationalGroupSelect v-model="filterForm.countryCode" @change="list" />
				</el-form-item>
				<el-form-item :label="getZH('zipcode')" prop="zipcode"	label-width="100px">
          <el-input size='mini' v-model="filterForm.zipcode" :placeholder="inputZH('zipcode')" @keyup.enter.native="list" />
				</el-form-item>
			</el-form>
		</top-search-items-slot>
    <div class="mb-10 top-btn-wrap">
      <el-button size="mini" type="primary" @click="edit()"> {{$t('common.addBtn')}}</el-button>
      <el-button size="mini" type="primary" @click="batchExport()">{{$t('common.importBtn')}}</el-button>
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
			<div class="pagination-wrap">
				<Pagination
					:total="totalData"
					:limit.sync="filterForm.pageSize"
					:page.sync="filterForm.pageNum"
					@pagination="list"
				/>
			</div>
      <FBAWarehouseEdit :visible.sync="dialog.visible" :id="id" @saved='list' />
      <ImportFBAWarehouse :visible.sync="dialogVisible" @saved='list' />
		</div>
	</div>
</template>
<script>
import FBAOpearation from './components/FBAOpearation'
import NationalGroupSelect from '../components/NationalGroupSelect'
import FBAWarehouseEdit from './FBAWarehouseEdit'
import ImportFBAWarehouse from './components/importFBAWarehouse'
import { getFBAWarehouseApi, delFBAWarehouseApi } from '@/api/OverseasWarehouse/overseasManage.js'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'FBAWarehouseList',
	mixins: [getZHMixin],
	components: { FBAOpearation, NationalGroupSelect, FBAWarehouseEdit, ImportFBAWarehouse },
	data() {
		return {
			loading: false,
			filterForm: {
				zipcode: null,
				code: null,
				countryCode: null,
				pageNum: 1,
				pageSize: 50
			},
			totalData: 0,
			dialogVisible: false,
			id: null,
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
		/**
		 * 获取列表
		 */

		async list() {
			this.loading = true
			const res = await getFBAWarehouseApi(this.filterForm)
			if (res.ok) {
				this.rowData = res.content.list
				this.totalData = Number(res.content.total)
			} else {
				this.rowData = []
				this.totalData = 0
			}
			this.loading = false
		},
		edit(id) {
			this.id = id || null
			this.dialog.visible = true
		},
		del(id) {
			this.$confirm(this.getZH('delFBATips'), this.getZH('tips', 'common'), {
				cancelButtonText: this.getZH('cancel', 'common'),
				confirmButtonText: this.getZH('confirmBtn', 'common'),
				type: 'warning'
			}).then(() => {
				delFBAWarehouseApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('deleteSuccess', 'common'))
						this.list()
					}
				})
			})
		},
		batchExport() {
			this.dialogVisible = true
		},
		/**
		 * 重置
		 */
		clearSearchForm() {
			this.$refs.filterForm.resetFields()
			this.list()
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
				field: 'code',
				headerName: this.getZH('warehouseCode'),
				minWidth: 120
			},
			{
				field: 'countryName',
				headerName: this.getZH('country'),
				minWidth: 120
			},
			{
				field: 'provinceName',
				headerName: this.getZH('provinceName'),
				minWidth: 150
			},
			{
				field: 'city',
				headerName: this.getZH('city'),
				minWidth: 150
			},
			{
				field: 'address1',
				headerName: this.getZH('address'),
				minWidth: 120
			},
			{
				field: 'zipcode',
				headerName: this.getZH('zipcode'),
				minWidth: 120
			},
			{
				field: 'id',
				headerName: this.getZH('operation', 'common'),
				minWidth: 110,
				maxWidth: 150,
				pinned: 'right',
				cellRendererFramework: 'FBAOpearation'
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
::v-deep.status-wrap {
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;
	.status-dot {
		display: block;
		width: 6px;
		height: 6px;
		border-radius: 6px;
		background: #ccc;
		margin-right: 4px;
		&.processing {
			background: #e6a23c;
		}
		&.successed {
			background: #67c23a;
		}
		&.rejected {
			background: #f56c6c;
		}
	}
}
.features-btn {
	margin-bottom: 10px;
}
</style>
