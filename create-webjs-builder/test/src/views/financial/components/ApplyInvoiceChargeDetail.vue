<template>
   <div class="invoice-charge-detail">
    <el-table size="mini" :data="tableData" style="width: 100%;" row-key="id" border>
        <el-table-column  prop="billNo" :label="$t('receiveFms.bill_no')" min-width="150"></el-table-column>
        <el-table-column  prop="entityNo" :label="$t('receiveFms.entity_no')" min-width="150"></el-table-column>
        <el-table-column  prop="businessTypeName" :label="$t('receiveFms.business_type')" min-width="100"></el-table-column>
        <el-table-column  prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="100"></el-table-column>
        <el-table-column  prop="chargeCurrency" :label="$t('receiveFms.currency')" min-width="80"></el-table-column>
        <el-table-column  prop="sourceChargeAmount" :label="$t('receiveFms.amount')" width="120">
          <template slot-scope="scope">
            <div style='text-align: right'>{{scope.row.sourceChargeAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column  prop="chargeAmount" :label="$t('fmsReceiveInvoice.invoice_apply_amount')" width="120">
          <template slot-scope="scope">
            <div style='text-align: right'>{{scope.row.chargeAmount}}</div>
          </template>
        </el-table-column>
    </el-table>

    <div class="total">
        <span>合计：</span>
        <span>
          <span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
            <span class='value'>{{item.currency}}</span>
            <span>{{item.value}}</span>
          </span>
        </span>
    </div>

    <pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getDetail"/>
  </div>

</template>
<script>
import { getApplyTaxDetailChargeListApi, getInvoiceDetailChargeListApi } from "@/api/financial/fmsReceiveInvoice"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "FmsInvoiveChargeDetail",
	props: {
		type: {
			type: String,
			default: ''
		},
		amountTotal: {
			type: Array,
			default: function () {
				return []
			}
		}
	},
	data() {
		return {
			loading: false,
			bill: {},
			tableData: [],
			pageSize: 50,
			pageNum: 1,
			total: 0
		}
	},
	created() {
		this.id = this.$route.query.id
		this.getDetail()
	},
	methods: {
		getDetail() {
			if (!this.id) {
				return
			}
			let data = {
				applyId: this.id,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			this.loading = true
			getApplyTaxDetailChargeListApi(data).then(res => {
				if (res.ok) {
					res.content.list.forEach(v => {
						v.taxRate = v.taxRate + '%'
						v.chargeAmount = formatNumberToThousands(v.chargeAmount)
						v.sourceChargeAmount = formatNumberToThousands(v.sourceChargeAmount)
					})
					this.total = res.content.total
					this.tableData = res.content.list
				}
			})
		},
		backList() {
			let name = this.$route.query.origin || (this.type === 'AR' ? 'FmsReceiveConfirmation' : 'FmsPayableConfirmation')
			this.$store.dispatch('tagsView/delView', this.$route)
			// 当传入的是close 则说明来源不是列表 无法回归，则关闭当前即可
			if (name !== 'close') {
				this.$router.push({ name: name })
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.invoice-charge-detail {
	padding: 20px;
	background: #fff;
}

.total {
	background: rgba(16, 142, 233, 0.1);
	color: #108ee9;
	font-family: "PingFangSC-Regular", "PingFang SC";
	font-weight: 400;
	font-style: normal;
	font-size: 14px;
	height: 50px;
	line-height: 50px;
	padding: 0px 10px;

	.value-item {
		display: inline-block;
		margin-right: 50px;
		.value {
			display: inline-block;
			margin-right: 5px;
		}
	}
}

.module {
	overflow: hidden;
	padding: 20px 0;
	background: #fff;
	margin-bottom: 20px;
	border-radius: 5px;

	.title {
		font-size: 16px;
		font-weight: 600;
		border-bottom: 1px solid #f0f2f5;
		margin-bottom: 15px;
		padding: 0 20px 15px 20px;
	}
	.content {
		padding: 0 25px;
		overflow: hidden;
	}
	.img {
		display: block !important;
		border: 1px dashed #ccc;
		border-radius: 6px;
		width: 300px;
		height: 180px;
		line-height: 180px;
		text-align: center;
		cursor: pointer;
		padding: 0;
		float: left;

		img {
			width: 100%;
			height: 100%;
			-o-object-fit: conver;
			object-fit: conver;
		}
	}
	.item {
		width: 50%;
		float: left;
		margin-bottom: 15px;
		display: flex;

		label {
			width: 130px;
			display: block;
			text-align: right;
			margin-bottom: 15px;
			font-weight: 500;
			font-size: 14px;
			float: left;
			margin-right: 6px;
		}
		span {
			font-weight: 500;
			font-size: 14px;
			display: inline;
			flex: 1;
		}
	}
}
</style>

