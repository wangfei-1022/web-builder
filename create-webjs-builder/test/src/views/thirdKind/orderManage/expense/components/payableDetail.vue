<template>
  <div class="order-item">
    <div class="title">
      <!-- 应付费用确认单 -->
      <span>{{ $t('air.payableExpenseConfirmation') }}：
        <!-- 目前不做 -->
        <!-- <a class="link" @click="view()">{{ item.confirmationNo }}
          <span :style="{ color: item.confirmationState === 11 ? 'red' : '' }">（{{ item.confirmationStateName
          }}）</span>
        </a> -->
        {{ item.confirmationNo }}
        <span :style="{ color: item.confirmationState === 11 ? 'red' : '' }">（{{ item.confirmationStateName }}）</span>
      </span>
      <span style="float: right">
        <!-- 费用确认 -->
        <el-button v-if="lockOrderFlag && item.confirmationState === 1 && order.orderState !== 100" type="primary" size="mini"
          @click="confirmCharge(item)">
          {{ $t("receiveFms.charge_confirm") }}
        </el-button>
        <!-- 删除 -->
        <el-button type="danger" size="mini" @click="deleteFn"
          v-if="lockOrderFlag && item.confirmationState === 1 && order.orderState !== 100"
          v-permission="['thk:order:pay:conf:del']">{{ $t('air.delete') }}</el-button>
        <!-- 编辑 -->
        <el-button type="primary" size="mini" @click="editOrder"
          v-if="lockOrderFlag && item.confirmationState < 2 && order.orderState !== 100"
          v-permission="['thk:order:pay:conf:edit']">{{ $t('air.edit') }}</el-button>
        <!-- 调整确认 -->
        <el-button type="primary" size="mini" @click="confirmationAdjust(item)"
          v-if="lockOrderFlag && item.confirmationState === 11 && order.orderState !== 100"
          v-permission="['thk:order:pay:conf:adjustConfirmation']">{{ $t('air.adjustConfirmation') }}</el-button>
        <!-- 调整 -->
        <el-button type="primary" size="mini" @click="editOrder"
          v-if="lockOrderFlag && item.confirmationState === 11 && order.orderState !== 100"
          v-permission="['thk:order:pay:conf:adjust']">{{ $t('air.adjust') }}</el-button>
        <!-- 导出 -->
        <el-button type="primary" size="mini" v-if="order.orderState !== 100" @click="exportFn"
          v-permission="['thk:order:pay:conf:export']">{{ $t('air.export') }}
        </el-button>
      </span>
    </div>
    <div class="company">
      <el-row>
        <!-- 结算单位类型 -->
        <!-- <el-col :span="5"><label>{{ $t('air.settlementUnitType') }}</label>{{ item.partnerRole | partnerRoleName(that)
        }}
        </el-col> -->
        <!-- 供应商 -->
        <el-col :span="7"><label>{{ $t('air.supplier') }}</label>{{ item.scmSupplierCnName }}</el-col>
        <!-- 结算单位 -->
        <el-col :span="7"><label>{{ $t('air.settlementUnit') }}</label>{{ item.settlementCompanyName }}</el-col>
        <!-- 结算方式 -->
        <el-col :span="3"><label>{{ $t('air.settlementMethod') }}</label> {{ item.settlementModeName }}</el-col>
        <!-- 付款账套 -->
        <el-col :span="7"> <label>{{ $t('air.paymentACSet') }}</label> {{ item.settlementOfficeName }}</el-col>
      </el-row>
    </div>
    <el-table size="mini" :data="item.charges" style="width: 100%" row-key="id" :border="true">
      <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')"></el-table-column>
      <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')"></el-table-column>
      <el-table-column prop="currency" :label="$t('receiveFms.currency')"></el-table-column>
      <el-table-column prop="price" :label="$t('receiveFms.price')">
        <template slot-scope="scope">
          <div style="text-align: right">
            {{ scope.row.price | formatNumberToThousandsFilter }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chargeQuantity1" :label="$t('receiveFms.number')"></el-table-column>
      <!-- <el-table-column prop="soakRate" :label="$t('air.soakRate')">
        <template slot-scope="scope">
          <div>
            {{ scope.row.soakRate ? scope.row.soakRate + '%' : "" }}
          </div>
        </template>
      </el-table-column> -->

      <el-table-column prop="invoiceTaxRateName" :label="$t('receiveFms.tax_rate')"></el-table-column>
      <el-table-column prop="remark" :label="$t('air.remark')">
      </el-table-column>
      <el-table-column prop="taxAmount" :label="$t('receiveFms.tax_amount')">
        <template slot-scope="scope">
          <div style="text-align: right">
            {{ scope.row.taxAmount | formatNumberToThousandsFilter }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="excludeTaxAmount" :label="$t('receiveFms.exclude_tax_amount')" min-width="100">
        <template slot-scope="scope">
          <div style="text-align: right">
            {{ scope.row.excludeTaxAmount | formatNumberToThousandsFilter }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="amount" :label="$t('receiveFms.charge_amount')" min-width="100">
        <template slot-scope="scope">
          <div style="text-align: right">
            {{ scope.row.amount | formatNumberToThousandsFilter }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('receiveFms.operation')" min-width="60">
        <template slot-scope="{ row }">
          <img v-permission="['thk:order:pay:conf:move']" src="/static/move.svg" style="width: 20px; cursor: pointer"
            @click="moveFn(row)"
            v-if="lockOrderFlag && item.confirmationState === 1 && item.charges.length > 1 && order.orderState !== 100" />
        </template>
      </el-table-column>
    </el-table>
    <div class="total">
      <span>{{ $t("payableFms.payable_sum") }}：</span>
      <span>
        <span class="value-item" v-for="(item, index) in item.amounts || []" :key="index">
          <span class="value">{{ item.currency }}</span>
          <span>{{ item.value | formatNumberToThousandsFilter }}</span>
        </span>
      </span>
    </div>
    <el-dialog :title="$t('air.move')" :visible.sync="visible" width="450px">
      <el-form ref="moveFormRef" :model="moveForm" :rules="moveFormRule" class="addForm">
        <div style="margin-bottom: 15px">
          {{ $t("air.moveConfirmationWarm") }}
        </div>
        <el-form-item :label="$t('air.confirmationIdTo')" prop="confirmationIdTo">
          <el-select v-model="moveForm.confirmationIdTo" size="mini" filterable>
            <el-option v-for="item in noList" :key="item.id" :label="item.confirmationNo" :value="item.id" />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" plain @click="newAddConfirm()" style="float: left">
          {{ $t("air.newAddConfirm")
          }}</el-button>
        <el-button size="mini" @click="visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button size="mini" type="primary" @click="moveConfirm()">{{
          $t("common.confirm")
        }}</el-button>
      </span>
    </el-dialog>

    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data"
      :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow = false" />
  </div>
</template>
<script>
import { delPayConfirmationApi, payConfirmationRemoveApi, payConfirmationMoveToNewApi, payConfirmationConfirmApi, confirmationAdjustSubmitApi } from "@/api/thirdKind"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import { validEmail } from "@/utils/validate"
export default {
	name: "PayableDetail",
	components: {
		reportListDialog
	},
	props: {
		order: {
			type: Object,
			default: function () {
				return {
					baseDTO: {}
				}
			}
		},
		noList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		item: {
			type: Object,
			default: function () {
				return {};
			}
		},
		index: Number
	},
	data() {
		return {
			that: this,
			visible: false,
			moveForm: {
				confirmationIdTo: ""
			},
			moveFormRule: {
				confirmationIdTo: [
					{
						required: true,
						message: this.$t("receiveFms.please_select"),
						trigger: "change"
					}
				]
			},
			moveChargeId: "",
			loading: false,
			reportDialog: {
				// 打印报表对话框
				isShow: false,
				typeCode: "",
				data: {
					jobId: "",
					assistInfo: "",
					definedInfo: "",
					entityIdList: [],
					remark: ""
				}
			}
		};
	},
	created() { },
	computed: {
		lockOrderFlag() {
			// true 未上锁  false 上锁
			return [0, 30].includes(this.order.lockOrderState)
		},
	},
	filters: {
		partnerRoleName(item, that) {
			let roleName = ""
			switch (item) {
				case 12015:
					roleName = that.$t('air.airlineName')
					break;

				case 14014:
					roleName = that.$t('air.nationalEncouragementscholarship')
					break;

				case 16010:
					roleName = that.$t('air.customsBroker')
					break;

				case 11011:
					roleName = that.$t('air.warehouseDistributionServiceProvider')
					break;

				case 12011:
					roleName = that.$t('air.truckCompany')
					break;

				case 14012:
					roleName = that.$t('air.destinationAgentName')
					break;
				default:
					break;
			}
			return roleName
		}
	},

	methods: {
		// 查看
		view() {
			this.$router.push({
				name: `PayFmsDetail`,
				query: { id: this.item.confirmationId, origin: "close" }
			});
		},
		exportFn() {
			// 根据查询条件进行批量打印
			this.reportDialog.typeCode = "THK_DEBIT_NOTE";
			this.reportDialog.data = { jobId: null, entityIdList: [this.item.confirmationId] };
			// this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
			this.reportDialog.isShow = true;
		},

		deleteFn() {
			this.$confirm(this.$t("air.isDeleteFn"), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			}).then(async () => {
				this.$emit('triggerPayableLoading', true)
				const res = await delPayConfirmationApi(this.item.confirmationId)
				if (res.ok) {
					this.$emit("init");
					this.$message.success(this.$t("air.successfullyDeleted"));
				} else {
					this.$emit('triggerPayableLoading')
				}
			}).catch(() => { });
		},
		editOrder() {
			this.$emit("editFn", this.index);
		},
		moveFn(row) {
			this.moveForm.confirmationIdTo = "";
			this.moveChargeId = row.id;
			this.visible = true;
		},
		moveConfirm() {
			this.$refs.moveFormRef.validate(async valid => {
				if (valid) {
					this.$emit('triggerPayableLoading', true)
					this.visible = false;
					let data = {
						confirmationIdFrom: this.item.confirmationId,
						confirmationIdTo: this.moveForm.confirmationIdTo,
						chargeIds: [this.moveChargeId]
					};
					const res = await payConfirmationRemoveApi(data)
					if (res.ok) {
						this.$message.success(this.$t("air.moveSuccess"));
						this.$emit("init");
					} else {
						this.$emit('triggerPayableLoading')
					}
				}
			});
		},
		async newAddConfirm() {
			this.$emit('triggerPayableLoading', true)
			this.visible = false;
			let data = {
				confirmationIdFrom: this.item.confirmationId,
				chargeIds: [this.moveChargeId]
			};
			const res = await payConfirmationMoveToNewApi(data)
			if (res.ok) {
				this.$message.success(this.$t("air.moveSuccess"));
				this.$emit("init");
			} else {
				this.$emit('triggerPayableLoading')
			}
		},
		// 费用确认
		confirmCharge(item) {
			this.$confirm(
				this.$t("receiveFms.charge_confirm_des"),
				this.$t("receiveFms.mention"),
				{
					confirmButtonText: this.$t("common.confirm"),
					cancelButtonText: this.$t("common.cancel"),
					type: "warning"
				}
			).then(async () => {
				this.$emit('triggerPayableLoading', true)
				const res = await payConfirmationConfirmApi(item.confirmationId)
				if (res.ok) {
					this.$message.success(
						this.$t("receiveFms.charge_confirm_success")
					);
					this.$emit("init");
				} else {
					this.$emit('triggerPayableLoading')
				}
			}).catch(() => { });
		},

		// 调整确认
		confirmationAdjust(item) {
			this.$confirm(
				this.$t("air.chargeAdjustDes"),
				this.$t("receiveFms.mention"),
				{
					confirmButtonText: this.$t("common.confirm"),
					cancelButtonText: this.$t("common.cancel"),
					type: "warning"
				}
			).then(async () => {
				this.$emit('triggerPayableLoading', true)
				let confirmationIds = [];
				confirmationIds.push(item.confirmationId)
				const res = await confirmationAdjustSubmitApi({ "confirmationIds": confirmationIds })
				if (res.ok) {
					this.$message.success(
						this.$t("air.chargeAdjustSuccess")
					);
					this.$emit("init");
				} else {
					this.$emit('triggerPayableLoading')
				}
			}).catch(() => { });
		},

		// 发送短信
		validateEmail(rule, value, callback) {
			if (value) {
				let emailArr = value.split(';')
				let isSome = emailArr.some(item => {
					if (!validEmail(item)) {
						callback(new Error(item + this.$t('blInfo.emailError')))
						return true
					}
				})
				if (!isSome) {
					callback()
				}
			} else {
				callback()
			}
		}
	}
};
</script>

<style scoped lang="scss">
.charge-tab {
	background: #fff;
	padding: 20px;
}

.order-item {
	border: 1px solid #dcdfe6;
	box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
	margin-bottom: 20px;

	.title {
		font-weight: 600;
		line-height: 60px;
		padding: 0 20px;
		border-bottom: 1px solid #ccc;
	}

	.link {
		font-weight: 500;
		color: #1890ff;
	}

	.company {
		line-height: 40px;
		padding: 0 20px;
		overflow: hidden;

		label {
			font-weight: 400;
			margin-right: 20px;
		}
	}
}

.add {
	padding: 10px;
	text-align: center;
	border: 1px dashed blue;
	box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
}

.total {
	background: rgba(16, 142, 233, 0.1);
	color: #108ee9;
	font-family: "PingFangSC-Regular", "PingFang SC";
	font-weight: 400;
	font-style: normal;
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	padding: 0px 10px;

	.value-item {
		display: inline-block;
		margin-right: 30px;

		.value {
			display: inline-block;
			margin-right: 5px;
		}
	}
}

.footer-btn {
	margin-top: 30px;
	text-align: right;
}
</style>
