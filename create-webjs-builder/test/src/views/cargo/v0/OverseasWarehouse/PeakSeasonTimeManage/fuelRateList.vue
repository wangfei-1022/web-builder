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
								:label="getZH('productName')"
								prop="productId"
							>
								<productSelect ref='productSelect' :defaultVal='formData.productName' 	v-model="formData.productId" tagValue="id" @selected='list' />
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
									:placeholder="getZH('nameCode')"
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
							<el-form-item
								class="el-form-item"
								:label="getZH('status')"
								prop="status"
							>
								<constant-select
                  v-model="formData.status"
                  url="/api/ovl-service/omc/ovl/warehouse/priceCards/statuses"
                  @change="list"
                  :placeholder="$t('warehousePriceCard.please_select_status')">
                </constant-select>
							</el-form-item>
						</el-form>
				</template>
			</TopSearchItemsSlot>
		</div>
		<div class="mb-10">
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
			style="width: 100%; height: calc(100vh - 300px)"
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
import { getFuelRateListApi, updateStatusApi, channelFuelRatePublishApi } from '@/api/OverseasWarehouse/fuelRate'
import fuelRateBtn from './components/fuelRateBtn'
import getZHMixin from './components/getZHMixin'
import { getProductListApi, getCompanyListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import productSelect from '../components/productSelect.vue'
export default {
	name: 'FuelRateList',
	mixins: [getZHMixin],
	components: { fuelRateBtn, productSelect },
	data() {
		return {
			formData: {
				productName: null,
				companyId: null,
				productId: null,
				status: null,
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			dataList: [],
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
					headerName: this.getZH('fuel'),
					field: 'fuel',
					cellRenderer: params => Number(params.data.fuel).toFixed(2) + '%'

				},
				{
					headerName: this.getZH('status'),
					field: 'statusName'
				},
				{
					headerName: this.getZH('fuelStartTime'),
					field: 'startTime',
					minWidth: 160,
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : '-'
				},
				{
					headerName: this.getZH('fuelEndTime'),
					field: 'endTime',
					minWidth: 160,
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : '-'
				},
				{
					headerName: this.getZH('publishTime'),
					field: 'publishTime',
					minWidth: 160,
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).format("YYYY-MM-DD HH:mm:ss") : '-'
				},
				{

					headerName: this.getZH('operation'), pinned: 'right', field: `id`, width: 140,
					cellRendererFramework: 'fuelRateBtn'
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
		},
		/**
			 * 获取列表
			 */
		async list() {
			this.loading = true
			const res = await getFuelRateListApi(this.formData).catch(res => {
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
		async publishFn(id) {
			this.loading = true
			let res = await channelFuelRatePublishApi(id)
			if (res.ok) {
				this.$alert(
					'<div><span class="fc-red fs-16">可能需要一定的处理时间</span><span class="fs-16">,请稍后在来查看结果</span></div>',
					"发布耗时可能会很长",
					{
						dangerouslyUseHTMLString: true,
						confirmButtonText: "知道了  "
					}
				)
				this.loading = false
				this.list()
			} else {
				this.loading = false
			}
		},
		/**
		 * 新增编辑
		 */
		edit(id, isDetail) {
			this.$router.push({ name: `FuelRateDetail`, query: { id, type: isDetail, time: new Date().getTime() } })
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
