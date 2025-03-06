<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('channelPriceCard.new_customer_price_card')"
			width="1200px"
			:close-on-click-modal="false"
		>
			<el-form
				label-width="100px"
				label-position="left"
				:model="formData"
				ref="formData"
				v-if="dialogVisible"
			>
				<LowestPrice :data="formData" v-if="dialogVisible" />
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="dialogVisible = false"> {{$t('channelPriceCard.cancel')}} </el-button>
				<el-button type="primary" :loading="loading" size="mini" @click="saveForm('formData')">
					{{$t('channelPriceCard.next_step')}}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import LowestPrice from '../../components/LowestPrice.vue'
import { saveTruckPriceCards, saveNotCostCards } from '@/api/OverseasWarehouse/PriceCardManage.js'
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
			customerId: null,
			customerName: null,
			priceCardType: '13',
			pssCoefficient: 1,
			surchargeCoefficient: 1,
			returnCoefficient: 1,
			minAmount: 1,
			priceCardName: '',
			meterBubbleCoefficient: '',
			channelCode: '',
			productCode: null,
			productId: null,
			productName: null,
			productType: null,
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
			formData: this.$extends(true, {}, defaultForm)
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
				let fn = Number(this.formData.productType) === 1 ? saveNotCostCards : saveTruckPriceCards
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
						this.$router.push({ name: 'ProductCustomerPriceCardDetail', query: { id: res.content, productType: this.formData.productType, time: new Date().getTime() } })
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})

			})

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
