<template>
    <div>
      <ExpenseConfirmation ref="confirmationExpenseReceivable" type="AR"></ExpenseConfirmation>
    </div>
</template>

<script>
import ExpenseConfirmation from './components/expenseConfirmation'
export default {
	name: 'ConfirmationExpenseReceivable',
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
			this.$refs.confirmationExpenseReceivable.list()
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
