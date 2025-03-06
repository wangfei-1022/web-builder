<template>
	<div>
		<ProductCostPriceCardDetail
			:isMember="true"
			:productType="Number($route.query.productType)"
		/>
	</div>
</template>

<script>
import ProductCostPriceCardDetail from './ProductCostPriceCardDetail.vue'
export default {
	name: 'ProductCustomerPriceCardDetail',
	components: { ProductCostPriceCardDetail },
	data() {
		return {

		}
	},
	created() {

	},
	mounted() {

	},
	methods: {

	}
}
</script>

<style scoped lang="less">
</style>
