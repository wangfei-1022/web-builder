<template>
	<div v-loading="loading" class="pd-16">
		<div class="mb-10">
			<TopSearchItemsSlot
				:searchFun="list"
				:resetFun="reset"
			>
				<template slot="multipleSearch">
					<el-form
						ref="formData"
						:inline="true"
						:model="formData"
						class="search-form"
						label-width="100px"
					>
						<el-form-item
							class="el-form-item"
							:label="getZH('warehouse')"
							prop="warehouseId"
						>
              <storageWarehouseSelect v-model="formData.warehouseId" clearable @change="list" />
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('countryName')"
							prop="countryCode"
						>
							<NationalGroupSelect
								v-model="formData.countryCode"
								@change="list"
							/>
						</el-form-item>
						<el-form-item :label="getZH('supplierName')" prop="supplierId">
              <type-select v-model="formData.supplierId" type="supplier" @selected="list" :requestParams="{businessType: 'OVERSEAS_WAREHOUSE'}"></type-select>
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('status')"
							prop="status"
						>
							<el-select v-model="formData.status" size="mini" @change="list">
								<el-option :label="getZH('all')" :value="null" />
								<el-option :label="getZH('active')" :value="1" />
								<el-option :label="getZH('inactive')" :value="2" />
							</el-select>
						</el-form-item>
					</el-form>
				</template>
			</TopSearchItemsSlot>
		</div>
		<div class="mb-10 top-btn-wrap">
			<el-button
				icon="el-icon-plus"
				size="mini"
				type="primary"
				@click="edit(null, '0')"
				>{{ getZH("add") }}</el-button
			>
		</div>
		<ag-grid-vue
			:locale-text-func="_i18nGridLocalText"
			:grid-options="gridOptionsRight"
			:side-bar="sideBarDefs"
			:column-defs="columnDefsRight"
			:row-data="dataList"
			:enable-col-resize="true"
			:enable-sorting="true"
			:grid-ready="onReadyRight"
			:style="gridHeight"
			class="ag-theme-balham"
		/>
		<Pagination
			:total="total"
			:limit.sync="formData.pageSize"
			:page.sync="formData.pageNum"
			@pagination="list"
		/>
	</div>
</template>
<script>
import { getWarehousePeakSeasonListApi, updateStatusActiveApi, updateStatusInactiveApi } from '@/api/OverseasWarehouse/warehouseSeason'
import operationBtn from './components/operationBtn'
import NationalGroupSelect from '../components/NationalGroupSelect'
import getZHMixin from './components/getZHMixin'
import storageWarehouseSelect from '../components/storageWarehouseSelect'
export default {
	name: 'FuelRateList',
	components: { operationBtn, NationalGroupSelect, storageWarehouseSelect },
	mixins: [getZHMixin],
	data() {
		return {
			formData: {
				warehouseId: null,
				countryCode: '',
				status: null,
				supplierId: null,
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			dataList: [],
			productList: [],
			companyList: [],
			tempList: [],
			columnDefsRight: [
				{
					headerName: this.getZH('warehouse'),
					field: 'warehouseName'
				},
				{
					headerName: this.getZH('countryName'),
					field: 'countryName'
				},
				{
					headerName: this.getZH('supplierName'),
					field: 'supplierName'
				},
				{
					headerName: this.getZH('status'),
					field: 'status',
					cellRenderer: params => {
						if (params.value === 2) {
							return `<div class='status-wrap'><span class='status-dot successed '></span>${params.data.statusName}</div>`
						} else if (params.value === 1) {
							return `<div class='status-wrap'><span class='status-dot processing'></span>${params.data.statusName}</div>`
						}
					}
				},
				{
					headerName: this.getZH('startTime'),
					field: 'startTime',
					minWidth: 160,
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : '-'
				},
				{
					headerName: this.getZH('endTime'),
					field: 'endTime',
					minWidth: 160,
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : '-'
				},
				{

					headerName: this.getZH('operation'), pinned: 'right', field: `id`, width: 140,
					cellRendererFramework: 'operationBtn'
				}],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			loading: false
		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			}
		}
		this.list()
	},
	mounted() {

	},
	methods: {
		onReadyRight(params) {
			// const self = this
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
					// self.onFirstDataRendered()
				})
			})
		},

		/**
			 * 获取列表
			 */
		async list() {
			this.loading = true
			const res = await getWarehousePeakSeasonListApi(this.formData).catch(res => {
				this.loading = false
			})
			if (res.ok) {
				this.dataList = res.content.list || []
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
		 * 新增编辑
		 */
		edit(id, type) {
			this.$router.push({ name: `WarehouseSeasonDetail`, query: { id, type, time: new Date().getTime() } })
		},
		/**
		 * 改变状态
		 */
		async updateStatus(id, status) {
			this.loading = true
			let fn = status === 1 ? updateStatusInactiveApi : updateStatusActiveApi
			let res = await fn({ id, status }).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.$message.success(this.getZH('updateSuccess'))
				this.loading = false
				this.list()
			} else {
				this.loading = false
			}
		},
		/**
			 * 重置搜索条件
			 */
		reset() {
			this.$refs.formData.resetFields()
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
</style>
