<template>
	<div>
    <!-- 查找收款 -->
		<el-dialog :visible.sync="visible" :close-on-click-modal="false" width="1000px" :title="$t('fmsReceiptTransactions.searchTrans')">
			<div class="container">
				<el-form ref="formDataFormRef" :inline="true" :model="formData" label-width="120px" size="mini">
					<el-form-item :label="$t('fmsReceiptTransactions.pay_type')" prop="payType">
						<el-select v-model="formData.payType" size="mini" @change="getList">
							<el-option :label="$t('common.ALL')" value="" />
							<el-option v-for="(item, index) in payTypeList" :key="index" :label="item.name" :value="item.code" />
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('fmsReceiptTransactions.payer_company')" prop="payerName">
						<!-- <el-input v-model="formData.payerName" type="text" size="mini" clearable @keyup.enter.native="getList" /> -->
						<type-autocomplete v-model="formData.payerName" type="member" size="mini" clearable @selected="payerNameSelected" />
					</el-form-item>
					<el-form-item :label="$t('fmsReceiptTransactions.claim_state')" prop="claimState" v-if="false">
						<el-select v-model="formData.claimState" size="mini" @change="getList">
							<el-option :label="$t('common.ALL')" value="" />
							<el-option v-for="item in claimStateList" :key="item.code" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('fmsReceiptTransactions.account_collect')" prop="accountCollectCategory">
						<el-select v-model="formData.accountCollectCategory" style="width: 100%" @change="getList">
							<el-option :label="$t('common.ALL')" value="" />
							<el-option v-for="item in bankList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('fmsReceiptTransactions.transactions_date')" prop="transactionsDatePeriod">
						<search-date-picker v-model="formData.transactionsDatePeriod" @change="getList" clearable></search-date-picker>
					</el-form-item>

					<el-button type="primary" size="mini" @click="getList()">{{$t('common.searchBtn')}}</el-button>
					<el-button type="primary" size="mini" @click="resetFn()">{{$t('common.resetBtn')}}</el-button>
				</el-form>

				<el-tabs v-model="activeName" type="border-card">
					<el-tab-pane :label="$t('fmsReceiptTransactions.my_claim') + '(' + multipleSelectionClaim.length +'/' + tableDataClaim.length + ')'" name="first">
						<el-table :data="tableDataClaim" style="width: 100%" height="400" size="mini" border @selection-change="handleSelectionChangeClaim">
							<el-table-column type="selection" width="55" fixed="left"></el-table-column>
							<el-table-column prop="claimNo" :label="$t('fmsReceiptTransactions.claim_no')" width="120"></el-table-column>
							<el-table-column prop="payTypeName" :label="$t('fmsReceiptTransactions.pay_type')" width="100"></el-table-column>
							<el-table-column prop="payerName" :label="$t('fmsReceiptTransactions.payer_company')" width="150" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="settlementOfficeName" :label="$t('fmsReceiptTransactions.settlement_office')" width="150" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="accountCollectName" :label="$t('fmsReceiptTransactions.account_collect')" width="120" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="transactionsAmountStr" :label="$t('fmsReceiptTransactions.transactionsAmountStr')" width="130" align="right">
								<template slot-scope="{row}">
									<div>
										<span>{{row.transactionsCurrency}}</span>
										<span>{{row.transactionsAmount | numberToThousands}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="claimAmount" :label="$t('fmsReceiptTransactions.claim_amount')" width="130" align="right">
								<template slot-scope="{row}">
									<div>
										<span>{{row.claimAmount | numberToThousands}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="transactionsDate" :label="$t('fmsReceiptTransactions.transactions_date')" width="150">
								<template slot-scope="{row}">
									<span>{{row.transactionsDate | parseTime}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="remark" :label="$t('fmsReceiptTransactions.transactions_remark')" width="180"></el-table-column>
							<el-table-column prop="recordByName" :label="$t('fmsReceiptTransactions.record_by')" width="100"></el-table-column>
							<el-table-column prop="recordDate" :label="$t('fmsReceiptTransactions.record_date')" width="160">
								<template slot-scope="{row}">
									<span>{{row.recordDate | parseTime}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="selfClaimStateName" :label="$t('fmsReceiptTransactions.claim_state')" width="100"></el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane :label="$t('fmsReceiptTransactions.un_claim') + '(' + multipleSelectionTransactions.length +'/' + tableDataTransactions.length + ')'" name="second">
						<el-table :data="tableDataTransactions" style="width: 100%" height="400" size="mini" border @selection-change="handleSelectionChangeTransactions">
							<el-table-column type="selection" width="55" fixed="left"></el-table-column>
							<el-table-column prop="transactionsNo" :label="$t('fmsReceiptTransactions.transactionsNo')" width="120"></el-table-column>
							<el-table-column prop="payTypeName" :label="$t('fmsReceiptTransactions.pay_type')" width="100"></el-table-column>
							<el-table-column prop="payerName" :label="$t('fmsReceiptTransactions.payer_company')" width="150" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="settlementOfficeName" :label="$t('fmsReceiptTransactions.settlement_office')" width="150" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="accountCollectName" :label="$t('fmsReceiptTransactions.account_collect')" width="120" :show-overflow-tooltip="true"></el-table-column>
							<el-table-column prop="transactionsAmountStr" :label="$t('fmsReceiptTransactions.transactionsAmountStr')" width="130" align="right">
								<template slot-scope="{row}">
									<div>
										<span>{{row.transactionsCurrency}}</span>
										<span>{{row.transactionsAmount | numberToThousands}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="unClaimTotalAmount" :label="$t('fmsReceiptTransactions.un_claimed_amount')" width="130" align="right">
								<template slot-scope="{row}">
									<div>
										<span>{{row.unClaimTotalAmount | numberToThousands}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="transactionsDate" :label="$t('fmsReceiptTransactions.transactions_date')" width="150">
								<template slot-scope="{row}">
									<span>{{row.transactionsDate | parseTime}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="remark" :label="$t('fmsReceiptTransactions.transactions_remark')" width="180"></el-table-column>
							<el-table-column prop="recordByName" :label="$t('fmsReceiptTransactions.record_by')" width="100"></el-table-column>
							<el-table-column prop="recordDate" :label="$t('fmsReceiptTransactions.record_date')" width="160">
								<template slot-scope="{row}">
									<span>{{row.recordDate | parseTime}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="selfClaimStateName" :label="$t('fmsReceiptTransactions.claim_state')" width="100"></el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>

			</div>

			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="visible = false">{{ $t("customerManage.cancel")}}</el-button>
				<el-button size="mini" type="primary" @click="confirmFn">{{ $t("customerManage.confirm") }}</el-button>
			</div>
		</el-dialog>

    <!--关联收款-->
		<el-dialog :visible.sync="editVisible" :close-on-click-modal="false" width="1000px" :title="$t('fmsReceiptTransactions.relativeTransactions')">
			<div style="max-height: 500px;overflow-y: auto;">
				<div class="list-container" v-if="alreadyClaimerList.length">
					<div class="title">
            <i class="m-icon el-icon-warning-outline" />
            <!--已认领收款-->
            {{$t('fmsReceiptTransactions.claimedTransactions')}}
            </div>
					<div class="select-has-list" v-if="alreadyClaimerList.length">
						<div class="select-has-item" v-for="(item,index) in alreadyClaimerList" :key="index">
							<div class="content-item"><label>{{$t('fmsReceiptTransactions.claim_no')}}</label><span>{{item.claimNo}}</span></div>
							<div class="content-item"><label>{{$t('fmsReceiptTransactions.transactions_amount')}}</label><span>{{item.transactionsAmount | numberToThousands}}</span></div>
							<div class="content-item"><label>{{$t('fmsReceiptTransactions.claim_amount')}}</label><span>{{item.claimAmount | numberToThousands}}</span></div>
							<div class="content-item"><label>{{$t('fmsReceiptTransactions.remain_amount')}}</label><span>{{item.remainAmount | numberToThousands}}</span></div>
						</div>
					</div>
					<div class="select-has-list" v-if="!alreadyClaimerList.length" style="line-height: 40px">
						{{$t('fmsReceiptTransactions.NONE')}}
					</div>
				</div>
				<div class="list-container">
					<div class="title">
            <i class="m-icon el-icon-warning-outline" />
            <!--未认领收款-->
            {{$t('fmsReceiptTransactions.unClaimedTransactions')}}
          </div>
					<div class="select-has-list" v-for="(item,index) in unClaimerList" :key="index">
						<div class="select-has-item">
							<div class="content-item"><label>{{$t('fmsReceiptTransactions.transactionsNo')}}</label><span>{{item.transactionsNo}}</span></div>
							<div class="content-item"><label>{{$t('fmsReceiptTransactions.transactionsAmountStr')}}</label><span>{{item.transactionsCurrency}}&nbsp;&nbsp;{{item.transactionsAmount | numberToThousands}}</span></div>
							<div class="content-item"><label>{{$t('fmsReceiptTransactions.un_claim_amount')}}</label><span>{{item.unClaimTotalAmount | numberToThousands}}</span></div>
						</div>
						<div class="">
							<claim-form
                :ref="'claimFormRef' + item.transactionsId"
                :businessTypeList="businessTypeList"
                :transactionsReceiptTypeList="transactionsReceiptTypeList"
                :businessTypes="detail.businessTypes"
                :transactionsItem="item"
                :settlementCompanyId="detail.settlementCompanyId"
              />
						</div>
					</div>
				</div>
			</div>

			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="editVisible = false">{{ $t("common.cancel")}}</el-button>
				<el-button size="mini" type="primary" @click="recordFn" :loading="editLoading">{{ $t("common.confirm") }}</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getRelativeTransactionReceiptListApi, transactionReceiptClaimApi, getTransactionReceiptClaimByIdsApi, getYHTReceiptCategoryAllApi } from "@/api/financial/fmsReceiptTransactions";
import { getDictDataApi } from "@/api/financial/fmsReceive";
import ClaimForm from "./claimForm";
import { getYHTListApi, getCurrenciesListApi, getBusinessTypeListApi } from "@/api/common";

// 申请核销
export default {
	name: "TransactionsReceiptModal",
	components: {
		ClaimForm
	},
	props: {
		detail: {
			type: Object,
			default: function () {
				return {};
			}
		},
		targetCurrency: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			activeName: "first",
			visible: false,
			tableDataClaim: [],
			multipleSelectionClaim: [],
			tableDataTransactions: [],
			multipleSelectionTransactions: [],

			pageSize: 50,
			pageNum: 1,
			total: 0,
			formData: {},
			bankList: [],
			YHTAccountList: [], // 分公司收款账户
			payTypeList: [], // 付款来源类型
			transactionsReceiptTypeList: [], // 收款类型
			claimStateList: [], // 认领状态
			businessTypeList: [],

			editVisible: false,
			editLoading: false,
			alreadyClaimerList: [], // 已经认领的列表
			unClaimerList: [] // 未认领的列表
		};
	},
	created() {
    this.init()
		this.getBasicData();
	},
	methods: {
		getBasicData() {
			Promise.all([getDictDataApi(22), getDictDataApi(23), getDictDataApi(28), getBusinessTypeListApi(), getYHTReceiptCategoryAllApi()]).then(results => {
				const payTypeRes = results[0];
				const transactionsReceiptTypeRes = results[1];
				const claimStateRes = results[2];
				const businessTypeRes = results[3];
				const bankListRes = results[4];
				if (payTypeRes.ok) {
					this.payTypeList = payTypeRes.content;
				}
				if (transactionsReceiptTypeRes.ok) {
					this.transactionsReceiptTypeList = transactionsReceiptTypeRes.content;
				}
				if (claimStateRes.ok) {
					this.claimStateList = claimStateRes.content;
				}
				if (businessTypeRes.ok) {
					this.businessTypeList = businessTypeRes.content;
				}
				if (bankListRes.ok) {
					let arr = [];
					bankListRes.content.forEach(office => {
						if (office.officeId === this.detail.settlementOfficeId) {
							office.categorys.forEach(account => {
								let categoryItem = {
									value: account.category,
									label: account.category
								};
								arr.push(categoryItem);
							});
						}
					});
					this.bankList = arr;
				}
			});
		},
		show() {
			this.visible = true;
      this.formData.payerName = this.detail.settlementCompanyName
			this.getList();
		},
		payerNameSelected(item) {
			this.formData.payerMemberId = item.id
      this.formData.payerMemberName = item.chineseName
      this.formData.payerMemberEnglishName = item.englishName
			if (item.id) {
				this.getList()
			}
		},
		getList() {
			if (this.detail.settlementOfficeId && this.detail.settlementCompanyId) {
				let data = {
					...this.formData,
					settlementOfficeId: this.detail.settlementOfficeId,
					settlementCompanyId: this.detail.settlementCompanyId
					// businessType: this.businessType
				};
				if (data.transactionsDatePeriod.length) {
					data.transactionsDateStart = this.formData.transactionsDatePeriod[0];
					data.transactionsDateEnd = this.formData.transactionsDatePeriod[1];
				}

				let claim = {
					...data,
					claimState: 2
				};
				if (claim.payerMemberId) {
				delete claim.payerName
			} else {
				delete claim.payerMemberId
			}
				getRelativeTransactionReceiptListApi(claim).then(res => {
					if (res.ok) {
						res.content.forEach(v => {
							v.useAmount = "";
						});
						this.tableDataClaim = res.content;
						this.multipleSelectionClaim = [];
					}
				});
				let transaction = {
					...data,
					claimState: 1
				};
				getRelativeTransactionReceiptListApi(transaction).then(res => {
					if (res.ok) {
						res.content.forEach(v => {
							v.useAmount = "";
						});
						this.tableDataTransactions = res.content;
						this.multipleSelectionTransactions = [];
					}
				});
			}
		},
		handleSelectionChangeClaim(val) {
			this.multipleSelectionClaim = val;
		},
		handleSelectionChangeTransactions(val) {
			this.multipleSelectionTransactions = val;
		},
		init() {
      this.formData = {
        payType: "",
				claimState: "",
				payerName: "",
				payerMemberId: "",
				payerMemberName: "",
				payerMemberEnglishName: "",
				transactionsDatePeriod: [],
				accountCollectCategory: ""
      }
    },
		resetFn() {
      this.init()
			this.getList();
		},

		// 批量提交认领
		recordFn() {
			let VALID = true;
			let arr = [];
			Object.keys(this.$refs).forEach(v => {
				if (v.indexOf("claimFormRef") >= 0) {
					if (this.$refs[v].length > 0) {
						let valid = this.$refs[v][0].validate();
						if (!valid) {
							VALID = false;
						} else {
							let item = this.$refs[v][0].getValue();
							arr.push(item);
						}
					}
				}
			});
			if (!VALID) {
				return;
			}
			this.editLoading = true;
			transactionReceiptClaimApi({ claims: arr })
				.then(res => {
					if (res.ok) {
						// 根据多个认领Id 去查对应的详情
						getTransactionReceiptClaimByIdsApi(res.content).then(list => {
							if (list) {
								let arr = this.alreadyClaimerList.concat(list.content);
								arr.forEach(v => {
									v.useAmount = "";
								});
								this.editVisible = false;
								this.visible = false;
								this.$emit("confirm", arr);
							}
						});
					}
					this.editLoading = false;
				})
				.catch(err => {
					console.log(err);
					this.editLoading = false;
				});
		},
		// 确认列表选中的认领
		confirmFn() {
			this.unClaimerList = []; // init

			let alreadyClaimerList = this.multipleSelectionClaim;
			let unClaimerList = this.multipleSelectionTransactions;
			if (alreadyClaimerList.length === 0 && unClaimerList.length === 0) {
				this.$message.error(this.$t("receiveFms.please_select_one_data"));
				return;
			}
			let VALID = true;
			let currency = [];
			let rows = alreadyClaimerList.concat(unClaimerList);
			rows.forEach(v => {
				if (currency.indexOf(v.transactionsCurrency) < 0) {
					currency.push(v.transactionsCurrency);
				}
				if (this.targetCurrency && this.targetCurrency !== v.transactionsCurrency) {
					VALID = false;
				}
			});
			if (currency.length > 1) {
        // 无法同时关联多币种收款
				this.$message.error(this.$t('fmsReceiveClear.transactionsClearCheck'));
				return;
			}
			if (!VALID) {
        // "关联币种与目标币种（" + this.targetCurrency + "）不一致!"
				this.$message.error(this.$t('fmsReceiveClear.transactionsCurrencyCheck', { targetCurrency: this.targetCurrency }));
				return;
			}
			if (unClaimerList.length > 0) {
				this.editVisible = true;
				this.$nextTick(() => {
					this.unClaimerList = unClaimerList;
					this.alreadyClaimerList = alreadyClaimerList;
				});
			} else {
				this.visible = false;
				this.$emit("confirm", rows);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../styles/clear.scss";
.container {
	::v-deep .el-table--border th {
		background: #f5f7fa;
	}
}

.list-container {
	margin-bottom: 20px;
	.title {
		font-size: 15px;
		font-weight: 600;
	}

	.select-has-list {
		margin-left: 20px;

		.select-has-item {
			overflow: hidden;
			margin-bottom: 15px;
			line-height: 40px;

			.content-item {
				float: left;
				width: 33%;

				label {
					margin-right: 10px;
				}
			}
		}
	}
}
</style>
