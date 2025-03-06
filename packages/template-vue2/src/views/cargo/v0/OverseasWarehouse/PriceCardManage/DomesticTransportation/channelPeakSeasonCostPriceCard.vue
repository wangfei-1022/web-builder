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
            <el-form-item	class="el-form-item" :label="getZH('channel')"	prop="channelCode">
              <type-select  v-model="formData.channelCode" channelKey="channelCode" type="channel" @selected="list" clearable />
            </el-form-item>
            <el-form-item
							class="el-form-item"
							:label="getZH('productName')"
							prop="productCode"
						>
							<productSelect ref='productSelect' :clearable='true' 	v-model="formData.productCode" @selected='list'  />
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('chargeItemName')"
							prop="chargeItemCode"
						>
							<el-select
								v-model="formData.chargeItemCode"
								size="mini"
								@change="list"
							>
								<el-option :label="getZH('all')" :value="null"></el-option>
								<el-option
									v-for="item in dropdownFeeList"
									:key="item.id"
									:label="item.chineseName"
									:value="item.code"
								/>
							</el-select>
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
import { getChannelPeakSeasonListApi, getFeeDropdownApi, channelPeakSeasonPublishApi } from '@/api/OverseasWarehouse/peakSeasonSurcharge'
import operation from './components/operationBtn'
import getZHMixin from './components/getZHMixin'
import productSelect from '../../components/productSelect'
export default {
	name: 'ChannelPeakSeasonCostPriceCard',
	mixins: [getZHMixin],
	components: { operation, productSelect },
	data() {
		return {
			formData: {
				chargeItemCode: null,
				channelCode: null,
				productCode: null,
				status: null,
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			dataList: [],
			dropdownFeeList: [],
			columnDefsRight: [
				{
					headerName: this.getZH('channelCode'),
					field: 'channelCode'
				},
				{
					headerName: this.getZH('channelName'),
					field: 'channelName'
				},
				{
					headerName: this.getZH('productName'),
					field: 'productName'
				},
				{
					headerName: this.getZH('chargeItemName'),
					field: 'chargeItemName'
				},
				{
					headerName: this.getZH('status'),
					field: 'status',
					cellRenderer: params => {
						if (params.value === 10) {
							return `<div class='status-wrap'><span class='status-dot  '></span>${params.data.statusName}</div>`
						} else if (params.value === 32) {
							return `<div class='status-wrap'><span class='status-dot successed'></span>${params.data.statusName}</div>`
						} else if (params.value === 33 || params.value === 42 || params.value === 41) {
							return `<div class='status-wrap'><span class='status-dot rejected'></span>${params.data.statusName}</div>`
						} else {
							return `<div class='status-wrap'><span class='status-dot processing'></span>${params.data.statusName}</div>`
						}
					}
				},
				{
					headerName: this.getZH('basePrice'),
					field: 'costPrice'
				},
				{
					headerName: this.getZH('currency'),
					field: 'currencyName'
				},
				{
					headerName: this.getZH('startTime'),
					field: 'peakSeasonStartTime',
					minWidth: 160,
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : '-'
				},
				{
					headerName: this.getZH('endTime'),
					field: 'peakSeasonEndTime',
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
					headerName: this.getZH('operation'), pinned: 'right', field: `id`, width: 100,
					cellRendererFramework: 'operation'
				}
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
			const res = await getChannelPeakSeasonListApi(this.formData).catch(res => {
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
			let res = await channelPeakSeasonPublishApi(id)
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
