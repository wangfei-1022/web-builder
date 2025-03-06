<template>
	<div class="page-edit-container full-page">
		<div class="customer-edit page-edit-content">
      <div class="info-section-module">
					<div class="info-title">
            {{$t("uexpressClaim.order_base_info")}}
          </div>
          <div class="info-content">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.chancel_order_no")}}：</span>
              <span class="info-span">{{detail.chancelOrderNo}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.sales_order_no")}}：</span>
              <span class="info-span">{{detail.salesOrderNo}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.outbound_time")}}：</span>
              <span class="info-span">{{detail.outboundTime | parseTime}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.apply_claim_date")}}：</span>
              <span class="info-span">{{detail.applyClaimDate | parseTime}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.customer_name")}}：</span>
              <span class="info-span">{{detail.customerName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.pay_date")}}：</span>
              <span class="info-span">{{detail.payDate | parseTime}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.product_name")}}：</span>
              <span class="info-span">{{detail.productName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.declare_country")}}：</span>
              <span class="info-span">{{detail.podName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.charge_detail")}}：</span>
              <span class="info-span">
                  <div class="charge-item">
                    <span>{{$t("uexpressClaim.declare_value")}}</span>
                    <span>{{detail.declareAmount}}{{detail.declareCurrency}}</span>
                  </div>
                  <div class="charge-item" v-if="detail.freightAmount">
                    <span>{{$t("uexpressClaim.freight_amount")}}</span>
                    <span>{{detail.freightAmount}}{{detail.freightCurrency}}</span>
                   </div>
                  <div class="charge-item" v-if="detail.taxAmount">
                    <span>{{$t("uexpressClaim.tax_amount")}}</span>
                    <span>{{detail.taxAmount}}{{detail.taxCurrency}}</span>
                  </div>
                </span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.rate")}}：</span>
              <span class="info-span">{{detail.insuranceExchangeRate}}({{detail.declareCurrency}}:{{detail.insureCurrency}})</span>
            </div>
          </div>
      </div>

      <div class="info-section-module">
					<div class="info-title">
            {{$t("uexpressClaim.claim_info")}}
          </div>
          <div class="info-content">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.claim_reason")}}：</span>
              <span class="info-span">{{detail.claimReasonName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.claim_type")}}：</span>
              <span class="info-span">{{detail.claimTypeName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressClaim.goods_apply_claim_amounts")}}：</span>
              <span class="info-span">{{detail.goodsApplyClaimAmountsAll}}{{detail.goodsApplyClaimAmountsCurrency}}</span>
            </div>
            <div class="info-item full-line" v-if="detail.claimType == 2">
              <span class="info-label">{{$t("uexpressClaim.special_apply_claim_amounts")}}：</span>
              <span class="info-span">
                  <div v-for="(item,index) in detail.specialApplyClaimAmounts || []" :key="index">
                    <div class="charge-item" v-if="item.value">
                      <span>{{detail.specialClaimItemNames[index]}}</span>
                      <span>{{item.value}} {{item.currency}}</span>
                    </div>
                  </div>
                  <div class="charge-item" v-if="detail.freightAmount">
                    <span>{{$t("uexpressClaim.freight_amount")}}</span>
                    <span>{{detail.freightClaimAmount}}{{detail.freightClaimCurrency}}</span>
                   </div>
                  <div class="charge-item" v-if="detail.taxAmount">
                    <span>{{$t("uexpressClaim.tax_amount")}}</span>
                    <span>{{detail.taxClaimAmount}}{{detail.taxClaimCurrency}}</span>
                  </div>
                  <div class="charge-item" v-if="detail.otherClaimAmount">
                    <span>{{$t("uexpressClaim.other_amount")}}</span>
                    <span>{{detail.otherClaimAmount}}{{detail.otherClaimCurrency}}</span>
                  </div>
                </span>
            </div>
            <div class="info-item full-line" v-if="detail.claimType == 2">
              <span class="info-label">{{$t("uexpressClaim.special_reason")}}：</span>
              <span class="info-span">{{detail.specialReason}}</span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">{{$t("uexpressClaim.claim_amounts_all")}}：</span>
              <span class="info-span">{{detail.applyClaimAmountsAll}}</span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">{{$t("uexpressClaim.supporting_files")}}：</span>
              <span class="info-span">
                <div v-for="(item, index) in detail.supportingFiles" :key="index">
                  <a style="color: #3939f1;" :href="item.url" target="_blank">{{item.originFileName}}</a>
                </div>
              </span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">{{$t("uexpressClaim.responsible_role")}}：</span>
              <span class="info-span">{{detail.responsibleRoleName}}</span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">{{$t("uexpressClaim.remarks")}}：</span>
              <span class="info-span">{{detail.claimRemarks}}</span>
            </div>
          </div>
      </div>

      <div class="info-section-module" v-if="type === 'AUDIT'">
        <div class="info-title">
          {{$t("uexpressClaim.audit_oper")}}
        </div>
        <div class="info-content ">
          <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
            <el-form-item :label='$t("uexpressClaim.audit_res")' prop="auditType">
              <el-radio-group v-model="form.auditType">
                <el-radio :label="1">{{$t("uexpressClaim.audited")}}</el-radio>
                <el-radio :label="2">{{$t("uexpressClaim.rejected")}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.rejected_reason")' prop="failReason" v-if="form.auditType === 2">
              <el-input v-model="form.failReason" type="textarea"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>


			<div class="page-edit-footer">
				<el-button type="primary" plain size="mini" @click="backList" v-if="type === 'DETAIL'">{{$t("common.close")}}</el-button>
				<el-button size="mini" @click="backList" v-if="type === 'AUDIT'">{{$t("common.cancel")}}</el-button>
				<el-button type="primary" @click="onSubmit" size="mini" :loading="loading" v-if="type === 'AUDIT'">{{$t("common.submit")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import {
  getClaimCustomerDetailApi,
  auditClaimCustomerApi,
  rejectClaimCustomerApi,
  auditProductClaimCustomerApi,
  rejectProductClaimCustomerApi
 } from "@/api/uexpress/claimCustomerList";
import { parseTime, formatNumberToThousands, addFloatNum } from "@/utils/index";

export default {
	name: "UExpressClaimCustomerListAuditAndDetail",
  props: {
    type: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
			id: "",
      detail: {},
			form: {
        auditType: '',
				failReason: ''
			},
			formRule: {
        auditType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
				failReason: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			loading: false
		};
	},
	created() {
    this.id = this.$route.query.id
    this.shardingKey = this.$route.query.shardingKey
    if (this.id) {
      this.getDetail()
    }
	},
	methods: {
    getDetail() {
      let data = {
        claimId: this.id,
        shardingKey: this.shardingKey
      }
      getClaimCustomerDetailApi(data).then(res => {
        if (res.ok) {
          // 特殊理赔金额
          let detail = res.content
          let specialApplyClaimAmountsAll = 0
          detail.specialApplyClaimAmounts.forEach(curreny => {
            specialApplyClaimAmountsAll = addFloatNum(specialApplyClaimAmountsAll, curreny.value)
          })
          detail.specialApplyClaimAmountsCurrency = ''
          detail.specialApplyClaimAmountsAll = formatNumberToThousands(specialApplyClaimAmountsAll)
          if (detail.specialApplyClaimAmounts[0]) {
            detail.specialApplyClaimAmountsCurrency = detail.specialApplyClaimAmounts[0].currency
          }

          // 商品理赔金额
          let goodsApplyClaimAmountsAll = 0
          detail.goodsApplyClaimAmounts.forEach(curreny => {
            goodsApplyClaimAmountsAll = addFloatNum(goodsApplyClaimAmountsAll, curreny.value)
          })
          detail.goodsApplyClaimAmountsCurrency = ''
          detail.goodsApplyClaimAmountsAll = formatNumberToThousands(goodsApplyClaimAmountsAll)
           if (detail.goodsApplyClaimAmounts[0]) {
            detail.goodsApplyClaimAmountsCurrency = detail.goodsApplyClaimAmounts[0].currency
          }

          // 总计理赔金额
          detail.claimAmountsAll = formatNumberToThousands(addFloatNum(detail.goodsApplyClaimAmountsAll, detail.specialApplyClaimAmountsAll))
          detail.claimAmountsCurrency = detail.goodsApplyClaimAmountsCurrency

          this.detail = {
            ...detail,
            applyClaimAmountsAll: addFloatNum(goodsApplyClaimAmountsAll, specialApplyClaimAmountsAll)
          }
        }
      })
    },
		onSubmit() {
			this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            claimShardingKey: this.shardingKey,
            claimId: this.id
          }
          if (this.form.auditType === 2) {
            data.failReason = this.form.failReason
          }
					this.loading = true;
          let fn = null
          if (this.detail.claimState === 20) {
            fn = this.form.auditType === 1 ? auditClaimCustomerApi : rejectClaimCustomerApi
          } else if (this.detail.claimState === 30) {
            fn = this.form.auditType === 1 ? auditProductClaimCustomerApi : rejectProductClaimCustomerApi
          }
					let msg = this.form.auditType === 1 ? this.$t("uexpressClaim.audit_success") : this.$t("uexpressClaim.reject_success");

					fn(data).then(res => {
						if (res.ok) {
							this.$message.success(msg);
							this.backList();
						}
						this.loading = false;
					});
				} else {
					this.mixinsFormScrollIntoView();
				}
			});
		},
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: `UExpressClaimCustomerList` });
		}
	}
};
</script>
<style scoped lang="scss">
.charge-item {
  margin-bottom: 10px;

  span {
    width: auto;
  }
  label {
    width: auto!important;
    margin-bottom: 0!important;
  }
}

</style>
