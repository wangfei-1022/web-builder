<template>
	<div>
		<div class="module edit-container" style="padding-top:0;">
			<el-form ref="formRef" :model="form" label-width="120px" size="mini" label-position="right">
				<el-row class="set-padding">
					<el-col :span="12">
						<div class="item">
							<label>{{$t('fmsReceiveInvoice.invoiceType')}}</label>
							<span>{{form.invoiceTypeName}}</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="item">
							<label>{{$t('fmsReceiveInvoice.invoiceMedium')}}</label>
							<span>{{form.invoiceMediumName}}</span>
						</div>
					</el-col>
				</el-row>

				<!--购买方/销售方-->
				<div>
					<el-row class="tilte-line">
						<el-col :span="12" class='title-name' v-if="form.invoiceType != invoiceTypeMap.COMMERCIAL_INVOICE">{{$t('fmsReceiveInvoice.buyer')}}</el-col>
						<el-col :span="12" class='title-name'>{{$t('fmsReceiveInvoice.supplierInvoice')}}</el-col>
					</el-row>

					<el-row class="set-padding">
						<el-col :span="12" v-if="form.invoiceType != invoiceTypeMap.COMMERCIAL_INVOICE">
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.buyerCompanyName')}}</label>
								<span>{{form.buyerCompanyName}}</span>
							</div>
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.buyerTaxNo')}}</label>
								<span>{{form.buyerTaxNo}}</span>
							</div>
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.buyerAddressTel')}}</label>
								<span>{{form.buyerAddress}}&nbsp;&nbsp;{{form.buyerTel}}</span>
							</div>
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.buyerBank')}}</label>
								<span>
									<p style="margin:0 5px 0 0;" v-for="(item, index) in form.buyerBankAccounts" :key="index">
										<span>{{item.bankName}}{{item.bankBranch}}</span>
										<span>{{item.bankAccount}}({{item.rechargeCurrency}})</span>
									</p>
								</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.supplierCompanyName')}}</label>
								<span>{{form.supplierCompanyName}}</span>
							</div>
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.supplierTaxNo')}}</label>
								<span>{{form.supplierTaxNo}}</span>
							</div>
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.supplierAddressTel')}}</label>
								<span>{{form.supplierAddress}}&nbsp;&nbsp;{{form.supplierTel}}</span>
							</div>
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.supplierBank')}}</label>
								<span>
									<p style="margin:0 5px 0 0;" v-for="(item, index) in form.supplierBankAccounts" :key="index">
										<span>{{item.bankName}}{{item.bankBranch}}</span>
										<span>{{item.bankAccount}}({{item.rechargeCurrency}})</span>
									</p>
								</span>
							</div>
						</el-col>
					</el-row>
				</div>

				<!--开票名称-->
				<div style="border-top: 1px solid #eee;padding: 20px 0;">
					<!--增值专票-->
					<el-row v-if="form.invoiceType != 3">
						<el-col :span="12">
							<el-row>
								<el-col :span="12" class="set-invoice-container">
									<div class="item">
										<label>{{$t('fmsReceiveInvoice.invoice_item_mode_name')}}</label>
										<span>{{form.invoiceItemModeName}}</span>
									</div>
								</el-col>
							</el-row>

						</el-col>
						<el-col :span="12">
							<div class="item">
								<label>{{$t('fmsReceiveInvoice.invoice_group_type_name')}}</label>
								<span>{{form.invoiceGroupTypeName}}</span>
							</div>
						</el-col>
					</el-row>

					<!--形式发票-->
					<div v-if="form.invoiceType == invoiceTypeMap.COMMERCIAL_INVOICE">
						<el-row>
							<el-col :span="12">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.invoiceTemplate')}}</label>
									<span>{{form.commercialTemplateName}}</span>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.invoice_group_type_name')}}</label>
									<span>{{form.invoiceGroupTypeName}}</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.invoiceSignatureType')}}</label>
									<span>{{form.invoiceSignatureTypeName}}</span>
								</div>
							</el-col>
							<el-col :span="12" v-if="form.invoiceGroupType == 1">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.companyInvoiceNo')}}</label>
									<span>{{form.companyInvoiceNo}}</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.invoiceRemark')}}</label>
									<span>{{form.invoiceRemark}}</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>

				<!--通知客户-->
				<div v-if="form.companySubscribeFlag">
					<div class="tilte-line">
						<div class="title-name">
							<span style="margin-right:10px;">{{$t('fmsReceiveInvoice.companySubscribe')}}</span>
						</div>
					</div>

					<div style="padding: 10px 0;">
						<el-row>
							<el-col :span="24">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.mobileSubscribers')}}</label>
									<span>{{form.mobileSubscribers}}</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="16">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.emailSubscribers')}}</label>
									<span>{{form.emailSubscribers}}</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>

				<!--寄送到-->
				<div v-if="form.companyExpressFlag">
					<div class="tilte-line">
						<div class="title-name">{{$t('fmsReceiveInvoice.companyExpress')}}</div>
					</div>

					<div style="padding: 10px 0;">
						<el-row>
							<el-col :span="12">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.consigneeContacts')}}</label>
									<span>{{form.consigneeContacts}}</span>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.consigneeTel')}}</label>
									<span>{{form.consigneeTel}}</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24">
								<div class="item">
									<label>{{$t('fmsReceiveInvoice.consigneeAddress')}}</label>
									<span>
										{{form.consigneeAddress}}

										<el-tooltip effect="dark" :content="$t('fmsReceiveInvoice.copy')" placement="top">
											<i class="iconfont icon-copy" @click="clipText($event)" />
										</el-tooltip>
									</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>

				<!--增值专票-->
				<div v-if="form.invoiceType != invoiceTypeMap.COMMERCIAL_INVOICE">
					<el-table size="mini" :data="currencyInfo" style="width: 100%; " row-key="id">
						<el-table-column prop="sourceCurrency" :label="$t('fmsReceiveInvoice.sourceInvoiceCurrency')">
							<template slot-scope="{ row }">
								<div>
									<span>{{row.sourceCurrency}}</span>
									<span>{{row.sourceAmount}}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="exchangeRate" :label="$t('fmsReceiveInvoice.exchangeRate')"></el-table-column>
						<el-table-column prop="invoiceCurrency" :label="$t('fmsReceiveInvoice.invoiceCurrency')">
							<template slot-scope="{ row }">
								<div>
									<span>{{row.invoiceCurrency}}</span>
									<span>{{row.invoiceAmount}}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="defaultItemName" :label="$t('fmsReceiveInvoice.defaultItemName')" v-if="form.invoiceItemMode == 1" >
						</el-table-column>
						<el-table-column prop="invoiceRemark" :label="$t('fmsReceiveInvoice.invoiceRemarkStr')">
							<template slot-scope="{ row }">
								<span>{{row.invoiceRemark}}{{row.invoiceCustomizeRemark}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="entryAmount" label="">
							<template slot-scope="{ row }">
								<el-checkbox v-model="row.businessNoFlag" disabled  v-if="isAirAndSeaport">{{$t('fmsReceiveInvoice.businessNo')}}</el-checkbox>
                <el-checkbox v-model="row.accountNoFlag" disabled>{{$t('fmsReceiveInvoice.accountNo')}}</el-checkbox>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<!--增值发票-->
				<div v-if="form.invoiceType != invoiceTypeMap.COMMERCIAL_INVOICE">
					<div class="tilte-line">
						<div class="title-name">
							{{$t('fmsReceiveInvoice.invoiceTotal')}}
							<span class="currency-item" v-for="(item, index) in sourceAmounts" :key="index">
								<span>{{item.currency}}</span>
								<span>{{item.value}}</span>
							</span>
						</div>
					</div>
				</div>

				<!--形式发票-->
				<div v-if="form.invoiceType == invoiceTypeMap.COMMERCIAL_INVOICE">
					<div class="tilte-line">
						<div class="title-name">
							{{$t('fmsReceiveInvoice.invoiceCurrency')}}
							<span class="currency-item" v-for="(item, index) in sourceAmounts" :key="index">
								<span>{{item.currency}}</span>
								<span>{{item.value}}</span>
							</span>
						</div>
					</div>

				</div>

				<div style="padding: 15px 0;position: relative;">
					<div class="item">
						<label>{{$t('fmsReceiveInvoice.otherRemark')}}</label>
						<span>{{form.remark}}</span>
					</div>
					<div class="item">
						<label>{{$t('fmsReceiveInvoice.otherFiles')}}</label>
						<div class="file-show">
							<div v-for="(item,index) in otherFiles" :key="index">
								<a :href="item.url" target="_blank">{{item.originFileName}}</a>
							</div>
						</div>
					</div>
					<div class="item stampFlag" v-if="otherFiles && otherFiles.length">
						<label>{{$t('fmsReceiveInvoice.stampFlag')}}</label>
						<span>
							<el-checkbox v-model="form.stampFlag" disabled></el-checkbox>
						</span>
					</div>
					<div class="item">
						<label>{{$t('fmsReceiveInvoice.invoiceDetailFlag')}}</label>
						<span>
							<el-checkbox v-model="form.invoiceDetailFlag" disabled></el-checkbox>
						</span>
					</div>
				</div>
			</el-form>
		</div>
	</div>
</template>
<script>
import { invoiceTypeMap, invoiceTypeList, invoiceMaterialTypeMap, invoiceMaterialTypeList } from "@/utils/constant";
import clip from "@/utils/clipboard";

// 该组件用于统一的编辑开票详情

export default {
	name: "ApplyInvoiceDialogDetail",
	props: {
		invoiceInfo: {
			type: Object,
			default: function () {
				return {};
			}
		}
	},
	watch: {
		invoiceInfo: {
			handler(val) {
				this.form = {
					...this.form,
					...val
				};

				this.currencyInfo = val.currencyInfo;
				this.sourceAmounts = val.sourceAmounts;
				this.otherFiles = val.otherFiles || [];

				this.isAirAndSeaport = this.form.businessType.indexOf("SEA_") >= 0 || this.form.businessType.indexOf("AIR_") >= 0;
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			isAirAndSeaport: false, // 空运 和 海运
			invoiceTypeMap: invoiceTypeMap,
			id: "",
			active: 0,
			sourceAmounts: [],
			currencyInfo: [],
			loading: false,
			otherFiles: [],
			form: {
				businessType: "", // 业务类型
				invoiceType: "", // 发票类型
				invoiceMedium: "", // 发票材质
				invoiceItemMode: "", // 开票款项 （明细开票/合并开票）
				invoiceItemModeName: "", // 开票名称 // 合并发票
				invoiceGroupType: "", // 开票方式
				invoiceRemark: "", // 开票备注

				templateId: "", // 开票模板（形式开票）
				templateName: "测试",
				invoiceSignatureType: "", // 盖章类型
				companyInvoiceNo: "", // 自定义发票号

				companySubscribeFlag: false, // 通知客户
				mobileSubscribers: "", // 手机号码
				emailSubscribers: "", // 邮箱地址
				invoiceDetailFlag: false, // 付发票明细
        stampFlag: false, // 盖章回传
				remark: "", // 注意事项
				applyCurrency: "", // 币种

				consigneeContacts: "", // 快递收件人名称
				consigneeTel: "", // 快递收件人电话
				consigneeAddress: "", // 快递收件人地址

				buyerCompanyName: "",
				buyerTaxNo: "",
				buyerAddress: "",
				buyerTel: "",
				buyerBankAccounts: [],
				supplierCompanyName: "",
				supplierTaxNo: "",
				supplierAddress: "",
				supplierTel: "",
				supplierBankAccounts: []
			}
		};
	},
	created() {},
	methods: {
		show() {
			this.visible = true;
		},
		clipText(event) {
			let text = (this.form.consigneeContacts || "") + " " + (this.form.consigneeTel || "") + " " + (this.form.consigneeAddress || "");
			clip(text, event);
		},
		toShowReport() {
			this.$router.replace({
				name: `ReportPageView`,
				query: {
					templateId: this.form.templateId,
					action: "view",
					time: new Date().getTime() + ""
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
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

::v-deep .el-table th {
	background: #f5f7fa;
	height: 49px;
}
.edit-container {
	font-size: 15px;
}
.tilte-line {
	line-height: 50px;
	height: 50px;
	background: #f5f7fa;
	border-bottom: 1px solid #dedede;
	border-top: 1px solid #dedede;

	.title-name {
		padding-left: 40px;
	}
}

::v-deep .el-table th {
	font-size: 15px;
	font-weight: 500;
}

.module {
	overflow: hidden;
	padding: 20px 0px;
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
		width: 100%;
		float: left;
		line-height: 40px;
		display: flex;

		> label {
			width: 110px;
			min-width: 110px;
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

.set-padding {
	padding: 20px;
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
.invoice-radio .el-radio {
	width: 100%;
	height: 36px;
	line-height: 36px;
}
.set-invoice-container {
	width: 250px;
}

::v-deep .el-table table thead tr th:first-child,
::v-deep .el-table table tbody tr td:first-child {
	padding-left: 30px;
}

.set-input-place {
	position: relative;
	span {
		position: absolute;
		top: 3px;
		left: 10px;
		z-index: 99;
	}
}

::v-deep .has-sp-remark input {
	padding-left: 200px;
}

.currency-item {
	color: #108ee9;
	margin-left: 50px;
}

.file-show {
	color: #108ee9;
	font-size: 14px;
}

.icon-copy {
	color: #46a6ff;
	font-size: 22px;
	margin-left: 10px;
	cursor: pointer;
}
</style>
