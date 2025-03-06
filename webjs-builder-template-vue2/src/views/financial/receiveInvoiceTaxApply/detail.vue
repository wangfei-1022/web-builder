<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="page-edit-content">
			<el-tabs v-model="activeName">
				<!--开票配置-->
				<el-tab-pane :label="$t('fmsReceiveInvoice.invoice_config')" name="first">
					<div class="module">
						<div class="info-container" style="padding: 0 20px;">
							{{$t('fmsReceiveInvoice.apply_no')}}：{{detail.applyNo}}
							<el-link type="primary" style="float: right;">{{detail.applyStateName}}</el-link>
						</div>
					</div>
					<div class="module">
						<div class="info-container">
							<div class="item">
								<label class="blod">
									<i class="icon iconfont icon-qiye"></i>
									<div style="float:right">{{$t('fmsReceiveInvoice.settlement_company_name')}}：</div>
								</label>
								<span class="blod">{{detail.settlementCompanyName}}</span>
							</div>
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.invoice_source')}}：</label>
								<span>{{detail.settlementSourceName}}</span>
							</div>
						</div>
					</div>
					<div class="module" style="padding: 0">
						<div class="blod name">
							<i class="icon iconfont icon-print" style="float: left;"></i>
							{{$t('fmsReceiveInvoice.invoice_config')}}
						</div>
						<apply-invoice-config-detail :invoiceInfo="detail" />
					</div>
				</el-tab-pane>
				<!--费用明细-->
				<el-tab-pane :label="$t('fmsReceiveInvoice.charge_detail')" name="two" lazy>
					<apply-invoice-charge-detail :amountTotal="detail.sourceAmounts" />
				</el-tab-pane>
				<!--发票-->
				<el-tab-pane :label="$t('fmsReceiveInvoice.invoice')" name="third" lazy v-if="detail.applyState === 2">
					<el-table size="mini" :data="invoiceList" style="width: 100%;" row-key="id" border>
						<el-table-column prop="invoiceNo" :label="$t('fmsReceiveInvoice.invoice_no')" min-width="150"></el-table-column>
						<el-table-column prop="invoiceSeqNo" :label="$t('fmsReceiveInvoice.invoice_seq_no')" min-width="150"></el-table-column>
						<el-table-column prop="taxSystemStateName" :label="$t('fmsReceiveInvoice.invoice_state_name_invoice')" min-width="150">
							<template slot-scope="scope">
								<span>{{scope.row.taxSystemStateName || scope.row.commercialInvoiceStateName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="chargeAmount" :label="$t('fmsReceiveInvoice.operation')" width="120">
							<template slot-scope="scope">
								<a @click="getInvoiceFile(scope.row)" style="color: #1890ff;">{{$t('fmsReceiveInvoice.view')}}</a>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>

		</div>
		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="toShowReport()" v-if="detail.invoiceType === 3 && detail.applyState != 2">{{$t('fmsReceiveInvoice.preview')}}</el-button>
			<el-button type="primary" size="mini" plain @click="backList()">{{$t('common.close')}}</el-button>
		</div>
	</div>

</template>
<script>
import { getApplyTaxDetailApi, getApplyCommercialDetailApi, applyInvoiceTaxFilesApi, applyInvoiceCommercialFilesApi, getInvoiceTaxInvoiceFileApi, getInvoiceCommercialInvoiceFileApi } from "@/api/financial/fmsReceiveInvoice";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import ApplyInvoiceConfigDetail from "../components/ApplyInvoiceConfigDetail";
import ApplyInvoiceChargeDetail from "../components/ApplyInvoiceChargeDetail";

export default {
	name: "FmsReceiveBillDetail",
	components: {
		ApplyInvoiceConfigDetail,
		ApplyInvoiceChargeDetail
	},
	data() {
		return {
			id: "",
			invoiceType: "",
			activeName: "first",
			detail: {},
			loading: false,
			invoiceList: []
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.invoiceType = Number(this.$route.query.invoiceType);
		this.role = this.$route.query.role;
		this.getDetail();
	},
	methods: {
		getDetail() {
			if (!this.id) {
				return;
			}
			let fn = this.invoiceType === 3 ? getApplyCommercialDetailApi : getApplyTaxDetailApi;
			fn(this.id).then(res => {
				if (res.ok) {
					res.content.sourceAmounts.forEach(v => {
						v.value = formatNumberToThousands(v.value);
					});
					this.detail = res.content;

					// 如果是已开票申请 则获取相关的发票信息
					if (this.detail.applyState === 2) {
						let deFn = this.invoiceType === 3 ? applyInvoiceCommercialFilesApi : applyInvoiceTaxFilesApi;
						deFn(this.id).then(res => {
							if (res.ok) {
								this.invoiceList = res.content;
							}
						});
					}
				}
			});
		},
		toShowReport() {
			this.$router.replace({
				name: `ReportPageView`,
				query: {
					templateId: this.detail.commercialTemplateId,
					action: "view",
					time: new Date().getTime() + ""
				}
			});
		},
		getInvoiceFile(item) {
			let fn = this.invoiceType === 3 ? getInvoiceCommercialInvoiceFileApi : getInvoiceTaxInvoiceFileApi;
			fn(item.id).then(res => {
				if (res.ok) {
					this.downloadFile({
						url: res.content.fileUrl,
						fileName: res.content.fileName
					});
				}
			});
		},
		backList() {
			let name = this.invoiceType === 3 ? "FmsCommercialInvoiceListOperator" : "FmsTaxInvoiceListOperator";
			if (this.role === "FINANCE") {
				name = this.invoiceType === 3 ? "FmsCommercialInvoiceListFinance" : "FmsTaxInvoiceListFinance";
			}
			// 增加从业务侧指定的返回
			let backPath = this.$route.query.backPath;
			let businessType = this.$route.query.businessType;
			if (businessType && backPath) {
				name = backPath;
			}
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: name });
		}
	}
};
</script>
<style lang="scss" scoped>
.page-edit-container .page-edit-content {
	padding: 0;
}
::v-deep .el-tabs__header {
	background: #fff;
	padding: 0 20px;
}
::v-deep .el-tabs__content {
	padding: 0 20px;
}

::v-deep .el-tabs__item {
	height: 50px;
	line-height: 50px;
}

.total {
	background: rgba(16, 142, 233, 0.1);
	color: #108ee9;
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
		margin-bottom: 10px;
		display: flex;

		label {
			width: 140px;
			min-width: 140px;
			display: block;
			text-align: right;
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

.blod {
	font-weight: 600 !important;
	font-style: normal;
	font-size: 16px !important;
	color: rgba(0, 0, 0, 0.8);
	height: 34px;
	line-height: 34px;
}

.name {
	padding-left: 26px;
	line-height: 60px;
	height: 60px;
	border-bottom: 1px solid #ddd;
}
.icon {
	color: #1890ff;
	font-size: 28px;
	margin-right: 5px;
}
</style>

