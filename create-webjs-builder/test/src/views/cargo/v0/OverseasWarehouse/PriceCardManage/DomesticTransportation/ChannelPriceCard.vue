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
					<el-form-item :label="$t('channelPriceCard.price_card_name')" prop="priceCardName">
						<el-input
							v-model="formData.priceCardName"
							type="text"
							:placeholder="$t('channelPriceCard.please_enter_price_card_name')"
							size="mini"
							clearable
							@keyup.enter.native="list"
						/>
					</el-form-item>
					<el-form-item :label="$t('channelPriceCard.country')" prop="countryCode">
						<NationalGroupSelect
							v-model="formData.countryCode"
							@change="list"
						/>
					</el-form-item>
					<el-form-item :label="$t('channelPriceCard.channel')" prop="channelId">
            <type-select v-model="formData.channelId" type="channel" @selected="list" clearable />
					</el-form-item>
					<el-form-item :label="$t('channelPriceCard.product_code')" prop="productId">
						<SelectFilter
							v-model="formData.productId"
							size="mini"
							:placeholder="$t('channelPriceCard.product_code_desc')"
							name-key="productName"
							value-key="id"
							:options="productList"
							class="w-full"
							:filter-keys="['productCode', 'productName']"
							clearable
							@change="list"
						/>
					</el-form-item>
					<el-form-item :label="$t('channelPriceCard.status')" prop="status">
            <constant-select
              v-model="formData.status"
              url="/api/ovl-service/omc/ovl/warehouse/priceCards/statuses"
              @change="list"
              :placeholder="$t('channelPriceCard.please_select_status')">
            </constant-select>
					</el-form-item>
          <el-form-item :label="$t('channelPriceCard.price_card_code')" prop="priceCardNo">
						<el-input
							v-model="formData.priceCardNo"
							type="text"
							:placeholder="$t('channelPriceCard.please_enter_price_card_code')"
							size="mini"
							clearable
							@keyup.enter.native="list"
						/>
					</el-form-item>
					<el-form-item :label="$t('channelPriceCard.effective_time')" prop="validTimeRange">
						<CommonPicker
              :useUTC="true"
              format="yyyy-MM-dd HH:mm:ss"
							pikcerType="datetimerange"
              valueFormat="timestamp"
              :default-time="['00:00:00', '23:59:59']"
							v-model="formData.validTimeRange"
							:parentRangeDate="formData.validTimeRange"
							@change="list"
							clearable
						/>
					</el-form-item>
				</el-form>
			</template>
		</TopSearchItemsSlot>
		<div class="mb-10 top-btn-wrap">
			<el-button size="mini" type="primary" @click="add()">
        {{$t('channelPriceCard.add')}}
			</el-button>
			<el-button size="mini" type="primary" @click="copy()">
        {{$t('channelPriceCard.copyBtn')}}
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
		<PriceCardDialog :visible.sync="dialog.visible" />
		<CopyPriceDialog :visible.sync="copyDialogVisible" :cardType='10' @saved="list" />
    <PostponeDialog :visible.sync="postponeVisible" :data="postponeData" @saved="list" :isWarehousePrice="false" />
	</div>
</template>
<script>
import NationalGroupSelect from '../../components/NationalGroupSelect.vue'
import PriceCardDialog from './components/PriceCardDialog.vue'
import operationBtn from '../components/OperationBtn.vue'
import { getProductListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import { getChannelsPriceCardsListApi, publishCostPriceCard, publishTruckCostPriceCard, delPriceCard } from '@/api/OverseasWarehouse/PriceCardManage.js'
import { priceCardStatusMap } from '@/utils/constant'
import CopyPriceDialog from '../components/copyPriceDialog'
import PostponeDialog from '../components/postponeDialog'
export default {
	name: 'ChannelPriceCard',
	components: { operationBtn, NationalGroupSelect, PriceCardDialog, CopyPriceDialog, PostponeDialog },
	data() {
		return {
			formData: {
				priceCardName: '',
				priceCardNo: '',
				countryId: '',
				countryCode: '',
				productId: '',
				channelId: '',
				validTimeRange: [],
				expiryDateEnd: null,
				expiryDateStart: null,
				status: null,
				priceCardType: '10',
				pageSize: 50,
				pageNum: 1

			},
			id: null,
			loading: false,
			isDetail: false,
			copyDialogVisible: false,
			total: 0,
			dataList: [],
			productList: [],
			columnDefsRight: [
				{
					headerName: this.$t('channelPriceCard.price_card_name'),
					field: 'priceCardName'
				},
				{
					headerName: this.$t('channelPriceCard.price_card_code'),
					field: 'priceCardNo'
				},
				{
					headerName: this.$t('channelPriceCard.channel'),
					field: 'channelName'
				},
				{
					headerName: this.$t('channelPriceCard.product_code'),
					field: 'productName'
				},
				{
					headerName: this.$t('channelPriceCard.country'),
					field: 'countryName'
				},
				{
					headerName: this.$t('channelPriceCard.status'),
					field: 'statusName'
				},
				{
					headerName: this.$t('channelPriceCard.effective_start_time'),
					field: 'expiryDateStart',
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : ''
				},
				{
					headerName: this.$t('channelPriceCard.effective_end_time'),
					field: 'expiryDateEnd',
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : ''
				},
				{
					field: 'remark',
					headerName: this.$t('common.failedReason'),
					minWidth: 100,
					cellRenderer: params => {
						if (params.data.status === priceCardStatusMap.PUBLISH_FAILED) {
							return params.data.remark
						}
						return ''
					}
				},
				{
					headerName: this.$t('channelPriceCard.operation'), pinned: 'right', field: `id`, minWidth: 100,
					cellRendererFramework: 'operationBtn'
				}],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			postponeData: {},
			postponeVisible: false

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
			this.formData.expiryDateStart = this.$isEmpty(this.formData.validTimeRange) ? null : this.formData.validTimeRange[0]
			this.formData.expiryDateEnd = this.$isEmpty(this.formData.validTimeRange) ? null : this.formData.validTimeRange[1]
			const res = await getChannelsPriceCardsListApi(this.formData).catch(() => {
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
		},
		/**
	 * 新增
	 */
		add(id, type, edit, productType) {
			edit = edit || '0'
			this.$router.push({ name: 'ChannelPriceCardDetail', query: { type, id, edit, productType, time: new Date().getTime() } })
		},
		/**
		 * 复制其他价卡
		 */
		copy() {
			this.copyDialogVisible = true
		},
		/**
		 * 发布
		 */
		async publish(id, productType) {
			this.loading = true
			let fn = productType === 1 ? publishCostPriceCard : publishTruckCostPriceCard
			let res = await fn(id)
			if (res.ok) {
				this.$alert('<div><span class="fc-red fs-16">可能需要一定的处理时间</span><span class="fs-16">,请稍后在来查看结果</span></div>', '发布耗时可能会很长', {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '知道了  '
				})
				this.loading = false
				this.list()
			} else {
				this.loading = false
			}

		},
		/**
		 * 删除
		 */
		del(id, type) {
			let msg = ''
			if (type === 10) {
				msg = this.$t('channelPriceCard.delTips1')
			} else {
				msg = this.$t('channelPriceCard.delTips2')
			}
			this.$confirm(msg, this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				delPriceCard(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
						this.loading = false
					} else {
						this.loading = false
					}
				})
			}).catch(() => {
				this.loading = false
			})
		},
		/**
		 * 编辑详情
		 */
		edit(id, isDetail) {
			this.id = id || null
			this.isDetail = isDetail
		},
		/**
		 * 清空重置条件
		 */
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.list()
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (to.query.refresh) {
				vm.list()
			}
		})
	}
}
</script>

<style scoped lang="less">
</style>
