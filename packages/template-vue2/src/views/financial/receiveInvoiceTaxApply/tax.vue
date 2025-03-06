<template>
	<!-- invoiceType(税票/形票) invoiceApplyState（待申请/已作废/已申请） role(财务/运营商务)-->
	<el-tabs type="border-card" class="top-tabs">
		<!--待开票申请-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.un_invoice_apply') + '(' + unInvoiceApplyStateNumber +')'" lazy>
			<apply-tax-list :invoiceType='2' :applyState='1' role="OPERATORS" @count='init'></apply-tax-list>
		</el-tab-pane>
		<!--已撤回申请-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.recall_apply') + '(' + rejectStateNumber +')'" lazy>
			<apply-tax-list :invoiceType='2' :applyState='3' role='OPERATORS' @count='init'></apply-tax-list>
		</el-tab-pane>
		<!--我的申请-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.my_apply')" lazy>
			<apply-tax-list :invoiceType='2' :applyState='2' role='OPERATORS' @count='init'></apply-tax-list>
		</el-tab-pane>
		<!--我的税票-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.my_tax_invoice')" lazy>
			<apply-invoice-tax-list :invoiceType='2' invoiceState='INVOICED' role='OPERATORS' @count='init'></apply-invoice-tax-list>
		</el-tab-pane>
		<!--全部申请-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.all_apply')" lazy v-if="isAllApplyList">
			<apply-tax-list :invoiceType='2' :applyState='2' role='BUSINESS' @count='init'></apply-tax-list>
		</el-tab-pane>
		<!--全部税票-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.all_tax_invoice')" lazy v-if="isAllInvoiceList">
			<apply-invoice-tax-list :invoiceType='2' invoiceState='INVOICED' role='BUSINESS' @count='init'></apply-invoice-tax-list>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import applyTaxList from "./applyTaxList";
import applyInvoiceTaxList from "./applyInvoiceTaxList";
import { getTaxApplyInvoiceStatusNumberApi } from "@/api/financial/fmsReceiveInvoice";
import store from "@/store";

export default {
	name: "FmsTaxInvoiceListOperator",
	components: {
		applyTaxList, // 申请的列表
		applyInvoiceTaxList // 发票的列表
	},
	data() {
		return {
			loading: false,
			unInvoiceApplyStateNumber: 0,
			rejectStateNumber: 0,
			isAllApplyList: false,
			isAllInvoiceList: false
		};
	},
	created() {
		const roles = store.getters && store.getters.roles;
		roles.forEach(v => {
			if (v === "fms:receive:tax:all:apply:list") {
				this.isAllApplyList = true;
			}
			if (v === "fms:receive:tax:all:invoice:list") {
				this.isAllInvoiceList = true;
			}
		});
		this.init();
	},
	methods: {
		init() {
			getTaxApplyInvoiceStatusNumberApi().then(res => {
				if (res.ok) {
					res.content.forEach(v => {
						// 待申请开票
						if (v.toDoTyp === 1) {
							this.unInvoiceApplyStateNumber = v.toDoCount || 0;
						}
						// 已拒绝开票
						if (v.toDoTyp === 3) {
							this.rejectStateNumber = v.toDoCount || 0;
						}
					});
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
</style>
