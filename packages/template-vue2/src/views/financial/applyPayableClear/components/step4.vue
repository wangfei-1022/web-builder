<template>
	<div class="">
		<div class="section origin-container">
			<div class="title">
				<span class="title-item-des">
					<svg-icon className="clear-module-icon" iconClass="icon-yingshouchongyingfu" />
          <!--收付对冲详情-->
					{{$t('fmsReceiveClear.arapOffsetDetail')}}
				</span>
			</div>
		</div>
		<div class="section origin-container">
			<div class="title">
				<span class="title-item-des">
					<svg-icon className="clear-module-icon" iconClass="icon-yingshouweixiao" />
          <!--应收未销合计-->
					{{$t('fmsReceiveClear.receiptClearAll')}}
				</span>
				<div class="currency-value-des">
					<span v-for="(item, index) in totalDataObject.arClearingInfo.unInstructionAmounts" :key="index">
						<span class="currency-value-item">{{item.currency}} {{item.value | numberToThousands}}</span>
					</span>
				</div>
			</div>
			<div class="section-content" v-if="totalDataObject.arClearingInfo.bills.length || totalDataObject.arClearingInfo.invoices.length">
				<el-table :data="totalDataObject.arClearingInfo.invoices" v-if="totalDataObject.arClearingInfo.invoices.length" style="width: 100%" border>
					<el-table-column prop="invoiceNo" :label="$t('fmsReceiveClear.invoiceNo')"></el-table-column>
					<el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')"></el-table-column>
					<el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')"></el-table-column>
					<el-table-column prop="sourceAmountsStr" :label="$t('fmsReceiveClear.currencyAmount')" align="right">
						<template slot-scope="{row}">
							<span v-for="(item, index) in row.sourceAmounts" :key="index">
								<span>{{item.currency}}</span>
								<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="unInstructionAmountsStr" :label="$t('fmsReceiveClear.unInstructionAmounts')" align="right">
						<template slot-scope="{row}">
							<span v-for="(item, index) in row.unInstructionAmounts" :key="index">
								<span>{{item.currency}}</span>
								<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
							</span>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="totalDataObject.arClearingInfo.bills" v-if="totalDataObject.arClearingInfo.bills.length" style="width: 100%" border>
					<el-table-column prop="billNo" :label="$t('fmsReceiveClear.billNo')"></el-table-column>
					<el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')"></el-table-column>
					<el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')"></el-table-column>
					<el-table-column prop="currencyAmountsStr" :label="$t('fmsReceiveClear.currencyAmount')">
						<template slot-scope="{row}">
							<span v-for="(item, index) in row.currencyAmounts" :key="index">
								<span>{{item.currency}}</span>
								<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="unInstructionAmountsStr" :label="$t('fmsReceiveClear.unInstructionAmounts')">
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

		<div class="section origin-container">
			<div class="title">
				<span class="title-item-des">
					<svg-icon className="clear-module-icon" iconClass="icon-yingfuweixiao" />
          <!--应付未销合计-->
					{{$t('fmsReceiveClear.payableClearAll')}}
				</span>
				<div class="currency-value-des">
					<span v-for="(item, index) in totalDataObject.apClearingInfo.unInstructionAmounts" :key="index">
						<span class="currency-value-item">{{item.currency}} {{item.value | numberToThousands}}</span>
					</span>
				</div>
			</div>
			<div class="section-content">
				<el-table :data="totalDataObject.apClearingInfo.bills" style="width: 100%" border>
					<el-table-column prop="billNo" :label="$t('fmsReceiveClear.billNo')"></el-table-column>
					<el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')"></el-table-column>
					<el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')"></el-table-column>
					<el-table-column prop="currencyAmountsStr" :label="$t('fmsReceiveClear.currencyAmount')">
						<template slot-scope="{row}">
							<span v-for="(item, index) in row.currencyAmounts" :key="index">
								<span>{{item.currency}}</span>
								<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="unInstructionAmountsStr" :label="$t('fmsReceiveClear.unInstructionAmounts')">
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

		<div class="section offset-container">
			<div class="title">
				<div class="title-item">
					<span class="title-item-des">
						<svg-icon className="clear-module-icon" iconClass="icon-yingshouchongyingfu" />
            <!--对冲详情-->
            {{$t('fmsReceiveClear.offsetDetail')}}
					</span>
				</div>
			</div>
			<div class="section-content ">
				<div class="same-curreny" v-if="totalDataObject.sameOffsetAmounts.length">
					<div class="name link">
            <!--同币对冲-->
            {{$t('fmsReceiveClear.sameCurrencyOffset')}}
          </div>
					<div class="currency-value">
						<span v-for="(item, index) in totalDataObject.sameOffsetAmounts" :key="index">
							<span style="margin-left: 10px">{{item.currency}} {{item.value | numberToThousands}}</span>
						</span>
					</div>
				</div>
				<div class="text-container diff-curreny" v-if="totalDataObject.arOffsetAmounts.length > 0 || totalDataObject.apOffsetAmounts.length > 0">
					<div class="name link" style="margin-bottom: 20px">
            <!--异币对冲-->
            {{$t('fmsReceiveClear.differentCurrencyOffset')}}
          </div>
					<div v-if="totalDataObject.arOffsetAmounts.length > 0" class="amount-container">
						<el-row v-for="(item, index) in totalDataObject.arOffsetAmounts" :key="index + 'AR'" class="amount-row">
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
								<span class="currency">{{item.currency}}</span>
								<span class="value">{{item.value | numberToThousands}}</span>
								<span class="symbol">x</span>
								<span class="input">
									<el-input v-model="item.exchangeRate" size="mini" disabled style="width:100px" />
								</span>
							</el-col>
							<el-col :span="4" class="calc-total">
								<div>
									<span class="symbol">=</span>
									<span class="total-transfer">{{item.calcTransferTotal | numberToThousands}}</span>
								</div>
							</el-col>
						</el-row>
						<el-row class="amount-row amount-total">
							<el-col :span="20" class="total-currency">
								<div class="link">
									<span>
                    <!--应收合计-->
                    {{$t('fmsReceiveClear.AR_TOTAL')}}
                  </span>
									<span>{{totalDataObject.diffOffsetCurrency}}</span>
								</div>
							</el-col>
							<el-col :span="4" class="calc-total">
								<div>
									<span class="symbol">=</span>
									<span class="total-transfer">{{totalDataObject.calcArOffsetAmountsTotal | numberToThousands}}</span>
								</div>
							</el-col>
						</el-row>
					</div>

					<div v-if="totalDataObject.apOffsetAmounts.length > 0" class="amount-container">
						<el-row v-for="(item, index) in totalDataObject.apOffsetAmounts" :key="index + 'AP'" class="amount-row">
							<el-col :span="4">
								<div>
									<span v-if="index === 0">
                    <!--应付-->
                    {{$t('fmsReceiveClear.AP')}}
                  </span>
									<span v-else>&nbsp;&nbsp;</span>
								</div>
							</el-col>
							<el-col :span="16" class="currency-value">
								<span class="currency">{{item.currency}}</span>
								<span class="value">{{item.value | numberToThousands}}</span>
								<span class="symbol">x</span>
								<span class="input">
									<el-input v-model="item.exchangeRate" size="mini" disabled style="width:100px" />
								</span>
							</el-col>
							<el-col :span="4" class="calc-total">
								<div>
									<span class="symbol">=</span>
									<span class="total-transfer">{{item.calcTransferTotal | numberToThousands}}</span>
								</div>
							</el-col>
						</el-row>
						<el-row class="amount-row amount-total">
							<el-col :span="20" class="total-currency">
								<div class="link">
									<span>
                    <!--应付合计-->
                    {{$t('fmsReceiveClear.AP_TOTAL')}}
                  </span>
									<span>{{totalDataObject.diffOffsetCurrency}}</span>
								</div>
							</el-col>
							<el-col :span="4" class="calc-total">
								<div>
									<span class="symbol">=</span>
									<span class="total-transfer">{{totalDataObject.calcApOffsetAmountsTotal | numberToThousands}}</span>
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
								<span>{{totalDataObject.diffOffsetCurrency}}</span>
							</div>
						</el-col>
						<el-col :span="4" class="calc-total">
							<div>
								<span class="symbol"></span>
								<span class="total-transfer">{{totalDataObject.calcRemainOffsetAmountsTotal | numberToThousands}}</span>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>

		<div class="section transactions-container" v-if="totalDataObject.claimList.length > 0">
			<div class="title">
				<div class="title-item">
					<span class="title-item-des">
						<svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
            <!--收款信息-->
            {{$t('fmsReceiveClear.transactionsInfo')}}
					</span>
				</div>
			</div>
			<div class="section-content">
				<div class="claim-list">
					<el-row v-for="(item, index) in totalDataObject.claimList" :key="index">
						<el-col :span="8">
							<div class="claim-list-item">
								<label>{{$t('fmsReceiveClear.claimNo')}}</label>
								<span class="link">{{item.claimNo}}</span>
							</div>
						</el-col>
						<el-col :span="8">
							<div class="claim-list-item center">
								<label>{{$t('fmsReceiveClear.remainAmount')}}</label>
								<span>{{item.remainAmount | numberToThousands}}</span>
							</div>
						</el-col>
						<el-col :span="8">
							<div class="claim-list-item right">
								<label>{{$t('fmsReceiveClear.useAmount')}}</label>
								<span>{{item.useAmount | numberToThousands}}</span>
							</div>
						</el-col>
					</el-row>
				</div>

				<div class="remain-calc-container">
					<el-row class="amount-row">
						<el-col :span="6">
              <!--剩余应收-->
              {{$t('fmsReceiveClear.remainReceipt')}}
            </el-col>
						<el-col :span="18">
							<div class="currency-value">
								<span class="currency">{{totalDataObject.diffOffsetCurrency}}</span>
								<span class="value">{{totalDataObject.calcRemainOffsetAmountsTotal | numberToThousands}}</span>
							</div>
						</el-col>
					</el-row>
					<el-row class="amount-row">
						<el-col :span="6">
              <!--使用金额合计-->
              {{$t('fmsReceiveClear.useAmountTotal')}}
            </el-col>
						<el-col :span="18">
							<div class="currency-value">
								<span class="currency">{{totalDataObject.diffOffsetCurrency}}</span>
								<span class="value">{{totalDataObject.receiptTransactionsTotal | numberToThousands}}</span>
							</div>
						</el-col>
					</el-row>
					<el-row class="amount-row remain-calc-row">
						<el-col :span="6">
              <!--差额-->
              {{$t('fmsReceiveClear.diffAmount')}}
            </el-col>
						<el-col :span="18">
							<div class="currency-value">
								<span class="currency">{{totalDataObject.diffOffsetCurrency}}</span>
								<span class="value">{{totalDataObject.diffCalcTotal | numberToThousands}}</span>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>

		<div class="section origin-container">
			<div class="title">
				<div class="title-item">
					<span class="title-item-des">
						<svg-icon className="clear-module-icon" iconClass="icon-zhuyishixiang" />
            <!--申请备注-->
            {{$t('fmsReceiveClear.applyRemark')}}
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
	</div>
</template>

<script>
export default {
	name: "Step4",
	props: {
		totalData: {
			type: Object,
			default: function () {
				return {
					instructionTransactionType: "", // 实收付类型 1 款项 2 钱包 3 水单 4 待付 5 完全平账 6 余额平账
					settlementOfficeId: "",
					settlementCompanyId: "",
					remark: "",
					arClearingInfo: {
						settlementSource: "",
						charges: [],
						bills: [],
						invoices: [],
						unInstructionAmounts: []
					},
					apClearingInfo: {
						settlementSource: "",
						charges: [],
						bills: [],
						invoices: [],
						unInstructionAmounts: []
					},
					sameOffsetAmounts: [], // 同币种对冲金额
					arOffsetAmounts: [], // 异币种对冲应收金额
					apOffsetAmounts: [], // 异币种对冲应付金额
					diffOffsetCurrency: "", // 异币种对冲目标币种
					claimList: [], // 收款列表

					// 前端使用
					calcArOffsetAmountsTotal: "", // 异币种目标币种应收合计
					calcApOffsetAmountsTotal: "", // 异币种目标币种应付合计
					calcRemainOffsetAmountsTotal: "", // 填写完汇率计算之后的应收值(异币种对冲之后剩余的)
					diffCalcTotal: "", // 收款之后的剩余值计算(差额)
					receiptTransactionsTotal: "" // 收款的使用总和
				};
			}
		}
	},
	watch: {
		totalData: {
			handler(val) {
				this.totalDataObject = {
					...val
				};
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			totalDataObject: {},
			formData: {
				remark: ""
			}
		};
	},
	created() {},
	methods: {
		getValue() {
			return {
				remark: this.formData.remark
			};
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../styles/clear.scss";
</style>
