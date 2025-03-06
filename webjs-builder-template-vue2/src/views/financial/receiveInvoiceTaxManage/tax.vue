<template>
  <!-- invoiceType(税票/形票) invoiceApplyState（待申请/已作废/已申请） role(财务/运营商务)-->
  <el-tabs type="border-card" class="top-tabs">
    <!--待开票申请-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.unInvoiceApply') + '(' + unInvoiceApplyStateNumber +')'" lazy>
      <apply-tax-list :invoiceType='2' :applyState='1' role='FINANCE' @count='init'></apply-tax-list>
    </el-tab-pane>
    <!--待提交税控-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.unSubmitInvoice') + '(' + unSubmitInvoiceNumber +')'" lazy>
      <tosubmit-invoice-tax-list :invoiceType='2' invoiceState='UN_SUBMIT' role='FINANCE' @count='init'></tosubmit-invoice-tax-list>
    </el-tab-pane>
    <!--异常-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.exceptInvoice') + '(' + exceptInvoiceNumber +')'" lazy>
      <except-invoice-tax-list :invoiceType='2' invoiceState='EXCEPT' role='FINANCE' @count='init'></except-invoice-tax-list>
    </el-tab-pane>
    <!--待回传税票-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.touploadInvoice') + '(' + touploadInvoiceNumber +')'" lazy>
      <toupload-invoice-tax-list :invoiceType='2' invoiceState='TO_UPLOAD' role='FINANCE' @count='init'></toupload-invoice-tax-list>
    </el-tab-pane>
    <!--全部税票-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.allInvoiceTax')" lazy>
      <invoice-tax-list :invoiceType='2' invoiceState='INVOICED' role='FINANCE' @count='init'></invoice-tax-list>
    </el-tab-pane>
    <!--推送异常-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.sendExceptInvoice') + '(' + sendExceptInvoiceNumber +')'" lazy>
      <send-except-invoice-tax-list :invoiceType='2' invoiceState='SEND_EXCEPT' role='FINANCE' @count='init' />
    </el-tab-pane>
    <!--全部申请-->
    <el-tab-pane :label="$t('fmsReceiveInvoice.allApplyTax')" lazy>
      <apply-tax-list :invoiceType='2' :applyState='2' role='FINANCE' @count='init'></apply-tax-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import invoiceTaxList from './taxList/invoiceTaxList'
import tosubmitInvoiceTaxList from './taxList/tosubmitInvoiceTaxList'
import touploadInvoiceTaxList from './taxList/touploadInvoiceTaxList'
import exceptInvoiceTaxList from './taxList/exceptInvoiceTaxList'
import sendExceptInvoiceTaxList from './taxList/sendExceptInvoiceTaxList'

import applyTaxList from '../receiveInvoiceTaxApply/applyTaxList'
import { getApplyTaxInvoiceNumberByFinanceApi, getTaxInvoiceNumberByFinanceApi } from "@/api/financial/fmsReceiveInvoice"

export default {
	name: "FmsTaxInvoiceListFinance",
	components: {
		tosubmitInvoiceTaxList,
		touploadInvoiceTaxList,
		exceptInvoiceTaxList,
    sendExceptInvoiceTaxList,
		invoiceTaxList,
		applyTaxList
	},
	data() {
		return {
			loading: false,
			unInvoiceApplyStateNumber: 0,
			unSubmitInvoiceNumber: 0,
			exceptInvoiceNumber: 0,
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
			getApplyTaxInvoiceNumberByFinanceApi().then(res => {
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
			getTaxInvoiceNumberByFinanceApi().then(res => {
				if (res.ok) {
					res.content.forEach(v => {
						// 待提交税控
						if (v.toDoTyp === 1) {
							this.unSubmitInvoiceNumber = v.toDoCount || 0
						}
						// 异常
						if (v.toDoTyp === 2) {
							this.exceptInvoiceNumber = v.toDoCount || 0
						}
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
