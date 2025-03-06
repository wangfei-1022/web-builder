<template>
  <div v-loading="loading" class="pd-16">
    <top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form
            ref="formData"
            :inline="true"
            :model="formData"
            label-width="100px"
            size="mini"
          >
            <el-form-item
              :label="$t('warehousePriceCard.price_card_name')"
              prop="priceCardName"
            >
              <el-input
                v-model="formData.priceCardName"
                type="text"
                :placeholder="
                  $t('warehousePriceCard.please_enter_price_card_name')
                "
                size="mini"
                clearable
                @keyup.enter.native="list"
              />
            </el-form-item>

            <el-form-item :label="$t('warehousePriceCard.warehouse_name')">
              <storageWarehouseSelect v-model="formData.warehouseId" clearable @change="list" />
            </el-form-item>
            <el-form-item
              :label="$t('warehousePriceCard.supplier')"
              prop="supplierId"
            >
              <type-select v-model="formData.supplierId" type="supplier" @selected="list" :requestParams="{businessType: 'OVERSEAS_WAREHOUSE'}"></type-select>
            </el-form-item>
            <el-form-item
              :label="$t('warehousePriceCard.status')"
              prop="status"
            >
              <constant-select
                v-model="formData.status"
                url="/api/ovl-service/omc/ovl/warehouse/priceCards/statuses"
                @change="list"
                :placeholder="$t('warehousePriceCard.please_select_status')">
              </constant-select>
            </el-form-item>
            <el-form-item
              :label="$t('warehousePriceCard.price_card_type')"
              prop="priceCardType"
            >
              <el-select
                v-model="formData.priceCardType"
                size="mini"
                :placeholder="
                  $t('warehousePriceCard.please_select_price_card_type')
                "
                class="w-full"
                @change="list"
              >
                <el-option
                  :label="$t('common.priceCardType.ALL')"
                  :value="null"
                />
                <el-option
                  v-for="(item, index) in priceCardTypes"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('warehousePriceCard.effective_time')"
              prop="validTimeRange"
            >
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
      <el-button
        size="mini"
        type="primary"
        @click="add()"
        v-permission="['ovl:warehouse:base:price:card:create']"
        >{{ $t("warehousePriceCard.add") }}</el-button
      >
      <el-button
        size="mini"
        type="primary"
        @click="copy()"
        v-permission="['ovl:warehouse:base:price:card:copy']"
        >{{ $t("warehousePriceCard.copy_price_card") }}</el-button
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
    <PriceCardDialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      @close="closePriceCardDialog"
    />
    <CopyPriceDialog :visible.sync="copyDialogVisible" :cardType='10' @saved="list" />
  </div>
</template>
<script>
import NationalGroupSelect from "../../components/NationalGroupSelect"
import PriceCardDialog from "./components/priceCardDialog"
import CopyPriceDialog from "./components/copyPriceDialog"
import operationBtn from "./components/operationBtn"
import { priceCardTypes } from "@/utils/constant"
import { getWarehousePriceCardsListApi, getPriceCardsStatusApi, publishWarehouseCostPriceCard, delWarehouseCostPriceCard } from "@/api/OverseasWarehouse/warehousePriceCard"
import { priceCardStatusMap } from '@/utils/constant'
import storageWarehouseSelect from '../../components/storageWarehouseSelect'
export default {
	name: "WarehousePriceCardList",
	components: { operationBtn, NationalGroupSelect, PriceCardDialog, CopyPriceDialog, storageWarehouseSelect },
	data() {
		return {
			formData: {
				priceCardName: "",
				countryId: "",
				countryCode: "",
				productId: "",
				supplierId: "",
				validTimeRange: [],
				expiryDateEnd: null,
				expiryDateStart: null,
				status: null,
				warehouseId: null,
				priceCardType: null,
				pageSize: 50,
				pageNum: 1
			},
			copyDialogVisible: false,
			copyLoading: false,
			dialogVisible: false,
			postponeVisible: false,
			id: null,
			loading: false,
			total: 0,
			priceCardTypes: priceCardTypes,
			dataList: [],
			statusList: [],
			columnDefsRight: [
				{
					headerName: this.$t("warehousePriceCard.price_card_name"),
					field: "priceCardName"
				},
				{
					headerName: this.$t('channelPriceCard.price_card_code'),
					field: 'priceCardNo'
				},
				{
					headerName: this.$t("warehousePriceCard.warehouse_name"),
					field: "warehouseName"
				},
				{
					headerName: this.$t("warehousePriceCard.supplier"),
					field: "supplierName"
				},
				{
					headerName: this.$t("warehousePriceCard.price_card_type"),
					field: "priceCardTypeName"
				},
				{
					headerName: this.$t("warehousePriceCard.status"),
					field: "statusName"
				},
				{
					headerName: this.$t("warehousePriceCard.effective_start_time"),
					field: "expiryDateStart",
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : ''
				},
				{
					headerName: this.$t("warehousePriceCard.effective_end_time"),
					field: "expiryDateEnd",
					cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : ''
				},
				{
					field: "remark",
					headerName: this.$t("common.failedReason"),
					minWidth: 100,
					cellRenderer: params => {
						if (params.data.status === priceCardStatusMap.PUBLISH_FAILED) {
							return params.data.remark
						}
						return ""
					}
				},
				{
					headerName: this.$t("warehousePriceCard.operation"),
					pinned: "right",
					field: `id`,
					minWidth: 150,
					cellRendererFramework: "operationBtn"
				}
			],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false }
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
	mounted() { },
	methods: {
		onReadyRight(params) {
			// const self = this
			params.api.sizeColumnsToFit()
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
					// self.onFirstDataRendered()
				})
			})
		},
		list() {
			this.formData.expiryDateStart = this.$isEmpty(this.formData.validTimeRange) ? null : this.formData.validTimeRange[0]
			this.formData.expiryDateEnd = this.$isEmpty(this.formData.validTimeRange) ? null : this.formData.validTimeRange[1]
			getWarehousePriceCardsListApi(this.formData)
				.then(res => {
					if (res.ok) {
						this.dataList = res.content.list || []
						this.total = Number(res.content.total)
						this.loading = false
					} else {
						this.loading = false
					}
				})
				.catch(() => {
					this.loading = false
				})
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
		async init() {
			getPriceCardsStatusApi().then(res => {
				if (res.ok) {
					this.statusList = res.content || []
				}
			})
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
		add() {
			this.$router.push({ name: 'WarehousePriceCardCostEdit' })
			//   this.dialogVisible = true;
		},
		closePriceCardDialog() {
			this.dialogVisible = false
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
