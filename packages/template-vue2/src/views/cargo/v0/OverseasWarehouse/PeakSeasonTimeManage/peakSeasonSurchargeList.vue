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
							:label="getZH('chargeItemName')"
							prop="chargeItemId"
						>
							<el-select
								v-model="formData.chargeItemId"
								size="mini"
								@change="list"
							>
								<el-option :label="getZH('all')" :value="null"></el-option>
								<el-option
									v-for="item in dropdownFeeList"
									:key="item.id"
									:label="item.chineseName"
									:value="item.id"
								/>
							</el-select>
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('productName')"
							prop="productId"
						>
							<productSelect ref='productSelect' tagValue="id" v-model="formData.productId" @selected="list" />
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('companyId')"
							prop="companyId"
						>
							<SelectFilter
								v-model="formData.companyId"
								size="mini"
								name-key="shortname"
								value-key="id"
								:placeholder="getZH('nameCode1')"
								:options="companyList"
								:filter-keys="[
									'scacCode',
									'shortname',
									'chineseName',
									'englishName',
								]"
								clearable
								@change="list"
							/>
						</el-form-item>
						<!-- <el-form-item
							class="el-form-item"
							:label="getZH('status')"
							prop="status"
						>
							<el-select v-model="formData.status" size="mini" @change="list">
								<el-option :label="getZH('all')" :value="null" />
								<el-option :label="getZH('active')" :value="1" />
								<el-option :label="getZH('inactive')" :value="2" />
							</el-select>
						</el-form-item> -->
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
import { getPeakSeasonTimeListApi, getFeeDropdownApi, updateStatusApi } from '@/api/OverseasWarehouse/peakSeasonSurcharge'
import operation from './components/operation'
import { getProductListApi, getCompanyListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import getZHMixin from './components/getZHMixin'
import productSelect from '../components/productSelect.vue'
export default {
	name: 'PeakSeasonSurchargeList',
	mixins: [getZHMixin],
	components: { operation, productSelect },
	data() {
		return {
			formData: {
				chargeItemId: null,
				companyId: null,
				productId: null,
				status: null,
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			dataList: [],
			dropdownFeeList: [],
			productList: [],
			companyList: [],
			columnDefsRight: [
				{
					headerName: this.getZH('productCode'),
					field: 'productCode'
				},
				{
					headerName: this.getZH('productName'),
					field: 'productName'
				},
				{
					headerName: this.getZH('companyId'),
					field: 'companyName'
				},
				{
					headerName: this.getZH('chargeItemName'),
					field: 'chargeItemName'
				},
				// {
				// 	headerName: this.getZH('status'),
				// 	field: 'status',
				// 	cellRenderer: params => {
				// 		if (params.value === 2) {
				// 			return `<div class='status-wrap'><span class='status-dot successed '></span>${params.data.statusName}</div>`
				// 		} else if (params.value === 1) {
				// 			return `<div class='status-wrap'><span class='status-dot processing'></span>${params.data.statusName}</div>`
				// 		}
				// 	}
				// },
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
				}


				// 	headerName: this.getZH('operation'), pinned: 'right', field: `id`, width: 140,
				// 	cellRendererFramework: 'operation'
				// }
			],
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
		this.init()
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
			// 获取物流公司数据
			const result = await getCompanyListApi({ pageSize: 500, pageNum: 1 })
			if (result.ok) {
				this.companyList = result.content.list || []
			}
			const rs = await getFeeDropdownApi()
			if (rs.ok) {
				let cods = ['ERESPSS', 'EAHSPSS', 'EOSPSS']
				this.dropdownFeeList = rs.content.filter(item => cods.indexOf(item.code) > -1)
			}
		},
		/**
			 * 获取列表
			 */
		async list() {
			this.loading = true
			const res = await getPeakSeasonTimeListApi(this.formData).catch(res => {
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
		edit(id, isDetail) {
			this.$router.push({ name: `PeakSeasonSurchargeDetail`, query: { id, type: isDetail, time: new Date().getTime() } })
		},
		/**
		 * 改变状态
		 */
		async updateStatus(id, status) {
			this.loading = true
			let res = await updateStatusApi({ id, status }).catch(() => {
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
			this.$refs.productSelect.clearData()
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
