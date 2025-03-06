<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="page-edit-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('fmsReceiptTransactions.claimDetail')" name="first" v-if="type === 'CLAIMER'">
          <transaction-detail :type="type"></transaction-detail>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsReceiptTransactions.transactions_detail')" name="first" v-if="type !== 'CLAIMER'">
          <transaction-detail :type="type"></transaction-detail>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsReceiptTransactions.clearDetail')" name="second" lazy v-if="isShowClearData">
          <clear-charge-detail :type="type"></clear-charge-detail>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsReceiptTransactions.rechargeClearDetail')" name="third" lazy v-if="isShowRechargeClearData">
          <recharge-detail :type="type"></recharge-detail>
        </el-tab-pane>
      </el-tabs>
		</div>

		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList()">{{ $t('common.close') }}</el-button>
		</div>
	</div>

</template>
<script>
import { getTransactionReceiptDetailApi, getTransactionClaimerDetailApi, getTransactionRechargeClearInfoApi, getClaimRechargeClearInfoApi } from "@/api/financial/fmsReceiptTransactions";
import TransactionDetail from './components/TransactionDetail'
import ClearChargeDetail from './components/ClearChargeDetail'
import RechargeDetail from './components/RechargeDetail'
import { getTransactionClearInfoApi, getTransactionClearInfoTotalApi, getClaimClearInfoApi, getClaimClearInfoTotalApi } from "@/api/financial/fmsReceiptTransactions"

export default {
	name: "ReceiptTransactionsDetail",
	props: {
		type: {
			type: String,
			default: ""
		}
	},
  components: {
    TransactionDetail,
    ClearChargeDetail,
    RechargeDetail
  },
	data() {
		return {
			id: "",
			backPath: "",
      activeName: 'first',
			loading: false,
      isShowClearData: false,
      isShowRechargeClearData: false
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.backPath = this.$route.query.backPath;
    // 是否展示核销详情 和 充值核销详情
    this.isShow()
	},
	methods: {
    isShow() {
      let data = {
        pageSize: 50,
        pageNum: 1
      }
      let fn = null
      if (this.type === "CLAIMER") {
        fn = getClaimClearInfoApi
        data.claimId = this.id
      } else {
        fn = getTransactionClearInfoApi;
        data.transactionsId = this.id
      }
      fn(data).then(res => {
        if (res.ok) {
          this.isShowClearData = res.content.list.length > 0
        }
      })

      let rechargeFn = null
      if (this.type === "CLAIMER") {
        rechargeFn = getClaimRechargeClearInfoApi
        data.claimId = this.id
      } else {
        rechargeFn = getTransactionRechargeClearInfoApi;
        data.transactionsId = this.id
      }
      rechargeFn(data).then(res => {
        if (res.ok) {
          this.isShowRechargeClearData = res.content.list.length > 0
        }
      })
    },
		backList() {
			if (this.backPath) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.backPath });
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.page-edit-container .page-edit-content {
  background: #fff;
  padding: 0;
}
::v-deep .el-tabs__header{
  margin-bottom: 0px;
  padding-left: 20px;
}
</style>

