<template>
	<el-dialog :visible.sync="visible" :close-on-click-modal="false" width="400px" :title="$t('fmsPayableClear.clearReason')">
		<div class="container" v-for="(item, index) in diffList" :key="index">
      <PaymentClearReasonItem :ref="'paymentClearReasonItemRef' + index" :item="item"/>
		</div>

		<div slot="footer" class="option-btn-wrap">
			<el-button size="mini" @click="visible = false">{{ $t("common.cancel")}}</el-button>
			<el-button size="mini" type="primary" @click="confirmFn">{{ $t("common.confirm") }}</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getDictDataApi } from "@/api/financial/fmsReceive";
import PaymentClearReasonItem from './PaymentClearReasonItem'

// 申请核销
export default {
	name: "PaymentClearReasonModal",
	props: {
    arap: {
      type: String,
      default: ''
    }
  },
  components: {
    PaymentClearReasonItem
  },
	data() {
		return {
			visible: false,
			diffList: [],
			cleatManyReasonList: []
		};
	},
	methods: {
    // isClearMany // 核销大于付款
		show(diffList) {
      this.diffList = []
			this.visible = true;
      this.$nextTick(() => {
        this.diffList = diffList
      })
		},
		confirmFn() {
      let valid = true
      let reasonMap = {}
      Object.keys(this.$refs).forEach(key => {
        if (this.$refs[key][0]) {
          let v = this.$refs[key][0].validate()
          let value = this.$refs[key][0].getValue()
          if (!v) {
            valid = false
          }
          reasonMap[value.currency] = value
        }
      })
      if (valid) {
        this.$emit("ok", reasonMap);
        this.visible = false;
      }
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
