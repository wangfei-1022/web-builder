<template>
	<div class="page-edit-container full-page">
		<div class="customer-edit page-edit-content">
      <div class="member-item">
        <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini" style="width: 666px;">
          <div class="title">
            {{type == 'ADD' ? $t("uexpressClaim.add_claim"): $t("uexpressClaim.edit_claim")}}
          </div>
          <div class="content">
            <el-form-item :label='$t("uexpressClaim.sales_order_no")' prop="salesOrderNo">
              <el-input v-model="form.salesOrderNo" disabled></el-input>
            </el-form-item>
            <div class="detail-container" v-if="checkMap.customerName">
              <div class="detail-item full-line">
                <label>{{$t("uexpressClaim.customer_name")}}</label><span>{{checkMap.customerName}}</span>
              </div>
              <div class="detail-item">
                <label>{{$t("uexpressClaim.product_name")}}</label><span>{{checkMap.productName}}</span>
              </div>
              <div class="detail-item">
                <label>{{$t("uexpressClaim.declare_country")}}</label><span>{{checkMap.declareCountryName}}</span>
              </div>
              <div class="detail-item">
                <label>{{$t("uexpressClaim.charge_detail")}}</label>
                <span>
                  <div class="charge-item">
                    <label>{{$t("uexpressClaim.declare_value")}}</label>
                    <span>{{checkMap.declareAmount}}{{checkMap.declareCurrency}}</span>
                  </div>
                  <div class="charge-item" v-if="checkMap.freightAmount">
                    <label>{{$t("uexpressClaim.freight_amount")}}</label>
                    <span>{{checkMap.freightAmount}}{{checkMap.freightCurrency}}</span>
                   </div>
                  <div class="charge-item" v-if="checkMap.taxAmount">
                    <label>{{$t("uexpressClaim.tax_amount")}}</label>
                    <span>{{checkMap.taxAmount}}{{checkMap.taxCurrency}}</span>
                  </div>
                </span>
              </div>
              <div class="detail-item">
                <label>{{$t("uexpressClaim.rate")}}</label>
                <span>{{checkMap.insuranceExchangeRate}}({{checkMap.declareCurrency}}:{{checkMap.insureCurrency}})</span>
              </div>
            </div>
            <el-form-item :label='$t("uexpressClaim.claim_reason")' prop="claimReason">
              <el-select v-model="form.claimReason" size="mini" style="width: 100%" filterable >
                <el-option v-for="item in claimReasonList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.claim_type")' prop="claimType">
              <el-select v-model="form.claimType" size="mini" style="width: 100%" filterable>
                <el-option v-for="item in claimTypeList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.goods_apply_claim_amounts")' prop="goodsClaimAmount">
              <el-input v-model="form.goodsClaimAmount">
                 <template slot="append">{{form.goodsClaimCurrency}}</template>
              </el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.special_apply_claim_amounts")' prop="remarks" v-if="form.claimType == 2">
              <div class="spe-item">
                <span>{{$t("uexpressClaim.freight_amount")}}</span>
                <el-input v-model="form.freightClaimAmount" style="width: 150px"></el-input>
                <span>{{form.freightClaimCurrency}}</span>
              </div>
              <div class="spe-item">
                <span>{{$t("uexpressClaim.tax_amount")}}</span>
                <el-input v-model="form.taxClaimAmount" style="width: 150px"></el-input>
                <span>{{form.taxClaimCurrency}}</span>
              </div>
              <div class="spe-item">
                <span>{{$t("uexpressClaim.other_amount")}}</span>
                <el-input v-model="form.otherClaimAmount" style="width: 150px"></el-input>
                <span>{{form.otherClaimCurrency}}</span>
              </div>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.special_reason")' prop="specialReason" v-if="form.claimType == 2">
              <el-input v-model="form.specialReason" type="textarea"></el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.supporting_files")' prop="supportingFiles">
              <upload-file v-model="form.supportingFiles" />
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.responsible_role")' prop="responsibleRole">
              <el-select v-model="form.responsibleRole" size="mini" style="width: 100%" filterable>
                <el-option v-for="item in responsibleRoleList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.remarks")' prop="claimRemarks">
              <el-input v-model="form.claimRemarks" type="textarea"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>

			<div class="page-edit-footer">
				<el-button size="mini" @click="backList">{{$t("common.cancel")}}</el-button>
				<el-button type="primary" @click="onSubmit" size="mini" :loading="loading">{{$t("common.submit")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { checkClaimDetailByOrderNoApi, createClaimCustomerApi, updateClaimCustomerApi, getEditClaimDetailApi, resubmitClaimCustomerApi } from "@/api/uexpress/claimCustomerList";
import { getDictListApi } from "@/api/uexpress/base";

export default {
	name: "ClaimCustomerListAddAndEdit",
  props: {
    type: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
      orderNo: '',
			id: "",
      shardingKey: '',
			form: {
        salesOrderNo: '',
        insuranceId: '', // 保单id
        insuranceShardingKey: '', // 保单分片键
        claimReason: '', // 理赔原因
        claimType: '', // 理赔类型
        goodsClaimCurrency: 'CNY', // 商品理赔币种
        goodsClaimAmount: '', // 商品理赔金额
        specialReason: '', // 特殊理赔原因
        freightClaimCurrency: 'CNY', // 运费理赔币种
        freightClaimAmount: '', // 运费理赔金额
        taxClaimCurrency: 'CNY', // 税费理赔币种
        taxClaimAmount: '', // 税费理赔金额
        otherClaimCurrency: 'CNY', // 其它费用理赔币种
        otherClaimAmount: '', // 其它费用理赔金额
        responsibleRole: '', // 责任方
        claimRemarks: '', // 备注
				supportingFiles: [] // 证明文件
			},
			formRule: {
				salesOrderNo: [
          {
            required: true,
            message: this.$t("common.cannot_be_null"),	trigger: "change"
          }],
        claimReason: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        claimType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        goodsClaimAmount: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        supportingFiles: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			loading: false,
      claimReasonList: [],
      claimTypeList: [],
      responsibleRoleList: [],
      checkMap: {}
		};
	},
	created() {
    this.id = this.$route.query.id
    this.salesOrderNo = this.$route.query.salesOrderNo
    this.shardingKey = this.$route.query.shardingKey
    if (this.id) {
      this.getDetail()
    } else if (this.salesOrderNo) {
      this.getCheckDetail(this.salesOrderNo)
    }
		this.getBaseDataFn();
	},
	methods: {
    getBaseDataFn() {
			Promise.all([getDictListApi(20), getDictListApi(21), getDictListApi(25)]).then(results => {
				const claimReasonRes = results[0];
        const claimTypeRes = results[1];
        const responsibleRoleRes = results[2];

				if (claimReasonRes.ok) {
					this.claimReasonList = claimReasonRes.content;
				}
				if (claimTypeRes.ok) {
					this.claimTypeList = claimTypeRes.content;
				}
        if (responsibleRoleRes.ok) {
					this.responsibleRoleList = responsibleRoleRes.content;
				}
			});
		},
    getDetail() {
      getEditClaimDetailApi({claimId: this.id, shardingKey: this.shardingKey}).then(res => {
        if (res.ok) {
          this.form = {
            salesOrderNo: this.salesOrderNo,
            ...this.form,
            ...res.content
          }
        }
      })
    },
    async getCheckDetail(orderNo) {
      let res = await checkClaimDetailByOrderNoApi({orderNo: orderNo})
      if (res.ok) {
        // 设置值
        this.checkMap = res.content
        this.form.salesOrderNo = this.salesOrderNo
        this.form.goodsClaimAmount = res.content.goodsClaimAmount
        // this.form.goodsClaimCurrency = res.content.goodsClaimCurrency
        this.form.freightClaimAmount = res.content.freightClaimAmount
        // this.form.freightClaimCurrency = res.content.freightClaimCurrency
        this.form.taxClaimAmount = res.content.taxClaimAmount
        // this.form.taxClaimCurrency = res.content.taxClaimCurrency
        this.form.otherClaimAmount = res.content.otherClaimAmount
        // this.form.otherClaimCurrency = res.content.otherClaimCurrency
        this.form.claimReason = res.content.claimReason
        this.form.responsibleRole = res.content.responsibleRole
      } else {
        this.checkMap = {}
      }
      return res
    },
		onSubmit() {
			this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            ...this.form,
            claimId: this.id,
            claimShardingKey: this.shardingKey,
            insuranceId: this.checkMap.insuranceId,
            insuranceShardingKey: this.checkMap.insuranceShardingKey
          }
					this.loading = true;
          let fn = this.id ? resubmitClaimCustomerApi : createClaimCustomerApi
					fn(data).then(res => {
						if (res.ok) {
							let msg = this.id ? this.$t("uexpressClaim.edit_success") : this.$t("uexpressClaim.add_success");
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
.customer-edit {
	::v-deep .el-table th > .cell {
		color: #555;
		font-size: 15px;
	}

	.member-item {
		overflow: hidden;
		padding: 20px 0;
		background: #fff;
		margin-bottom: 20px;
		border-radius: 5px;

		.title {
			font-size: 16px;
			font-weight: 600;
			border-bottom: 1px solid #f0f2f5;
			margin-bottom: 15px;
			padding: 0 20px 15px 20px;
		}
		.content {
			padding: 0 20px;
		}
	}

	.height33 {
		height: 33px;
	}

}
.full-line {
  margin-right: 40px;
}

.if_member_admin_account {
	::v-deep.el-form-item__label {
		width: 200px !important;
	}
}

.detail-container{
  overflow: hidden;

  .detail-item{
    width: 50%;
    float: left;
    margin-bottom: 15px;
    display: flex;
    color: #606266;
    font-size: 12px;

    label {
      width: 110px;
      display: block;
      text-align: right;
      margin-bottom: 10px;
      font-weight: 500;
      float: left;
      margin-right: 6px;
    }
    span {
      font-weight: 500;
      display: inline;
      flex: 1;
    }
  }
}

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
.spe-item{
  margin-bottom: 10px;

  span{
    color: #606266;
    font-size: 12px;
    margin-right: 10px;
  }
}
</style>
