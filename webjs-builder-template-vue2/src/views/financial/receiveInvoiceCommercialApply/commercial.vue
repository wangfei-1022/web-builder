<template>
	<el-tabs type="border-card" class="top-tabs">
		<!--待开票申请-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.un_invoice_apply') + '(' + unInvoiceApplyStateNumber +')'" lazy>
			<apply-commercial-list :invoiceType='3' :applyState='1' role='OPERATORS' @count='init'></apply-commercial-list>
		</el-tab-pane>
		<!--已撤回申请-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.recall_apply')" lazy>
			<apply-commercial-list :invoiceType='3' :applyState='3' role='OPERATORS' @count='init'></apply-commercial-list>
		</el-tab-pane>
		<!--我的申请-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.my_apply')" lazy>
			<apply-commercial-list :invoiceType='3' :applyState='2' role='OPERATORS' @count='init'></apply-commercial-list>
		</el-tab-pane>
		<!--我的形票-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.my_commercial_invoice')" lazy>
			<apply-invoice-commercial-list :invoiceType='3' invoiceState='INVOICED' role='OPERATORS' @count='init'></apply-invoice-commercial-list>
		</el-tab-pane>
		<!--全部申请-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.all_apply')" lazy v-if="isAllApplyList">
			<apply-commercial-list :invoiceType='3' :applyState='2' role='BUSINESS' @count='init'></apply-commercial-list>
		</el-tab-pane>
		<!--全部形票-->
		<el-tab-pane :label="$t('fmsReceiveInvoice.all_commercial_invoice')" lazy v-if="isAllInvoiceList">
			<apply-invoice-commercial-list :invoiceType='3' invoiceState='INVOICED' role='BUSINESS' @count='init'></apply-invoice-commercial-list>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import applyCommercialList from "./applyCommercialList";
import applyInvoiceCommercialList from "./applyInvoiceCommercialList";
import { getCommercialApplyInvoiceStatusNumberApi } from "@/api/financial/fmsReceiveInvoice";
import store from "@/store";

export default {
	name: "FmsCommercialInvoiceListOperator",
	components: {
		applyCommercialList, // 申请的列表
		applyInvoiceCommercialList // 发票的列表
	},
	data() {
		return {
			loading: false,
			unInvoiceApplyStateNumber: 0,
			unBillStateNumber: 0,
			isAllApplyList: false,
			isAllInvoiceList: false
		};
	},
	created() {
		const roles = store.getters && store.getters.roles;
		roles.forEach(v => {
			if (v === "fms:receive:commercial:all:apply:list") {
				this.isAllApplyList = true;
			}
			if (v === "fms:receive:commercial:all:invoice:list") {
				this.isAllInvoiceList = true;
			}
		});
		this.init();
	},
	methods: {
		init() {
			getCommercialApplyInvoiceStatusNumberApi().then(res => {
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
