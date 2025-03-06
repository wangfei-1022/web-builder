<template>
  <div class="container">
    <div v-if="item.isClearMany" class="des">
      <div class="title"><i class="m-icon el-icon-warning-outline" />
        {{item.currency}}{{$t('fmsPayablePayment.applyClearAmountUnpay')}} &gt; {{$t('fmsPayablePayment.transactionsAmountUse')}}
      </div>
      <div>{{$t('fmsPayablePayment.pleaseSelectReason')}}</div>
    </div>
    <div v-if="!item.isClearMany" class="des">
      <div class="title"><i class="m-icon el-icon-warning-outline" />
        {{item.currency}}{{$t('fmsPayablePayment.applyClearAmountUnpay')}} &lt; {{$t('fmsPayablePayment.transactionsAmountUse')}}
      </div>
      <div>{{$t('fmsPayablePayment.pleaseSelectReason')}}</div>
    </div>
    <el-form ref="formDataForm" :model="formData" :rules="formDataRules" size="mini">
      <el-form-item label="" prop="reason">
        <el-select v-model="formData.reason" size="mini" style="width: 100%;">
          <el-option v-for="item in reasonList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="remark" v-if="formData.reason == 9">
        <el-input v-model="formData.remark" type="textarea" size="mini" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getDictDataApi } from "@/api/financial/fmsReceive";

// 申请核销
export default {
	name: "PaymentClearReasonItem",
	props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
	data() {
		return {
			visible: false,
			formData: {
				reason: "",
				remark: ""
			},
			formDataRules: {
				reason: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "change" }],
				remark: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }]
			},
			isClearMany: true,
			reasonList: []
		};
	},
  created() {
    // 核销金额大于付款
    if (this.item.isClearMany) {
      // 付款少付的原因
			getDictDataApi(43).then(res => {
        this.reasonList = res.content;
      });
    } else {
      // 付款多付的原因
			getDictDataApi(44).then(res => {
        this.reasonList = res.content;
      });
    }
  },
	methods: {
    getValue() {
      return {
        ...this.item,
        ...this.formData
      }
    },
		validate() {
      let VALID = false
      this.$refs.formDataForm.validate(valid => {
				VALID = valid
			});
      return VALID
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	::v-deep .el-table--border th {
		background: #f5f7fa;
	}
}
.des {
	line-height: 40px;

	.title {
		font-weight: 600;
		font-size: 15px;
	}
}

.m-icon {
	font-size: 26px;
	line-height: 26px;
	color: #1890ff;
	margin-right: 10px;
	float: left;
	margin-top: 5px;
}
</style>
