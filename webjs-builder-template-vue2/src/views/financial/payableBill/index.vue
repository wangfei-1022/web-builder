<template>
  <el-tabs type="border-card" class="top-tabs">
    <el-tab-pane :label="$t('receiveFms.ALL')">
      <bill type='AP'></bill>
    </el-tab-pane>
    <el-tab-pane :label="unBillStateTitle" lazy>
      <bill type='AP' :billState='1'></bill>
    </el-tab-pane>
    <el-tab-pane :label="unInvoiceApplyStateTitle" lazy v-if="false">
      <bill type='AP' :billState='2' :invoiceApplyState='1'></bill>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import bill from './bill'
import { getBillStatusNumberApi } from "@/api/financial/fmsPayable"

export default {
	name: "FmsPayableBill",
	components: {
		bill
	},
	data() {
		return {
			loading: false,
			unInvoiceApplyStateNumber: '',
			unInvoiceApplyStateTitle: this.$t('payableFms.UN_APPLY_INVOICE'),
			unBillStateNumber: '',
			unBillStateTitle: this.$t('payableFms.UN_VERIFY')
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			// 待对账
			getBillStatusNumberApi(1).then(res => {
				if (res.ok) {
					this.unBillStateTitle = this.$t('payableFms.UN_VERIFY') + '(' + res.content.value + ')'
				}
			})
			// 待申请开票
			getBillStatusNumberApi(2).then(res => {
				if (res.ok) {
					this.unInvoiceApplyStateTitle = this.$t('payableFms.UN_APPLY_INVOICE') + '(' + res.content.value + ')'
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
