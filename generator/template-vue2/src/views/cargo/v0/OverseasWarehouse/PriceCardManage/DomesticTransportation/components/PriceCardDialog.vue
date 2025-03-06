<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('channelPriceCard.please_select')"
			width="1200px"
			:close-on-click-modal="false"
		>
			<el-form
				label-width="100px"
				label-position="left"
				:model="formData"
				ref="formData"
				v-if="dialogVisible"
				v-loading="loading"
			>
				<el-tabs
					v-model="formData.priceCardType"
					type="border-card"
					style="width: 100%"
					@tab-click="handlerTabClick"
				>
					<el-tab-pane :label="$t('channelPriceCard.priceCardType.LOWER')" name="12">
						<LowestPrice
							ref="LowestPrice"
							:data="formData"
							v-if="formData.priceCardType == '12'"
						/>
					</el-tab-pane>
					<el-tab-pane :label="$t('channelPriceCard.priceCardType.GUIDE')" name="11">
						<LowestPrice
							ref="LowestPrice"
							:data="formData"
							v-if="formData.priceCardType == '11'"
						/>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="dialogVisible = false"> {{$t('channelPriceCard.cancel')}} </el-button>
				<el-button type="primary" size="mini" :loading="loading" @click="saveForm('formData')">
					{{$t('channelPriceCard.next_step')}}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import LowestPrice from '../../components/LowestPrice.vue'
import { saveNotCostCards, saveTruckNotCostCards } from '@/api/OverseasWarehouse/PriceCardManage.js'
export default {
	name: 'PriceCardDialog',
	components: { LowestPrice },
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		let defaultForm = {
			associatedPriceCardId: '',
			costPriceCardId: '',
			priceCardType: '12',
			pssCoefficient: 1,
			surchargeCoefficient: 1,
			minAmount: 1,
			priceCardName: '',
			channelCode: null,
			channelId: null,
			productCode: null,
			productId: null,
			productName: null,
			productType: null,
			countryCode: null,
			countryName: null,
			unitCategoryType: null,
			chargeTypeCoefficientDTOList: [
				{
					adjustmentCoefficient: 1,
					areaCodeList: [],
					endWarehouseIdList: [],
					endWarehouseId: null,
					serial: 0,
					startWarehouseIdList: [],
					startWarehouseId: null,
					endTray: '',
					startTray: '',
					weightEndValue: '',
					weightStartValue: ''
				}
			]
		}
		return {
			defaultForm,
			dialogVisible: false,
			loading: false,
			formData: this.$extends(true, {}, defaultForm),
			tempDTOList: []
		}
	},
	methods: {
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				if (this.$isEmpty(this.formData.associatedPriceCardId)) {
					this.$message.error(this.$t('channelPriceCard.please_select_cost_price_card'))
					return
				}
				this.loading = true
				let fn = Number(this.formData.productType) === 1 ? saveNotCostCards : saveTruckNotCostCards
				if (this.$isNotEmpty(this.formData.chargeTypeCoefficientDTOList)) {
					this.formData.chargeTypeCoefficientDTOList.forEach((item, index) => {
						item.serial = index + 1
						item.endWarehouseIdList = item.endWarehouseId ? [item.endWarehouseId] : []
						item.startWarehouseIdList = item.startWarehouseId ? [item.startWarehouseId] : []
					})
				}
				fn(this.formData).then(res => {
					if (res.ok) {
						this.dialogVisible = false
						this.$router.push({ name: 'ProductCostPriceCardDetail', query: { id: res.content, productType: this.formData.productType, time: new Date().getTime() } })
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})

			})

		},

		handlerTabClick() {
			this.formData.associatedPriceCardId = null
			let temp = this.$extends(true, [], this.formData.chargeTypeCoefficientDTOList)
			if (this.$isEmpty(this.tempDTOList)) {
				this.formData.chargeTypeCoefficientDTOList = [
					{
						adjustmentCoefficient: 1,
						areaCodeList: [],
						endWarehouseIdList: [],
						endWarehouseId: null,
						serial: 0,
						startWarehouseIdList: [],
						startWarehouseId: null,
						endTray: '',
						startTray: '',
						weightEndValue: '',
						weightStartValue: ''
					}
				]
			} else {
				this.formData.chargeTypeCoefficientDTOList = this.$extends(true, [], this.tempDTOList)
			}
			// 缓存数据
			this.tempDTOList = temp
		}
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.formData = this.$extends(true, {}, this.defaultForm)
			}
			this.$emit('update:visible', val)
		},
		visible(val) {
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
