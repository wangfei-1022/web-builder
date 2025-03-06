<template>
    <div>
      <ExpenseConfirmation ref="confirmationExpensesPayable" type="AP"></ExpenseConfirmation>
    </div>
</template>

<script>
import ExpenseConfirmation from './components/expenseConfirmation'
export default {
	name: 'ConfirmationExpensesPayable',
	components: { ExpenseConfirmation },
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
			this.$refs.confirmationExpensesPayable.list()
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
