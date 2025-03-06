<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('channelPriceCard.copyBtn')"
			width="1300px"
			:close-on-click-modal="false"
		>
      <div class="dialog-content">
        <el-form
          label-width="120px"
          label-position="left"
          :model="formData"
          :rules="formRules"
          ref="formData"
          v-if="dialogVisible"
          v-loading="loading"
        >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item :label="$t('warehousePriceCard.warehouse_name')" prop="warehouseId">
              <storageWarehouseSelect v-model="formData.warehouseId" @selected="warehouseSelected"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if='cardType !== 13'>
            <el-form-item :label="$t('warehousePriceCard.new_price_card_type')" prop="priceCardType" >
              <el-select size="mini" v-model="formData.priceCardType" :placeholder="$t('warehousePriceCard.please_select_price_card_type')" @change="changeWarehouse">
                <el-option v-for="item in priceCardTypes" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="mb-10">
          <lb-table :column="columnData" :data="dataList"  highlight-current-row stripe border @current-change="handleCurrentChange" />
        </div>
        <el-row :gutter="10">
          <el-col :span="8" v-if='cardType === 13'>
             <el-form-item :label="$t('channelPriceCard.new_customer_name')" prop="customerId">
              <type-select type ='customer' v-model="formData.customerId" @selected='selectedCustomer' class="w-full"></type-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('channelPriceCard.new_price_card_name')" prop="priceCardName">
              <el-input size="mini" v-model.trim="formData.priceCardName" :placeholder="$t('channelPriceCard.please_new_price_card_name')" />
            </el-form-item>
          </el-col>

        </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" size="mini" @click="dialogVisible=false">
            {{ $t("common.cancelBtn") }}
          </el-button>
          <el-button type="primary"  :loading="loading" size="mini" @click="saveForm('formData')">
            {{ $t("warehousePriceCard.next_step") }}
          </el-button>
      </span>
		</el-dialog>
	</div>
</template>
<script lang="jsx">
import { priceCardTypes } from '@/utils/constant'
import storageWarehouseSelect from '../../../components/storageWarehouseSelect'
import { getWarehousePriceCardsTypeListApi, checkCardNameExists, copyWarehouseCustomerPriceCardApi, copyAddCostPriceCardsBaseInfoApi, copyAddNotCostPriceCardsBaseInfoApi } from '@/api/OverseasWarehouse/warehousePriceCard'
export default {
	name: 'CopyPriceDialog',
	components: { storageWarehouseSelect },
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		cardType: {
			type: Number,
			required: true
		}

	},
	data() {
		return {
			dialogVisible: false,
			priceCardTypes,
			loading: false,
			dataList: [],
			currentRow: {},
			warehouseMap: {},
			formRules: {
				warehouseId: [{ required: true, message: this.$t('channelPriceCard.please_select_channel') }],
				priceCardName: [{ required: true, message: this.$t('channelPriceCard.please_enter_price_card_name') }],
				priceCardType: [{ required: true, message: this.$t('channelPriceCard.please_select_price_card_type') }],
				customerId: [{ required: true, message: this.$t('channelPriceCard.please_select_customer_name') }]
			},
			columnData: [
				{
					label: '#',
					width: 35,
					render: (h, { row }) =>
						<div>
							{
								this.currentRow === row ? <el-radio ></el-radio> : <el-radio value={false}></el-radio>
							}

						</div>
				},
				{
					label: this.$t('channelPriceCard.price_card_name'),
					prop: 'priceCardName',
					minWidth: 150,
					showOverflowTooltip: true
				},
				{
					label: this.$t('channelPriceCard.price_card_type'),
					prop: 'priceCardTypeName',
					width: 100,
					showOverflowTooltip: true
				},
				{
					label: this.$t('channelPriceCard.status'),
					prop: 'statusName',
					width: 140,
					showOverflowTooltip: true
				},
				{
					label: this.$t('channelPriceCard.effective_start_time'),
					prop: 'expiryDateStart',
					width: 160,
					render: (h, { row }) =>
						<div>
							{
								this.$moment(parseInt(row.expiryDateStart, 10)).utc().format("YYYY-MM-DD HH:mm:ss")
							}

						</div>
				},
				{
					label: this.$t('channelPriceCard.effective_end_time'),
					prop: 'expiryDateEnd',
					width: 160,
					render: (h, { row }) =>
						<div>
							{
								this.$moment(parseInt(row.expiryDateEnd, 10)).utc().format("YYYY-MM-DD HH:mm:ss")
							}
						</div>
				},
				{
					label: this.$t('channelPriceCard.unit_category_type'),
					prop: 'unitCategoryType',
					showOverflowTooltip: true,
					width: 140,
					render: (h, { row }) =>
						<div>
							{row.unitCategoryType === 10 ? this.$t('channelPriceCard.unitCategoryType.METRIC') : this.$t('channelPriceCard.unitCategoryType.IMPERIAL')}

						</div>
				},
				{
					label: this.$t('channelPriceCard.currency'),
					prop: 'currencyName',
					width: 90,
					showOverflowTooltip: true
				}
			],
			formData: {
				copyFromId: null,
				countryCode: null,
				countryName: null,
				priceCardName: null,
				supplierId: null,
				supplierName: null,
				warehouseCode: null,
				warehouseId: null,
				warehouseName: '',
				priceCardType: null,
				customerName: null,
				customerId: null
			}
		}
	},
	computed: {

	},
	methods: {
		async init() {
			if (this.cardType === 13) {
				let data = this.columnData.find(item => item.prop === 'customerName')
				if (this.$isEmpty(data)) {
					this.columnData.splice(1, 0, {
						label: this.$t('channelPriceCard.customer_name'),
						prop: 'customerName',
						minWidth: 150,
						showOverflowTooltip: true
					})
				}
			}
		},
		/**
		 * 选中客户
		 */
		selectedCustomer(data) {
			this.formData.customerName = data.chineseName
		},
		// 仓库选择
		warehouseSelected(data) {
			data.warehouseName = data.name
			this.warehouseMap[data.id] = data
			this.changeWarehouse()
		},
		// 获取可复制的价卡列表
		async changeWarehouse() {
			this.dataList = []
			this.currentRow = {}
			if (this.cardType === 10 && (this.$isEmpty(this.formData.warehouseId) || this.$isEmpty(this.formData.priceCardType))) {
				return
			}
			this.loading = true
			let res = await getWarehousePriceCardsTypeListApi({ warehouseId: this.formData.warehouseId, cardType: this.$isEmpty(this.formData.priceCardType) ? this.cardType : this.formData.priceCardType })
			if (res.ok) {
				this.loading = false
				this.dataList = res.content || []
			} else {
				this.loading = false
				this.dataList = []
			}
		},
		// 选中价卡
		handleCurrentChange(val) {
			if (this.$isEmpty(val)) {
				return
			}
			this.currentRow = val
		},
		/**
	 * 保存接口
	 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					if (this.$isEmpty(this.currentRow)) {
						this.$message.error(this.$t('channelPriceCard.please_select_copy_priceCard'))
						return
					}
					this.loading = true
					checkCardNameExists({ priceCardName: this.formData.priceCardName, cardType: this.$isEmpty(this.formData.priceCardType) ? this.cardType : this.formData.priceCardType }).then(rs => {
						if (rs.ok) {
							if (rs.content) {
								this.$message.error(this.$t('channelPriceCard.price_card_repeat'))
								this.loading = false
								return
							}
							let warehouseData = this.warehouseMap[this.formData.warehouseId]
							this.$copyProps(this.formData, warehouseData)
							this.formData.copyFromId = this.currentRow.id
							this.formData.priceCardType = this.$isEmpty(this.formData.priceCardType) ? this.cardType : this.formData.priceCardType
							let fn = this.cardType === 10 ? copyAddCostPriceCardsBaseInfoApi : this.cardType === 13 ? copyWarehouseCustomerPriceCardApi : copyAddNotCostPriceCardsBaseInfoApi
							fn(this.formData).then(res => {
								this.loading = false
								if (res.ok) {
									this.loading = false
									this.dialogVisible = false
									let query = {
										id: res.content,
										priceCardType: this.formData.priceCardType
									}
									this.$emit('saved')
									let routeName = 'WarehousePriceCardEdit'
									this.$router.push({ name: routeName, query })
								} else {
									this.loading = false
								}
							})
						} else {
							this.loading = false
						}
					})
				} else {
					return false
				}
			})
		}

	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.warehouseId = ''
				this.formData.warehouseName = ''
				this.formData.priceCardType = ''
				this.formData.priceCardName = ''
				this.formData.customerId = ''
				this.formData.customerName = ''
				this.dataList = []
				this.currentRow = {}
				this.init()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
