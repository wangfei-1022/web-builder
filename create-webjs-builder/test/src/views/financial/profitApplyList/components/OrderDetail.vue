<template>
  <div style="padding: 0 20px;">
    <!-- 订单信息 -->
    <div class="info-section-module">
      <div class="info-title">
        <svg-icon className="clear-module-icon" iconClass="icon-dingdanguanli" :style="{color: '#409EFF'}"/>
        {{$t('fmsProfit.orderInfo')}}
        <span>{{detail.paymentStateName}}</span>
        <status-icon class="status-icon" :statusName="detail.profitApplyStateName" v-if="detail.id"/>
      </div>
      <div class="info-content">
        <div class="info-item">
          <span class="info-label">{{$t('fmsProfit.orderNo')}}：</span>
          <span class="info-span">{{detail.orderNo}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsProfit.businessDate')}}：</span>
          <span class="info-span">{{detail.businessDate | parseTime}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsProfit.businessType')}}：</span>
          <span class="info-span">{{detail.businessTypeName}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsProfit.memberName')}}：</span>
          <span class="info-span">{{detail.memberName}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsProfit.sales')}}：</span>
          <span class="info-span">{{detail.memberPrincipalName}}</span>
        </div>
      </div>

      
      <div class="charge-detail">
        <!-- 费用统计(不含内部往来) -->
        <div class="charge-module" v-if="showOuter">
          <div class="charge-title">
            <svg-icon className="clear-module-icon" iconClass="icon-dingdanguanli" :style="{color: '#409EFF'}"/>
            费用统计(不含内部往来)
          </div>
          <div class="charge-content">
            <div class="charge-content-container-left">
              <div class="charge-item">
                <label class="charge-label">应收合计</label>
                <span class="charge-span">
                  <span v-for="(item, index) in detail.totalAmountAr" :key="index">
                    {{item.currency}}&nbsp;{{item.value | numberToThousands}}
                  </span>
                </span>
              </div>
              <div class="charge-item">
                <label class="charge-label">应付合计</label>
                <span class="charge-span">
                  <span v-for="(item, index) in detail.totalAmountAp" :key="index">
                    {{item.currency}}&nbsp;{{item.value | numberToThousands}}
                  </span>
                </span>
              </div>
              <div class="charge-item">
                <label class="charge-label">单票毛利
                  <el-popover trigger="hover">
                    <div>
                      <div>应收合计-应付合计</div>
                    </div>
                    <span slot="reference">
                      <i class="iconfont icon-tishi" />
                    </span>
                  </el-popover>
                </label>
                <span class="charge-span">
                  <span v-for="(item, index) in detail.totalAmountGrossProfit" :key="index">
                    {{item.currency}}&nbsp;{{item.value | numberToThousands}}
                  </span>
                </span>
              </div>
              <div class="charge-item">
                <label class="charge-label">
                  历史毛利率(%)
                  <el-popover trigger="hover">
                    <div>
                      <div>【∑（盈亏月币种汇率*应收币种金额）-∑（盈亏月币种汇率*应付币种金额）】/∑（盈亏月币种汇率*应收币种金额）</div>
                    </div>
                    <span slot="reference">
                      <i class="iconfont icon-tishi" />
                    </span>
                  </el-popover>
                </label>
                <span class="charge-span">{{detail.historyAmountProfitRate}}</span>
              </div>
              <div class="charge-item">
                <label class="charge-label">当期毛利率(%)
                  <el-popover trigger="hover">
                    <div>
                      <div>【∑（费用提交月币种汇率*应收币种金额）-∑（费用提交月币种汇率*应付币种金额）】/∑（费用提交月币种汇率*应收币种金额）</div>
                    </div>
                    <span slot="reference">
                      <i class="iconfont icon-tishi" />
                    </span>
                  </el-popover>
                </label>
                <span class="charge-span">{{detail.orderAmountProfitRate}}</span>
              </div>
              <div class="charge-item">
                <label class="charge-label">变化毛利率(%)
                  <el-popover trigger="hover">
                    <div>
                      <div>【∑（费用提交月币种汇率*Δ应收币种金额）-∑（费用提交月币种汇率*Δ应付币种金额）】/∑（费用提交月币种汇率*Δ应收币种金额）</div>
                    </div>
                    <span slot="reference">
                      <i class="iconfont icon-tishi" />
                    </span>
                  </el-popover>
                </label>
                <span class="charge-span">{{detail.submitAmountProfitRate}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 费用统计(内部往来) -->
        <div class="charge-module" v-if="showInner">
          <div class="charge-title">
            <svg-icon className="clear-module-icon" iconClass="icon-dingdanguanli" :style="{color: '#409EFF'}"/>
            费用统计(内部往来)
          </div>
          <div class="charge-content">
            <div class="charge-content-container-right" v-for="(office, index) in detail.innerAmountList" :key="index">
              <div style="color: #000;margin-bottom: 12px;">{{office.officeName}}</div>
              <div class="charge-item">
                <label class="charge-label">应收</label>
                <span class="charge-span">
                  <span v-for="(item, index) in office.profitAmount.arTotalAmounts" :key="index">
                    {{item.currencyCode}}&nbsp;{{item.value | numberToThousands}}
                  </span>
                </span>
              </div>
              <div class="charge-item">
                <label class="charge-label">应付</label>
                <span class="charge-span">
                  <span v-for="(item, index) in office.profitAmount.apTotalAmounts" :key="index">
                    {{item.currencyCode}}&nbsp;{{item.value | numberToThousands}}
                  </span>
                </span>
              </div>
              <div class="charge-item" style="border-top: 1px dashed #999;padding-top: 10px;">
                <label class="charge-label">毛利</label>
                <span class="charge-span">
                  <span v-for="(item, index) in office.profitAmount.totalProfitAmounts" :key="index">
                    {{item.currencyCode}}&nbsp;{{item.value | numberToThousands}}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单检测结果 -->
    <div class="info-section-module">
      <div class="info-title">
        <svg-icon className="clear-module-icon" iconClass="icon-yunwei-xitongjiance" />
        {{$t('fmsProfit.orderCheckInfo')}}
        <span style="font-weight: 500;font-size: 14px;margin-left: 14px;">
          {{$t('fmsProfit.orderNo')}}&nbsp;&nbsp;{{detail.orderNo}}，
          系统检测{{detail.checkSuccessList.length}}项通过，
          <span style="color: red;">{{detail.checkErrorList.length}}项失败</span>
        </span>
      </div>
      <div class="info-content">
        <div class="order-check" v-if="showOuter">
          <div class="order-check-title">非内部往来部分</div>
          <div class="order-check-item" v-for="(item, index) in detail.profitApplyChargeCheckStateInfo.profitApplyOuterCheckDetails" :key="index">
            <i class="iconfont icon-chenggong" v-if="item.stateCode === 20" />
            <i class="iconfont icon-guanbi1" v-if="item.stateCode !== 20" />
            {{item.itemDesc}}
          </div>
        </div>
        <div class="order-check" v-if="showInner">
          <div class="order-check-title">内部往来部分</div>
          <div class="order-check-item" v-for="(item, index) in detail.profitApplyChargeCheckStateInfo.profitApplyInnerCheckDetails" :key="index">
            <i class="iconfont icon-chenggong" v-if="item.stateCode === 20" />
            <i class="iconfont icon-guanbi1" v-if="item.stateCode !== 20" />
            {{item.itemDesc}}
          </div>
        </div>
      </div>
      <div class="info-content" v-if="operation === 'SUBMIT'">
        <el-form ref="submitFormRef" class="submit-form" :rules="submitFormRules" :model="submitForm" size="mini" label-width="120px" label-position="top">
          <el-form-item :label="$t('fmsProfit.submitRemark')" prop="submitRemark">
            <el-input v-model="submitForm.submitRemark" type="textarea" />
          </el-form-item>
          <el-form-item :label="$t('fmsProfit.submitAttachments')" prop="submitAttachments">
            <upload-file v-model="submitForm.submitAttachments" multiple accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"></upload-file>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="info-content" v-if="operation === 'AUDIT'" style="border-top: 1px solid #dfdfdf;margin-top: 20px;padding-top: 20px;">
        <div class="info-item">
          <span class="info-label">{{$t('fmsProfit.businessSubmitReason')}}：</span>
          <span class="info-span">{{detail.submitRemark}}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{$t('fmsProfit.businessSubmitFile')}}：</span>
          <span class="info-span">
            <div v-for="(item, index) in detail.submitAttachments" :key="index" style="margin-bottom: 5px;">
              <a :href="item.fileUrl" class="link" target="_blank">{{item.fileName}}</a>
            </div>
          </span>
        </div>
      </div>
    </div>

    <!-- 审批意见 -->
    <div class="info-section-module" v-if="operation === 'AUDIT'">
      <div class="info-title">
        <svg-icon className="clear-module-icon" iconClass="icon-shenhe1" :style="{color: '#1590ff'}" />
        {{$t('fmsProfit.auditConfirmRemark')}}
      </div>
      <div class="info-content">
        <el-form ref="auditFormRef" :model="auditForm" size="mini" label-width="100px">
          <el-form-item label="" prop="result" :rules="[{ required: true, message: $t('common.selectPlaceholder') }]">
            <el-radio-group v-model="auditForm.result">
              <el-radio :label="true">{{$t('fmsProfit.agree')}}</el-radio>
              <el-radio :label="false">{{$t('fmsProfit.reject')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('fmsProfit.auditConfirmRemark')" prop="confirmRemark" :rules="[{ required: !auditForm.result, message: $t('common.can_not_be_null') }]">
            <el-input v-model="auditForm.confirmRemark" type="textarea" size="mini" />
          </el-form-item>
          <el-form-item :label="$t('fmsProfit.auditAttachments')" prop="auditAttachments">
            <upload-file v-model="auditForm.auditAttachments" multiple accept=".rar,.zip,.doc,.docx,.pdf,.xlsx,.xls"></upload-file>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: "OrderDetail",
	props: {
		detail: {
			type: Object,
			default: function () {
				return {
          profitApplyChargeCheckStateInfo: {
            profitApplyInnerCheckDetails: [],
            profitApplyOuterCheckDetails: [],
          },
          originalTotalAmount: {},
          totalAmount: {},
          innerTotalAmount: {
            innerTotalAmounts: [] // 费用内部往来
          },
          checkSuccessList: [],
          checkErrorList: []
        };
			}
		},
    operation: {
      type: String,
      default: ''
    }
	},
  computed: {
    showOuter() {
      return this.detail && 
        this.detail.profitApplyChargeCheckStateInfo && 
        this.detail.profitApplyChargeCheckStateInfo.profitApplyOuterCheckDetails.length
    },
    showInner() {
      return this.detail && 
        this.detail.profitApplyChargeCheckStateInfo && 
        this.detail.profitApplyChargeCheckStateInfo.profitApplyInnerCheckDetails.length
    }
  },
	data() {
		return {
      auditForm: {
        confirmRemark: '',
        auditAttachments: [],
      },
      submitForm: {
        submitRemark: '',
        submitAttachments: []
      },
      submitFormRules: { }
		};
	},
	created() {
    let flag = this.detail.checkErrorList.length > 0 ? true : false
    this.submitFormRules = {
      submitRemark: [{ required: flag, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
      submitAttachments: [{ required: flag, message: this.$t("common.cannot_be_null"), trigger: "blur" }]
    }
	},
	methods: {
    validate() {
      let VALID = true
      this.$refs.submitFormRef.validate(valid => {
        VALID = valid
      })
      if (!VALID) {
        this.mixinsFormScrollIntoView()
      }
      return VALID
    },
    getValue() {
      return this.submitForm
    },
    auditValidate(){
      let VALID = true
      this.$refs.auditFormRef.validate(valid => {
        VALID = valid
      })
      if (!VALID) {
        this.mixinsFormScrollIntoView()
      }
      return VALID
    },
    auditGetValue() {
      return this.auditForm
    },
	}
};
</script>
<style lang="scss" scoped>
.status-icon {
  position: absolute;
  right: 100px;
  top: 0px;
}
.charge-detail{
  overflow:hidden;
  border-top: 1px dashed #ccc;
  margin-top: 20px;
  clear: both;

  .clear-module-icon{
    width: 22px;
  }

  .charge-module{
    width: 50%;
    float: left;
  }
  .charge-title {
    font-size: 15px;
    font-weight: 600;
    height: 52px;
    line-height: 52px;
    padding: 0 20px;
  }
  .charge-content {
    padding: 0 25px;
    width: 100%;
    overflow: hidden;
  }
  .charge-content-container-left{
    background: #eee;
    padding: 15px 20px;
    border-radius: 5px;
    color: #777;

    .charge-item {
      margin-bottom: 16px;
      width: 100%;
      overflow: hidden;
      text-align: right;

      .charge-label {
        width: 140px;
        min-width: 110px;
        display: block;
        text-align: left;
        font-weight: 500;
        font-size: 14px;
        float: left;
        margin-right: 6px;
      }
    }
    .charge-item:last-child {
      margin-bottom: 0px;
    }
  }

  .charge-content-container-right{
    background: #eee;
    padding: 10px 20px;
    border-radius: 5px;
    color: #777;
    margin-bottom: 10px;

    .charge-item {
      margin-bottom: 10px;
      width: 100%;
      overflow: hidden;
      text-align: right;

      .charge-label {
        width: 140px;
        min-width: 110px;
        display: block;
        text-align: left;
        font-weight: 500;
        font-size: 14px;
        float: left;
        margin-right: 6px;
      }
    }
    .charge-item:last-child {
      margin-bottom: 0px;
    }
  }
}
.order-check{
  width: 50%;
  float: left;

  .order-check-title{
    margin-bottom: 6px;
    font-size: 15px;
    font-weight: 600;
    text-indent: 28px;
  }
  .order-check-item {
    line-height: 32px;
    text-indent: 38px;

    .icon-chenggong{
      color: rgb(21,126,213);
    }
    .icon-guanbi1{
      color: red;
    }
  }
}

.submit-form {
  overflow: hidden;
  width: 100%;
  margin-top: 10px;

  ::v-deep .el-form-item{
    width: 50%;
    float: left;
    padding-left: 28px;
  }

  ::v-deep .el-form-item__label{
    font-size: 15px!important;
    font-weight: 700!important;
  }
}

.info-section-module .info-content {
  overflow: hidden;
}
.icon-tishi {
  font-size: 13px;
  color: #409EFF;
}
</style>

