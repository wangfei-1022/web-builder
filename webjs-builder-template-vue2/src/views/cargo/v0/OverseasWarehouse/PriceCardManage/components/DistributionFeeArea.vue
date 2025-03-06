<template>
	<div>
		<div v-if="$isNotEmpty(data.chargeDetailForDeliveryChargeDTOList)">
			<el-table :data="data.chargeDetailForDeliveryChargeDTOList">
				<el-table-column
					:label="$t('channelPriceCard.weightInfo') + getViewUnit"
					prop="endWeight"
				/>
				<el-table-column
					:label="item"
					v-for="(item, index) in columns"
					:key="index"
				>
					<template slot-scope="{ row }">
						<span>{{ getColumnVal(row, item) }}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DistributionFeeArea',
	props: {
		data: {
			type: Object,
			require: true
		},
		// 是否为成本价卡
		isBasePrice: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			columns: []
		}
	},
	computed: {
		/**
		 * 获取单位显示
		 */
		getViewUnit() {
			let str = ''
			let val = Number(this.data.unitCategoryType)
			switch (val) {
				case 11:
					str = this.$t('channelPriceCard.weightType.LB')
					break
				case 20:
					str = this.$t('channelPriceCard.weightType.g')
					break
				case 21:
					str = this.$t('channelPriceCard.weightType.OZ')
					break
				default: str = this.$t('channelPriceCard.weightType.KG')
					break
			}
			return str
		},
	},
	watch: {
		'data.chargeDetailForDeliveryChargeDTOList': {
			handler(val) {
				// 用第一条数据动态生成列
				this.columns = []
				if (this.$isEmpty(val)) {
					return
				}
				let handlerData = val[0]
				for (let key in handlerData.deliveryChargeValueDTOMap) {
					this.columns.push(key)
				}
			},
			immediate: true
		}
	},
	methods: {
		/**
		 * 获取动态列数据
		 */
		getColumnVal(row, key) {
			if (this.isBasePrice) {
				return row.deliveryChargeValueDTOMap[key].basePrice
			} else {
				return row.deliveryChargeValueDTOMap[key].basePrice + '/' + row.deliveryChargeValueDTOMap[key].adjustmentPrice
			}
		}
	}
}
</script>

<style scoped >
</style>
