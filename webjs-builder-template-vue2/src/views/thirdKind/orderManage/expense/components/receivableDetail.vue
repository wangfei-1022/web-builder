<template>
  <div class="order-item">
    <div class="title">
      <!-- 应收费用确认单 -->
      <span>{{ $t('air.receivableExpenseConfirmationDocument') }}：
        <!-- 目前不做 -->
        <!-- <a class="link" @click="view()">{{ item.confirmationNo }}
          <span :style="{ color: item.confirmationState === 11 ? 'red' : '' }">（{{ item.confirmationStateName }}）</span>
        </a> -->
        {{ item.confirmationNo }}
        <span :style="{ color: item.confirmationState === 11 ? 'red' : '' }">（{{ item.confirmationStateName }}）</span>
      </span>
      <span style="float: right">
        <!-- 申请开票 -->
        <el-button v-if="item.confirmationState === 2 &&
          ((item.invoiceState === 1 || item.invoiceState === 2) && (item.invoiceApplyState === 1 || item.invoiceApplyState === 2) && item.settlementMode === 1)
          &&
          order.orderState !== 100" size="mini" type="primary" @click="applyInvoice()"
          v-permission="['thk:order:conf:applyInvoice']">
          {{ $t('air.applyForInvoice') }}</el-button>
        <!-- 申请核销 -->
        <el-button size="mini" type="primary" v-permission="['thk:order:conf:applicationWriteOff']"
          v-if="applyOrHedgeClearShow(item)" @click="applyOrHedgeClear(false)">{{
            $t('air.applicationWriteOff')
          }}</el-button>
        <!-- 费用确认 -->
        <el-button v-if="lockOrderFlag && item.confirmationState === 1 && order.orderState !== 100" type="primary" size="mini"
          @click="confirmCharge(item)" v-permission="['thk:order:conf:chargeConfirm']">
          {{ $t("receiveFms.charge_confirm") }}
        </el-button>
        <!-- 删除 -->
        <el-button type="danger" size="mini" @click="deleteFn"
          v-if="lockOrderFlag && item.confirmationState === 1 && order.orderState !== 100"
          v-permission="['thk:order:conf:del']">{{ $t('air.delete') }}</el-button>
        <!-- 编辑 -->
        <el-button type="primary" size="mini" @click="editOrder"
          v-if="lockOrderFlag && item.confirmationState < 2 && order.orderState !== 100"
          v-permission="['thk:order:conf:edit']">{{ $t('air.edit') }}</el-button>
        <!-- 调整确认 -->
        <el-button type="primary" size="mini" @click="confirmationAdjust(item)"
          v-if=" lockOrderFlag && item.confirmationState === 11 && order.orderState !== 100"
          v-permission="['thk:order:conf:adjustConfirmation']">{{ $t('air.adjustConfirmation') }}</el-button>
        <!-- 调整 -->
        <el-button type="primary" size="mini" @click="editOrder"
          v-if="lockOrderFlag && item.confirmationState === 11 && order.orderState !== 100"
          v-permission="['thk:order:conf:adjust']">{{ $t('air.adjust') }}</el-button>
        <!-- 导出 -->
        <el-button type="primary" size="mini" @click="exportFn" v-if="order.orderState !== 100"
          v-permission="['thk:order:conf:export']">{{ $t('air.export') }}
        </el-button>
        <!-- 发送至客户 -->
        <el-button type="primary" size="mini" @click="sendCustomer" v-if="order.orderState !== 100" v-permission="['thk:order:conf:sendEmail']">{{
          $t('air.sendToCustomer')
        }}
        </el-button>
      </span>
    </div>
    <div class="company">
      <el-row>
        <!-- 结算单位类型 -->
        <el-col :span="5"><label>{{ $t('air.settlementUnitType') }}</label>{{
          item.partnerRole | partnerRoleName(that)
        }}
        </el-col>
        <!-- 结算单位 -->
        <el-col :span="8"><label>{{ $t('air.settlementUnit') }}</label>{{ item.settlementCompanyName }}</el-col>
        <!-- 结算方式 -->
        <el-col :span="4"><label>{{ $t('air.settlementMethod') }}</label> {{ item.settlementModeName }}</el-col>
        <!-- 收款账套 -->
        <el-col :span="7"> <label>{{ $t('air.collectionACSet') }}</label> {{ item.settlementOfficeName }}</el-col>
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
      <!-- <el-table-column prop="extendInfo1" :label="$t('air.soakRate')">
        <template slot-scope="scope">
          <div>
            {{ scope.row.extendInfo1 ? scope.row.extendInfo1 + '%' : "" }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="invoiceTaxRateName" :label="$t('receiveFms.tax_rate')"></el-table-column>
      <el-table-column prop="remark" :label="$t('air.remark')"> </el-table-column>
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
          <img v-permission="['thk:order:conf:move']" src="/static/move.svg" style="width: 20px; cursor: pointer"
            @click="moveFn(row)"
            v-if="lockOrderFlag && item.confirmationState === 1 && item.charges.length > 1 && order.orderState !== 100" />
        </template>
      </el-table-column>
    </el-table>
    <div class="total">
      <span>{{ $t("receiveFms.receive_sum") }}：</span>
      <span>
        <span class="value-item" v-for="(item, index) in item.sourceAmounts || []" :key="index">
          <span class="value">{{ item.currency }}</span>
          <span>{{ item.value | formatNumberToThousandsFilter }}</span>
        </span>
      </span>
    </div>
    <div class="company">
      <el-row>
        <el-col :span="4">{{ $t("air.billStatus") }}：
          <span class="colorBlue">{{ item.entryStateName }}</span>
        </el-col>
        <el-col :span="4">{{ $t("air.applyForInvoicing") }}：
          <span class="colorBlue">{{ item.invoiceApplyStateName }}</span>
        </el-col>
        <el-col :span="4">{{ $t("air.invoiceState") }}：
          <span class="colorBlue">{{ item.invoiceStateName }}</span>
        </el-col>
        <el-col :span="4">{{ $t("air.writeOffStatus") }}：
          <span class="colorBlue">{{ item.clearStateName }}
          </span>
        </el-col>
        <el-col :span="4">{{ $t("air.applyClearStatus") }}：
          <span class="colorBlue">{{ item.instructionStateName }}
          </span>
        </el-col>
      </el-row>
    </div>
    <!-- 迁移 -->
    <el-dialog :title="$t('air.move')" :visible.sync="visible" width="450px">
      <el-form ref="moveFormRef" :model="moveForm" :rules="moveFormRule" class="addForm">
        <div style="margin-bottom: 15px">
          {{ $t("air.moveConfirmationWarm") }}
        </div>
        <!-- 费用确认单号 -->
        <el-form-item :label="$t('air.confirmationIdTo')" prop="confirmationIdTo">
          <el-select v-model="moveForm.confirmationIdTo" size="mini" filterable>
            <el-option v-for="item in noList" :key="item.id" :label="item.confirmationNo" :value="item.id" />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 新增费用确认单 -->
        <el-button size="mini" type="primary" plain @click="newAddConfirm()" style="float: left">{{
          $t("air.newAddConfirm")
        }}</el-button>
        <el-button size="mini" @click="visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button size="mini" type="primary" @click="moveConfirm()">{{
          $t("common.confirm")
        }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="sendCustomerDialog" :title="$t('air.sendConfirmationToCustomer')" width="700px" :before-close="closeSendCustomer">
      <div>{{ $t('air.confirmationWillBeSentAsFollows') }}</div>
      <el-form ref="sendCustomerForm" :model="sendCustomerForm" style="margin-top: 10px;">
        <!--        接收邮箱-->
        <el-form-item :label="$t('air.receivingMailbox')" prop="receiveEmails"
          :rules="[{ required: true, message: $t('air.pleaseEnter'), trigger: 'change' }, { validator: validateEmail, trigger: 'blur' }]">
          <el-input v-model="sendCustomerForm.receiveEmails" size="mini" style="width: 500px"
            :placeholder="$t('air.multipleMailboxPartitions')" maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="$t('air.mailNotes')" prop="emailRemark">
          <el-input v-model="sendCustomerForm.emailRemark" size="mini" style="width: 500px" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitSendCustomer">{{ $t('air.sendOut') }}</el-button>
        <el-button size="small" @click="closeSendCustomer">{{ $t('common.cancel') }}</el-button>
      </div>
    </el-dialog>

    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data"
      :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow = false" />

    <apply-invoice-dialog ref="applyInvoiceDialogRef" origin="CONFIRMATION" :ids="selectedIds" :businessType="order.businessType" toPath='ThkOrderManagementApplyForInvoice' originType="thk" :isSpecifyInvoiceType="true" />

  </div>
</template>
<script>
import { deleteConfirmationApi, moveConfirmationApi, moveNewConfirmationApi, thkChargeSendToCustomerApi, confirmationAdjustSubmitApi, receiveConfirmationConfirmApi } from "@/api/thirdKind"
import reportListDialog from "@/components/Cargo/Report/reportListDialog";
import ApplyInvoiceDialog from "@/views/financial/components/ApplyInvoiceDialog";
import { validEmail } from "@/utils/validate"
export default {
	name: "ReceiveDetail",
	components: {
		reportListDialog,
		ApplyInvoiceDialog
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
		index: Number,
		back: {
			type: String,
			default() {
				return ""
			}
		}
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
			sendCustomerDialog: false,
			sendCustomerForm: {
				id: "",
				receiveEmails: "",
				emailRemark: ""
			},
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
			},
			selectedIds: []
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
			if (item === 21010) {
				return that.$t("air.customer")
			}
			if (item === 14012) {
				return that.$t("air.destinationAgent")
			}
		}
	},
	methods: {
		applyOrHedgeClearShow(v) {
			// console.log(v)
			let flag = true
			// if (v.entryState != 4) {
			//   flag = false
			// }
			if (v.confirmationState !== 2) {
				flag = false
			}
			if (v.clearState !== 1 && v.clearState !== 2) {
				flag = false
			}
			if (v.instructionState !== 1 && v.instructionState !== 2) {
				flag = false
			}
			return flag
		},
		// 申请核销 或者 对冲
		applyOrHedgeClear(isHedge) {

			let selectedRows = [this.item]
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("receiveFms.please_select_one_then_bill"));
				return;
			}
			let selectedSettlementId = [];
			let ids = [];
			let MSG = "";
			// console.log("selectedRows", selectedRows)
			selectedRows.forEach(v => {
				ids.push(v.id);
				if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
					selectedSettlementId.push(v.settlementCompanyId);
				}
				// if (v.entryState != 4) {
				//   MSG = "只有账单状态为已对账才能进行核销操作";
				// }
				if (v.confirmationState !== 2) {
					// MSG = "只有费用确认单确认状态为已确认才能进行核销操作";
					MSG = this.$t("air.confirmationStateWarm");
				}
				if (v.clearState !== 1 && v.clearState !== 2) {
					// MSG = "只有核销状态为未核销或者部分核销才能进行核销操作";
					MSG = this.$t("air.clearStateWarm");
				}
				if (v.instructionState !== 1 && v.instructionState !== 2) {
					// MSG = "只有申请核销状态为未申请或者部分申请才能进行核销操作";
					MSG = this.$t("air.instructionStateWarm");
				}
			});
			if (selectedSettlementId.length > 1) {
				// "不是同一家结算单位的不支持一起发送账单！"
				this.$message.error(this.$t("air.selectedSettlementWarm"));
				return;
			}
			if (MSG) {
				this.$message.error(MSG);
				return;
			}
			// 未核销 已对账
			// let name = isHedge ? "FmsOffsetClearPage" : "FmsApplyClearPage";
			this.$router.push({
				name: "ThkFmsApplyClearPage",
				query: {
					ids: ids.join(","),
					origin: "CONFIRMATION",
					back: this.back
				}
			});
		},
		// 申请开票
		applyInvoice() {
			let ids = []
			this.selectedIds = [this.item.id]
			// console.log("ids", this.selectedIds)
			this.$refs.applyInvoiceDialogRef.show(ids)
		},
		// 查看
		// 目前不做
		// view () {
		//   this.$router.push({
		//     name: `ThkReceiveConfirmationDetail`,
		//     query: { id: this.item.id, origin: "close" }
		//   });
		// },
		exportFn() {
			// 根据查询条件进行批量打印
			this.reportDialog.typeCode = "THK_DEBIT_NOTE";
			this.reportDialog.data = { jobId: null, entityIdList: [this.item.id] };
			// this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
			this.reportDialog.isShow = true;
		},
		sendCustomer() {
			this.sendCustomerForm.id = this.item.id
			this.sendCustomerForm.receiveEmails = this.item.extendInfo2
			this.sendCustomerForm.emailRemark = this.item.extendInfo3
			this.sendCustomerDialog = true;
		},
		deleteFn() {
			this.$confirm(this.$t("air.isDeleteFn"), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			}).then(async () => {
				this.$emit('triggerReceiveLoading', true)
				const res = await deleteConfirmationApi(this.item.id)
				if (res.ok) {
					this.$message.success(this.$t("air.successfullyDeleted"));
					// 不关闭loading, 让init关闭loading
					this.$emit("init");
				}
			}).catch(err => {
				this.$emit('triggerReceiveLoading')
				console.error(err)
			});
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
					this.$emit('triggerReceiveLoading', true)
					let data = {
						confirmationIdFrom: this.item.id,
						confirmationIdTo: this.moveForm.confirmationIdTo,
						chargeIds: [this.moveChargeId]
					};
					const res = await moveConfirmationApi(data)
					if (res.ok) {
						this.visible = false;
						this.$message.success(this.$t("air.moveSuccess"));
						this.$emit("init");
					}
					this.$emit('triggerReceiveLoading')
				}
			});
		},
		async newAddConfirm() {
			this.$emit('triggerReceiveLoading', true)
			let data = {
				confirmationIdFrom: this.item.id,
				chargeIds: [this.moveChargeId]
			};
			const res = await moveNewConfirmationApi(data)
			if (res.ok) {
				this.visible = false;
				this.$message.success(this.$t("air.moveSuccess"));
				this.$emit("init");
			}
			this.$emit('triggerReceiveLoading')
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
				this.$emit('triggerReceiveLoading', true)
				const res = await receiveConfirmationConfirmApi(item.id)
				if (res.ok) {
					this.$message.success(
						this.$t("receiveFms.charge_confirm_success")
					);
					this.$emit("init");
				} else {
					this.$emit('triggerReceiveLoading')
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
				this.$emit('triggerReceiveLoading', true)
				let confirmationIds = [];
				confirmationIds.push(item.id)
				const res = await confirmationAdjustSubmitApi({ "confirmationIds": confirmationIds })
				if (res.ok) {
					this.$message.success(
						this.$t("air.chargeAdjustSuccess")
					);
					this.$emit("init");
				} else {
					this.$emit('triggerReceiveLoading')
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
		},
		// 发送客户
		async submitSendCustomer() {
			const _data = JSON.parse(JSON.stringify(this.sendCustomerForm))
			this.closeSendCustomer()
			this.$emit('triggerReceiveLoading', true)
			const res = await thkChargeSendToCustomerApi(_data)
			if (res.ok) {
				this.$message.success(this.$t('air.submittedSuccessfully'))
			}
			this.$emit('triggerReceiveLoading')
		},
		closeSendCustomer() {
			this.sendCustomerDialog = false
			this.sendCustomerForm = {
				id: "",
				receiveEmails: "",
				emailRemark: ""
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

.colorBlue {
	color: #1890ff;
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
