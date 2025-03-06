<template>
  <div style="padding: 0 20px;">
    <div class="info-section-module" style="padding: 20px;" v-if="detail.id && detail.paymentType === 1" >
      <PayableOrderChargeTotal 
        :instructionId="id" 
        :approvalSpecialInfo="detail.approvalSpecialInfo"
        :contactAbsolute="false"
      />
    </div>

    <!-- 付款信息 -->
    <div class="info-section-module" v-if="detail.paymentState === 91">
      <div class="info-title">
        <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
        {{$t('fmsPayablePayment.paymentRecord')}}
        <span style="color:red">({{detail.paymentStateName}})</span>
      </div>
      <div class="info-content">
        <div class="info-item">
          <span class="info-label">{{$t('fmsPayablePayment.payByName')}}：</span>
          <span class="info-span">{{detail.currentApprovalLog.approvalUser}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsPayablePayment.rejectPayTime')}}：</span>
          <span class="info-span">{{detail.currentApprovalLog.approvalTime | parseTime}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsPayablePayment.rejectPayReason')}}：</span>
          <span style="color:red">{{detail.currentApprovalLog.approvalRemarks}}</span>
        </div>
      </div>
    </div>

    <!-- 付款信息 -->
    <div class="info-section-module" v-if="detail.transactionsList && detail.transactionsList.length > 0">
      <div class="info-title">
          <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
        {{$t('fmsPayablePayment.paymentRecord')}}
      </div>
      <div class="info-content">
        <div class="payment-item" v-for="(item,index) in detail.transactionsList" :key="index">
          <div class="info-item full-line payment-title">
            <span class="info-label">{{$t('fmsPayablePayment.transactionsNo')}}: </span>
            <span class="info-span">{{item.transactionsNo }}<span class="link" v-if="item.payableAmounts.length > 1">({{$t('fmsPayablePayment.YICurrency')}})</span></span>
          </div>
          <div class="info-item full-line">
            <span class="info-label">{{$t('fmsPayablePayment.paidSourceAmount')}}：</span>
            <span class="info-span">
              <span v-for="(xx, index) in item.payableAmounts" :key="index">
                {{xx.sourceCurrency}}&nbsp;{{xx.sourceValue | numberToThousands}}
                <span v-if="item.payableAmounts.length > 1">({{$t('fmsPayablePayment.exchangeRate')}}{{xx.exchangeRate}})</span>
              </span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('fmsPayablePayment.transactionsCurrencyAmount')}}：</span>
            <span class="info-span">{{item.transactionsCurrency}}&nbsp;{{item.transactionsAmount | numberToThousands}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('fmsPayablePayment.paidTime')}}：</span>
            <span class="info-span">{{item.transactionsDate | parseDate}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('fmsPayablePayment.paidFiles')}}：</span>
            <span class="info-span">
              <span v-if="item.payFiles.length > 0">
                <a v-for="(file, index) in item.payFiles" class="link" :key="index" target="_blank" :href="file.url">{{file.originFileName}}</a>
              </span>
              <el-button size="mini" type="text" style="padding: 0px;" @click="uploadFn(item.id)">
                <i class="el-icon-upload el-icon--right"></i>{{item.payFiles.length <= 0 ? $t('fmsPayablePayment.uploadPaidFiles') : $t('fmsPayablePayment.updateUploadPaidFiles')}}
              </el-button>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('fmsPayablePayment.payByName')}}：</span>
            <span class="info-span">{{item.payByName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('fmsPayablePayment.opTime')}}：</span>
            <span class="info-span">{{item.opTime | parseTime}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('fmsPayablePayment.paidRemarks')}}：</span>
            <span class="info-span">{{item.remark}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请付款信息 -->
    <div class="info-section-module">
      <div class="info-title">
          <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
        {{$t('payableFms.applyPaymentInfo')}}
        <span style="margin-left: 10px;">{{detail.instructionNo}}</span>
        <span style="float: right; color: #1890ff;font-size: 14px;">{{operation === "APPROVAL" ? detail.approvalTypeName : detail.paymentStateName}}</span>
      </div>
      <div class="info-content">
        <div class="info-item full-line">
          <label class="info-label">{{$t('fmsPayablePayment.localServicePaymentType')}}：</label>
          <span class="info-span">{{detail.localServicePaymentTypeName}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsPayablePayment.paymentType')}}：</span>
          <span class="info-span">{{detail.paymentTypeName}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsPayablePayment.settlementCompanyName')}}：</span>
          <span class="info-span">{{detail.settlementCompanyName}}</span>
        </div>
        <div class="info-item full-line">
          <span class="info-label">{{$t('fmsPayablePayment.registerAddress')}}：</span>
          <span class="info-span">{{detail.isOverSea && detail.countryCode ? (detail.countryCode + '，') : ''}}{{detail.registerAddress}}</span>
        </div>
        <div v-for="(bank, index) in detail.applyAmounts" :key="index">
          <div class="info-item">
            <span class="info-label">{{$t('fmsPayablePayment.paymentValue')}}：</span>
            <span class="info-span">{{bank.currency}}&nbsp;{{bank.value | numberToThousands}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('fmsPayablePayment.bankAccountInfo')}}：</span>
            <span class="info-span">{{bank.bankName}}{{bank.bankBranch}}({{bank.accountNo}})</span>
          </div>
        </div>
        <div class="info-item" v-if="detail.isOverSea">
          <span class="info-label">{{$t('fmsPayablePayment.swiftCode')}}：</span>
          <span class="info-span">{{detail.applyAmounts[0].swiftCode}}</span>
        </div>
        <div class="info-item" v-if="detail.isOverSea">
          <span class="info-label">{{$t('fmsPayablePayment.bankAddress')}}：</span>
          <span class="info-span">{{(detail.applyAmounts[0].countryCode || '') + '，'}}{{detail.applyAmounts[0].bankAddress}}</span>
        </div>
        <div class="info-item" v-if="detail.isOverSea">
          <span class="info-label">{{$t('fmsPayablePayment.contact')}}：</span>
          <span class="info-span">{{detail.contact}}</span>
        </div>
        <div class="info-item" v-if="detail.tel">
          <span class="info-label">{{$t('fmsPayablePayment.tel')}}：</span>
          <span class="info-span">{{detail.tel}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsPayablePayment.paymentDesc')}}：</span>
          <span class="info-span">{{detail.paymentDesc}}</span>
        </div>

        <div style="border-bottom: 1px dashed #aaa;margin: 30px;clear: both;"></div>

        <div class="info-item">
          <span class="info-label">{{$t('fmsPayablePayment.businessTypes')}}：</span>
          <span class="info-span">{{detail.businessTypeNames ? detail.businessTypeNames.join('、') : ''}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsPayablePayment.paymentDueDate')}}：</span>
          <span class="info-span">{{detail.paymentDueDate | parseDate}}</span>
        </div>
        <div class="info-item full-line">
          <span class="info-label">{{$t('fmsPayablePayment.costDepartment')}}：</span>
          <span class="info-span">{{detail.costDepartmentName}}</span>
        </div>
        <div class="info-item full-line" v-if="detail.isOverSea">
          <span class="info-label">{{$t('fmsPayablePayment.commissionMode')}}：</span>
          <span class="info-span">{{detail.commissionModeName}}</span>
        </div>
        <div class="info-item full-line" v-if="detail.isOverSea">
          <span class="info-label">{{$t('fmsPayablePayment.commissionFiles')}}：</span>
          <span>
            <div v-for="(item,index) in detail.commissionFiles" :key="index">
              <a class="link" :href="item.url" target="_blank">{{item.originFileName}}</a>
            </div>
          </span>
        </div>
        <div class="info-item full-line">
          <span class="info-label">{{$t('fmsPayablePayment.invoiceMedium')}}：</span>
          <span class="info-span">{{detail.invoiceMediumName}}</span>
        </div>
        <div class="info-item full-line">
          <span class="info-label">{{$t('fmsPayablePayment.invoiceFiles')}}：</span>
          <span class="info-span">
            <div v-for="(item,index) in detail.invoiceFiles" :key="index">
              <a class="link" :href="item.url" target="_blank">{{item.originFileName}}</a>
            </div>
          </span>
        </div>
        <div class="info-item full-line">
          <span class="info-label">{{$t('fmsPayablePayment.billFiles')}}：</span>
          <span class="info-span">
            <div v-for="(item,index) in detail.billFiles" :key="index">
              <a class="link" :href="item.url" target="_blank">{{item.originFileName}}</a>
            </div>
          </span>
        </div>
        <div class="info-item full-line">
          <span class="info-label">{{$t('fmsPayablePayment.otherFiles')}}：</span>
          <span class="info-span">
            <div v-for="(item,index) in detail.otherFiles" :key="index">
              <a class="link" :href="item.url" target="_blank">{{item.originFileName}}</a>
            </div>
          </span>
        </div>
        <div class="info-item full-line">
          <span class="info-label">{{$t('fmsPayablePayment.otherRemark')}}：</span>
          <span class="info-span">{{detail.remark}}</span>
        </div>
        <div class="info-item full-line" style="padding-left: 40px;">
          <!-- 付款通知书 -->
          <el-checkbox :value="true" disabled v-if="detail.paymentType === 1">{{$t('fmsPayablePayment.paymentNotifyBo')}}</el-checkbox>
          <!-- 付款报告 -->
          <el-checkbox :value="true" disabled>{{$t('fmsPayablePayment.paymentReport')}}</el-checkbox>
        </div>
        <div class="info-item full-line" style="padding-left: 40px;">
          <!-- 财务回传水单后直接发送到供应商指定邮箱 -->
          <el-checkbox :value="detail.paymentMemoSubscriberFlag" disabled>{{$t('fmsPayablePayment.paymentMemoSubscriberFlag')}}</el-checkbox>
        </div>
        <div class="info-item full-line" v-if="detail.paymentMemoSubscriberFlag">
          <span class="info-label">{{$t('fmsPayablePayment.memoEmailSubscribers')}}：</span>
          <span class="info-span">{{detail.memoEmailSubscribers}}</span>
        </div>
        <div class="info-item full-line" v-if="detail.paymentMemoSubscriberFlag">
          <span class="info-label">{{$t('fmsPayablePayment.memoEmailSubscriberRemark')}}：</span>
          <span class="info-span">{{detail.memoEmailSubscriberRemark}}</span>
        </div>
      </div>
    </div>

    <!-- 审批意见 -->
    <div class="info-section-module" v-if="(detail.approvalType === 50) && operation === 'APPROVAL'">
      <div class="info-title">
        <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
        {{$t('fmsPayablePayment.approvalInfo')}}
      </div>
      <div class="info-content">
        <el-form ref="approvalFormDataRef" :model="approvalFormData" size="mini" label-width="120px">
          <el-form-item label="" prop="result" :rules="[{ required: true, message: $t('common.selectPlaceholder') }]">
            <el-radio-group v-model="approvalFormData.result">
              <el-radio :label="true">{{$t('fmsPayablePayment.agree')}}</el-radio>
              <el-radio :label="false">{{$t('fmsPayablePayment.reject')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.approvalRemark')" prop="approvalRemark" :rules="[{ required: !approvalFormData.result, message: $t('common.can_not_be_null') }]">
            <el-input v-model="approvalFormData.approvalRemark" type="textarea" size="mini" />
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.approvalFiles')" prop="approvalFiles">
            <upload-file v-model="approvalFormData.approvalFiles" multiple accept=".rar,.zip,.doc,.docx,.pdf,.xlsx,.xls"></upload-file>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog :visible.sync="uploadVisible" :close-on-click-modal="false" width="400px" :title="$t('fmsPayablePayment.uploadPaidFiles')">
      <div class="container" style="height: 250px;">
        <attach-sreenshot v-model="uploadForm.paidFiles" />
      </div>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="uploadVisible = false">{{ $t("common.cancel")}}</el-button>
        <el-button size="mini" type="primary" @click="uploadConfirmFn" :loading="uploadLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadCertiferFileApi } from "@/api/financial/fmsPayablePayment";
import PayableOrderChargeTotal from "@/views/financial/components/PayableOrderChargeTotal";

export default {
	name: "PaymentDetail",
  components: {
    PayableOrderChargeTotal
  },
	props: {
		detail: {
			type: Object,
			default: function () {
				return {
          businessTypeNames: []
        };
			}
		},
    id: {
      type: String,
      default: ''
    },
    operation: {
      type: String,
      default: ''
    }
	},
	data() {
		return {
      approvalFormData: {
        result: null,
        approvalRemark: '',
        approvalFiles: []
      },

      transactionsId: '', // 当前选中要上传的付款水单ID

      uploadVisible: false,
      uploadLoading: false,
      uploadForm: {
        paidFiles: []
      }
		};
	},
	created() {

	},
	methods: {
    approvalValidate() {
      let VALID = true
      this.$refs.approvalFormDataRef.validate(valid => {
        VALID = valid
      })
      if (!VALID) {
        this.mixinsFormScrollIntoView()
      }
      return VALID
    },
    approvalValue() {
      return this.approvalFormData
    },
    payFileDownload() {
      this.$emit('download')
    },
    uploadFn(transactionsId) {
      this.transactionsId = transactionsId
      this.uploadForm.paidFiles = []
      this.uploadVisible = true
    },
    uploadConfirmFn() {
      if (!this.uploadForm.paidFiles.length) {
        // 请先上传水单
        this.$message.error(this.$t('fmsPayablePayment.paidFilesError'))
        return
      }
      let data = {
        instructionId: this.detail.id,
        transactionsId: this.transactionsId,
        certificateFiles: this.uploadForm.paidFiles
      }
      this.uploadLoading = true
      uploadCertiferFileApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsPayablePayment.uploadSuccess'))
          this.$emit('init')
          this.uploadForm.paidFiles = []
          this.uploadVisible = false
        }
        this.uploadLoading = false
      })
    }
	}
};
</script>
<style lang="scss" scoped>
.edit-container{
  padding: 20px;
}

.file-show {
	color: #108ee9;
	font-size: 14px;
}

.payment-item {
  overflow: hidden;
  background: #eee;
  padding: 20px;
  border-bottom: 1px solid #ddd;

  .payment-title{
    label{
      font-weight: 600!important;
    }
    span{
      font-weight: 600!important;
    }
  }

  .item{
    width: 33%;
  }
  .item.full-line {
    width: 100%;
  }
}
</style>

