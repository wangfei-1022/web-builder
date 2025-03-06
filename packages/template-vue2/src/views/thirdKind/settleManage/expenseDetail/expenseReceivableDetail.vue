<template>
  <div>
    <ExpenseDetail type="AR" ref="expenseReceivableDetail"></ExpenseDetail>
  </div>
</template>

<script>
import ExpenseDetail from './components/expenseDetail'
export default {
	name: 'ExpenseReceivableDetail',
	components: { ExpenseDetail },
	data() {
		return {

		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		list() {
			this.$refs.expenseReceivableDetail.list()
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.list()
		})
	}
};
</script>

<style scoped lang="less">
</style>
