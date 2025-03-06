<template>
  <div>
    <ExpenseDetail type="AP" ref="expensePayableDetail"></ExpenseDetail>
  </div>
</template>

<script>
import ExpenseDetail from './components/expenseDetail'
export default {
	name: 'ExpensePayableDetail',
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
			this.$refs.expensePayableDetail.list()
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
