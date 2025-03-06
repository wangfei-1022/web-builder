<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="page-edit-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('fmsProfit.orderDetail')" name="1">
          <order-detail ref="orderDetailRef" :detail="detail" v-if="detail.orderId || detail.id" :operation="operation"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsProfit.innerBusinessFalse')" name="2" v-if="outerChargeList.length">
          <profit-charge-detail :id="id" :chargeList="outerChargeList"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsProfit.innerBusinessTrue')" name="3" v-if="innerChargeList.length">
          <profit-charge-detail :id="id" :chargeList="innerChargeList" inner/>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsProfit.approvalProgress')" name="4" lazy v-if="detail.id">
          <approval-progress :profitApplyId="profitApplyId"/>
        </el-tab-pane>
      </el-tabs>
		</div>

    <profit-apply-audit-dialog ref="profitApplyAuditDialogRef" @audit="submitAuditEmit"/>

		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'DETAIL'">{{$t('common.close')}}</el-button>
			<el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'AUDIT' || operation === 'SUBMIT'">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" @click="submitAuditFn()" v-if="operation === 'AUDIT'">{{$t('fmsProfit.submitAudit')}}</el-button>
			<el-button type="primary" size="mini" @click="submitFn()" v-if="operation === 'SUBMIT'">{{$t('fmsProfit.submit')}}</el-button>
		</div>
	</div>
</template>

<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { 
  getProfitApplyDetailByOrderApi,
  getProfitApplyDetailChargeByOrderApi,
  getProfitApplyDetailApi, 
  getProfitApplyDetailChargeApi, 
  profitApplySubmitApi, // 提交
  profitApplyResubmitApi // 重新提交
} from "@/api/financial/fmsProfitApply";
import {  profitApplyAuditApi, profitApplyRejectApi } from "@/api/financial/fmsProfitAudit";
import OrderDetail from "./OrderDetail";
import ProfitApplyAuditDialog from "./ProfitApplyAuditDialog";
import ApprovalProgress from "./ApprovalProgress";
import ProfitChargeDetail from "./ProfitChargeDetail";

// 申请核销
export default {
	name: "FmsProfitApplyListDetail",
	components: {
    OrderDetail,
    ProfitApplyAuditDialog,
    ApprovalProgress,
    ProfitChargeDetail
	},
  props: {
    operation: {
      type: String,
      default: ""
    }
  },
	data() {
		return {
      loading: false,

      id: '',
      origin: '',
      logList: [],
      detail: {
        profitApplyChargeCheckStateInfo: {
          profitApplyInnerCheckDetails: [],
          profitApplyOuterCheckDetails: [],
        },
        totalAmountAp: [],
        totalAmountAr: [],
        totalAmountGrossProfit: [],
        innerAmountList: [],
        checkSuccessList: [],
        checkErrorList: []
      },
      activeName: '1',

      rejectLoading: false,
      rejectVisible: false,
      rejectForm: {
        rejectRemark: ''
      },
      rejectFormRules: {
        rejectRemark: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
      },

      outerChargeList: [],
      innerChargeList: []
		};
	},
	created() {
		this.orderId = this.$route.query.orderId;
		this.entityType = this.$route.query.entityType;
    this.profitApplyId = this.$route.query.profitApplyId;
		this.origin = this.$route.query.origin;
		this.init();
	},
	methods: {
		init() {
      let data = {
        orderId: this.orderId, 
        entityType: this.entityType
      }
      if (this.profitApplyId) {
        data = {
          profitApplyId: this.profitApplyId
        }
      }
      let fn = this.profitApplyId ? getProfitApplyDetailApi : getProfitApplyDetailByOrderApi
			fn(data).then(res => {
        if (res.ok) {
          let v = res.content
          if (v.outerTotalAmount && v.outerTotalAmount.orderAmount) {
            // 应收合计
            v.totalAmountAr = v.outerTotalAmount.orderAmount.arTotalAmounts
            // 应付合计
            v.totalAmountAp = v.outerTotalAmount.orderAmount.apTotalAmounts
            // 单票毛利
            v.totalAmountGrossProfit = v.outerTotalAmount.orderAmount.totalProfitAmounts
          }
          if (v.outerTotalAmount && v.outerTotalAmount.historyAmount) {
            // 历史毛利率
            let rate = v.totalAmount.historyAmount.profitRate.rate
            v.historyAmountProfitRate = rate === null ? "-" : (rate * 100).toFixed(2) + '%'
          }
          if (v.outerTotalAmount && v.outerTotalAmount.orderAmount) {
            // 当期毛利率
            let rate = v.outerTotalAmount.orderAmount.profitRate.rate
            v.orderAmountProfitRate = rate === null ? "-" : (rate * 100).toFixed(2) + '%'
          }
          if (v.outerTotalAmount && v.outerTotalAmount.submitAmount) {
            // 变化毛利率
            let rate = v.outerTotalAmount.submitAmount.profitRate.rate
            v.submitAmountProfitRate = rate === null ? "-" : (rate * 100).toFixed(2) + '%'
          }
          if (v.innerTotalAmount && v.innerTotalAmount.orderAmount) {
            v.innerAmountList = v.innerTotalAmount.orderAmount.profitAmounts
          }

          let checkSuccessList = []
          let checkErrorList = []
          if(v.profitApplyChargeCheckStateInfo && v.profitApplyChargeCheckStateInfo.profitApplyOuterCheckDetails) {
            v.profitApplyChargeCheckStateInfo.profitApplyOuterCheckDetails.forEach(item => {
              if(item.stateCode === 20) {
                checkSuccessList.push(item)
              } else {
                checkErrorList.push(item)
              }
            })
          }
          if(v.profitApplyChargeCheckStateInfo && v.profitApplyChargeCheckStateInfo.profitApplyInnerCheckDetails) {
            v.profitApplyChargeCheckStateInfo.profitApplyInnerCheckDetails.forEach(item => {
              if(item.stateCode === 20) {
                checkSuccessList.push(item)
              } else {
                checkErrorList.push(item)
              }
            })
          }
          v.checkSuccessList = checkSuccessList
          v.checkErrorList = checkErrorList
          this.detail = v
        }
      })
      let chargeFn = this.profitApplyId ? getProfitApplyDetailChargeApi : getProfitApplyDetailChargeByOrderApi
      chargeFn(data).then(res => {
				if (res.ok) {
          let outerChargeList = []
          let innerChargeList = []
          res.content.forEach(v => {
            if (v.innerBusinessFlag) {
              innerChargeList.push(v)
            } else {
              outerChargeList.push(v)
            }
          })
          this.outerChargeList = outerChargeList
          this.innerChargeList = innerChargeList
				}
			});
		},
    // 提交
    submitFn() {
      let valid = this.$refs.orderDetailRef.validate();
      if (valid) {
        let data = this.$refs.orderDetailRef.getValue();
        data.orderEntityType = this.entityType
        data.orderId = this.orderId
        data.profitApplyId = this.profitApplyId

        this.loading = true
        let fn = this.profitApplyId ? profitApplyResubmitApi : profitApplySubmitApi
        fn(data).then(res => {
          if (res.ok) {
            // 提交成功
            this.$message.success(this.$t('fmsProfit.submitSuccess'))
            this.backList(true)
          }
          this.loading = false
        })
      }
    },
    // 提交审核
		submitAuditFn() {
      let valid = this.$refs.orderDetailRef.auditValidate();
      if (valid) {
        let data = this.$refs.orderDetailRef.auditGetValue();
        data.profitApplyId = this.profitApplyId
        if (data.result) {
          this.$refs.profitApplyAuditDialogRef.show([data.profitApplyId])
        } else {
          this.loading = true
          profitApplyRejectApi(data).then(res => {
            if (res.ok) {
              // 拒绝成功
              this.$message.success(this.$t('fmsProfit.submitRejectSuccess'))
              this.backList(true)
            }
            this.loading = false
          })
        }
      }
		},
    // 审核
    submitAuditEmit(profitPeriods) {
      this.loading = true
      let data = this.$refs.orderDetailRef.auditGetValue();
      data.profitApplyId = this.profitApplyId
      data.profitPeriods = profitPeriods
      profitApplyAuditApi(data).then(res => {
        if (res.ok) {
          // 审核成功
          this.$message.success(this.$t('fmsProfit.submitAuditSuccess'))
          this.backList(true)
          this.$refs.profitApplyAuditDialogRef.hide()
        }
        this.loading = false
      })
    },
		backList(refresh) {
			if (this.origin) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.origin, query: { refresh: refresh } });
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page-edit-container .page-edit-content {
	padding: 0;
}
::v-deep .el-tabs__header{
  background: #fff;
  padding-left: 20px;
  line-height: 50px;
}
</style>
