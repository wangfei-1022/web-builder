<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="page-edit-content">
			<div class="module" style="padding: 20px;">
				<el-steps :active="active">
					<!--确认开票费用-->
					<el-step :title="$t('fmsReceiveInvoice.step_1')" :description="$t('fmsReceiveInvoice.confirm_invoice_charge')"></el-step>
					<!--填写开票配置-->
					<el-step :title="$t('fmsReceiveInvoice.step_2')" :description="$t('fmsReceiveInvoice.text_invoice_config')"></el-step>
					<!--提交成功-->
					<el-step :title="$t('fmsReceiveInvoice.step_3')" :description="$t('fmsReceiveInvoice.submit_success')"></el-step>
				</el-steps>
			</div>

			<div v-show="active === 1">
				<div class="module">
					<div class="info-container">
						<div class="item">
							<label class="blod">
								<i class="icon iconfont icon-qiye"></i>
								<div style="float:right">{{$t('receiveFms.settlement_company_name')}}：</div>
							</label>
							<span class="blod">{{settlementCompanyName}}</span>
						</div>
						<div class="item">
							<label>{{$t('fmsReceiveInvoice.invoice_source')}}：</label>
							<span>{{originName}}</span>
						</div>
					</div>
				</div>
				<div class="module " style="padding:10px 20px 20px 20px;">
					<div class="blod name">
						<i class="icon iconfont icon-dingdandingdanmingxishouzhimingxi" style="float: left;"></i>
						{{$t('fmsReceiveInvoice.charge_detail')}}
					</div>
					<div style="">
						<!--已选择多少项-->
						<div class="has-select">
							<i class="el-icon-info set-blue-color" />
							{{$t('fmsReceiveInvoice.has_select')}}
							<span class="set-blue-color" style="margin: 0 5px;">{{multipleSelection.length}}</span>
							{{$t('fmsReceiveInvoice.items')}}
						</div>
						<el-table ref="chargeTableRef" size="mini" :data="tableData" style="width: 100%;" row-key="id" border @selection-change="handleSelectionChange">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="billNo" :label="$t('receiveFms.bill_no')" min-width="150"></el-table-column>
							<el-table-column prop="confirmationNo" :label="$t('receiveFms.serial_no')" min-width="150"></el-table-column>
							<el-table-column prop="entityNo" :label="$t('receiveFms.entity_no')" min-width="150"></el-table-column>
							<el-table-column prop="businessTypeName" :label="$t('receiveFms.business_type')" min-width="100"></el-table-column>
							<el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="100"></el-table-column>
							<el-table-column prop="currency" :label="$t('receiveFms.currency')" min-width="80"></el-table-column>
							<el-table-column prop="entryAmount" :label="$t('receiveFms.entry_amount')" min-width="120">
								<template slot-scope="scope">
									<div style='text-align: right'>{{scope.row.entryAmount}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="applyingAmount" :label="$t('fmsReceiveInvoice.applying_amount')" min-width="120">
								<template slot-scope="scope">
									<div style='text-align: right'>{{scope.row.applyingAmount}}</div>
								</template>
							</el-table-column>
							<el-table-column prop="invoiceApplyAmount" :label="$t('fmsReceiveInvoice.invoice_apply_amount')" min-width="120">
								<template slot-scope="{ row }">
									<el-input v-model="row.invoiceApplyAmount" size="mini" @change="calcTotal" oninput="value=value.replace(/[^\d.-]/g,'')" />
								</template>
							</el-table-column>
						</el-table>
						<div class="total">
							<span>{{$t('fmsReceiveInvoice.invoice_apply_amount_total')}}：</span>
							<span>
								<span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
									<span class='value'>{{item.currency}}</span>
									<span>{{item.value}}</span>
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>

			<!--开票配置-->
			<div v-show="active === 2">
				<apply-invoice-config :invoiceInfo="invoiceInfo" ref="applyInvoiceConfigRef" role="OPERATORS"></apply-invoice-config>
			</div>

			<div v-show="active === 3">
				<!--形票 && 电子- 成功的提示信息 -->
				<div class="create-bill" v-if="successInfo.invoiceType === 3 && successInfo.invoiceMedium === 2">
					<i class="iconfont icon-yanzhengchenggong"></i>
					<div class="render">{{$t('fmsReceiveInvoice.submit_success')}}</div>
					<div class="bill-no-info">
						{{$t('fmsReceiveInvoice.submit_success_info')}}:
						<a class="link" @click="invoiceDetail(item.invoiceId)" v-for="(item,index) in successInfo.invoiceNos" :key="index">{{item.invoiceNo}}</a>
					</div>
					<el-button type="primary" size="mini" @click="backList()">{{$t('common.backList')}}</el-button>
				</div>

				<!-- 成功的提示信息 -->
				<div class="create-bill" v-else>
					<i class="iconfont icon-yanzhengchenggong"></i>
					<div class="render">{{$t('fmsReceiveInvoice.submit_success')}}</div>
					<div class="bill-no-info">
						{{$t('fmsReceiveInvoice.invoice_apply_no')}}:
						<a class="link" @click="applyInvoiceDetail(successInfo.applyId)">{{successInfo.applyNo}}</a>
					</div>
					<el-button type="primary" size="mini" @click="backList()">{{$t('common.backList')}}</el-button>
				</div>
			</div>
		</div>
		<div class="page-edit-footer">
			<el-button size="mini" plain @click="backList()" v-if="active === 1 || active === 2">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" @click="next()" v-if="active === 1">{{$t('common.nextStep')}}</el-button>
			<el-button type="primary" size="mini" @click="pre()" v-if="active === 2">{{$t('common.previousStep')}}</el-button>
			<el-button type="primary" size="mini" @click="submitFn()" v-if="active === 2">{{$t('common.submit')}}</el-button>
		</div>
	</div>

</template>
<script>
import { getReceiveBillDetailApi, getReceiveBillDetailChargeApi } from "@/api/financial/fmsReceive";
import { invoiceApplyTaxInitApi, invoiceApplyTaxSubmitApi, invoiceApplyCommercialInitApi, invoiceApplyCommercialSubmitApi, getInvoiceChargeByChargeApi, getInvoiceChargeByConfirmationApi, getInvoiceChargeByBillApi } from "@/api/financial/fmsReceiveInvoice";
import { parseTime, formatNumberToThousands, addFloatNum } from "@/utils/index";
import { invoiceTypeMap, invoiceTypeList, invoiceMaterialTypeMap, invoiceMaterialTypeList } from "@/utils/constant";
import ApplyInvoiceConfig from "../components/ApplyInvoiceConfig.vue";

export default {
	name: "ApplyInvoiceComponent",
	components: {
		ApplyInvoiceConfig
	},
	props: {
		config: {
			type: Object,
			default: function () {
				return {};
			}
		}
	},
	data() {
		return {
			id: "",
			origin: "",
			originName: "",
			active: 1,
			settlementCompanyId: "",
			settlementCompanyName: "",
			tableData: [],
			loading: false,
			amountTotal: [],
			formModel: {},
			formRules: {},
			confirmationStateList: [],
			multipleSelection: [],
			invoiceInfo: {},
			successInfo: {},
			templateList: []
		};
	},
	created() {
		let map = {
			CHARGE: 1,
			CONFIRMATION: 2,
			BILL: 3
		};
		let mapName = {
			1: this.$t("fmsReceiveInvoice.charge"), // 费用
			2: this.$t("fmsReceiveInvoice.confirmation"), // 费用确认单
			3: this.$t("fmsReceiveInvoice.bill") // 账单
		};
		this.ids = (this.$route.query.ids || this.$route.params.ids || "").split(",");
		this.origin = map[this.$route.query.origin];
		this.originName = mapName[this.origin];
		this.invoiceInfo.invoiceType = Number(this.$route.query.invoiceType);
		this.invoiceInfo.retPayFlag = this.$route.query.retPayFlag
		this.invoiceInfo.invoiceMedium = Number(this.$route.query.invoiceMedium);
		this.getDetail();
	},
	methods: {
		getDetail() {
			let fn = null;
			if (this.origin === 1) {
				fn = getInvoiceChargeByChargeApi;
			} else if (this.origin === 2) {
				fn = getInvoiceChargeByConfirmationApi;
			} else if (this.origin === 3) {
				fn = getInvoiceChargeByBillApi;
			}
			if (!fn) {
				return;
			}
			fn(this.ids).then(res => {
				if (res.ok) {
					res.content = res.content || [];
					res.content.forEach(v => {
						v.taxRate = v.taxRate + "%";
						v.price = formatNumberToThousands(v.price);
						v.amount = formatNumberToThousands(v.amount);
						v.taxAmount = formatNumberToThousands(v.taxAmount);
						v.entryAmount = formatNumberToThousands(v.entryAmount);
						v.excludeTaxAmount = formatNumberToThousands(v.excludeTaxAmount);
						v.invoiceApplyAmount = v.applyingAmount;
					});
					if (res.content[0]) {
						this.settlementCompanyName = res.content[0].settlementCompanyName;
						this.settlementCompanyId = res.content[0].settlementCompanyId;
					}
					this.tableData = res.content;
					this.$nextTick(() => {
						this.$refs.chargeTableRef.toggleAllSelection();
					});
				}
			});
		},
		calcTotal() {
			let map = {};
			let amountTotal = [];
			this.multipleSelection.forEach(v => {
				map[v.currency] = addFloatNum(map[v.currency], v.invoiceApplyAmount)
			});
			Object.keys(map).forEach(v => {
				amountTotal.push({
					currency: v,
					value: formatNumberToThousands(map[v])
				});
			});
			this.amountTotal = amountTotal;
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.calcTotal();
		},
		pre() {
			this.active = 1;
			this.invoiceInfo = {
				invoiceType: this.invoiceInfo.invoiceType,
				invoiceMedium: this.invoiceInfo.invoiceMedium
			};
		},
		next() {
			// 第二部初始化 开票配置
			// 形票和税票
			let data = this.collectApplyData();
			if (data.charges.length === 0) {
				this.$message.error(this.$t("fmsReceiveInvoice.please_select_invoice_apply_charge"));
				return;
			}
			let commercialInitApi = this.config.commercialInitApi;
			let taxInitApi = this.config.taxInitApi;
			let fn = this.invoiceInfo.invoiceType === invoiceTypeMap.COMMERCIAL_INVOICE ? commercialInitApi : taxInitApi;
			if (!fn) {
				return;
			}
			fn(data).then(res => {
				if (res.ok) {
					this.active = 2;
					res.content.sourceAmounts.forEach(v => {
						v.value = formatNumberToThousands(v.value);
					});
					this.invoiceInfo = {
						...res.content
					};
				}
			});
		},
		// 提交
		submitFn() {
			if (this.$refs.applyInvoiceConfigRef.validate()) {
				let data = this.$refs.applyInvoiceConfigRef.getValue();

				let checkFlag = true
				// 税票
				if (data.invoiceType !== invoiceTypeMap.COMMERCIAL_INVOICE) {
					if (!data.buyerTel || !data.buyerTaxNo || !data.buyerCompanyName || !data.buyerAddress || data.buyerBankAccounts.length === 0) {
						checkFlag = false
					}
				}

				data.buyerBankAccounts.forEach(v => {
					if (!v.rechargeCurrency || !v.bankAccount || !v.bankName || !v.bankBranch) {
						checkFlag = false
					}
				})

				if (!checkFlag) {
					let htmlStr = `<span style="color: red;">${this.$t('fmsReceiveInvoice.apple_invoice_info_1')}</span>${this.$t('fmsReceiveInvoice.apple_invoice_info_2')}`
					this.$confirm(htmlStr, this.$t('common.mention'), {
						dangerouslyUseHTMLString: true,
						cancelButtonText: this.$t('fmsReceiveInvoice.cancel_apply'),
						confirmButtonText: this.$t('fmsReceiveInvoice.re_submit'),
						type: 'warning'
					}).then(() => {
						this.submitFetchFn(data)
					}).catch(() => { });
				} else {
					this.submitFetchFn(data)
				}
			} else {
				// 滚动到 校验未通过的位置
				this.mixinsFormScrollIntoView()
			}
		},
		submitFetchFn(data) {
			let taxSubmitApi = this.config.taxSubmitApi;
			let commercialSubmitApi = this.config.commercialSubmitApi;
			let fn = this.invoiceInfo.invoiceType === invoiceTypeMap.COMMERCIAL_INVOICE ? commercialSubmitApi : taxSubmitApi;
			if (!fn) {
				return;
			}
			this.loading = true;
			fn(data).then(res => {
				if (res.ok) {
					this.successInfo = {
						...res.content,
						invoiceType: data.invoiceType,
						invoiceMedium: data.invoiceMedium
					};
					this.active = 3;
				}
				this.loading = false;
			}).catch(() => {
				this.loading = false;
			});
		},
		// 开票申请提交之后 可查看申请详情
		applyInvoiceDetail(id) {
			let name = this.config.taxInvoiceApplyDetailPath;
			if (name) {
				this.$router.push({
					name: name,
					query: {
						id: id,
						invoiceType: this.successInfo.invoiceType,
						backPath: this.config.backPath,
						businessType: this.config.businessType
					}
				});
			}
		},
		// 形票电子申请提交之后 可查看发票详情
		invoiceDetail(id) {
			// FmsCommercialInvoiceDetail
			// 通过配置进行回调的
			let name = this.config.commercialInvoiceDetailPath;
			if (name) {
				this.$router.push({
					name: name,
					query: {
						id: id,
						backPath: this.config.backPath,
						businessType: this.config.businessType
					}
				});
			}
		},
		// 搜集第一步执行之后 选择的要申请的费用数据
		collectApplyData() {
			// 结算数据来源 --> 1 费用 2 费用确认单3 账单
			let data = {
				settlementCompanyId: this.settlementCompanyId,
				invoiceType: this.invoiceInfo.invoiceType,
				invoiceMedium: this.invoiceInfo.invoiceMedium,
				settlementSource: this.origin,
				retPayFlag: this.invoiceInfo.retPayFlag,
				charges: [],
				businessType: this.config.businessType
			};
			this.multipleSelection.forEach(v => {
				data.charges.push({
					chargeEntryId: v.id,
					invoiceApplyAmount: v.invoiceApplyAmount
				});
			});
			return data;
		},
		backList() {
			// 通过配置进行回调的
			if (this.config.backPath) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.config.backPath });
			}
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
	height: 50px;
}
.edit-container {
	border: 1px solid #dedede;
}
.tilte-line {
	line-height: 50px;
	height: 50px;
	background: #f5f7fa;
	margin-bottom: 15px;
	border-bottom: 1px solid #dedede;
	border-top: 1px solid #dedede;

	.title-name {
		padding-left: 40px;
	}
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
			-o-object-fit: cover;
			object-fit: cover;
		}
	}
	.item {
		width: 100%;
		float: left;
		display: flex;
		margin-bottom: 10px;
		height: 35px;
		line-height: 35px;

		label {
			width: 130px;
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
}

.name {
	height: 50px;
	line-height: 50px;
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
.set-blue-color {
	color: #108ee9;
}
.has-select {
	padding-left: 10px;
	height: 40px;
	line-height: 40px;
	background: rgba(16, 142, 233, 0.1);
	font-size: 14px;
}

::v-deep .el-step__head.is-success {
	color: #fff;
	border-color: #1890ff;

	.el-step__icon.is-text {
		background: #1890ff;
	}
}
::v-deep .el-step__title.is-success,
::v-deep .el-step__description.is-success {
	color: #1890ff;
}
::v-deep .el-step__head.is-process {
	color: #c0c4cc;
	border-color: #c0c4cc;

	.el-step__icon.is-text {
		color: #c0c4cc;
	}
}
::v-deep .el-step__title.is-process {
	color: #c0c4cc;
}
::v-deep .el-step__description.is-process {
	color: #c0c4cc;
}

.create-bill {
	text-align: center;
	background: #fff;
	padding: 50px;

	i {
		font-size: 60px;
		color: rgb(82, 196, 26);
	}
	.render {
		font-weight: 650;
		font-style: normal;
		font-size: 24px;
		color: rgba(0, 0, 0, 0.847058823529412);
		line-height: 32px;
		margin: 10px 0;
	}
	.bill-no-info {
		font-weight: 400;
		font-style: normal;
		text-align: center;
		line-height: 22px;
		margin-bottom: 40px;
	}
	.link {
		color: #108ee9;
		text-decoration: underline;
		margin-left: 10px;
	}
}
</style>

