<template>
  <div class="clear-charge-detail">
    <div class="section" style="padding: 0 20px 20px 20px;">
      <div class="title" style="padding-left: 0;">
        <span class="title-item-des">
          <svg-icon className="clear-module-icon" iconClass="icon-weixiaozhangdan" v-if="isBill" />
          <svg-icon className="clear-module-icon" iconClass="icon-fapiaoguanli" v-else-if="isInvoice" />
          <svg-icon className="clear-module-icon" iconClass="icon-weixiaofeiyong" v-else />
          {{$t('fmsReceiveClear.clear_total_amount')}}
        </span>

        <span class="currency-value-des" >
          <span style="margin-right: 10px" v-for="(item, index) in sourceAmountsTotal" :key="index">
            {{item.currency}}{{item.value | numberToThousands}}
          </span>
        </span>

        <span class="title-item-des">
          {{$t('fmsReceiveClear.use_total_amount')}}
        </span>

        <span class="currency-value-des" >
          <span style="margin-right: 10px" v-for="(item, index) in useAmountsTotal" :key="index">
            {{item.currency}}{{item.value | numberToThousands}}
          </span>
        </span>
      </div>

      <el-table size="mini" :data="tableData" style="width: 100%;" row-key="id" border>
        <el-table-column  prop="rechargeNo" :label="$t('fmsReceiptTransactions.rechargeApplyNo')" min-width="150"></el-table-column>
        <el-table-column  prop="accountCodeName" :label="$t('fmsReceiptTransactions.businessType')" min-width="150"></el-table-column>
        <el-table-column  prop="settlementCompanyName" :label="$t('fmsReceiptTransactions.settlement_company')" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="settlementOfficeName" :label="$t('fmsReceiptTransactions.settlement_office')" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="chargeCurrency" :label="$t('fmsReceiptTransactions.transactionsAmountStr')" width="120">
          <template slot-scope="scope">
            <div style='text-align: right'>
              {{scope.row.transactionsAmount | numberToThousands}}
              {{scope.row.transactionsCurrency}}
            </div>
          </template>
        </el-table-column>
        <el-table-column  prop="useAmount" :label="$t('fmsReceiptTransactions.useAmount')" min-width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>
              {{scope.row.useAmount | numberToThousands}}
            </div>
           </template>
        </el-table-column>
        <el-table-column  prop="accountCurrency" :label="$t('fmsReceiptTransactions.entryAccountCurrency')" min-width="100"></el-table-column>
        <el-table-column  prop="accountAmount" :label="$t('fmsReceiptTransactions.entryAccountAmount')" min-width="100">
          <template slot-scope="scope">
           <div style='text-align: right'>
              {{scope.row.accountAmount | numberToThousands}}
            </div>
          </template>
        </el-table-column>

      </el-table>

      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getDetail"/>
    </div>
  </div>

</template>
<script>
import { getTransactionRechargeClearInfoApi, getTransactionRechargeClearInfoTotalApi, getClaimRechargeClearInfoApi, getClaimRechargeClearInfoTotalApi } from "@/api/financial/fmsReceiptTransactions"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "FmsClearChargeDetail",
	props: {
		totalData: {
			type: Object,
			default: function() {
        return {
          sourceAmounts: [],
          clearingInfo: {
            bills: [],
            invoices: []
          }
        }
      }
		},
    type: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			loading: false,
			bill: {},
			tableData: [],
			amountTotal: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			instructionId: '',

      isBill: false,
      isInvoice: false,
      sourceAmountsTotal: [],
      useAmountsTotal: []
		}
	},
	created() {
		this.id = this.$route.query.id
		this.getDetail()
	},
	methods: {
		getDetail() {
			this.loading = true
      let data = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      let fn = null
      let totalFn = null
      if (this.type === "CLAIMER") {
        fn = getClaimRechargeClearInfoApi
        totalFn = getClaimRechargeClearInfoTotalApi
        data.claimId = this.id
      } else {
        fn = getTransactionRechargeClearInfoApi;
        totalFn = getTransactionRechargeClearInfoTotalApi
        data.transactionsId = this.id
      }
			fn(data).then(res => {
				if (res.ok) {
					this.total = res.content.total
					this.tableData = res.content.list
				}
			})
			totalFn(data).then(res => {
				if (res.ok) {
          res.content.forEach(v => {
            if (v.amountName === "AMOUNT_NAME_CLEAR_TOTAL") {
              this.sourceAmountsTotal = v.amounts
            }
            if (v.amountName === "AMOUNT_NAME_CLEAR_TOTAL") {
              this.useAmountsTotal = v.amounts
            }
          })
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
@import "../../styles/clear.scss";
.clear-charge-detail {
	padding: 20px;
  background: #f0f2f5;
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

