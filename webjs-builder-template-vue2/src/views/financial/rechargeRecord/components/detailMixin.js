import {
  getRechargeApplyDetailListApi, // 客户提交申请的详情
  getRechargeDetailRelativeTransApi, // 运营关联之后待审核的详情
  getRechargeSuccessDetailListApi // 财务审核通过之后的详情
} from "@/api/financial/rechargeRecord";
import RelativeTransaction from "@/views/financial/applyReceiptClear/components/relativeTransaction";

export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  components: {
    RelativeTransaction
  },
  data() {
    return {
      id: "",
      recordItem: {},
      transData: {},
      applyCurrencyInfo: [],
      claimList: []
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.origin = this.$route.query.origin;
    this.rechargeState = Number(this.$route.query.rechargeState);
    this.getDetail();
  },
  methods: {
    backList() {
      if (this.origin) {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({ name: this.origin });
      }
    },
    getDetail() {
      let fn = null
      switch (this.rechargeState) {
        case 10:
        case 30:
        case 99:
          fn = getRechargeApplyDetailListApi
          break;
        case 20:
          fn = getRechargeDetailRelativeTransApi
          break;
        case 40:
          fn = getRechargeSuccessDetailListApi
          break;
        default:
          break;
      }
      if (fn) {
        getRechargeApplyDetailListApi(this.id).then(res => {
          if (res.ok) {
            let recordItem = {
              ...res.content
            }
            this.applyCurrencyInfo = [{
              currency: recordItem.currency,
              value: recordItem.amount
            }]
            let claims = []
            if (res.content.claims && res.content.claims.length) {
              recordItem.transactionsAmount = 0
              res.content.claims.forEach(v => {
                recordItem.transactionsCurrency = v.transactionsCurrency
                recordItem.transactionsAmount += Number(v.useAmount)

                claims.push({
                  ...v,
                  settlementOfficeName: recordItem.receiverOfficeName,
                  settlementCompanyName: recordItem.entryName
                })
              })
            }
            this.claimList = claims
            this.recordItem = recordItem
            this.transData.settlementCompanyId = res.content.entryId
            this.transData.settlementOfficeId = res.content.receiverOfficeId
            this.transData.businessTypes = [{
              businessType: res.content.entryAccountCode,
              businessTypeName: res.content.entryAccountCodeName
            }]
            this.transData.instructionCurrency = res.content.currency
          }
        });
      }

    }
  }
};
