<template>
	<div style="padding: 20px; background: #f0f2f5;">
    <div class="section origin-container">
      <div class="title">
        <div class="title-item">
          <span class="title-item-des">
            <svg-icon className="clear-module-icon" iconClass="icon-shoukuandan" />
            {{$t("fmsReceiptTransactions.transactions_detail")}}
            <span style="margin-left:15px;">{{detailItem.transactionsNo}}</span>
          </span>
        </div>
      </div>
      <div class="section-content">
        <div class="record-container">
          <div class="record-container-content">
            <div class="record-item title-important-item">
              <label>{{$t("fmsReceiptTransactions.transactions_amount")}}：</label>
              <span>{{detailItem.transactionsCurrency}}&nbsp;&nbsp;
                {{detailItem.transactionsAmount | numberToThousands}}</span>
            </div>
            <div class="record-item title-important-item"><label>{{$t("fmsReceiptTransactions.claimed_amount")}}：</label><span>{{detailItem.claimedAmount | numberToThousands}}</span></div>
            <div class="record-item title-important-item"><label>{{$t("fmsReceiptTransactions.un_claim_amount")}}：</label><span>{{detailItem.unClaimAmount | numberToThousands}}</span></div>
          </div>
          <div class="record-container-content">
            <div class="record-item" style="width: 100%">
              <label>{{$t("fmsReceiptTransactions.pay_type")}}：</label>
              <span>
                {{detailItem.payTypeName}}
                <span style="margin-left:10px;">{{detailItem.thirdPartyName}}</span>
                <span v-if="detailItem.payingAgentFlag">
                  <el-checkbox v-model="detailItem.payingAgentFlag" disabled class="person-flag"></el-checkbox>个人代付
                </span>
              </span>
            </div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.payer_name")}}：</label><span>{{detailItem.payerName}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.member_account_no")}}：</label><span>{{detailItem.accountPayAccountNo}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.member_account_name")}}：</label><span>{{detailItem.accountPayName}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.settlement_office")}}：</label><span>{{detailItem.settlementOfficeName}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.account_collect")}}：</label><span>{{detailItem.accountCollectName}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.account_collect_no")}}：</label><span>{{detailItem.accountCollectAccountNo}}({{detailItem.transactionsCurrency}})</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.transactions_amount")}}：</label><span>{{detailItem.transactionsAmount | numberToThousands}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.transactions_date")}}：</label><span>{{detailItem.transactionsDate | parseTime}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.transactions_remark")}}：</label><span>{{detailItem.remark}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.certificate_files")}}：</label>
              <span>
                <div class="file-show">
                  <div v-for="(item,index) in detailItem.certificateFiles" :key="index">
                    <a :href="item.url" target="_blank">{{item.originFileName}}</a>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section origin-container" v-if="detailItem.claims && detailItem.claims.length">
      <div class="title">
        <div class="title-item">
          <span class="title-item-des">
            <svg-icon className="clear-module-icon" iconClass="icon-shoukuanrenling" />
            {{$t("fmsReceiptTransactions.claim_record")}}
          </span>
        </div>
      </div>
      <div class="section-content">
        <div class="record-container claimer-container" v-for="(item, index) in (detailItem.claims || [])" :key="index">
          <div class="record-container-content">
            <div class="record-item title-important-item"><label>{{$t("fmsReceiptTransactions.current_claim_amount")}}：</label><span>{{item.claimAmount | numberToThousands}}</span></div>
            <div class="record-item title-important-item"><label>{{$t("fmsReceiptTransactions.instruction_amount")}}：</label><span>{{item.instructionAmount | numberToThousands}}</span></div>
            <div class="record-item title-important-item"><label>{{$t("fmsReceiptTransactions.un_instruction_amount")}}：</label><span>{{item.unInstructionAmount | numberToThousands}}</span></div>
            <div class="record-item title-important-item"><label>{{$t("fmsReceiptTransactions.clear_amount")}}：</label><span>{{item.clearAmount | numberToThousands}}</span></div>
            <div class="record-item title-important-item"><label>{{$t("fmsReceiptTransactions.un_clear_amount")}}：</label><span>{{item.unClearAmount | numberToThousands}}</span></div>
          </div>
          <div class="record-container-content">
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.transactions_type")}}：</label><span>{{item.transactionsTypeName}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.settlement_company")}}：</label><span>{{item.settlementCompanyName}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.business_type")}}：</label><span>{{item.businessTypeNames.join('、')}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.remain_amount_use")}}：</label><span>{{item.remainAmount | numberToThousands}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.claim_by")}}：</label><span>{{item.claimByName}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.claim_date")}}：</label><span>{{item.claimDate | parseTime}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.claim_remark")}}：</label><span>{{item.claimRemark}}</span></div>
            <div class="record-item"><label>{{$t("fmsReceiptTransactions.claim_files")}}：</label>
              <span>
                <div class="file-show">
                  <div v-for="(item,index) in item.claimFiles" :key="index">
                    <a :href="item.url" target="_blank">{{item.originFileName}}</a>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTransactionReceiptDetailApi, getTransactionClaimerDetailApi } from "@/api/financial/fmsReceiptTransactions";

export default {
	name: "ReceiptTransactionsDetail",
	props: {
		type: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			id: "",
			backPath: "",
			loading: false,
			detailItem: {}
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.backPath = this.$route.query.backPath;
		this.getDetail();
	},
	methods: {
		getDetail() {
			let fn = this.type === "CLAIMER" ? getTransactionClaimerDetailApi : getTransactionReceiptDetailApi;
			fn(this.id).then(res => {
				if (res.ok) {
					this.detailItem = res.content;
				}
			});
		},
		backList() {
			if (this.backPath) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.backPath });
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.page-edit-container .page-edit-content {
	padding: 20px;
}

.section {
	background: #fff;
	margin-bottom: 20px;
	box-shadow: 0 0 8px 0 #ddd, 0 2px 4px 0 #ddd;

	.title {
		height: 50px;
		line-height: 50px;
		font-weight: 600;
		font-size: 16px;
		overflow: hidden;
		border-bottom: 1px solid #dedede;
		padding-left: 20px;

		.title-item {
			float: left;
			margin-right: 15px;
		}

		.title-item-des {
			margin-right: 15px;
		}
		.m-icon {
			font-size: 26px;
			line-height: 26px;
			color: #1890ff;
			margin-right: 10px;
			float: left;
			margin-top: 10px;
		}
	}

	.section-content {
		font-size: 14px;
		padding: 20px;
	}
}

.record-container {
	.record-container-content {
		overflow: hidden;
		.record-item {
			float: left;
			width: 50%;
			margin-bottom: 15px;
			display: flex;

			label {
				width: 120px;
				min-width: 120px;
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

		.title-important-item.record-item {
			width: 33%;
			label {
				font-weight: 600 !important;
			}
			span {
				font-weight: 600 !important;
			}
		}
	}
}

.claimer-container {
	padding: 20px;
	background: #efefef;
	border-radius: 5px;
}
.file-show {
	color: #108ee9;
	font-size: 14px;
}
.person-flag {
	float: none !important;
	width: auto !important;
	min-width: auto !important;
	display: inline-block !important;
	margin-left: 10px !important;
	margin-bottom: 0 !important;
}
</style>

