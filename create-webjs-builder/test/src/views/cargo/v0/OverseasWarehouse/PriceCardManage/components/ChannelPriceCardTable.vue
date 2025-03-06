<template>
	<div v-loading="loading">
		<lb-table
			:column="columnData"
			:data="dataList"
			highlight-current-row
			stripe
			@current-change="handleCurrentChange"
		>
		</lb-table>
	</div>
</template>

<script lang="jsx">
import { getChannelPriceCardApi } from '@/api/OverseasWarehouse/PriceCardManage.js'
export default {
	name: 'ChannelPriceCardTable',
	props: {
		data: Object,
		cardType: {
			type: String,
			default: '10'
		}
	},
	data() {
		return {
			loading: false,
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
					showOverflowTooltip: true
				},
				{
					label: this.$t('channelPriceCard.price_card_type'),
					prop: 'priceCardTypeName',
					showOverflowTooltip: true
				},
				{
					label: this.$t('channelPriceCard.effective_start_time'),
					prop: 'expiryDateStart',
					minWidth: 150,
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
					minWidth: 150,
					render: (h, { row }) =>
						<div>
							{
								this.$moment(parseInt(row.expiryDateEnd, 10)).utc().format("YYYY-MM-DD HH:mm:ss")
							}

						</div>
				}
			],
			dataList: [],
			currentRow: null

		}
	},
	created() {

	},
	watch: {
		'data.productId': {
			handler() {
				this.getChannelPriceCard()

			},
			immediate: true
		}
	},
	methods: {
		handleCurrentChange(val) {
			if (this.$isEmpty(val)) {
				this.data.unitCategoryType = null
				return
			}
			this.currentRow = val
			this.data.associatedPriceCardId = val.id
			this.data.costPriceCardId = val.costPriceCardId
			this.data.unitCategoryType = val.unitCategoryType || '10'
		},

		/**
		 * 通过物流产品查询对应的成本价卡
		 */
		async getChannelPriceCard() {
			if (this.$isEmpty(this.data.channelId)) {
				return
			}
			this.loading = true
			let res = await getChannelPriceCardApi({
				cardType: 10,
				channelId: this.data.channelId
			}).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.loading = false
				this.dataList = res.content || []
			} else {
				this.loading = false
			}
		}
	}
}
</script>

<style scoped lang="less">
</style>
