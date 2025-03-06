<template>
  <el-tabs type="border-card" class="top-tabs">
    <el-tab-pane :label="$t('receiveFms.ALL')">
      <bill type='AR' @refresh="init"></bill>
    </el-tab-pane>
    <el-tab-pane :label="unBillStateTitle" lazy>
      <bill type='AR' :billState='1' @refresh="init"></bill>
    </el-tab-pane>
    <el-tab-pane :label="unSendBillStateTitle" lazy>
      <bill type='AR' :pushEmailState='1' @refresh="init"></bill>
    </el-tab-pane>
    <el-tab-pane :label="sendBillStateExTitle" lazy>
      <bill type='AR' :pushEmailState='5' @refresh="init"></bill>
    </el-tab-pane>
    <el-tab-pane :label="$t('receiveFms.SENDED')" lazy>
      <bill type='AR' :pushEmailState='6' @refresh="init"></bill>
    </el-tab-pane>
    <el-tab-pane :label="unInvoiceApplyStateTitle" lazy>
      <bill type='AR' :billState='2' :invoiceApplyState='1' @refresh="init"></bill>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import bill from './bill'
import { getBillStatusNumberApi } from "@/api/financial/fmsReceive"

export default {
	name: "FmsReceiveBill",
	components: {
		bill
	},
	data() {
		return {
			loading: false,
			unInvoiceApplyStateNumber: '',
			unInvoiceApplyStateTitle: this.$t('receiveFms.UN_APPLY_INVOICE'),
			unBillStateNumber: '',
			unBillStateTitle: this.$t('receiveFms.UN_VERIFY'),
			unSendBillStateTitle: this.$t('receiveFms.UN_SENDED'),
			sendBillStateExTitle: this.$t('receiveFms.SEND_EX')
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
					this.unBillStateTitle = this.$t('receiveFms.UN_VERIFY') + '(' + res.content.value + ')'
				}
			})
			// 待申请开票
			getBillStatusNumberApi(2).then(res => {
				if (res.ok) {
					this.unInvoiceApplyStateTitle = this.$t('receiveFms.UN_APPLY_INVOICE') + '(' + res.content.value + ')'
				}
			})
			// 待推送
			getBillStatusNumberApi(4).then(res => {
				if (res.ok) {
					this.unSendBillStateTitle = this.$t('receiveFms.UN_SENDED') + '(' + res.content.value + ')'
				}
			})
			// 推送异常
			getBillStatusNumberApi(5).then(res => {
				if (res.ok) {
					this.sendBillStateExTitle = this.$t('receiveFms.SEND_EX') + '(' + res.content.value + ')'
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
