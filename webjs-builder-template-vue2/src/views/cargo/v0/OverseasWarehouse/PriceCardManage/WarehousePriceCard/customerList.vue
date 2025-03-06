<template>
  <div v-loading="loading" class="pd-16">
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px">
            <el-form-item :label="$t('warehousePriceCard.customer_name')" prop="customerId">
              <MemberList v-model="formData.customerId"	@selected="setCustomerInfo"	clearable	/>
            </el-form-item>
            <el-form-item :label="$t('warehousePriceCard.price_card_name')" prop="priceCardName">
              <el-input v-model="formData.priceCardName" type="text" :placeholder="$t('warehousePriceCard.please_enter_price_card_name')" size="mini" clearable @keyup.enter.native="list"/>
            </el-form-item>

            <el-form-item :label="$t('warehousePriceCard.warehouse_name')" prop="warehouseId">
              <storageWarehouseSelect v-model="formData.warehouseId" clearable @change="list" />
            </el-form-item>
            <el-form-item :label="$t('warehousePriceCard.status')" prop="status">
              <el-select v-model="formData.status" size="mini" :placeholder="$t('warehousePriceCard.please_select_status')" class="w-full" @change="list">
                <el-option :label="$t('warehousePriceCard.statusType.ALL')" :value="null" />
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('warehousePriceCard.effective_time')" prop="validTimeRange">
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
        </div>
      </template>
    </top-search-items-slot>
    <div class="mb-10 top-btn-wrap">
      <el-button size="mini" type="primary" @click="add()" v-permission="['ovl:warehouse:customer:price:card:create']">{{$t('warehousePriceCard.add')}}</el-button>
      <el-button size="mini" type="primary" @click="copy()">{{$t('channelPriceCard.copyBtn')}}</el-button>
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
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list"/>
    <CopyPriceDialog :visible.sync="copyDialogVisible" :cardType='13' @saved="list" />
    <PostponeDialog :visible.sync="postponeVisible" :data="postponeData" @saved="list" />
  </div>
</template>
<script>
import NationalGroupSelect from '../../components/NationalGroupSelect'
import PriceCardDialog from './components/priceCardDialog'
import price from './components/price'
import operationBtn from './components/operationBtn'
import { priceCardTypes } from '@/utils/constant'
import { getCustomerCostPriceCardsListApi, publishWarehouseCostPriceCard, getPriceCardsStatusApi, delWarehouseCostPriceCard } from '@/api/OverseasWarehouse/warehousePriceCard'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { priceCardStatusMap } from '@/utils/constant'
import CopyPriceDialog from './components/copyPriceDialog'
import storageWarehouseSelect from '../../components/storageWarehouseSelect'
import PostponeDialog from '../components/postponeDialog'
export default {
	name: 'WarehouseCustomerPriceCardList',
	components: { operationBtn, NationalGroupSelect, PriceCardDialog, price, cargoLimitedSelect, CopyPriceDialog, storageWarehouseSelect, PostponeDialog },
	data() {
		return {
			formData: {
				customerId: '',
				customerName: '',
				priceCardName: '',
				countryId: '',
				countryCode: '',
				productId: '',
				channelId: '',
				validTimeRange: [],
				expiryDateEnd: null,
				expiryDateStart: null,
				status: null,
				priceCardType: null,
				warehouseId: null,
				pageSize: 50,
				pageNum: 1
			},
			copyDialogVisible: false,
			copyLoading: false,
			dialogVisible: false,
			postponeVisible: false,
			postponeData: {},
			id: null,
			loading: false,
			total: 0,
			priceCardTypes: priceCardTypes,
			dataList: [],
			statusList: [],
			productList: [],
			columnDefsRight: [
				{
					headerName: this.$t('warehousePriceCard.customer_name'),
					field: 'customerName'
				},
				{
					headerName: this.$t('warehousePriceCard.price_card_name'),
					field: 'priceCardName'
				},
				{
					headerName: this.$t('channelPriceCard.price_card_code'),
					field: 'priceCardNo'
				},
				{
					headerName: this.$t('warehousePriceCard.warehouse_name'),
					field: 'warehouseName'
				},
				{
					headerName: this.$t('warehousePriceCard.supplier'),
					field: 'supplierName'
				},
				{
					headerName: this.$t('warehousePriceCard.price_card_type'),
					field: 'priceCardTypeName'
				},
				{
					headerName: this.$t('warehousePriceCard.status'),
					field: 'statusName'
				},
				{
					headerName: this.$t('warehousePriceCard.effective_start_time'),
					field: 'expiryDateStart',
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : ''
				},
				{
					headerName: this.$t('warehousePriceCard.effective_end_time'),
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
					headerName: this.$t('warehousePriceCard.operation'), pinned: 'right', field: `id`, width: 200,
					cellRendererFramework: 'operationBtn'
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
		setCustomerInfo(customer) {
			this.formData.customerId = customer.id
			this.formData.customerName = customer.chineseName
			this.list()
		},
		list() {
			this.loading = true
			this.formData.expiryDateStart = this.$isEmpty(this.formData.validTimeRange) ? null : this.formData.validTimeRange[0]
			this.formData.expiryDateEnd = this.$isEmpty(this.formData.validTimeRange) ? null : this.formData.validTimeRange[1]
			getCustomerCostPriceCardsListApi(this.formData).then(res => {
				if (res.ok) {
					this.dataList = res.content.list || []
					this.total = Number(res.content.total)
					this.loading = false
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})
		},
		async init() {
			getPriceCardsStatusApi().then(res => {
				if (res.ok) {
					this.statusList = res.content || []
				}
			})
		},
		add() {
			this.$router.push({ name: 'WarehousePriceCardCostEdit', query: { priceCardType: 13 } })

		},
		copy() {
			this.copyDialogVisible = true
		},
		/**
	 * 发布
	 */
		async publish(id) {
			this.loading = true
			let res = await publishWarehouseCostPriceCard(id)
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
		del(id) {
			this.$confirm(this.$t('channelPriceCard.delTips2'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				delWarehouseCostPriceCard(id).then(res => {
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
		edit(id) {
			this.id = id || null
		},
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="less">
</style>
