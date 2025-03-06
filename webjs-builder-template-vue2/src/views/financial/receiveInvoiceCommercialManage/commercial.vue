<template>
  <el-tabs type="border-card" class="top-tabs">
    <!--待回传形票-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.touploadInvoiceCommercial') + '(' + touploadInvoiceNumber +')'" lazy>
      <toupload-invoice-commercial-list :invoiceType='3' invoiceState='TO_UPLOAD' role='FINANCE' @count='init'></toupload-invoice-commercial-list>
    </el-tab-pane>
    <!--全部形票-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.allInvoiceCommercial')" lazy>
      <invoice-commercial-list :invoiceType='3' invoiceState='INVOICED' role='FINANCE' @count='init'></invoice-commercial-list>
    </el-tab-pane>
    <!--推送异常-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.sendExceptInvoice') + '(' + sendExceptInvoiceNumber +')'" lazy>
      <send-except-invoice-commercial-list :invoiceType='2' invoiceState='SEND_EXCEPT' role='FINANCE' @count='init'></send-except-invoice-commercial-list>
    </el-tab-pane>
    <!--全部申请-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.allApply')" lazy>
      <apply-commercial-list :invoiceType='3' :applyState='2' role='FINANCE' @count='init'></apply-commercial-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import applyCommercialList from '../receiveInvoiceCommercialApply/applyCommercialList'

import invoiceCommercialList from './commercialList/invoiceCommercialList'
import touploadInvoiceCommercialList from './commercialList/touploadInvoiceCommercialList'
import sendExceptInvoiceCommercialList from './commercialList/sendExceptInvoiceCommercialList'
import { getApplyCommercialInvoiceNumberByFinanceApi, getCommercialInvoiceNumberByFinanceApi } from "@/api/financial/fmsReceiveInvoice"

export default {
	name: "FmsCommercialInvoiceListFinance",
	components: {
		invoiceCommercialList,
		applyCommercialList,
		touploadInvoiceCommercialList,
    sendExceptInvoiceCommercialList
	},
	data() {
		return {
			loading: false,
			unInvoiceApplyStateNumber: 0,
			touploadInvoiceNumber: 0,
      sendExceptInvoiceNumber: 0
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			// 开票申请相关
			getApplyCommercialInvoiceNumberByFinanceApi().then(res => {
				if (res.ok) {
					res.content.forEach(v => {
						// 待申请开票
						if (v.toDoTyp === 1) {
							this.unInvoiceApplyStateNumber = v.toDoCount || 0
						}
					})
				}
			})
			// 发票相关
			getCommercialInvoiceNumberByFinanceApi().then(res => {
				if (res.ok) {
					res.content.forEach(v => {
						// 待回传
						if (v.toDoTyp === 3) {
							this.touploadInvoiceNumber = v.toDoCount || 0
						}
            // 推送异常
						if (v.toDoTyp === 4) {
							this.sendExceptInvoiceNumber = v.toDoCount || 0
						}
					})
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
