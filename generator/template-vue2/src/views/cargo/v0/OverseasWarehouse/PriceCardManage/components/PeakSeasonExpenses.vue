<template>
	<div>
		<ExpenseStatement :data="data" :type="type" :isBaseCard="isBaseCard" :isPeakSeason="true" />
	</div>
</template>

<script>
import ExpenseStatement from './ExpenseStatement.vue'
export default {

	name: 'PeakSeasonExpenses',
	components: { ExpenseStatement },
	props: {
		data: {
			type: Object,
			require: true
		},
		type: String,
		isBaseCard: {
			type: Boolean,
			default: true
		}
	},
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
