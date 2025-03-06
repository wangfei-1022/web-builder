<template>
	<div class="section">
		<div class="title">
			<span class="title-item-des">
        <i class="m-icon iconfont icon-shoukuan" />
        {{$t('fmsPayableClear.canUsePayment')}}
      </span>
			<span v-for="(item, index) in receiptAmounts" :key="index">
				<span style="margin-right: 10px">{{item.currency}} {{item.value | numberToThousands}}</span>
			</span>

			<el-radio-group v-model="transactionType" v-if="showSelectType" @change="transactionTypeChangeFn">
				<!--关联预付款-->
        <el-radio :label="4">{{$t('fmsPayableClear.PRE_PAYMENT')}}</el-radio>
			</el-radio-group>

			<el-button type="primary" size="mini" @click="reseachPayment" v-if="transactionType === 4" class="search-transaction">
        {{$t('fmsPayableClear.searchPayment')}}
      </el-button>
		</div>

    <!--余额-->
		<div class="section-content" v-if="transactionType === 2">
			<el-table :data="walletAccountUseList" style="width: 100%" border>
				<el-table-column prop="businessTypeName" :label="$t('fmsPayableClear.businessTypeName')" minWidth="200"></el-table-column>
				<el-table-column prop="settlementCompanyName" :label="$t('fmsPayableClear.settlementCompanyName')" minWidth="220" show-overflow-tooltip></el-table-column>
				<el-table-column prop="settlementOfficeName" :label="$t('fmsPayableClear.settlementOfficeName')" minWidth="220" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amountAvailable" :label="$t('fmsPayableClear.accountCurrencyAmount')" align="right" minWidth="150">
					<template slot-scope="{row}">
						<div>
							<span>{{row.currency}}</span>
							<span>{{row.amountAvailable | numberToThousands}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="useAmount" :label="$t('fmsPayableClear.useAmount')" minWidth="150" fixed="right">
					<template slot-scope="{row}">
						<el-input v-model="row.useAmount" type="text" size="mini" @blur="useAmountChange('AMOUNT_CHANGE')" oninput="value=value.toString().match(/^\d+(?:\.\d{0,2})?/)" />
					</template>
				</el-table-column>
				<el-table-column prop="operation" :label="$t('fmsPayableClear.operation')" minWidth="150" fixed="right">
					<template slot-scope="{row}">
						<el-button type="text" @click="removeWalletAccountFn(row)">{{$t('fmsPayableClear.remove')}}</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

    <el-dialog :visible.sync="walletAcountClearVisible" :close-on-click-modal="false" width="400px" :title="$t('fmsPayableClear.walletAcountClear')">
      <div>
        <!-- 请使用余额核销 -->
        <div>{{$t('fmsPayableClear.pleaseUseWalletAcountClear')}}</div>
        <el-radio-group v-model="walletAcountCurrency" class="radio-list">
          <el-radio :label="item.currency" v-for="(item, index) in walletAcountCurrencyList" :key="index" :disabled="item.amountAvailable <= 0">
            <img :src="'/static/' + item.currency + '.jpg'" :alt="item.code" class="currency-img"/>
             <!-- 可用余额  -->
            {{$t('fmsPayableClear.accountAmount')}}
            {{item.symbol}}{{item.amountAvailable | numberToThousands}}
          </el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="walletAcountClearVisible = false">{{ $t("common.cancel")}}</el-button>
        <el-button size="mini" type="primary" @click="walletAcountClearConfirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <!--关联收款-->
		<div class="section-content" v-if="transactionType === 4">
			<el-table :data="transactionsList" style="width: 100%" border>
				<el-table-column prop="transactionsNo" :label="$t('fmsPayablePayment.transactionsNo')" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="businessTypeNames" :label="$t('fmsPayableClear.businessTypeName')" minWidth="200" :show-overflow-tooltip="true">
					<template slot-scope="{row}">
						<span>{{row.businessTypeNames.join('、')}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="settlementCompanyName" :label="$t('fmsPayableClear.settlementCompanyName')" minWidth="220" show-overflow-tooltip></el-table-column>
				<el-table-column prop="settlementOfficeName" :label="$t('fmsPayableClear.settlementOfficeName')" minWidth="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" :label="$t('fmsPayablePayment.paymentCurrencyAmount')" min-width="180">
          <template slot-scope="{row}">
            <span>{{row.transactionsCurrency}}{{row.transactionsAmount | numberToThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remainAmount" :label="$t('fmsPayablePayment.unTransactionsAmount')" min-width="110" >
          <template slot-scope="{row}">
            <span>{{row.remainAmount | numberToThousands}}</span>
          </template>
        </el-table-column>
				<el-table-column prop="useAmount" :label="$t('fmsPayableClear.useAmount')" minWidth="150" fixed="right">
					<template slot-scope="{row}">
						<el-input v-model="row.useAmount" type="text" size="mini" @blur="useAmountChange('AMOUNT_CHANGE')" oninput="value=value.toString().match(/^\d+(?:\.\d{0,2})?/)" />
					</template>
				</el-table-column>
				<el-table-column prop="operation" :label="$t('fmsPayableClear.operation')" minWidth="150" fixed="right">
					<template slot-scope="{row}">
						<el-button type="text" @click="removeClaimFn(row)">{{$t('fmsPayableClear.remove')}}</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<payable-payment-modal
      ref="payablePaymentModalRef"
      @confirm='selectReceiptFn'
      :detail="detail"
      :targetCurrency="targetCurrency"
      :sourceClearAmounts="sourceClearAmounts"
    />
	</div>
</template>

<script>
import PayablePaymentModal from "./PayablePaymentModal";
import { getMemberWalletAccountListClearApi } from "@/api/financial/fmsReceiptClear";
import { currencyAymbol } from "@/utils/constant";

export default {
	name: "RelativeTransaction",
	components: {
		PayablePaymentModal
	},
	props: {
    detail: {
      type: Object,
			default: function () {
				return {
          businessTypes: []
        };
			}
    },
		targetCurrency: {
			type: String,
			default: ""
		},
		showSelectType: {
			type: Boolean,
			default: true
		},
		// 源币种所有未核销的金额 、 用于判断是否进行使用金额的初始化
		sourceClearAmounts: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	data() {
		return {
			modleValue: "",
			transactionType: 4,
			transactionsList: [],
      walletAccountUseList: [],
			receiptAmounts: [],

      walletAcountCurrency: '',
      walletAcountCurrencyList: [],
      walletAcountClearVisible: false
		};
	},
	created() {},
	methods: {
		transactionTypeChangeFn() {
			this.$emit("transactionTypeChange", this.transactionType);
			this.transactionsList = [];
      this.walletAcountCurrencyList = [];
      this.useAmountChange('TYPE_CHANGE');
		},
		// 查找收款
		reseachPayment() {
			this.$refs.payablePaymentModalRef.show();
		},
    // 查找余额
    reseachWalletReceipt() {
      this.walletAcountClearVisible = true
      let data = {
        memberId: this.detail.settlementCompanyId,
        accountCode: this.detail.businessTypes[0].businessType
      }
      getMemberWalletAccountListClearApi(data).then(res => {
        if (res.ok) {
          res.content.forEach(v => {
            v.symbol = currencyAymbol[v.currency]
          })
          this.walletAcountCurrencyList = res.content
        }
      })
    },
		selectReceiptFn(rows) {
			let shareAmountMap = {};
			if (rows.length > 0) {
        // 找到目标币种可以分配的金额
        this.sourceClearAmounts.forEach(v => {
          shareAmountMap[v.currency] = v.value
        })
			}
			// 去除掉 已经选中 不能重复选中
			let arr = [];
			rows.forEach(v => {
				let index = this.transactionsList.findIndex(item => item.id === v.id);
				if (index < 0) {
					arr.push(v);
				}
			});
			this.transactionsList = this.transactionsList.concat(arr);

			// 进行金额的分配
			this.transactionsList.forEach(v => {
        let shareAmount = shareAmountMap[v.transactionsCurrency]
        if (!v.useAmount && shareAmount > 0) {
          v.useAmount = Number(shareAmount) > Number(v.remainAmount || 0) ? v.remainAmount : shareAmount;
          shareAmount = (Number(shareAmount) - Number(v.useAmount || 0)).toFixed(2);
          shareAmountMap[v.currency] = shareAmount
        }
      });
			this.useAmountChange('SELECTED');
		},
		useAmountChange(type) {
      // 关联预付款
			if (this.transactionType === 4) {
        let map = {};
        let VALID = true;
        this.transactionsList.forEach(v => {
          let useAmount = Number(v.useAmount || 0);
          let remainAmount = Number(v.remainAmount || 0);
          if (useAmount > remainAmount) {
            VALID = false;
          }
          if (map[v.transactionsCurrency]) {
            map[v.transactionsCurrency] = useAmount + Number(map[v.transactionsCurrency]);
          } else {
            map[v.transactionsCurrency] = useAmount;
          }
        });
        if (!VALID) {
          // 使用金额不能大于未关联金额
          this.$message.error(this.$t('fmsPayableClear.checkUseAmount'));
        }
        let arr = [];
        Object.keys(map).forEach(v => {
          arr.push({
            currency: v,
            value: map[v]
          });
        });
        this.receiptAmounts = arr;
        this.$emit("selectFn", this.transactionsList, this.receiptAmounts, type);
      } else if (this.transactionType === 2) {
        // 关联余额
        let map = {};
        let VALID = true;
        this.walletAccountUseList.forEach(v => {
          let useAmount = Number(v.useAmount || 0);
          let remainAmount = Number(v.remainAmount || 0);
          if (useAmount > remainAmount) {
            VALID = false;
          }
          if (map[v.transactionsCurrency]) {
            map[v.transactionsCurrency] = useAmount + Number(map[v.transactionsCurrency]);
          } else {
            map[v.transactionsCurrency] = useAmount;
          }
        });
        if (!VALID) {
          // 使用金额不能大于未关联金额
          this.$message.error(this.$t('fmsPayableClear.checkUseAmount'));
        }
        let arr = [];
        Object.keys(map).forEach(v => {
          arr.push({
            currency: v,
            value: map[v]
          });
        });
        this.receiptAmounts = arr;
        this.$emit("selectFn", this.walletAccountUseList, this.receiptAmounts, type);
      } else {
        this.$emit("selectFn", [], [], type);
      }
		},
		removeClaimFn(item) {
			let index = this.transactionsList.findIndex(v => item.id === v.id);
			if (index >= 0) {
				this.transactionsList.splice(index, 1);
			}
			this.useAmountChange('REMOVE');
		},
    removeWalletAccountFn(item) {
      let index = this.walletAccountUseList.findIndex(v => item.id === v.id);
			if (index >= 0) {
				this.walletAccountUseList.splice(index, 1);
			}
			this.useAmountChange('REMOVE');
    },
    walletAcountClearConfirmFn() {
      if (!this.walletAcountCurrency) {
				this.$message.error(this.$t("receiveFms.please_select_one_data"));
				return;
			}
      let arr = []
      this.walletAcountCurrencyList.forEach(v => {
        if (v.currency === this.walletAcountCurrency) {
          arr.push({
            ...v,
            transactionsCurrency: v.currency,
            remainAmount: v.amountAvailable,
            settlementCompanyName: this.detail.settlementCompanyName,
            settlementOfficeName: this.detail.settlementOfficeName,
            businessTypeName: this.detail.businessTypes[0].businessTypeName
          })
        }
      })
      this.walletAcountClearVisible = false

      let shareAmount = 0;
			if (arr.length > 0) {
        // 找到目标币种可以分配的金额
        this.sourceClearAmounts.forEach(v => {
          if (v.currency === arr[0].transactionsCurrency) {
            shareAmount = v.value;
          }
        })
			}
      // 进行金额的分配
			if (shareAmount > 0) {
				arr.forEach(v => {
					if (!v.useAmount && shareAmount > 0) {
						v.useAmount = Number(shareAmount) > Number(v.remainAmount || 0) ? v.remainAmount : shareAmount;
					}
					shareAmount = (Number(shareAmount) - Number(v.useAmount || 0)).toFixed(2);
				});
			}

      this.walletAccountUseList = arr
      this.useAmountChange('SELECTED');
    }
	}
};
</script>

<style lang="scss" scoped>
@import "../../styles/clear.scss";
.search-transaction {
	float: right;
	margin-top: 10px;
	margin-right: 20px;
}
.radio-list{
  ::v-deep .el-radio{
    width:100%;
    margin: 10px;
  }
  .currency-img{
    width: 30px;
    vertical-align: middle
  }
}
</style>
