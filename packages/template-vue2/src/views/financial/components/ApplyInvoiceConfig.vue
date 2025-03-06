<template>
	<div class="apply-invoice-config">
		<div class="module edit-container">
			<el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" size="mini" label-position="right">
				<el-row class="set-padding">
					<el-col :span="12">
						<el-form-item :label="$t('fmsReceiveInvoice.invoiceType')" prop="invoiceType">
							<el-select v-model="form.invoiceType" size="mini" disabled>
								<el-option v-for="(item, index) in invoiceTypeList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="$t('fmsReceiveInvoice.invoiceMedium')" prop="invoiceMedium">
							<el-select v-model="form.invoiceMedium" size="mini" disabled>
								<el-option v-for="(item, index) in invoiceMaterialTypeList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<!--购买方/销售方（税票）-->
				<div v-if="form.invoiceType != invoiceTypeMap.COMMERCIAL_INVOICE">
					<el-row class="tilte-line">
						<el-col :span="12" class='title-name'>{{$t('fmsReceiveInvoice.buyer')}}</el-col>
						<el-col :span="12" class='title-name'>{{$t('fmsReceiveInvoice.supplierInvoice')}}</el-col>
					</el-row>

					<el-row class="set-padding">
						<el-col :span="12">
							<el-form-item :label="$t('fmsReceiveInvoice.buyerCompanyName')" prop="buyerCompanyName">
								<el-input v-model="form.buyerCompanyName" size="mini" disabled />
							</el-form-item>
							<el-form-item :label="$t('fmsReceiveInvoice.buyerTaxNo')" prop="buyerTaxNo">
								<el-input v-model="form.buyerTaxNo" size="mini" disabled />
							</el-form-item>
							<el-form-item :label="$t('fmsReceiveInvoice.buyerAddressTel')" prop="buyerAddress">
								<el-row>
									<el-col :span="12">
										<el-input v-model="form.buyerAddress" size="mini" disabled />
									</el-col>
									<el-col :span="12">
										<el-input v-model="form.buyerTel" size="mini" disabled />
									</el-col>
								</el-row>
							</el-form-item>
							<el-form-item :label="$t('fmsReceiveInvoice.buyerBank')">
								<el-row v-for="(item, index) in form.buyerBankAccounts" :key="index" style="margin-bottom: 5px;">
									<el-col :span="12">
										<el-input v-model="item.bankStr" size="mini" disabled />
									</el-col>
									<el-col :span="12">
										<el-select v-model="item.bankAccount" size="mini" style="width: 100%;" @change="changeBuyerBankAccounts(index,$event)" :disabled="isFinance">
											<el-option v-for="(item, index) in buyerBankAccountsList" :key="index" :label="item.bankAccountStr" :value="item.bankAccount" />
										</el-select>
									</el-col>
								</el-row>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item :label="$t('fmsReceiveInvoice.supplierCompanyName')" prop="supplierCompanyName">
								<el-input v-model="form.supplierCompanyName" size="mini" disabled />
							</el-form-item>
							<el-form-item :label="$t('fmsReceiveInvoice.supplierTaxNo')" prop="supplierTaxNo">
								<el-input v-model="form.supplierTaxNo" size="mini" disabled />
							</el-form-item>
							<el-form-item :label="$t('fmsReceiveInvoice.supplierAddressTel')" prop="supplierAddress">
								<el-row>
									<el-col :span="12">
										<el-input v-model="form.supplierAddress" size="mini" disabled />
									</el-col>
									<el-col :span="12">
										<el-input v-model="form.supplierTel" size="mini" disabled />
									</el-col>
								</el-row>
							</el-form-item>
							<el-form-item :label="$t('fmsReceiveInvoice.supplierBank')">
								<el-row v-for="(item, index) in form.supplierBankAccounts" :key="index" style="margin-bottom: 5px;">
									<el-col :span="12">
										<el-input v-model="item.bankStr" size="mini" disabled />
									</el-col>
									<el-col :span="12">
										<el-input v-model="item.bankAccountStr" size="mini" disabled />
									</el-col>
								</el-row>
							</el-form-item>
						</el-col>
					</el-row>
				</div>

				<!--销售方（形票）-->
				<div v-if="form.invoiceType === invoiceTypeMap.COMMERCIAL_INVOICE">
					<el-row class="tilte-line">
						<el-col :span="12" class='title-name'>{{$t('fmsReceiveInvoice.supplierInvoice')}}</el-col>
					</el-row>

					<el-row class="set-padding">
						<el-form-item :label="$t('fmsReceiveInvoice.supplierCompanyName')" prop="supplierCompanyEnglishName">
							<el-input v-model="form.supplierCompanyEnglishName" size="mini" disabled />
						</el-form-item>
						<el-form-item :label="$t('fmsReceiveInvoice.supplierBankAccounts')">
							<el-row>
								<el-col :span="12" v-for="(item, index) in form.supplierBankAccounts" :key="index" style="margin-bottom: 5px;">
									<el-row>
										<el-col :span="6">
											<el-input v-model="item.rechargeCurrency" size="mini" disabled />
										</el-col>
										<el-col :span="14">
											<el-select v-model="item.bankAccount" size="mini" style="width: 100%;" @change="changeSupplierBankAccounts(index,$event)" :disabled="isFinance">
												<el-option v-for="(bank, index) in item.supplierBankAccountsList" :key="index" :label="bank.bankAccountStr" :value="bank.bankAccount" />
											</el-select>
										</el-col>
										<el-col :span="4">
											<el-popover trigger="hover">
												<div>
													<div style="line-height: 30px;"><span style="margin-right:10px;">Bank Account:</span>{{item.bankBranch}}</div>
													<div style="line-height: 30px;"><span style="margin-right:10px;">Bank Address:</span>{{item.bankAddress}}</div>
													<div style="line-height: 30px;"><span style="margin-right:10px;">SWIFT CODE:</span>{{item.swiftCode}}</div>
												</div>
												<span slot="reference">
													<i class="iconfont icon-infooutline" style="margin-left:10px;color: #1890ff;" />
												</span>
											</el-popover>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</el-form-item>
					</el-row>
				</div>

				<!--开票名称-->
				<div style="border-top: 1px solid #eee;padding: 20px 0;">
					<!--增值专票-->
					<el-row v-if="form.invoiceType != invoiceTypeMap.COMMERCIAL_INVOICE">
						<el-col :span="12">
							<el-row>
								<el-col :span="12" class="set-invoice-container">
									<el-form-item :label="$t('fmsReceiveInvoice.invoice_item_mode_name')" prop="invoiceItemMode">
										<el-radio-group v-model="form.invoiceItemMode" class="invoice-radio" :disabled="isFinance">
											<el-radio :label="1">{{$t('fmsReceiveInvoice.INVOICE_MERGE')}}</el-radio>
											<el-radio :label="2">{{$t('fmsReceiveInvoice.INVOICE_DETAIL')}}</el-radio>
										</el-radio-group>
									</el-form-item>
								</el-col>
							</el-row>

						</el-col>
						<el-col :span="12">
							<el-form-item :label="$t('fmsReceiveInvoice.invoice_group_type_name')" prop="invoiceGroupType">
								<el-radio-group v-model="form.invoiceGroupType" :disabled="isFinance">
									<el-radio :label="1">{{$t('fmsReceiveInvoice.INVOICE_SHEET')}}</el-radio>
									<el-radio :label="2">{{$t('fmsReceiveInvoice.INVOICE_BILL_SHEET')}}</el-radio>
									<el-radio :label="3">{{$t('fmsReceiveInvoice.INVOICE_ORDER_SHEET')}}</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>

					<!--形式发票-->
					<div v-if="form.invoiceType === invoiceTypeMap.COMMERCIAL_INVOICE">
						<el-row>
							<el-col :span="12">
								<el-form-item :label="$t('fmsReceiveInvoice.invoiceTemplate')" prop="templateId">
									<el-select v-model="form.templateId" size="mini" disabled>
										<el-option v-for="(item, index) in templateList" :key="index" :label="item.chineseName" :value="item.id" />
									</el-select>
									<span style="color: #1890ff; cursor: pointer;margin-left: 10px;" @click="toShowReport" v-if="form.templateId">预览</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item :label="$t('fmsReceiveInvoice.invoice_group_type_name')" prop="invoiceGroupType">
									<el-radio-group v-model="form.invoiceGroupType">
                    <el-radio :label="1">{{$t('fmsReceiveInvoice.INVOICE_SHEET')}}</el-radio>
                    <el-radio :label="2">{{$t('fmsReceiveInvoice.INVOICE_BILL_SHEET')}}</el-radio>
                    <el-radio :label="3">{{$t('fmsReceiveInvoice.INVOICE_ORDER_SHEET')}}</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item :label="$t('fmsReceiveInvoice.invoiceSignatureType')" prop="invoiceSignatureType">
									<el-radio-group v-model="form.invoiceSignatureType">
										<el-radio :label="1">{{$t('fmsReceiveInvoice.SEAL_INVOICE')}}</el-radio>
										<el-radio :label="2">{{$t('fmsReceiveInvoice.SEAL_FINANCIAL')}}</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span="12" v-if="form.invoiceGroupType === 1">
								<el-form-item :label="$t('fmsReceiveInvoice.companyInvoiceNo')" prop="companyInvoiceNo">
									<el-input v-model="form.companyInvoiceNo" size="mini" />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item :label="$t('fmsReceiveInvoice.invoiceRemark')" prop="invoiceRemark">
									<el-input v-model="form.invoiceRemark" size="mini" />
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</div>

				<!--通知客户-->
				<div>
					<div class="tilte-line">
						<div class="title-name">
							<span style="margin-right:10px;">{{$t('fmsReceiveInvoice.companySubscribe')}}</span>
							<el-switch v-model="form.companySubscribeFlag" size="mini" :disabled="isFinance"></el-switch>
						</div>
					</div>

					<div v-if="form.companySubscribeFlag" style="padding: 10px 0;">
						<el-row>
							<el-col :span="16">
								<el-form-item :label="$t('fmsReceiveInvoice.mobileSubscribers')" prop="mobileSubscribers">
									<el-input v-model="form.mobileSubscribers" size="mini" :disabled="isFinance" placeholder="多个手机号码以分号;隔开" oninput="value=value.replace(/[^\d.\-\;]/g,'')" />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="16">
								<el-form-item :label="$t('fmsReceiveInvoice.emailSubscribers')" prop="emailSubscribers">
									<notify-customer-select v-model="form.emailSubscribers" size="mini" placeholder="多个邮箱地址以分号;隔开" :disabled="isFinance" :settlementId="form.settlementCompanyId" @selected='emailSubscribersSelectedFn' />
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</div>

				<!--寄送到-->
				<div>
					<div class="tilte-line">
						<div class="title-name">
							<span style="margin-right:10px;">{{$t('fmsReceiveInvoice.companyExpress')}}</span>
							<el-switch v-model="form.companyExpressFlag" size="mini" :disabled="isFinance"></el-switch>
						</div>
					</div>
					<!--当材质是纸质的时候，寄送到必填项-->
					<div v-if="form.companyExpressFlag" style="padding: 10px 0;">
						<el-row>
							<el-col :span="8">
								<el-form-item :label="$t('fmsReceiveInvoice.consigneeContacts')" prop="consigneeContacts">
									<consignee-select v-model="form.consigneeContacts" size="mini" :disabled="isFinance" :settlementId="form.settlementCompanyId" @selected='consigneeSelectedFn' />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item :label="$t('fmsReceiveInvoice.consigneeTel')" prop="consigneeTel">
									<el-input v-model="form.consigneeTel" size="mini" :disabled="isFinance" oninput="value=value.replace(/[^\d.\-\;]/g,'')" />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="16">
								<el-form-item :label="$t('fmsReceiveInvoice.consigneeAddress')" prop="consigneeAddress">
									<el-input v-model="form.consigneeAddress" size="mini" :disabled="isFinance" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-tooltip effect="dark" :content="$t('fmsReceiveInvoice.copy')" placement="top">
									<i class="iconfont icon-copy" @click="clipText($event)" />
								</el-tooltip>
							</el-col>
						</el-row>
					</div>
				</div>

				<!--增值专票-->
				<div v-if="form.invoiceType != invoiceTypeMap.COMMERCIAL_INVOICE">
					<el-table size="mini" :data="currencyInfo" style="width: 100%; " row-key="id" class="invoice-table">
						<el-table-column prop="sourceCurrency" :label="$t('fmsReceiveInvoice.sourceInvoiceCurrency')" min-width="130">
							<template slot-scope="{ row }">
								<div>
									<span>{{row.sourceCurrency}}</span>
									<span>{{row.sourceAmount}}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="exchangeRate" :label="$t('fmsReceiveInvoice.exchangeRate')" min-width="100"></el-table-column>
						<el-table-column prop="invoiceCurrency" :label="$t('fmsReceiveInvoice.invoiceCurrency')" min-width="120">
							<template slot-scope="{ row }">
								<div>
									<span>{{row.invoiceCurrency}}</span>
									<span>{{row.invoiceAmount}}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="defaultItemName" :label="$t('fmsReceiveInvoice.defaultItemName')" v-if="form.invoiceItemMode === 1" min-width="150">
							<template slot-scope="{ row }">
								<div class="set-input-place">
									<el-input v-model="row.defaultItemName" size="mini" :disabled="isFinance" />
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="invoiceRemark" :label="$t('fmsReceiveInvoice.invoiceRemarkStr')" min-width="350">
							<template slot-scope="{ row }">
								<div class="set-input-place" :title="row.invoiceRemark + row.invoiceCustomizeRemark">
									<span>{{row.invoiceRemark}}</span>
									<el-input v-model="row.invoiceCustomizeRemark" :class="getClassNotice(row)" size="mini" :disabled="isFinance" />
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="entryAmount" label="" min-width="200">
							<template slot-scope="{ row }">
								<el-checkbox v-model="row.businessNoFlag" :disabled="isFinance" v-if="isAirAndSeaport">{{$t('fmsReceiveInvoice.businessNo')}}</el-checkbox>
                <el-checkbox v-model="row.accountNoFlag" :disabled="isFinance">{{$t('fmsReceiveInvoice.accountNo')}}</el-checkbox>
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
				<div v-if="form.invoiceType === invoiceTypeMap.COMMERCIAL_INVOICE">
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

				<div class="set-padding" style="position: relative;">
					<el-form-item :label="$t('fmsReceiveInvoice.otherRemark')" prop="remark">
						<el-input v-model="form.remark" size="mini" :disabled="isFinance" :class="isFinance ? 'color-notice' : ''" />
					</el-form-item>
					<el-form-item :label="$t('fmsReceiveInvoice.otherFiles')" v-if="!isFinance">
						<upload-file v-model="otherFiles" multiple></upload-file>
					</el-form-item>
					<el-form-item :label="$t('fmsReceiveInvoice.otherFiles')" v-if="otherFiles.length && isFinance">
						<div class="file-show">
							<div v-for="(item,index) in otherFiles" :key="index">
								<a :href="item.url" target="_blank">{{item.originFileName}}</a>
							</div>
						</div>
					</el-form-item>
          <el-form-item :label="$t('fmsReceiveInvoice.stampFlag')" prop="stampFlag" v-if="otherFiles.length > 0" class="stampFlag">
						<el-checkbox v-model="form.stampFlag"  :disabled="isFinance"></el-checkbox>
					</el-form-item>
          <el-form-item :label="$t('fmsReceiveInvoice.invoiceDetailFlag')" prop="invoiceDetailFlag" v-if="isFinance ? form.invoiceDetailFlag : true">
						<!-- <el-checkbox v-model="form.invoiceDetailFlag" :disabled="isFinance"></el-checkbox> -->
            <el-checkbox v-model="form.invoiceDetailFlag" disabled></el-checkbox>
					</el-form-item>
				</div>
			</el-form>
		</div>
	</div>
</template>
<script>
import ConsigneeSelect from "../components/ConsigneeSelect";
import NotifyCustomerSelect from "../components/NotifyCustomerSelect";
import { invoiceTypeMap, invoiceTypeList, invoiceMaterialTypeMap, invoiceMaterialTypeList } from "@/utils/constant";
import { getBusinessReportTemplateList } from "@/api/report";
import { getDictDataApi } from "@/api/financial/fmsReceive";
import { getOfficeTitleApiCommercialApi, getMemberTitleApiTaxApi } from "@/api/financial/fmsReceiveInvoice";
import clip from "@/utils/clipboard";
import { validateEmail, validateMobile } from "@/utils/validate";

// 该组件用于统一的编辑开票编辑

export default {
	name: "ApplyInvoiceConfig",
	components: {
		ConsigneeSelect,
		NotifyCustomerSelect
	},
	props: {
		invoiceInfo: {
			type: Object,
			default: function () {
				return {};
			}
		},
		role: {
			type: String,
			default: ""
		}
	},
	computed: {
		isFinance() {
			return this.role === "FINANCE";
		}
	},
	watch: {
		invoiceInfo: {
			handler(val) {
				// 空运海运时显示提单号，其他业务类型下不显示此项
				if (val.currencyInfo) {
					val.currencyInfo.forEach(v => {
						v.businessNoFlag = v.businessNoFlag || false;
						v.invoiceCustomizeRemark = v.invoiceCustomizeRemark || "";
					});
				}
				if (val.buyerBankAccounts && val.buyerBankAccounts.length) {
					val.buyerBankAccounts.forEach(v => {
						v.bankStr = v.bankName + v.bankBranch;
					});
				}
				if (val.supplierBankAccounts && val.supplierBankAccounts.length) {
					val.supplierBankAccounts.forEach(v => {
						v.bankStr = v.bankName + v.bankBranch;
					});
				}
				this.currencyInfo = this.$extends(true, [], val.currencyInfo);
				this.sourceAmounts = this.$extends(true, [], val.sourceAmounts);
				this.otherFiles = this.$extends(true, [], val.otherFiles);

				if (val.businessType) {
					this.isAirAndSeaport = val.businessType.indexOf("SEA_") >= 0 || val.businessType.indexOf("AIR_") >= 0;
				}

				if (val.invoiceType !== 3 && val.supplierBankAccounts) {
					val.supplierBankAccounts.forEach(v => {
						let rechargeCurrency = v.rechargeCurrency ? "(" + v.rechargeCurrency + ")" : "";
						v.bankAccountStr = v.bankAccount + rechargeCurrency;
					});
				}

				this.form = {
					...this.form,
					...val
				};

				this.getBankInfoList();
        this.initTemplate()
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		const validateEmailFn = (rule, value, callback) => {
			if (this.form.no) {
				callback();
				return;
			}
			if (value) {
				if (validateEmail(value)) {
					callback();
				} else {
					return callback(this.$t("fmsReceiveInvoice.email_error"));
				}
			} else {
				callback();
			}
		};

		const validateMobileFn = (rule, value, callback) => {
			if (value) {
				if (validateMobile(value)) {
					callback();
				} else {
					return callback(this.$t("fmsReceiveInvoice.mobile_error"));
				}
			} else {
				callback();
			}
		};

		return {
			// 下拉选择购买方银行
			buyerBankAccountsList: [], // 购买方 给到税票使用
			supplierBankAccountsList: [], // 销售方 给到形票使用

			isAirAndSeaport: false, // 空运 和 海运
			invoiceMaterialTypeList: [],
			invoiceTypeList: [],
			invoiceTypeMap: invoiceTypeMap,
			invoiceMaterialTypeMap: invoiceMaterialTypeMap,
			id: "",
			active: 0,
			bill: {},
			sourceAmounts: [],
			currencyInfo: [],
			loading: false,
			amountTotal: [],
			confirmationStateList: [],
			otherFiles: [],
			form: {
				settlementOfficeId: "", // 分公司Id
				businessType: "", // 业务类型
				invoiceType: "", // 发票类型
				invoiceMedium: "", // 发票材质
				invoiceItemMode: "", // 开票款项 （明细开票/合并开票）
				defaultItemName: "", // 开票名称 // 合并发票
				invoiceGroupType: "", // 开票方式
				invoiceRemark: "", // 开票备注

				templateId: "", // 开票模板（形式开票）
				templateName: "",
				invoiceSignatureType: "", // 盖章类型
				companyInvoiceNo: "", // 自定义发票号

				companySubscribeFlag: false, // 通知客户
				mobileSubscribers: "", // 手机号码
				emailSubscribers: "", // 邮箱地址
				invoiceDetailFlag: false, // 付发票明细
        stampFlag: true, // 盖章回传
				remark: "", // 注意事项
				applyCurrency: "", // 币种

				companyExpressFlag: false, // 是否寄送
				consigneeContacts: "", // 快递收件人名称
				consigneeTel: "", // 快递收件人电话
				consigneeAddress: "", // 快递收件人地址

				buyerCompanyName: "",
				buyerTaxNo: "",
				buyerAddress: "",
				buyerTel: "",
				buyerBankAccounts: [
					{
						rechargeCurrency: "",
						bankAccount: "",
						bankAccountStr: "",
						bankName: "",
						bankBranch: "",
						bankStr: "",
						bankAddress: "",
						swiftCode: ""
					}
				],
				supplierCompanyName: "",
				supplierCompanyEnglishName: "",
				supplierTaxNo: "",
				supplierAddress: "",
				supplierTel: "",
				supplierBankAccounts: [
					{
						rechargeCurrency: "",
						bankAccount: "",
						bankAccountStr: "",
						bankName: "",
						bankBranch: "",
						bankStr: "",
						bankAddress: "",
						swiftCode: ""
					}
				]
			},
			formRules: {
				invoiceType: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				invoiceMedium: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				invoiceItemMode: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				invoiceItemModeName: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				invoiceGroupType: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				templateId: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				invoiceSignatureType: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				companyInvoiceNo: [{ required: false, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				consigneeContacts: [
					{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "change" },
					{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }
				],
				consigneeTel: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				consigneeAddress: [{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" }],
				emailSubscribers: [
					{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "blur" },
					{ required: true, message: this.$t("fmsReceiveInvoice.can_not_be_null"), trigger: "change" },
					{ validator: validateEmailFn, trigger: "blur" }
				]
			},
			templateList: []
		};
	},
	created() {
		this.init();
	},
	methods: {
    initTemplate() {
      // 海外仓
      if (this.form.businessType === 'OVERSEAS_WAREHOUSE') {
        this.templateList.forEach(v => {
          if (v.code === 'COMMERCIAL_INVOICE_WHS') {
            this.form.templateId = v.id
          }
        })
      } else {
        this.templateList.forEach(v => {
          if (v.code === 'COMMERCIAL_INVOICE') {
            this.form.templateId = v.id
          }
        })
      }
    },
		init() {
			Promise.all([getDictDataApi(12), getDictDataApi(13), getBusinessReportTemplateList("INVOICE_COMMERCIAL")]).then(results => {
				const invoiceTypeRes = results[0];
				const invoiceMaterialTypeRes = results[1];
				const templateRes = results[2];

				if (invoiceTypeRes.ok) {
					this.invoiceTypeList = invoiceTypeRes.content;
				}
				if (invoiceMaterialTypeRes.ok) {
					this.invoiceMaterialTypeList = invoiceMaterialTypeRes.content;
				}
				if (templateRes.ok) {
					this.templateList = templateRes.content;
          this.initTemplate()
				}
			});
		},
		getBankInfoList() {
			if (this.invoiceInfo.invoiceType === 3) {
				// this.supplierBankAccountsList.length > 0
				if (!this.form.settlementOfficeId) {
					return;
				}
				getOfficeTitleApiCommercialApi(this.form.settlementOfficeId).then(res => {
					if (res.ok) {
						res.content.bankAccounts.forEach(v => {
							let bankName = v.bankName ? "(" + v.bankName + ")" : "";
							v.bankAccountStr = v.bankAccount + bankName;
						});
						let supplierBankAccounts = this.$extends(true, [], this.form.supplierBankAccounts);
						supplierBankAccounts.forEach(v => {
							let arr = [];
							res.content.bankAccounts.forEach(item => {
								if (item.rechargeCurrency === v.rechargeCurrency) {
									arr.push(item);
								}
							});
							v.supplierBankAccountsList = arr;
						});
						this.form.supplierBankAccounts = supplierBankAccounts;
						this.supplierBankAccountsList = res.content.bankAccounts;
					}
				});
			} else {
				if (!this.form.memberId || this.buyerBankAccountsList.length > 0) {
					return;
				}
				let currencies = [];
				// this.form.sourceAmounts.forEach(v => {
				// 	currencies.push(v.currency)
				// })
				let data = {
					memberId: this.form.memberId,
					settlementCompanyId: this.form.settlementCompanyId,
					businessType: this.form.businessType,
					currencies: currencies
				};
				getMemberTitleApiTaxApi(data).then(res => {
					if (res.ok) {
						res.content.bankAccounts.forEach(v => {
							let rechargeCurrency = v.rechargeCurrency ? "(" + v.rechargeCurrency + ")" : "";
							v.bankAccountStr = v.bankAccount + rechargeCurrency;
							v.bankStr = v.bankName + v.bankBranch;
						});
						this.buyerBankAccountsList = res.content.bankAccounts;
					}
				});
			}
		},
		getClassNotice(row) {
			let arr = [];
			if (row.invoiceRemark) {
				arr.push("has-sp-remark");
			}
			if (this.isFinance) {
				arr.push("color-notice");
			}
			return arr.join(" ");
		},
		// 形票银行信息变更change
		changeSupplierBankAccounts(index, bankAccount) {
			let i = this.supplierBankAccountsList.findIndex(v => v.bankAccount === bankAccount);
			let target = this.supplierBankAccountsList[i];
			let supplierBankAccounts = this.$extends(true, [], this.form.supplierBankAccounts);
			supplierBankAccounts[index] = {
				...supplierBankAccounts[index],
				...target,
				bankStr: target.bankName + target.bankBranch
			};
			this.form.supplierBankAccounts = [];
			this.$nextTick(() => {
				this.form.supplierBankAccounts = supplierBankAccounts;
			});
		},
		// 税票银行信息变更change
		changeBuyerBankAccounts(index, bankAccount) {
			let i = this.buyerBankAccountsList.findIndex(v => v.bankAccount === bankAccount);
			let buyerBankAccounts = this.$extends(true, [], this.form.buyerBankAccounts);
			buyerBankAccounts[index] = this.$extends(true, {}, this.buyerBankAccountsList[i]);
			this.form.buyerBankAccounts = [];
			this.$nextTick(() => {
				this.form.buyerBankAccounts = buyerBankAccounts;
			});
		},
		show() {
			this.visible = true;
		},
		validate() {
			let VALID = true;
			if (this.form.buyerBankAccounts.length > 1) {
				let item1 = this.form.buyerBankAccounts[0];
				let item2 = this.form.buyerBankAccounts[1];
				if (item1.rechargeCurrency === item2.rechargeCurrency && item1.bankAccount === item2.bankAccount && item1.bankName === item2.bankName && item1.bankBranch === item2.bankBranch) {
					// 购买方开户行及账号的两条记录不能相同!
          this.$message.error(this.$t("fmsReceiveInvoice.invoiceCheckInfo"));
					return false;
				}
			}

			this.$refs.formRef.validate(valid => {
				VALID = valid;
			});
			return VALID;
		},
		getValue() {
			if (this.form.templateId) {
				this.templateList.forEach(v => {
					if (v.id === this.form.templateId) {
						this.form.templateName = v.chineseName;
					}
				});
			}
      let data = {
        otherFiles: this.otherFiles,
				...this.form,
				currencyInfo: this.currencyInfo
      }
      if (this.otherFiles.length <= 0) {
        data.stampFlag = false
      }
      data.allBuyerBankAccounts = this.buyerBankAccountsList
			return data;
		},
		// 下拉选中寄件联系人
		consigneeSelectedFn(item) {
			if (item) {
				this.form.consigneeContacts = item.consigneeContacts;
				this.form.consigneeTel = item.consigneeTel;
				this.form.consigneeAddress = item.consigneeAddress;
			}
		},
		// 下拉选中通知客户 邮箱
		emailSubscribersSelectedFn(item) {
			if (item) {
				// 设置手机号
				this.form.emailSubscribers = item.emailSubscribers;
			}
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
		},
		clipText(event) {
			let text = (this.form.consigneeContacts || "") + " " + (this.form.consigneeTel || "") + " " + (this.form.consigneeAddress || "");
			clip(text, event);
		}
	}
};
</script>
<style lang="scss" scoped>
.apply-invoice-config {
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

	.edit-container {
		border: 1px solid #dedede;
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

	.invoice-table th {
		font-size: 15px;
		font-weight: 500;
		background: #f5f7fa;
		height: 49px;
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
			margin-bottom: 15px;
			display: flex;

			label {
				width: 110px;
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
		height: 28px;
		line-height: 28px;
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
		padding-left: 245px;
	}

	.currency-item {
		color: #108ee9;
		margin-left: 50px;
	}
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
.color-notice {
	::v-deep .el-input__inner {
		color: rgba(255, 0, 0, 0.6) !important;
		font-weight: 600;
	}
}

.stampFlag{
  width: 150px;
    position: absolute;
    top: 69px;
    left: 200px;
}
</style>

