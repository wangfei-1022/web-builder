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
            <el-form-item :label="$t('channelPriceCard.channel')" prop="channelId">
              <type-select v-model="formData.channelId" type="channel" @selected="changePriceList" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if='cardType === 11'>
            <el-form-item :label="$t('channelPriceCard.new_price_card_type')" prop="priceCardType">
              <el-select size="mini" v-model="formData.priceCardType" @change="changePriceList">
                <el-option :label="$t('channelPriceCard.priceCardType.GUIDE')" :value="11"></el-option>
                <el-option :label="$t('channelPriceCard.priceCardType.LOWER')" :value="12"></el-option>
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
import { getChannelPriceCardApi, copyChannelPriceCardApi, existsPriceCardNameApi, copyCustomerPriceCardApi } from '@/api/OverseasWarehouse/PriceCardManage'
export default {
	name: 'CopyPriceDialog',
	components: {},
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
			loading: false,
			dataList: [],
			currentRow: {},
			formRules: {
				channelId: [{ required: true, message: this.$t('channelPriceCard.please_select_channel') }],
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
					minWidth: 120,
					showOverflowTooltip: true
				},
				{
					label: this.$t('channelPriceCard.price_card_type'),
					prop: 'priceCardTypeName',
					width: 100,
					showOverflowTooltip: true
				},
				{
					label: this.$t('channelPriceCard.product_code'),
					prop: 'productName',
					minWidth: 100,
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
							{this.getViewUnit(row.unitCategoryType)}
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
				channelId: '',
				priceCardType: null,
				priceCardName: null,
				customerId: null,
				customerName: null
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
		 * 获取单位显示
		 */
		getViewUnit(val) {
			let str = ''
			switch (val) {
				case 11:
					str = this.$t('channelPriceCard.unitCategoryType.IMPERIAL')
					break
				case 20:
					str = this.$t('channelPriceCard.unitCategoryType.METGRAM')
					break
				case 21:
					str = this.$t('channelPriceCard.unitCategoryType.FEETOUNCES')
					break
				default: str = this.$t('channelPriceCard.unitCategoryType.METRIC')
					break
			}
			return str
		},
		// 获取可复制的价卡列表
		async changePriceList() {
			this.dataList = []
			this.currentRow = {}
			if (this.cardType === 11 && (this.$isEmpty(this.formData.channelId) || this.$isEmpty(this.formData.priceCardType))) {
				return
			}
			this.loading = true
			let res = await getChannelPriceCardApi({ channelId: this.formData.channelId, cardType: this.$isEmpty(this.formData.priceCardType) ? this.cardType : this.formData.priceCardType })
			if (res.ok) {
				this.loading = false
				this.dataList = res.content || []
			} else {
				this.loading = false
				this.dataList = []
			}
		},
		/**
	 * 选中客户
	 */
		selectedCustomer(data) {
			this.formData.customerName = data.chineseName
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
					existsPriceCardNameApi({ priceCardName: this.formData.priceCardName, cardType: this.$isEmpty(this.formData.priceCardType) ? this.cardType : this.formData.priceCardType }).then(rs => {
						if (rs.ok) {
							if (rs.content) {
								this.$message.error(this.$t('channelPriceCard.price_card_repeat'))
								this.loading = false
								return
							}
							let saveForm = {
								copyCardId: this.currentRow.id,
								priceCardName: this.formData.priceCardName
							}
							if (this.cardType === 13) {
								saveForm.customerId = this.formData.customerId
								saveForm.customerName = this.formData.customerName
							}
							let fn = this.cardType === 13 ? copyCustomerPriceCardApi : copyChannelPriceCardApi
							fn(saveForm).then(res => {
								this.loading = false
								if (res.ok) {
									this.loading = false
									this.dialogVisible = false
									let query = {
										type: 0,
										id: res.content,
										edit: 1,
										time: new Date().getTime(),
										productType: this.currentRow.productType || 1,
										copy: 1

									}
									this.$emit('saved')
									let routeName = this.cardType === 10 ? 'ChannelPriceCardDetail' : this.cardType === 13 ? 'ProductCustomerPriceCardDetail' : 'ProductCostPriceCardDetail'
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

				this.formData.channelId = ''
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
