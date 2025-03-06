<template>
	<div v-loading="loading" class="pd-16">
		<TopSearchItemsSlot
			:searchFun="list"
			:resetFun="clearSearchForm"
      class="mb-10"
		>
			<template slot="multipleSearch">
				<el-form
						ref="formData"
						:inline="true"
						:model="formData"
						label-width="100px"
					>
						<el-form-item :label="$t('partition.area_scheme_code')" prop="areaSchemeCode">
							<el-input
								v-model="formData.areaSchemeCode"
								type="text"
                :placeholder="$t('partition.please_enter_area_scheme_code')"
								size="mini"
								clearable
								@keyup.enter.native="list"
							/>
						</el-form-item>
						<el-form-item :label="$t('partition.area_scheme_name')" prop="areaSchemeName">
							<el-input
								v-model="formData.areaSchemeName"
								type="text"
                :placeholder="$t('partition.please_enter_area_scheme_name')"
								size="mini"
								clearable
								@keyup.enter.native="list"
							/>
						</el-form-item>
						<el-form-item :label="$t('partition.product_code')" prop="productCode">
							<SelectFilter
								v-model="formData.productCode"
								size="mini"
                :placeholder="$t('partition.product_code_des')"
								name-key="productName"
								value-key="productCode"
								:options="productList"
								class="w-full"
								:filter-keys="['productCode', 'productName']"
								clearable
								@change="list"
							/>
						</el-form-item>
						<el-form-item :label="$t('partition.warehouse')" prop="warehouseIds">
							<el-select
								v-model="formData.warehouseIds"
								size="mini"
                :placeholder="$t('partition.please_select_warehouse')"
								class="w-full"
								multiple
								:collapse-tags="true"
								clearable
								@visible-change="
									(val) => {
										if (!val) {
											list();
										}
									}
								"
							>
								<el-option
									v-for="item in warehouseList"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								/>
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('partition.status')" prop="importStatus">
							<el-select
								v-model="formData.importStatus"
								size="mini"
                :placeholder="$t('partition.please_select_status')"
								class="w-full"
								@change="list"
							>
								<el-option :label="$t('partition.statusMode.ALL')" :value="null" />
								<el-option :label="$t('partition.statusMode.PARSING')" :value="1" />
								<el-option :label="$t('partition.statusMode.PARSING_SUCCEEDED')" :value="2" />
								<el-option :label="$t('partition.statusMode.PARSING_FAILED')" :value="3" />
							</el-select>
						</el-form-item>
				</el-form>
			</template>
		</TopSearchItemsSlot>
		<div class="mb-10 top-btn-wrap">
			<el-button icon="el-icon-plus" size="mini" type="primary" @click="edit()">
        {{$t('partition.add')}}
			</el-button>
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
		<PartitionChangeDialog
			:id="id"
			:is-detail="isDetail"
			:visible.sync="dialog.visible"
			@saved="list"
		/>
	</div>
</template>

<script>
import { getWarehouseListApi } from '@/api/OverseasWarehouse/warehouse'
import PartitionBtn from './components/PartitionBtn'
import PartitionChangeDialog from './components/PartitionChangeDialog'
import { getAreaSchemeListApi, getProductListApi, delAreaSchemeApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
export default {
	name: 'Partition',
	components: { PartitionBtn, PartitionChangeDialog },
	data() {
		return {
			formData: {
				areaSchemeCode: '',
				areaSchemeName: '',
				productCode: '',
				warehouseIds: [],
				importStatus: null,
				pageSize: 50,
				pageNum: 1

			},
			warehouseList: [],
			id: null,
			loading: false,
			isDetail: false,
			total: 0,
			dataList: [],
			productList: [],
			columnDefsRight: [
				{
					headerName: this.$t('partition.area_scheme_code'),
					field: 'areaSchemeCode'
				},
				{
					headerName: this.$t('partition.area_scheme_name'),
					field: 'areaSchemeName'
				},
				{
					headerName: this.$t('partition.product_name'),
					field: 'productName'
				},
				{
					headerName: this.$t('partition.warehouse'),
					field: 'warehouseNames'
				},
				{
					headerName: this.$t('partition.status'),
					field: 'importStatusName'
				},
				{
					headerName: this.$t('partition.import_failure'),
					field: 'importFailure',
					cellRenderer: params => params.data.importStatus === 3 ? params.data.importFailure : ''
				},
				{
					headerName: this.$t('partition.operation'), pinned: 'right', field: `id`, minWidth: 120, maxWidth: 120,
					cellRendererFramework: 'PartitionBtn'
				}],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }

		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			}
		}
		this.init()
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
		 * 获取列表数据
		 */
		async list() {
			this.loading = true
			const res = await getAreaSchemeListApi(this.formData).catch(() => {
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
		 * 获取物流产品列表数据
		 */
		async init() {
			const res = await getProductListApi({
				pageSize: 1000,
				pageNum: 1
			})
			if (res.ok) {
				this.productList = res.content.list || []
			}
			const rs = await getWarehouseListApi({
				pageSize: 1000,
				pageNum: 1,
				status: 2
			})
			if (rs.ok) {
				this.warehouseList = rs.content.list || []
			}
		},
		/**
	 * 新增编辑
	 */
		edit(id, isDetail) {
			this.id = id || null
			this.dialog.visible = true
			this.isDetail = isDetail
		},
		/**
		 * 删除
		 */
		del(id) {
			this.$confirm(this.$t('partition.deleteTips'), this.$t('common.tips'), {
				cancelButtonText: this.$t('common.cancel'),
				confirmButtonText: this.$t('common.confirmBtn'),
				type: 'danger'
			}).then(() => {
				this.loading = true
				delAreaSchemeApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
					}
					this.loading = false
				}).catch(() => {
					this.loading = false
				})
			})
		},
		/**
		 * 清空重置条件
		 */
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="less">
</style>
