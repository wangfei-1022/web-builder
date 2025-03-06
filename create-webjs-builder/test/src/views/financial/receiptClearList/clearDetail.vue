<template>
	<div class="page-edit-container full-page">
		<div class="page-edit-content">
      <el-tabs v-model="activeName">
        <!--核销详情/申请详情-->
        <el-tab-pane :label="totalData.clearNo ? $t('fmsReceiveClear.clearDetail') : $t('fmsReceiveClear.applyDetail')" name="first">
          <div class="section clear-title" style="margin-bottom: 0" v-if="operation === 'DETAIL'">
            <div v-if="totalData.instructionState === 3" class="title">
              <span>{{$t('fmsReceiveClear.apply_clear_no')}}</span>
              <span style="margin-left: 15px;">{{totalData.instructionNo}}</span>
              <svg-icon className="clear-img" iconClass="icon-yichehui-huise" />
              <span class="no-transactions" v-if="totalData.instructionState === 5 || totalData.instructionState === 6">{{$t('fmsReceiveClear.TRANSACTIONS_NO')}}</span>
            </div>
            <div v-else-if="totalData.clearNo" class="title">
              <span>{{$t('fmsReceiveClear.clear_no')}}</span>
              <span style="margin-left: 15px;">{{totalData.clearNo}}</span>
              <svg-icon className="clear-img" iconClass="icon-yihexiao" />
              <span class="no-transactions" v-if="totalData.instructionState === 5 || totalData.instructionState === 6">{{$t('fmsReceiveClear.TRANSACTIONS_NO')}}</span>
            </div>
            <div v-else-if="!totalData.clearNo" class="title">
              <span>{{$t('fmsReceiveClear.apply_clear_no')}}</span>
              <span style="margin-left: 15px;">{{totalData.instructionNo}}</span>
              <svg-icon className="clear-img" iconClass="icon-weihexiao" />
              <span class="no-transactions" v-if="totalData.instructionState === 5 || totalData.instructionState === 6">{{$t('fmsReceiveClear.TRANSACTIONS_NO')}}</span>
            </div>
          </div>
          <div class="clear-detail-container">
            <div class="section origin-container">
              <div class="title">
                <span class="title-item-des">
                  <svg-icon className="clear-module-icon" iconClass="icon-weixiaozhangdan" v-if="clearingInfo.bills.length > 0" />
                  <svg-icon className="clear-module-icon" iconClass="icon-fapiaoguanli" v-else-if="clearingInfo.invoices.length > 0" />
                  <svg-icon className="clear-module-icon" iconClass="icon-weixiaofeiyong" v-else />
                  {{$t('fmsReceiveClear.apply_clear_total_amount')}}
                </span>

                <span class="currency-value-des" v-for="(item, index) in totalData.sourceAmounts" :key="index">
                  <span style="margin-right: 10px" v-if="item.sourceValue != 0">{{item.sourceCurrency}} {{item.sourceValue | numberToThousands}}</span>
                </span>
              </div>
              <div class="section-content" v-if="clearingInfo.invoices.length || clearingInfo.bills.length">
                <!--应收发票-->
                <el-table :data="clearingInfo.invoices" v-if="clearingInfo.invoices.length" style="width: 100%" border>
                  <el-table-column prop="invoiceNo" :label="$t('fmsReceiveClear.invoice_no')" min-width="150"></el-table-column>
                  <el-table-column prop="businessTypeNames" :label="$t('fmsReceiveClear.business_type_name')" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span>{{row.businessTypeNames.join('、')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlement_company_name')" min-width="150" show-overflow-tooltip>
                    <template>
                      <span>{{totalData.settlementCompanyName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="invoiceTotalAmounts" :label="$t('fmsReceiveClear.currency_value')" align="right" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span v-for="(item, index) in row.invoiceTotalAmounts" :key="index">
                        <span>{{item.currency}}</span>
                        <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="clearTotalAmounts" :label="$t('fmsReceiveClear.current_apply_currency_value')" align="right" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span v-for="(item, index) in row.clearTotalAmounts" :key="index">
                        <span>{{item.currency}}</span>
                        <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>

                <!--应收账单-->
                <el-table :data="clearingInfo.bills" v-if="clearingInfo.bills.length" style="width: 100%" border>
                  <el-table-column prop="billNo" :label="$t('fmsReceiveClear.bill_no')" min-width="150"></el-table-column>
                  <el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.business_type_name')" min-width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlement_company_name')" min-width="150" show-overflow-tooltip>
                    <template>
                      <span>{{totalData.settlementCompanyName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="billTotalAmounts" :label="$t('fmsReceiveClear.currency_value')" align="right" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span v-for="(item, index) in row.billTotalAmounts" :key="index">
                        <span>{{item.currency}}</span>
                        <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="clearTotalAmounts" :label="$t('fmsReceiveClear.current_apply_currency_value')" align="right" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span v-for="(item, index) in row.clearTotalAmounts" :key="index">
                        <span>{{item.currency}}</span>
                        <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!--关联的收款-本次核销使用金额-->
            <div class="section containerrelative-container" v-if="claimList.length > 0">
              <div class="title">
                <span class="title-item-des">
                  <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
                  <!--本次核销使用金额-->
                  {{$t('fmsReceiveClear.currentClearUseAmount')}}
                </span>
                <span class="currency-value-des" v-for="(item, index) in transactionsAmounts" :key="index">
                  <span style="margin-right: 10px">{{item.currency}} {{item.value | numberToThousands}}</span>
                </span>
              </div>
              <div class="section-content">
                <el-table :data="claimList" style="width: 100%" border>
                  <el-table-column prop="transactionsNo" :label="$t('fmsReceiveClear.transactionsNo')" min-width="150"></el-table-column>
                  <el-table-column prop="claimNo" :label="$t('fmsReceiveClear.claimNo')" min-width="150"></el-table-column>
                  <el-table-column prop="transactionsDate" :label="$t('fmsReceiveClear.transactionsDate')" min-width="120">
                    <template slot-scope="{row}">
                      <span>{{row.transactionsDate | parseDate}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="businessTypeNames" :label="$t('fmsReceiveClear.businessTypeName')" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <div class="oh">
                        <span>{{row.businessTypeNames.join('、')}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="payerName" :label="$t('fmsReceiveClear.payerName')" min-width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')" min-width="150" show-overflow-tooltip>
                    <template>
                      <span>{{totalData.settlementCompanyName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="settlementOfficeName" :label="$t('fmsReceiveClear.settlementOfficeName')" min-width="150" show-overflow-tooltip>
                    <template>
                      <span>{{totalData.settlementOfficeName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="transactionsCurrency" :label="$t('fmsReceiveClear.transactionsCurrency')" align="right" min-width="100"></el-table-column>
                  <el-table-column prop="claimAmount" :label="$t('fmsReceiveClear.claimAmount')" min-width="150" align="right" fixed="right">
                    <template slot-scope="{row}">
                      <span>{{row.claimAmount | numberToThousands}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="useAmount" :label="$t('fmsReceiveClear.useAmount')" min-width="150" align="right" fixed="right">
                    <template slot-scope="{row}">
                      <span>{{row.useAmount | numberToThousands}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!--余额核销-本次核销使用金额-->
            <div class="section containerrelative-container" v-if="instructionAccounts.length > 0">
              <div class="title">
                <span class="title-item-des">
                  <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
                  <!--本次核销使用金额-->
                  {{$t('fmsReceiveClear.currentClearUseAmount')}}
                </span>
                <span class="currency-value-des" v-for="(item, index) in transactionsAmounts" :key="index">
                  <span style="margin-right: 10px">{{item.currency}} {{item.value | numberToThousands}}</span>
                </span>
              </div>
              <div class="section-content">
                <el-table :data="instructionAccounts" style="width: 100%" border>
                  <el-table-column prop="instructionTransactionTypeName" :label="$t('fmsReceiveClear.type')" min-width="80"></el-table-column>
                  <el-table-column prop="accountCodeName" :label="$t('fmsReceiveClear.businessTypeName')" min-width="120"></el-table-column>
                  <el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')" min-width="150" show-overflow-tooltip>
                    <template>
                      <span>{{totalData.settlementCompanyName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="settlementOfficeName" :label="$t('fmsReceiveClear.settlementOfficeName')" min-width="150" show-overflow-tooltip>
                    <template>
                      <span>{{totalData.settlementOfficeName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="useAmount" :label="$t('fmsReceiveClear.useAmount')" width="150" align="right" >
                    <template slot-scope="{row}">
                      <span>{{row.useAmount | numberToThousands}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="section offset-container" v-if="claimList.length || instructionAccounts.length">
              <div class="title">
                <div class="title-item">
                  <span class="title-item-des">
                    <svg-icon className="clear-module-icon" iconClass="icon-hexiaoxiangqing" />
                    <!--核销详情-->
                    {{$t('fmsReceiveClear.clearDetail')}}
                    <span v-if="totalData.exchangeCurrency" class='YI ml-10'>
                      <!--异-->
                      {{$t('fmsReceiveClear.DIFF')}}
                    </span>
                  </span>
                  <span class="title-item-des" v-if="false">
                    <!--剩余原币未销合计-->
                    {{$t('fmsReceiveClear.remainSourceUnClearTotal')}}：
                  </span>
                  <span v-for="(item, index) in remainAmounts" :key="index">
                    <span>{{item.currency}}</span>
                    <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                  </span>
                </div>
              </div>
              <div class="section-content" v-if="isDifferent">
                <div class="text-container">
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
                        <span class="currency">{{item.sourceCurrency}}</span>
                        <span class="value">{{item.sourceValue | numberToThousands}}</span>
                        <span class="symbol">x</span>
                        <span class="input">{{item.exchangeRate}}</span>
                      </el-col>
                      <el-col :span="4" class="calc-total">
                        <div>
                          <span class="symbol">=</span>
                          <span class="total-transfer">{{item.targetValue | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="amount-container">
                    <el-row class="amount-row">
                      <el-col :span="4">
                        <div>
                          <span>
                            <!--本次收款核销金额-->
                            {{$t('fmsReceiveClear.currentTransactionsClearAmount')}}
                          </span>
                        </div>
                      </el-col>
                      <el-col :span="16" class="currency-value">
                        <span class="currency">{{totalData.instructionCurrency}}</span>
                        <span class="value">{{receiptTransactionTotal | numberToThousands}}</span>
                        <span class="symbol">&nbsp;</span>
                        <span class="input" style="visibility: hidden;">&nbsp;</span>
                      </el-col>
                      <el-col :span="4" class="calc-total">
                        <div>
                          <span class="symbol">=</span>
                          <span class="total-transfer">{{receiptTransactionTotal | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <el-row class="remain-row remain-border">
                    <el-col :span="6">
                      <div>
                        <!--剩余金额-->
                        {{$t('fmsReceiveClear.remainCalcAmount')}}
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
                        <span class="total-transfer">{{totalData.diffCalcTotal | numberToThousands}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>

              <!--只有同一个币种的展示-->
              <div class="section-content same-curreny-result-container" v-if="!isDifferent">
                <el-row class="amount-row">
                  <el-col :span="6">
                    <!--本次原币核销金额-->
                    {{$t('fmsReceiveClear.currentSourceUnClearAmount')}}
                  </el-col>
                  <el-col :span="18">
                    <div class="currency-value">
                      <span class="currency">{{totalData.instructionCurrency}}</span>
                      <span class="value">{{receiptSourceAmountsTotal | numberToThousands}} </span>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="amount-row">
                  <el-col :span="6">
                    <!--本次收款核销金额-->
                    {{$t('fmsReceiveClear.currentTransactionsClearAmount')}}
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
                      <span class="value">{{totalData.diffCalcTotal | numberToThousands}}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="section remark-container">
              <div class="title">
                <span class="title-item-des">
                  <svg-icon className="clear-module-icon" iconClass="icon-zhuyishixiang" />
                    <!--其他-->
                    {{$t('fmsReceiveClear.other')}}
                </span>
              </div>
              <div class="section-content description-container">
                <div class="description-item"><span>{{$t('fmsReceiveClear.submitByName')}}</span><label>{{totalData.submitByName}}</label></div>
                <div class="description-item"><span>{{$t('fmsReceiveClear.submitDate')}}</span><label>{{totalData.submitDate | parseTime}}</label></div>
                <div class="description-item full"><span>{{$t('fmsReceiveClear.submitRemark')}}</span><label>{{totalData.remark}}</label></div>
                <div class="description-item full"><span>{{$t('fmsReceiveClear.submitClearReason')}}</span>
                  <label>
                    {{totalData.clearDiffReason}}
                    {{totalData.clearDiffRemark ? ('：'+ totalData.clearDiffRemark) : ''}}
                  </label>
                </div>
                <div class="description-item" v-if="totalData.clearNo"><span>{{$t('fmsReceiveClear.clearByName')}}</span><label>{{totalData.clearByName}}</label></div>
                <div class="description-item" v-if="totalData.clearNo"><span>{{$t('fmsReceiveClear.clearDate')}}</span><label>{{totalData.clearDate | parseTime}}</label></div>
                <div class="description-item full" v-if="totalData.clearNo"><span>{{$t('fmsReceiveClear.clearReason')}}</span>
                  <label>
                    {{totalData.clearClearDiffReason}}
                    {{totalData.clearClearDiffRemark ? ('：'+ totalData.clearClearDiffRemark) : ''}}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="totalData.clearNo ? $t('fmsReceiveClear.applyClearDetail') : $t('fmsReceiveClear.clearDetail')" name="second" lazy>
          <clear-charge-detail :id="id" :totalData="totalData" type="AR"/>
        </el-tab-pane>
      </el-tabs>

			<clear-reason-modal ref="clearReasonModalRef" @ok="submitConfirmFn" />
		</div>

		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'DETAIL'">{{$t('common.close')}}</el-button>
			<el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'CLEAR'">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" :loading="rejectApplyLoading" @click="rejectApplyFn()" v-if="operation === 'CLEAR' && !totalData.clearNo">{{$t('fmsReceiveClear.recallApply')}}</el-button>
			<el-button type="primary" size="mini" :loading="rejectLoading" @click="rejectFn()" v-if="operation === 'CLEAR' && totalData.clearNo">{{$t('fmsReceiveClear.recallClear')}}</el-button>
			<el-button type="primary" size="mini" :loading="clearLoading" @click="confirmFn()" v-if="operation === 'CLEAR'">{{$t('common.confirm')}}</el-button>
		</div>
	</div>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getReceiptClearDetailApi, receiptClearAuditApi, receiptClearCancelApi, receiptApplyClearCancelApi } from "@/api/financial/fmsReceiptClear";
import ClearReasonModal from "@/views/financial/components/ReceiptClearReasonModal";
import ClearChargeDetail from "./components/clearChargeDetail";
// 申请核销
export default {
	name: "FmsReceiptClearDetail",
	components: {
		ClearReasonModal,
    ClearChargeDetail
	},
	data() {
		return {
      activeName: 'first',
			id: "",
			operation: "",
			origin: "",
			clearLoading: false,
      rejectApplyLoading: false,
      rejectLoading: false,
			formData: {},
			isDifferent: false,
			receiptSourceAmountsTotal: 0, // 本次应收的值。单币种的时候使用
			receiptTransactionTotal: 0, // 本次收款核销合计
			remainAmounts: [], // 剩余原币未销合计
			isRelative: 1, // 是否关联收款

			claimList: [],
      instructionAccounts: [],
			transactionsAmounts: [],
			totalData: {
				diffCalcTotal: 0, // 剩余应收合计
				instructionTransactionType: "",
				businessType: "",
				settlementOfficeId: "",
				settlementCompanyId: "",
				arAp: "1",
				remark: "",
				instructionCurrency: "",
				sourceAmounts: [], // 编辑之后的合计

        // 传递给费用明细用的
        clearingInfo: {
          settlementSource: "",
          settlementSourceName: "",
          charges: [],
          bills: [],
          invoices: [],
          unInstructionAmounts: [] // 原有的合计
        }
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
		this.id = this.$route.query.id;
		this.origin = this.$route.query.origin;
		this.operation = this.$route.query.operation;
		this.init();
	},
	methods: {
		init() {
			getReceiptClearDetailApi(this.id).then(res => {
				if (res.ok) {
					this.totalData = {
						...this.totalData,
						...res.content
					};
          res.content.claims.forEach(v => {
            v.instructionTransactionType = res.content.instructionTransactionTypeName
            v.instructionTransactionTypeName = res.content.instructionTransactionTypeName
          })
          res.content.instructionAccounts.forEach(v => {
            v.instructionTransactionType = res.content.instructionTransactionTypeName
            v.instructionTransactionTypeName = res.content.instructionTransactionTypeName
          })
					this.claimList = res.content.claims;
          this.instructionAccounts = res.content.instructionAccounts
					this.totalData.sourceAmounts = res.content.chargeTotalAmounts;
					this.totalData.instructionCurrency = res.content.instructionCurrency;
					let unInstructionAmounts = res.content.clearSourceInfo.chargeTotalAmounts;
					this.clearingInfo = {
						...res.content.clearSourceInfo,
						unInstructionAmounts: unInstructionAmounts
					};

          this.isDifferent = false
          unInstructionAmounts.forEach(v => {
            if(v.curreny !== this.totalData.instructionCurrency) {
              this.isDifferent = true;
            }
          })

					let receiptTransactionTotal = 0;
          let arr = []
          if (this.claimList.length) {
            arr = this.claimList
          } else if (this.instructionAccounts.length) {
            arr = this.instructionAccounts
          }
					arr.forEach(v => {
						receiptTransactionTotal += Number(v.useAmount || 0);
					});
					let receiptSourceAmountsTotal = 0;
					this.totalData.sourceAmounts.forEach(v => {
						receiptSourceAmountsTotal += Number(v.targetValue || 0);
					});
					// 计算
					this.totalData.diffCalcTotal = Number(receiptSourceAmountsTotal - receiptTransactionTotal).toFixed(2); // 剩余应收合计
					this.receiptSourceAmountsTotal = receiptSourceAmountsTotal; // 本次应收的值。单币种的时候使用
					this.receiptTransactionTotal = receiptTransactionTotal; // 本次收款核销合计

					this.transactionsAmounts = [
						{
							currency: res.content.instructionCurrency,
							value: receiptTransactionTotal
						}
					];
				}
			});
		},
		submitConfirmFn(reason) {
			let data = {
				instructionId: this.id
			};
			// 如果是弹窗选原因
			if (reason) {
				data.clearDiffRemark = reason.remark;
				if (Number(this.totalData.diffCalcTotal) > 0) {
					data.clearUnderReason = reason.reason;
				} else {
					data.clearOverReason = reason.reason;
				}
			}
			this.clearLoading = true;
			receiptClearAuditApi(data).then(res => {
        if (res.ok) {
          this.backList();
          this.$message.success(this.$t('fmsReceiveClear.clearSuccess'));
        }
        this.clearLoading = false;
      }).catch(() => {
        this.clearLoading = false;
      });
		},
		confirmFn() {
			if (this.totalData.instructionTransactionType === 5) {
				// 完全平账
				this.submitConfirmFn();
			} else if (this.totalData.instructionTransactionType === 6) {
				// 余额平账
				this.$refs.clearReasonModalRef.show(true);
			} else if (this.totalData.instructionTransactionType === 1 || this.totalData.instructionTransactionType === 2) {
				// 关联收款
				if (Number(this.totalData.diffCalcTotal) !== 0) {
					let flag = Number(this.totalData.diffCalcTotal) > 0;
					this.$refs.clearReasonModalRef.show(flag);
				} else {
					this.submitConfirmFn();
				}
			}
		},
		rejectApplyFn() {
			this.$confirm(this.$t('fmsReceiveClear.recallApplyInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.rejectApplyLoading = true
					receiptApplyClearCancelApi({ instructionId: this.id }).then(res => {
						if (res.ok) {
							this.backList();
							this.$message.success(this.$t('fmsReceiveClear.recallApplySuccess'));
						}
            this.rejectApplyLoading = false
					});
				})
				.catch(() => {});
		},
		rejectFn() {
			this.$confirm(this.$t('fmsReceiveClear.recallClearInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.rejectLoading = true
					receiptClearCancelApi({ instructionId: this.id }).then(res => {
						if (res.ok) {
							this.backList();
							this.$message.success(this.$t('fmsReceiveClear.recallClearSuccess'));
						}
            this.rejectLoading = false
					});
				})
				.catch(() => {});
		},
		backList() {
			if (this.origin) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.origin });
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../styles/clear.scss";
.page-edit-container .page-edit-content {
	padding: 0;
}
.clear-detail-container {
	padding: 20px;
}
.clear-title {
	font-size: 15px;
	font-weight: 600;
	height: 50px;
	line-height: 50px;
	background: #fff;
	position: relative;

	.clear-img {
		position: absolute;
		right: 100px;
		top: 0px;
		font-size: 110px;
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

.description-container {
	overflow: hidden;
	.description-item {
		line-height: 35px;
		width: 50%;
		float: left;
		span {
			display: inline-block;
			margin-right: 10px;
			width: 90px;
			text-align: right;
			color: #777;
		}
		label {
			font-weight: 500;
		}
	}
	.description-item.full {
		width: 100%;
	}
}

.no-transactions {
	float: right;
	padding-right: 20px;
	color: red;
}

.YI {
  color: #fff;
  background: #1890ff;
  display: inline-block;
  border-radius: 2px;
  height: 22px;
  line-height: 22px;
  width: 22px;
  text-align: center;
  font-size: 12px;
}

::v-deep .el-tabs__header{
  background: #fff;
  padding-left: 20px;
  line-height: 50px;
}
</style>
