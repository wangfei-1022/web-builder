<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="page-edit-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('fmsPayablePayment.detail')" name="first">
          <payment-detail ref="paymentDetailRef" :detail="detail" :id="id" @init="init" @download="downloadFn" :operation="operation"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsPayablePayment.approvalProgress')" name="second" lazy>
          <approval-progress :logList="logList"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsPayablePayment.chargeDetail')" name="third" v-if="detail.paymentType === 1" lazy>
          <charge-detail :id="id" type="AP" :sourceAmounts="detail.chargeTotalAmounts"/>
        </el-tab-pane>
      </el-tabs>
		</div>

		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList()">{{$t('common.close')}}</el-button>
      <el-button type="primary" size="mini" plain @click="downloadFn()"  v-if="operation === 'DETAIL'">{{$t('fmsPayablePayment.download')}}</el-button>

			<el-button type="primary" size="mini" @click="rejectFn()" v-if="(detail.paymentState === 30) && operation === 'PAY'">{{$t('fmsPayablePayment.rejectPay')}}</el-button>
			<el-button type="primary" size="mini" @click="confirmPayFn()" v-if="(detail.paymentState === 30 || detail.paymentState === 40) && operation === 'PAY'">{{$t('fmsPayablePayment.confirmPay')}}</el-button>

      <el-button type="primary" size="mini" @click="approvalFn()" v-if="(detail.approvalType === 50) && operation === 'APPROVAL'">{{$t('fmsPayablePayment.submit')}}</el-button>
		</div>

    <pay-dialog ref="payDialogRef" @backList="backList"/>

    <el-dialog :title="$t('fmsPayablePayment.rejectPay')" :visible.sync="rejectVisible" width="500px">
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectFormRules" label-width="120px" label-position="right" size="mini">
        <el-form-item :label="$t('fmsPayablePayment.rejectRemark')" prop="rejectRemark">
          <el-input v-model="rejectForm.rejectRemark" type="textarea" :row="3"/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitRejectFn" :loading="rejectLoading" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>

    <download-file-dialog ref="downloadFileDialogRef" />
	</div>
</template>

<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { 
  getPayablePaymentDetailApi, 
  paymentFinishApi, 
  paymentRejectApi, 
  approvalApplyAgreeApi, 
  approvalApplyRejectApi,
  approvalApplyAgreeV1Api, 
  approvalApplyRejectV1Api
 } from "@/api/financial/fmsPayablePayment";
import PaymentDetail from "./components/PaymentDetail";
import ApprovalProgress from "./components/ApprovalProgress";
import PayDialog from "./components/PayDialog";
import DownloadFileDialog from "@/views/financial/components/DownloadFileDialog";
import ChargeDetail from "./components/ChargeDetail";

// 申请核销
export default {
	name: "FmsPayablePaymentApplyDetail",
	components: {
    PaymentDetail,
    ApprovalProgress,
    PayDialog,
    DownloadFileDialog,
    ChargeDetail
	},
	data() {
		return {
      loading: false,

      id: '',
      origin: '',
      operation: '',
      logList: [],
      detail: {},
      activeName: 'first',

      rejectLoading: false,
      rejectVisible: false,
      rejectForm: {
        rejectRemark: ''
      },
      rejectFormRules: {
        rejectRemark: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
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
			getPayablePaymentDetailApi(this.id).then(res => {
				if (res.ok) {
          this.detail = res.content
          this.logList = res.content.approvalLogList
				}
			});
		},
    // 审批
    approvalFn() {
      let valid = this.$refs.paymentDetailRef.approvalValidate();
      if (valid) {
        let data = this.$refs.paymentDetailRef.approvalValue();
        data.applyId = this.detail.id
        data.instructionId = this.detail.id
        data.applyType = this.detail.paymentType
        data.currentApplyApprovalNodeCode = this.detail.currentApprovalLog.approvalNodeCode
        data.nextApprovalNode = this.detail.currentApprovalLog.nextApprovalNode

        let fn = null
        if (this.detail.workflowType === 10) {
          fn = data.result ? approvalApplyAgreeV1Api : approvalApplyRejectV1Api
        } else {
          fn = data.result ? approvalApplyAgreeApi : approvalApplyRejectApi
        }
        this.loading = true
        fn(data).then(res => {
          if (res.ok) {
            // 审批成功
            this.$message.success(this.$t('fmsPayablePayment.approvalOperSuccess'))
            this.backList(true)
          }
          this.loading = false
        })
      }
    },
    // 下载文件
    downloadFn() {
      this.$refs.downloadFileDialogRef.show(this.id)
    },
		confirmPayFn() {
      this.$refs.payDialogRef.show(this.id, this.detail.unClearTotalAmounts, this.detail.applyAmounts)
		},
		rejectFn() {
      this.rejectVisible = true
		},
    submitRejectFn() {
      this.$refs.rejectFormRef.validate(valid => {
        if (valid) {
          let data = {
            instructionId: this.id,
            rejectRemark: this.rejectForm.rejectRemark
          }
          this.loading = true
          paymentRejectApi(data).then(res => {
            if (res.ok) {
              // 拒绝付款成功
              this.$message.success(this.$t('fmsPayablePayment.rejectPaySuccess'))
              this.backList(true)
            }
            this.loading = false
          })
        }
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
