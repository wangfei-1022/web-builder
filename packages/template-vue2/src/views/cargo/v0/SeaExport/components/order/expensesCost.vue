<template>
  <div class="box" v-loading="loading">
    <ExpensesCostList v-if="page===1" @changePage="changePage" :orderDetailsData="orderDetailsData" :confirmationSheetId="confirmationSheetId"></ExpensesCostList>
    <ExpensesCostDetails v-if="page===2 && $isNotEmpty(orderDetailsData)" :orderDetailsData="orderDetailsData" :confirmationId="confirmationId" :viewBy="viewBy" @changePage="changePage"></ExpensesCostDetails>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import ExpensesCostList from "./expensesCostList"
import ExpensesCostDetails from "./expensesCostDetails"
export default {
	name: 'ExpensesCost',
	components: { ExpensesCostList, ExpensesCostDetails },
	props: {
		uploadRadioType: { type: String, default: null },
		orderDetailsData: { type: Object, default: () => { } }
	},
	data() {

		return {
			loading: false,
			id: this.$route.query.id,
			dataList: [{
				businessNo: null
			}],
			page: 1,
			confirmationSheetId: null,
			confirmationId: null,
			viewBy: true
		}
	},
	computed: {
		url() {
			return URL
		}
	},
	created() { },
	methods: {
		changePage(val, type, id) {
			if (type === 'add') { // 新建
				this.confirmationSheetId = null
				this.confirmationId = null
				this.viewBy = true
			}
			if (type === 'preview') { // 预览
				this.confirmationId = id
				this.viewBy = false
			}
			if (type === 'edit') { // 编辑
				this.confirmationId = id
				this.viewBy = true
			}
			this.page = val
		},
		clientEdit() {
			this.$router.push({ name: 'SeaExportOrderCreate', query: { id: this.id } })
		}
	}
}
</script>
<style lang="scss" scoped>
.flex-bet {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
}
.box_title {
	border-left: solid 3px rgb(24, 144, 255);
	font-size: 18px;
	color: #199ed8;
	padding-left: 8px;
	height: 28px;
	line-height: 28px;
	margin: 5px 0 8px 0;
	display: flex;
	.operate-buttons-left {
		margin-left: 20px;
	}
}
.box {
	background-color: #f5f7f7;
	padding: 8px;
	::v-deep .el-form-item--medium {
		.el-form-item__content {
			line-height: 28px;
		}
		.el-form-item__label {
			line-height: 28px;
		}
	}
}
.box_child {
	border: solid 1px rgba(121, 121, 121, 1);
	padding: 20px 30px;
	background: #fff;
	margin-bottom: 15px;
	.box25 {
		width: 20%;
	}
}
::v-deep .el-form--inline .el-form-item {
	display: block;
}
.cost_head {
	display: flex;
	justify-content: space-between;
	border-bottom: #ccc solid 1px;
	padding-bottom: 8px;
}
.cost_mid {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	::v-deep .el-form-item {
		width: 30%;
	}
}
.addExpenseConfirmation {
	width: 100%;
	margin: 12px auto;
}
//**
</style>
