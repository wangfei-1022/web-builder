<template>
  <div>
    <el-dialog :visible.sync="visible" :title="$t('warehousePriceCard.please_select')" width="800px" :close-on-click-modal="false" @close="closeFn">
      <el-tabs v-model="priceCardType" type="border-card" style="width: 100%">
        <el-tab-pane :label="$t('common.priceCardType.COST')" name="10" lazy>
          <price priceCardType="10" ref="costPrice"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('common.priceCardType.LOWER')" name="12" lazy>
          <price priceCardType="12" ref="lowestPrice"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('common.priceCardType.GUIDE')" name="11" lazy>
          <price priceCardType="11" ref="guidePrice"/>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="closeFn">{{$t('warehousePriceCard.cancel')}} </el-button>
				<el-button type="primary" size="mini" @click="saveForm()" :loading="loading">{{$t('warehousePriceCard.next_step')}}</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import price from './price'
import { basePriceCardsBaseInfoApi } from '@/api/OverseasWarehouse/warehousePriceCard'

export default {
	name: 'PriceCardDialog',
	components: {
		price
	},
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: false,
			priceCardType: '10'
		}
	},
	methods: {
		saveForm() {
			// 成本
			if (this.priceCardType === 10) {
				this.closeFn()
				this.$router.push({ name: 'WarehousePriceCardCostEdit' })
			} else {
				// 最低卖价  && 指导价
				let valid = this.priceCardType === 12 ? this.$refs.lowestPrice.validate() : this.$refs.guidePrice.validate()
				// 校验成功
				if (valid) {
					this.loading = true
					let data = this.priceCardType === 12 ? this.$refs.lowestPrice.getValue() : this.$refs.guidePrice.getValue()
					data.priceCardType = this.priceCardType
					basePriceCardsBaseInfoApi(data).then(res => {
						this.loading = false
						if (res.ok) {
							this.closeFn()
							this.$router.push({ name: 'WarehousePriceCardEdit', query: { id: res.content, priceCardType: this.priceCardType, operateCode: 'ADD' } })
						}
					}).catch(() => {
						this.loading = false
					})
				}
			}
		},
		closeFn() {
			this.$emit('close')
		}
	}
}
</script>

<style>
</style>
