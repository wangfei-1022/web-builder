<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="page-edit-content">
			<div class="section source-container">
				<div class="title">
					<div class="title-item">
						<span class="title-item-des">
							<svg-icon className="clear-module-icon" iconClass="icon-weixiaozhangdan" v-if="clearingInfo.bills.length > 0" />
							<svg-icon className="clear-module-icon" iconClass="icon-fapiaoguanli" v-else-if="clearingInfo.invoices.length > 0" />
							<svg-icon className="clear-module-icon" iconClass="icon-weixiaofeiyong" v-else />
              <!--未销{{clearingInfo.settlementSourceName}}合计-->
              {{$t('fmsReceiveClear.unclearTitle',{ settlementSourceName: clearingInfo.settlementSourceName })}}
							<span v-if="clearingInfo.invoices.length === 0 && clearingInfo.bills.length === 0">
								<span style="margin-left: 20px">{{totalData.businessTypeNames.join('、')}}</span>
								<span style="margin-left: 20px">{{totalData.settlementCompanyName}}</span>
							</span>
						</span>
						<span class="currency-value-des" v-for="(item, index) in clearingInfo.unInstructionAmounts" :key="index">
							<span>{{item.currency}} {{item.value | numberToThousands}}</span>
						</span>
					</div>
				</div>
				<div class="section-content" v-if="clearingInfo.invoices.length || clearingInfo.bills.length">
					<el-table :data="clearingInfo.invoices" v-if="clearingInfo.invoices.length" style="width: 100%" border>
						<el-table-column prop="invoiceNo" :label="$t('fmsReceiveClear.invoiceNo')" min-width="120"></el-table-column>
						<el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')" min-width="120" show-overflow-tooltip></el-table-column>
						<el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')" min-width="220" show-overflow-tooltip></el-table-column>
						<el-table-column prop="sourceAmounts" :label="$t('fmsReceiveClear.currencyAmount')" align="right" min-width="220" show-overflow-tooltip>
							<template slot-scope="{row}">
								<span v-for="(item, index) in row.sourceAmounts" :key="index">
									<span>{{item.currency}}</span>
									<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="unInstructionAmountsStr" :label="$t('fmsReceiveClear.unInstructionAmounts')" align="right" min-width="220" show-overflow-tooltip>
							<template slot-scope="{row}">
								<span v-for="(item, index) in row.unInstructionAmounts" :key="index">
									<span>{{item.currency}}</span>
									<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
								</span>
							</template>
						</el-table-column>
					</el-table>
					<el-table :data="clearingInfo.bills" v-if="clearingInfo.bills.length" style="width: 100%" border>
						<el-table-column prop="billNo" :label="$t('fmsReceiveClear.billNo')" min-width="120"></el-table-column>
						<el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')" min-width="120"></el-table-column>
						<el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')" min-width="220" show-overflow-tooltip></el-table-column>
						<el-table-column prop="currencyAmountsStr" :label="$t('fmsReceiveClear.currencyAmount')" align="right" min-width="220" show-overflow-tooltip>
							<template slot-scope="{row}">
								<span v-for="(item, index) in row.currencyAmounts" :key="index">
									<span>{{item.currency}}</span>
									<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="unInstructionAmountsStr" :label="$t('fmsReceiveClear.unInstructionAmounts')" align="right" min-width="220" show-overflow-tooltip>
							<template slot-scope="{row}">
								<span v-for="(item, index) in row.unInstructionAmounts" :key="index">
									<span>{{item.currency}}</span>
									<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
								</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>

			<div class="section relative-container">
				<relative-transaction
          @selectFn="selectReceiptFn"
          @transactionTypeChange="transactionTypeChangeFn"
          :detail="{
            settlementOfficeId: totalData.settlementOfficeId,
            settlementOfficeName: totalData.settlementOfficeName,
            settlementCompanyId:  totalData.settlementCompanyId,
            settlementCompanyName:  totalData.settlementCompanyName,
            businessTypes: totalData.businessTypes
          }"
          :targetCurrency="totalData.instructionCurrency"
          :sourceClearAmounts="clearingInfo.unInstructionAmounts"
        />
			</div>

			<div class="section result-container" v-if="claimList.length">
				<div class="title">
					<div class="title-item">
						<span class="title-item-des">
							<svg-icon className="clear-module-icon" iconClass="icon-hexiaoxiangqing" />
              <!--核销详情-->
              {{$t('fmsReceiveClear.clearDetail')}}
						</span>
						<span class="title-item-des">
              <!--申请核销未销合计-->
              {{$t('fmsReceiveClear.applyUnClearTotal')}}：</span>
						<span v-for="(item, index) in totalData.sourceAmounts" :key="index">
							<span v-if="item.checked">
								<span>{{item.currency}}</span>
								<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
							</span>
						</span>
					</div>
				</div>
				<div class="text-container" v-if="isDifferent">
					<div class="amount-container">
						<el-row v-for="(item, index) in totalData.sourceAmounts" :key="index + 'AR'" class="amount-row">
							<el-col :span="4">
								<div>
									<span v-if="index === 0">
                    <!--应收-->
                    {{$t('fmsReceiveClear.AR')}}
                  </span>
									<span v-else>&nbsp;&nbsp;</span>
								</div>
							</el-col>
							<el-col :span="16" class="currency-value">
                <el-checkbox v-if="totalData.sourceAmounts.length > 1" v-model="item.checked" @change="checkedChange(item, index)"/>
								<span class="currency">{{item.currency}}</span>
								<span class="value">
									<edit-input v-model="item.value" @calc="calcAmount(item)" :canEdit="item.checked" type="AMOUNT"/>
								</span>
								<span class="symbol">x</span>
								<span class="input">
									<edit-input v-model="item.exchangeRate" @calc="calcAmount(item)" :canEdit="item.currency != receiptAmounts[0].currency && item.checked" />
								</span>
							</el-col>
							<el-col :span="4" class="calc-total">
								<div>
									<span class="symbol">=</span>
									<span class="total-transfer">{{item.calcTransferTotal | numberToThousands}}</span>
								</div>
							</el-col>
						</el-row>
					</div>
					<div class="amount-container">
						<el-row class="amount-row">
							<el-col :span="4">
								<div>
									<span>
                    <!--本次收款使用金额-->
                    {{$t('fmsReceiveClear.currentTransactionsUseAmount')}}
                  </span>
								</div>
							</el-col>
							<el-col :span="16" class="currency-value">
								<span class="currency">{{totalData.instructionCurrency}}</span>
								<span class="value">{{receiptTransactionTotal | numberToThousands}}</span>
								<span class="symbol">&nbsp;</span>
								<span class="input" style="visibility: hidden;">
									<edit-input />
								</span>
							</el-col>
							<el-col :span="4" class="calc-total">
								<div>
									<span class="symbol">=</span>
									<span class="total-transfer">{{receiptTransactionTotal | numberToThousands}}</span>
								</div>
							</el-col>
						</el-row>
					</div>
					<el-row class="remain-row">
						<el-col :span="6">
							<div>
                <!--剩余应收-->
                {{$t('fmsReceiveClear.remainReceipt')}}
              </div>
						</el-col>
						<el-col :span="14" class="total-currency">
							<div>
								<span v-if="totalData.instructionCurrency">{{totalData.instructionCurrency}}</span>
								<span v-else>&nbsp;</span>
							</div>
						</el-col>
						<el-col :span="4" class="calc-total">
							<div>
								<span class="symbol"></span>
								<span class="total-transfer">{{diffCalcTotal | numberToThousands}}</span>
							</div>
						</el-col>
					</el-row>
				</div>

				<!--只有同一个币种的展示-->
				<div class="section-content same-curreny-result-container" v-if="!isDifferent">
					<el-row class="amount-row">
						<el-col :span="6">
              <!--本次申请核销金额-->
              {{$t('fmsReceiveClear.currentApplyClearAmount')}}
            </el-col>
						<el-col :span="18">
							<div class="currency-value">
								<span class="currency">{{totalData.instructionCurrency}}</span>
								<span class="value">
									<el-input type="text" size="mini" v-model="receiptSourceAmountsTotal" @change="changeReceiptSourceAmount" oninput="value=value.toString().match(/^\d+(?:\.\d{0,2})?/)" />
								</span>
							</div>
						</el-col>
					</el-row>
					<el-row class="amount-row">
						<el-col :span="6">
              <!--本次收款使用金额-->
              {{$t('fmsReceiveClear.currentTransactionsUseAmount')}}
            </el-col>
						<el-col :span="18">
							<div class="currency-value">
								<span class="currency">{{totalData.instructionCurrency}}</span>
								<span class="value">{{receiptTransactionTotal | numberToThousands}}</span>
							</div>
						</el-col>
					</el-row>
					<el-row class="amount-row remain-calc-row">
						<el-col :span="6">
              <!--剩余金额-->
              {{$t('fmsReceiveClear.remainCalcAmount')}}
            </el-col>
						<el-col :span="18">
							<div class="currency-value">
								<span class="currency">{{totalData.instructionCurrency}}</span>
								<span class="value">{{diffCalcTotal | numberToThousands}}</span>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>

			<div class="section remark-container">
				<div class="title">
					<div class="title-item">
						<span class="title-item-des">
							<svg-icon className="clear-module-icon" iconClass="icon-zhuyishixiang" />
              <!--备注-->
              {{$t('fmsReceiveClear.remark')}}
						</span>
					</div>
				</div>
				<div class="section-content">
					<el-form ref="claimerDataForm" :model="formData" label-width="120px" size="mini">
						<el-form-item :label="$t('fmsReceiveClear.applyClearDesc')" prop="settlementCompanyId">
							<el-input v-model="formData.remark" type="textarea" size="mini" clearable />
						</el-form-item>
					</el-form>
				</div>
			</div>

			<clear-reason-modal ref="clearReasonModalRef" @ok="submitConfirmFn" />
		</div>

		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList()">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" @click="confirmFn()">{{$t('common.confirm')}}</el-button>
		</div>
	</div>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getBillClearingApi, getInvoiceClearingApi, fmsInstructionReceiptCollectApi, getConfirmationClearingApi, getChargeClearingApi } from "@/api/financial/fmsReceiptClear";
import RelativeTransaction from "./components/relativeTransaction";
import EditInput from "./components/editInput";
import ClearReasonModal from "@/views/financial/components/ReceiptClearReasonModal";

// 申请核销
export default {
	name: "ApplyClearComponent",
	components: {
		RelativeTransaction,
		EditInput,
		ClearReasonModal
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
			loading: false,
			formData: {
				remark: ""
			},
			isDifferent: false,
			diffCalcTotal: 0, // 剩余应收合计
			receiptSourceAmountsTotal: 0, // 本次应收的值。单币种的时候使用
			receiptTransactionTotal: 0, // 本次收款核销合计
			remainAmounts: [], // 剩余原币未销合计
			isRelative: 1, // 是否关联收款

			claimList: [],
			totalData: {
				instructionTransactionType: 1,
				businessTypes: [],
				businessTypeNames: [],
				settlementOfficeId: "",
				settlementOfficeName: "",
				settlementCompanyId: "",
				settlementCompanyName: "",
				arAp: "1",
				remark: "",
				instructionCurrency: "",
				sourceAmounts: [] // 编辑之后的合计
			},
			clearingInfo: {
				settlementSource: "",
				settlementSourceName: "",
				charges: [],
				bills: [],
				invoices: [],
				unInstructionAmounts: [] // 原有的合计
			}
		};
	},
	created() {
		this.ids = this.config.ids;
		this.origin = this.config.origin;
		this.back = this.config.backPath;
		this.init();
	},
	methods: {
		init() {
			let fn = null;
			if (this.origin === "BILL") {
				fn = this.config.getBillClearingApi;
			} else if (this.origin === "INVOICE") {
				fn = this.config.getInvoiceClearingApi;
			} else if (this.origin === "CHARGE") {
				fn = this.config.getChargeClearingApi;
			} else if (this.origin === "CONFIRMATION") {
				fn = this.config.getConfirmationClearingApi;
			}
			fn(this.ids).then(res => {
				if (res.ok) {
					let sourceAmounts = this.$extends(true, [], res.content.unInstructionAmounts);
          sourceAmounts.forEach(v => {
            v.checked = true
          })
          this.totalData.sourceAmounts = sourceAmounts
					if (this.totalData.sourceAmounts.length === 1) {
						this.receiptSourceAmountsTotal = this.totalData.sourceAmounts[0].value;
					}

					this.clearingInfo.settlementSource = res.content.settlementSource;
					this.clearingInfo.settlementSourceName = res.content.settlementSourceName;
					this.clearingInfo.unInstructionAmounts = res.content.unInstructionAmounts;
					if (this.origin === "BILL") {
						this.clearingInfo.bills = res.content.bills;
						this.totalData.settlementOfficeId = res.content.bills[0].settlementOfficeId;
						this.totalData.settlementOfficeName = res.content.bills[0].settlementOfficeName;
						this.totalData.settlementCompanyId = res.content.bills[0].settlementCompanyId;
						this.totalData.settlementCompanyName = res.content.bills[0].settlementCompanyName;

						// 收集业务类型
						let arr = [];
						res.content.bills.forEach(v => {
              let index = arr.findIndex(item => item.businessType === v.businessType)
							if (index < 0) {
								arr.push({
                  businessType: v.businessType,
                  businessTypeName: v.businessTypeName
                });
							}
						});
						this.totalData.businessTypes = arr;
					} else if (this.origin === "INVOICE") {
						this.clearingInfo.invoices = res.content.invoices;
						this.totalData.settlementOfficeId = res.content.invoices[0].settlementOfficeId;
						this.totalData.settlementOfficeName = res.content.invoices[0].settlementOfficeName;
						this.totalData.settlementCompanyId = res.content.invoices[0].settlementCompanyId;
						this.totalData.settlementCompanyName = res.content.invoices[0].settlementCompanyName;

						// 收集业务类型
						let arr = [];
						res.content.invoices.forEach(v => {
              let index = arr.findIndex(item => item.businessType === v.businessType)
							if (index < 0) {
								arr.push({
                  businessType: v.businessType,
                  businessTypeName: v.businessTypeName
                });
							}
						});
						this.totalData.businessTypes = arr;
					} else if (this.origin === "CHARGE" || this.origin === "CONFIRMATION") {
						this.clearingInfo.charges = res.content.charges;
						this.totalData.settlementOfficeId = res.content.settlementOfficeId;
						this.totalData.settlementOfficeName = res.content.settlementOfficeName;
						this.totalData.settlementCompanyId = res.content.settlementCompanyId;
						this.totalData.settlementCompanyName = res.content.settlementCompanyName;
						this.totalData.businessTypeNames = res.content.businessTypeNames;

						// 收集业务类型
						let arr = [];
						res.content.charges.forEach(v => {
              let index = arr.findIndex(item => item.businessType === v.businessType)
							if (index < 0) {
								arr.push({
                  businessType: v.businessType,
                  businessTypeName: v.businessTypeName
                });
							}
						});
						this.totalData.businessTypes = arr;
					}

					// 初始化 剩余原币未销合计
					let arr = [];
					this.clearingInfo.unInstructionAmounts.forEach(v => {
						arr.push({
							value: 0,
							currency: v.currency
						});
					});
					this.remainAmounts = arr;
				}
			});
		},
		// 只有一个币种的时候 变更核销的值 可能进行部分核销
		changeReceiptSourceAmount() {
			this.diffCalcTotal = Number((this.receiptSourceAmountsTotal || 0) - (this.receiptTransactionTotal || 0)).toFixed(2);

			let currencyItem = this.clearingInfo.unInstructionAmounts[0];
			if (currencyItem) {
				this.remainAmounts = [
					{
						value: Number(Number(currencyItem.value) - Number(this.receiptSourceAmountsTotal)).toFixed(2),
						currency: currencyItem.currency
					}
				];
			}
		},
		// 变更汇率之后进行计算
		calcAmount(item) {
			if (item.value && item.exchangeRate) {
				item.calcTransferTotal = (Number(item.value || 0) * Number(item.exchangeRate || 0)).toFixed(2);
			} else {
				item.calcTransferTotal = 0;
			}
			this.calcReceiptTotalFn();
		},
		calcReceiptTotalFn() {
			// 计算剩余的汇总
			let arTotal = 0;
			let claimTotal = 0;
			this.totalData.sourceAmounts.forEach(v => {
				arTotal += Number(v.calcTransferTotal || 0).toFixed(2) * 100;
			});
			this.claimList.forEach(v => {
				claimTotal += Number(v.useAmount || 0).toFixed(2) * 100;
			});
			this.diffCalcTotal = (Number(arTotal - claimTotal) / 100).toFixed(2);

			// 金额变更之后 计算相应的剩余原币未销金额
			// 计算剩余原币未销金额
			let arr = [];
			let map = {};
			this.totalData.sourceAmounts.forEach(v => {
				map[v.currency] = v.value;
			});
			this.clearingInfo.unInstructionAmounts.forEach(v => {
				arr.push({
					value: (Number(v.value) - Number(map[v.currency])).toFixed(2),
					currency: v.currency
				});
			});
			this.remainAmounts = arr;
		},
    // 当有多条币种原币 且 勾选框事件触发
    checkedChange(item, index) {
      if (item.checked) {
        this.clearingInfo.unInstructionAmounts.forEach(v => {
          if (v.currency === item.currency) {
            item.value = v.value
          }
        })
      } else {
        item.value = 0
      }
      if (item.exchangeRate) {
        item.calcTransferTotal = (Number(item.value || 0) * Number(item.exchangeRate || 0)).toFixed(2);
      } else {
        item.calcTransferTotal = item.value
      }
      this.$set(this.totalData.sourceAmounts, index, item)
    },
		// 查找收款
		reseachReceipt() {
			this.$refs.transactionsReceiptDialogRef.show();
		},
    // 选择收款
		selectReceiptFn(val, receiptAmounts, type) {
			this.claimList = val;
			if (val.length > 0) {
				this.receiptAmounts = receiptAmounts;
				this.totalData.instructionCurrency = receiptAmounts[0].currency;
				this.receiptTransactionTotal = receiptAmounts[0].value;

        // 当有多个元币种的时候 才开启checked
        if (this.totalData.sourceAmounts.length > 1) {
          // 改变金额
          if (type !== 'AMOUNT_CHANGE') {
            this.totalData.sourceAmounts.forEach(v => {
              if (v.currency === receiptAmounts[0].currency) {
                // 复位之前归0的数值
                this.clearingInfo.unInstructionAmounts.forEach(item => {
                  if (v.currency === item.currency) {
                    v.value = item.value
                  }
                })

                v.exchangeRate = 1;
                v.calcTransferTotal = v.value;
                v.canEdit = false;
                v.checked = true
              } else {
                v.exchangeRate = 1;
                v.value = 0
                v.checked = false
              }
            });
          }
        }

				// 当源币种和所选币种不一致的时候，展示填写汇率应收合计
				// 当源币种数量大于1，肯定不一致，因为选中的收款币种只能是一种，展示填写汇率应收合计
				if (this.clearingInfo.unInstructionAmounts.length === 1 && this.clearingInfo.unInstructionAmounts[0].currency === receiptAmounts[0].currency) {
					this.isDifferent = false;
					this.diffCalcTotal = Number((this.receiptSourceAmountsTotal || 0) - (this.receiptTransactionTotal || 0)).toFixed(2);
				} else {
					this.isDifferent = true;
					this.calcReceiptTotalFn();
				}
			} else {
				this.totalData.instructionCurrency = "";
				this.receiptAmounts = [];
				this.receiptTransactionTotal = 0;
				this.diffCalcTotal = Number((this.receiptSourceAmountsTotal || 0) - (this.receiptTransactionTotal || 0)).toFixed(2);
			}
		},
		confirmFn() {
			// 关联收款的时候 进行校验
			if (this.totalData.instructionTransactionType === 1 || this.totalData.instructionTransactionType === 2) {
				let VALID = true;
				let msg = "";
				if (this.claimList.length === 0) {
          // 请先选择一条关联的收款
					this.$message.error(this.$t('fmsReceiveClear.pleaseSelectTransactions'));
					return false;
				}
				this.claimList.forEach(v => {
					if (!v.useAmount) {
						VALID = false;
            // 收款的使用金额不能为空
						msg = this.$t('fmsReceiveClear.transactionsAmountCheck1');
					}
					if (v.useAmount > v.remainAmount) {
						VALID = false;
            // 使用金额不能大于未关联金额
						msg = this.$t('fmsReceiveClear.transactionsAmountCheck2');
					}
				});
				if (!VALID) {
					this.$message.error(msg);
					return false;
				}

        let hasChecked = false
        if (this.totalData.sourceAmounts.length > 1) {
          this.totalData.sourceAmounts.forEach(v => {
            if (v.checked) {
              hasChecked = true
            }
          })

          if (!hasChecked) {
            // 请至少勾选一个申请币种进行核销
            this.$message.error(this.$t('fmsReceiveClear.pleaseSelectOneToClear'));
            return false;
          }
        }

				// 异币种的情况
				if (this.isDifferent) {
					let map = {};
					let VALID_FLAG = true;
						let VALID_FLAG_ZERO = true;
					this.totalData.sourceAmounts.forEach(v => {
						map[v.currency] = v.value;
						if (!v.exchangeRate) {
							VALID_FLAG = false;
						}
						if (v.exchangeRate === 0) {
							VALID_FLAG_ZERO = false;
						}
					});
					if (!VALID_FLAG) {
            // 请先输入汇率
						this.$message.error(this.$t('fmsReceiveClear.exchangeRateCheck'));
						return;
					}
					if (!VALID_FLAG_ZERO) {
            // 输入的汇率不能为0
						this.$message.error(this.$t('fmsReceiveClear.exchangeRateCheck1'));
						return;
					}
					this.clearingInfo.unInstructionAmounts.forEach(v => {
						if ((Number(v.value) - Number(map[v.currency])).toFixed(2) < 0) {
							VALID_FLAG = false;
						}
					});
					if (!VALID_FLAG) {
            // 输入的币种金额不能大于原币未销金额
						this.$message.error(this.$t('fmsReceiveClear.amountCheck1'));
						return;
					}
				} else {
					// 同币种的时候的校验
					if (!this.receiptSourceAmountsTotal) {
            // 本次收款使用金额不能为空
						this.$message.error(this.$t('fmsReceiveClear.amountCheck2'));
						return false;
					}
					// 币种相同的实惠 校验
					let currencyItem = this.clearingInfo.unInstructionAmounts[0];
					let VALID_FLAG = Number(Number(currencyItem.value) - Number(this.receiptSourceAmountsTotal)).toFixed(2) >= 0;
					if (!VALID_FLAG) {
            // 输入的币种金额不能大于原币未销金额
						this.$message.error(this.$t('fmsReceiveClear.amountCheck3'));
						return;
					}
				}
			}

			if (this.totalData.instructionTransactionType === 5) {
				// 完全平账
				this.submitConfirmFn();
			} else if (this.totalData.instructionTransactionType === 6) {
				// 余额平账
				this.$refs.clearReasonModalRef.show(true);
			} else if (this.totalData.instructionTransactionType === 1 || this.totalData.instructionTransactionType === 2) {
				// 关联收款
				if (Number(this.diffCalcTotal) !== 0) {
					let flag = this.diffCalcTotal > 0;
					this.$refs.clearReasonModalRef.show(flag);
				} else {
					this.submitConfirmFn();
				}
			}
		},
		// 关联收款、 无收款
		transactionTypeChangeFn(val) {
			this.totalData.instructionTransactionType = val;
			if (val !== 1 && val !== 2) {
				this.totalData.instructionCurrency = "";
			}
		},
		// 提交
		submitConfirmFn(reason) {
			let data = {
				...this.totalData,
				remark: this.formData.remark,
				clearingInfo: {
					...this.clearingInfo
				},
				claimList: [], // 认领列表
        walletAccountUseList: [] // 余额核销列表
			};
      // 根据勾选的时候，则根据勾选的币种进行展示提交
      let sourceAmounts = []
      this.totalData.sourceAmounts.forEach(v => {
        if (v.checked) {
          sourceAmounts.push(v)
        }
      })
      data.sourceAmounts = sourceAmounts

			// 如果是弹窗选原因
			if (reason) {
				data.clearDiffRemark = reason.remark;
				if (this.diffCalcTotal > 0) {
					data.clearUnderReason = reason.reason;
				} else {
					data.clearOverReason = reason.reason;
				}
			}

			if (this.totalData.instructionTransactionType === 1 || this.totalData.instructionTransactionType === 2) {
				if (this.totalData.instructionTransactionType === 1) {
          this.claimList.forEach(v => {
            data.claimList.push({
              claimId: v.id,
              useAmount: v.useAmount
            });
          });
        } else if (this.totalData.instructionTransactionType === 2) {
          this.claimList.forEach(v => {
            data.walletAccountUseList.push({
              walletAccountId: v.id,
              useAmount: v.useAmount
            });
          });
        }

				// 场景-没有不同币种-收款币种和应收币种一致 则data.sourceAmounts.length 为1
				if (!this.isDifferent) {
					data.sourceAmounts[0].value = this.receiptSourceAmountsTotal;
					data.sourceAmounts[0].exchangeRate = 1;
				}
			} else {
				// 无收款的场景
				data.sourceAmounts.forEach(v => {
					v.exchangeRate = 1;
				});
			}

			if (this.clearingInfo.bills.length > 0) {
				data.clearingInfo.bills = [];
				this.clearingInfo.bills.forEach(v => {
					let clearingCharges = [];
					v.clearingCharges.forEach(item => {
						clearingCharges.push({
							chargeKeepId: item.chargeKeepId,
							unInstructionAmount: item.unInstructionAmount
						});
					});
					data.clearingInfo.bills.push({
						id: v.id,
						clearingCharges: clearingCharges
					});
				});
			}
			if (this.clearingInfo.invoices.length > 0) {
				data.clearingInfo.invoices = [];
				this.clearingInfo.invoices.forEach(v => {
					let clearingCharges = [];
					v.clearingCharges.forEach(item => {
						clearingCharges.push({
							chargeKeepId: item.chargeKeepId,
							unInstructionAmount: item.unInstructionAmount
						});
					});
					data.clearingInfo.invoices.push({
						id: v.id,
						clearingCharges: clearingCharges
					});
				});
			}
			if (this.clearingInfo.charges.length > 0) {
				data.clearingInfo.charges = [];
				this.clearingInfo.charges.forEach(v => {
					data.clearingInfo.charges.push({
						chargeKeepId: v.chargeKeepId,
						unInstructionAmount: v.unInstructionAmount
					});
				});
			}

			this.loading = true;
			let fn = this.config.fmsInstructionReceiptCollectApi;

			fn(data).then(res => {
					if (res.ok) {
            // 申请核销成功
						this.$message.success(this.$t('fmsReceiveClear.applyClearSuccess'));
						this.backList();
					}
					this.loading = false;
				}).catch(() => {
					this.loading = false;
				});
		},
		backList() {
			if (this.back) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.back });
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../styles/clear.scss";
.text-container {
	padding: 0 30px;
	font-weight: 600;
	font-size: 15px;

	.amount-container {
		margin: 20px 0;

		.amount-row {
			margin: 10px 0;
		}
	}

	.remain-row {
		padding: 20px 0;
		border-top: 1px solid #dedede;
	}

	.currency-value {
		text-align: center;
		.currency {
			width: 40px;
			display: inline-block;
		}
		.value {
			margin-right: 40px;
			width: 140px;
			display: inline-block;
			text-align: left;
		}
		.symbol {
			margin-right: 40px;
		}
		.input {
			width: 140px;
			display: inline-block;
			text-align: left;
		}
	}
	.calc-total {
		text-align: right;

		.symbol {
			float: left;
		}
	}
	.total-currency {
		text-align: right;
		padding-right: 20px;
	}
}

.same-curreny-result-container {
	overflow: hidden;
	clear: both;
	font-size: 14px;
	font-weight: 600;
	padding: 0 20px;

	.amount-row {
		margin-bottom: 20px;

		.currency-value {
			text-align: right;
			.value {
				width: 120px;
				margin-left: 10px;
				display: inline-block;
			}
		}
	}

	.remain-calc-row {
		padding-top: 20px;
		border-top: 1px dashed #dedede;
	}
}
</style>
