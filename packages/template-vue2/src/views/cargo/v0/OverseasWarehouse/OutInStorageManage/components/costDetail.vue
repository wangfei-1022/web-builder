<template>
	<div>
		<lb-table
			show-summary
			border
			stripe
			:summary-method="getSummaries"
			:column="columnData"
			:data="dataList || []"
      align="center"
		/>
	</div>
</template>
<script lang="jsx">
import getZHMixin from './getZHMixin'
import { formatNumberToThousands, formatCurrency, formatCurrencyName } from '@/utils'
export default {
	name: 'CostDetail',
	mixins: [getZHMixin],
	props: {
		dataList: {
			type: Array,
			default: () => []
		},
		totalPrice: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {
			columnData: [
				{
					label: this.getZH('number'),
					width: 50,
					render: (h, { $index }) =>
						<div>
							{
								$index + 1
							}
						</div>
				},
				{
					label: this.getZH('costName'),
					prop: 'chargeName',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('billingTerms'),
					prop: 'chargeItemCondition',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('currency'),
					prop: 'currency',
					showOverflowTooltip: true,
					render: (h, { row }) =>
						<div>
							{formatCurrencyName(row.currency)}
						</div>
				},
				{
					label: this.getZH('basePrice'),
					prop: 'price',
					showOverflowTooltip: true,
					align: 'right',
					render: (h, { row }) =>
						<div>
							{formatCurrency(row.currency)}
							{formatNumberToThousands(row.price, false)}
						</div>
				},
				{
					label: this.getZH('cnt'),
					prop: 'quantity',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('estimatedAmount'),
					prop: 'totalAmount',
					showOverflowTooltip: true,
					align: 'right',
					render: (h, { row }) =>
						<div>
							{formatCurrency(row.currency)}
							{formatNumberToThousands(row.totalAmount, false)}
						</div>
				},
				{
					label: this.getZH('estimatedTime'),
					prop: 'createTime',
					showOverflowTooltip: true,
					render: (h, { row }) =>
						<div>
							{
								this.formatDate(row.createTime)
							}
						</div>
				}
			]
		}
	},
	computed: {
		getTotalPrice() {
			let total = ''
			if (this.$isNotEmpty(this.totalPrice)) {
				for (const key in this.totalPrice) {
					let value = formatCurrency(key) + formatNumberToThousands(this.totalPrice[key], false)
					if (total) {
						total += '、'
					}
					total += value
				}
			}
			return total
		}
	},
	methods: {
		getSummaries(param) {
			const { columns, data } = param
			const sums = []
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = this.getZH('combined')
					return
				}
				const values = data.map(item => Number(item[column.property]))
				if (!values.every(value => isNaN(value)) && index === 6) {
					sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr)
						if (!isNaN(value)) {
							return this.getTotalPrice
						} else {
							return prev
						}
					}, 0)
				} else {
					sums[index] = ''
				}
			})

			return sums
		}
	}
}
</script>
<style>
</style>
