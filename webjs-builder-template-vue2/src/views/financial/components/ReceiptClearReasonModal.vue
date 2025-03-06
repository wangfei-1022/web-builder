<template>
	<el-dialog :visible.sync="visible" :close-on-click-modal="false" width="400px" :title="$t('fmsReceiveClear.clearReason')">
		<div class="container">
			<div v-if="isClearMany && false" class="des">
				<div class="title"><i class="m-icon el-icon-warning-outline" />
          {{$t('fmsReceiveClear.transactionsAmount')}} &lt; {{$t('fmsReceiveClear.applyClearAmount')}}
        </div>
				<div>{{$t('fmsReceiveClear.transactionsAmountLessThanApplyClearAmount')}}</div>
			</div>
			<div v-if="!isClearMany && false" class="des">
				<div class="title"><i class="m-icon el-icon-warning-outline" />
          {{$t('fmsReceiveClear.transactionsAmount')}} &gt; {{$t('fmsReceiveClear.applyClearAmount')}}
        </div>
				<div>{{$t('fmsReceiveClear.transactionsAmountGreaterThanApplyClearAmount')}}</div>
			</div>
			<div class="des">
				<div class="title"><i class="m-icon el-icon-warning-outline" />
          {{$t('fmsReceiveClear.pleaseSelectReason')}}
        </div>
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

		<div slot="footer" class="option-btn-wrap">
			<el-button size="mini" @click="visible = false">{{ $t("common.cancel")}}</el-button>
			<el-button size="mini" type="primary" @click="confirmFn">{{ $t("common.confirm") }}</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getDictDataApi } from "@/api/financial/fmsReceive";

// 申请核销
export default {
	name: "ClearReasonModal",
	props: {
    arap: {
      type: String,
      default: ''
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
	watch: {
		settlementOfficeId: {
			handler(val) {
				if (val) {
					this.getList();
				}
			},
			deep: true,
			immediate: true
		},
		settlementCompanyId: {
			handler(val) {
				if (val) {
					this.getList();
				}
			},
			deep: true,
			immediate: true
		}
	},
	created() {},
	methods: {
		show(isClearMany) {
			// 核销大于收款
			if (isClearMany) {
				this.isClearMany = true;
				getDictDataApi(24).then(res => {
					this.reasonList = res.content;
				});
			} else {
				this.isClearMany = false;
				getDictDataApi(27).then(res => {
					if (res.ok) {
						this.reasonList = res.content;
					}
				});
			}
			this.formData = {
				reason: "",
				remark: ""
			};
			this.visible = true;
		},
		getList() {},
		backList() {},
		confirmFn() {
			this.$refs.formDataForm.validate(valid => {
				if (valid) {
					this.$emit("ok", this.formData);
					this.visible = false;
				}
			});
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
