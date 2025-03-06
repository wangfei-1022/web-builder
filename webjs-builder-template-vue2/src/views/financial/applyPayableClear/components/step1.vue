<template>
	<div>
		<div class="section origin-container">
			<div class="title">
				<span class="title-item-des">
					<svg-icon className="clear-module-icon" iconClass="icon-weixiaozhangdan" v-if="arClearingInfo.bills.length > 0" />
					<svg-icon className="clear-module-icon" iconClass="icon-fapiaoguanli" v-else-if="arClearingInfo.invoices.length > 0" />
					<svg-icon className="clear-module-icon" iconClass="icon-weixiaofeiyong" v-else />
					<!--应收未销合计-->
          {{$t('fmsReceiveClear.receiptClearAll')}}

					<span v-if="arClearingInfo.invoices.length === 0 && arClearingInfo.bills.length === 0">
						<span style="margin-left: 20px">{{businessTypeNames.join('、')}}</span>
						<span style="margin-left: 20px">{{settlementCompanyName}}</span>
					</span>
				</span>
				<div class="currency-value-des">
					<span v-for="(item, index) in arClearingInfo.unInstructionAmounts" :key="index">
						<span class="currency-value-item">{{item.currency}} {{item.value | numberToThousands}}</span>
					</span>
				</div>
			</div>
			<div class="section-content" v-if="arClearingInfo.invoices.length || arClearingInfo.bills.length">
				<el-table :data="arClearingInfo.invoices" v-if="arClearingInfo.invoices.length" style="width: 100%" border>
					<el-table-column prop="invoiceNo" :label="$t('fmsReceiveClear.invoiceNo')"></el-table-column>
					<el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')"></el-table-column>
					<el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')"></el-table-column>
					<el-table-column prop="sourceAmounts" :label="$t('fmsReceiveClear.currencyAmount')" align="right">
						<template slot-scope="{row}">
							<span v-for="(item, index) in row.sourceAmounts" :key="index">
								<span>{{item.currency}}</span>
								<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="unInstructionAmounts" :label="$t('fmsReceiveClear.unInstructionAmounts')" align="right">
						<template slot-scope="{row}">
							<span v-for="(item, index) in row.unInstructionAmounts" :key="index">
								<span>{{item.currency}}</span>
								<span style="margin-right:10px">{{item.value | numberToThousands}}</span>
							</span>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="arClearingInfo.bills" v-if="arClearingInfo.bills.length" style="width: 100%" border>
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

		<div class="section">
			<div class="section-content" style="padding-top: 0;">
				<el-tabs v-model="activePayableName">
					<el-tab-pane :label="$t('fmsReceiveClear.payableBill')" name="BILL">
						<div>
							<el-table :data="allPayableBills" style="width: 100%" border @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column prop="billNo" :label="$t('fmsReceiveClear.billNo')"></el-table-column>
								<el-table-column prop="businessTypeName" :label="$t('fmsReceiveClear.businessTypeName')"></el-table-column>
								<el-table-column prop="settlementCompanyName" :label="$t('fmsReceiveClear.settlementCompanyName')" width="220"></el-table-column>
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
							<div class="page-total">
								<span>{{$t('fmsReceiveClear.payableClearAll')}}：</span>
								<span>
									<span class="value-item" v-for="(item, index) in unClearPayableAmountTotal" :key='index'>
										<span class='value'>{{item.currency}}</span>
										<span>{{item.value | numberToThousands}}</span>
									</span>
								</span>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script>
import { getBillClearingApi, getChargeClearingApi, getPayableBillUninstructionApi, getInvoiceClearingApi, getConfirmationClearingApi } from "@/api/financial/fmsReceiptClear";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "Step1",
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
			unClearPayableAmountTotal: [], // 应付未销合计
			activePayableName: "BILL",

			allPayableBills: [], // 所有的应付账单
			multipleSelection: [],

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
			settlementOfficeId: "",
			settlementOfficeName: "",
			settlementCompanyId: "",
			settlementCompanyName: "",
			businessTypeNames: [],
			businessTypes: []
		};
	},
	created() {
		this.ids = this.config.ids;
		this.origin = this.config.origin;
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
					this.arClearingInfo.settlementSource = res.content.settlementSource;
					this.arClearingInfo.unInstructionAmounts = res.content.unInstructionAmounts;

					if (this.origin === "BILL") {
						this.arClearingInfo.bills = res.content.bills;
						this.settlementOfficeId = res.content.bills[0].settlementOfficeId;
						this.settlementOfficeName = res.content.bills[0].settlementOfficeName;
						this.settlementCompanyId = res.content.bills[0].settlementCompanyId;
						this.settlementCompanyName = res.content.bills[0].settlementCompanyName;

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
						this.businessTypes = arr;
					} else if (this.origin === "INVOICE") {
						this.arClearingInfo.invoices = res.content.invoices;
						this.settlementOfficeId = res.content.invoices[0].settlementOfficeId;
						this.settlementOfficeName = res.content.invoices[0].settlementOfficeName;
						this.settlementCompanyId = res.content.invoices[0].settlementCompanyId;
						this.settlementCompanyName = res.content.invoices[0].settlementCompanyName;

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
						this.businessTypes = arr;
					} else if (this.origin === "CHARGE" || this.origin === "CONFIRMATION") {
						this.arClearingInfo.charges = res.content.charges;

						this.settlementOfficeId = res.content.settlementOfficeId;
						this.settlementOfficeName = res.content.settlementOfficeName;
						this.settlementCompanyId = res.content.settlementCompanyId;
						this.settlementCompanyName = res.content.settlementCompanyName;
						this.businessTypeNames = res.content.businessTypeNames;

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
						this.businessTypes = arr;
					}

					this.getPayableBillListFn(this.settlementCompanyId);
				}
			});
		},
		// 查询应付账单
		getPayableBillListFn(settlementCompanyId) {
			let data = {
				settlementCompanyId: settlementCompanyId
			};
			this.config.getPayableBillUninstructionApi(data).then(res => {
				if (res.ok) {
					res.content.forEach(v => {});
					this.allPayableBills = res.content;
				}
			});
		},
		// 选中
		handleSelectionChange(val) {
			this.multipleSelection = val;
			let map = {};
			val.forEach(v => {
				v.currencyAmounts.forEach(item => {
					if (map[item.currency]) {
						map[item.currency] = (Number(item.value || 0) + Number(map[item.currency])).toFixed(2);
					} else {
						map[item.currency] = item.value;
					}
				});
			});
			let arr = [];
			Object.keys(map).forEach(v => {
				arr.push({
					currency: v,
					value: map[v]
				});
			});
			this.unClearPayableAmountTotal = arr;
		},
		validate() {
			let ids = [];
			this.multipleSelection.forEach(v => {
				ids.push(v.id);
			});
			if (ids.length === 0) {
        // 请先选择一个应付账单！
				this.$message.error(this.$t('fmsReceiveClear.pleaseSelectReceiptBill'));
				return false;
			}
			return true;
		},
		async getValue() {
			let ids = [];
			this.multipleSelection.forEach(v => {
				ids.push(v.id);
			});
			let data = {
				settlementOfficeId: this.settlementOfficeId,
				settlementOfficeName: this.settlementOfficeName,
				settlementCompanyId: this.settlementCompanyId,
				settlementCompanyName: this.settlementCompanyName,
				businessTypes: this.businessTypes,

				arClearingInfo: this.arClearingInfo,
				apClearingInfo: {
					settlementSource: "",
					charges: [],
					bills: [],
					invoices: [],
					unInstructionAmounts: []
				}
			};
			// 获取应付账单对应的数据
			let res = await this.config.getBillClearingApi(ids);
			if (res.ok) {
				// 获取应付对应的值
				data.apClearingInfo.bills = res.content.bills;
				data.apClearingInfo.settlementSource = res.content.settlementSource;
				data.apClearingInfo.unInstructionAmounts = res.content.unInstructionAmounts;
			}
			return data;
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../styles/clear.scss";
</style>
