<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="dataList" @submit.native.prevent ref="customerInformationForm">
      <el-checkbox v-model="orderDetailsData.chargeCategoryType" :true-label="1" :false-label="0" @change="changeChargeCategory">{{ $t('sea.chargeCategoryType') }}</el-checkbox>
      <el-button type="primary" @click="addExpenseConfirmation" size="medium"  icon="el-icon-plus" v-if="orderDetailsData.isUnlocked" class="addExpenseConfirmation">{{$t('sea.addExpenseConfirmation')}}</el-button>
      <div style="color: red; font-size: 14px" v-if="$isNotEmpty(addChargeRemindData)">
        {{$t('sea.payAttentionToCurrentCustomers')}} {{addChargeRemindData.vessel}} / {{addChargeRemindData.voyage}} {{$t('sea.payAttentionToCurrentCustomers2')}}
      </div>
      <div class="box_child" v-for="(item,index) in dataList.list" :key="index">
        <div class="cost_head">
          <div>{{ $t('sea.confirmationNo') }} {{ item.confirmationNo }}</div>
          <div>{{ $t('sea.totalExpenses') }}：
            <span v-for="val in item.amounts" :key="val.currency" style="margin-right: 10px">
              {{val.currency}} {{formatNumberToThousands(val.value)}}
            </span>
          </div>
          <div class="operate-buttons-left">
            <!--{{ dynamicHeightFactor }}, {{ isShowingMoreSearchCondition }}, {{ searchItemHeight }}-->
            <el-button v-if="invoicingStatus(item)" size="mini" type="primary" @click="applyInvoice(item.confirmationId)" >{{ $t('sea.applyForInvoicing') }}</el-button>
            <!--            未确认 + 票结 -->
            <el-button v-if="orderDetailsData.isUnlocked && (item.confirmationState === 1 || item.confirmationState === 11)" type="primary" size="mini" @click="chargeConfirm(item)">{{ $t('sea.expenseConfirmation') }}</el-button>
            <el-button type="primary" size="mini" @click="printSample(item.confirmationId)">{{$t('sea.preview')}}</el-button>

            <el-button v-if="orderDetailsData.isUnlocked && (item.confirmationState === 1 || item.confirmationState === 11)" type="primary" size="mini" @click="edit(item.confirmationId)">{{$t('sea.edit')}}</el-button>
            <el-button v-else-if="orderDetailsData.isUnlocked && item.confirmationState === 2" v-permission="['sea:confirmation:charge:list:update_special']" type="primary" size="mini" @click="edit(item.confirmationId)">{{$t('sea.edit')}}</el-button>

            <el-button type="primary" size="mini" @click="printSample(item.confirmationId)">{{$t('sea.download')}}</el-button>
            <el-button v-if="orderDetailsData.isUnlocked && item.confirmationState === 1" type="primary" size="mini" @click="feeMigrationFun(item)">{{$t('sea.feeMigration')}}</el-button>
            <el-button type="primary" size="mini" @click="sendToCustomer(item)">{{$t('sea.sendToCustomer')}}</el-button>
            <el-popconfirm v-if="orderDetailsData.isUnlocked && item.confirmationState === 1"
                           :title="$t('sea.expenseDeletionCannotBeRestored')" style="margin-left: 10px;" @confirm="deleteOrder(item.confirmationId)"
            >
              <el-button slot="reference" type="danger" size="mini">{{$t('sea.delete')}}</el-button>
            </el-popconfirm>
          </div>
        </div>
        <div class="cost_mid">
          <el-form-item :label="$t('sea.businessNo')" prop="userReferenceNo" >{{item.entityNo}}</el-form-item>
          <el-form-item :label="$t('sea.collectionACSet')" prop="userReferenceNo" >{{item.settlementOfficeName}}</el-form-item>
          <el-form-item :label="$t('sea.settlementMethod')" prop="userReferenceNo" >{{item.settlementModeName}}</el-form-item>
          <el-form-item :label="$t('sea.settlementUnit')" prop="userReferenceNo" >{{item.settlementCompanyName}}</el-form-item>
          <el-form-item :label="$t('sea.customerAddress')" prop="userReferenceNo" >{{item.customerAddress}}</el-form-item>
          <el-form-item :label="$t('sea.receivingMailbox')" prop="userReferenceNo" >{{item.receiveEmails}}</el-form-item>
        </div>
        <el-table class="case-data-table" :data="item.charges">
          <el-table-column type="selection" width="55" fixed></el-table-column>
          <el-table-column prop="feeItemName" :label="$t('sea.feeName')" align="center" />
          <el-table-column prop="unitName1" :label="$t('sea.billingMethod')" align="center"  />
          <el-table-column prop="currency" :label="$t('sea.currency')" align="center"  />
          <el-table-column prop="price" :label="$t('sea.unitPrice')" align="center">
            <template slot-scope="{row}">
              {{formatNumberToThousands(row.price)}}
            </template>
          </el-table-column>
          <el-table-column prop="chargeQuantity1" :label="$t('sea.quantity')" align="center"  />
          <el-table-column prop="invoiceTaxRateName" :label="$t('sea.taxRate')" align="center"/>
          <el-table-column prop="taxAmount" :label="$t('sea.taxAmount')" align="center" >
            <template slot-scope="{row}">
              {{formatNumberToThousands(row.taxAmount)}}
            </template>
          </el-table-column>
          <el-table-column prop="excludeTaxAmount" :label="$t('sea.amountExcludingTax')" align="center" >
            <template slot-scope="{row}">
              {{formatNumberToThousands(row.excludeTaxAmount)}}
            </template>
          </el-table-column>
          <el-table-column prop="amount" :label="$t('sea.expenseAmount')" align="center" >
            <template slot-scope="{row}">
              {{formatNumberToThousands(row.amount)}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('sea.remark')" align="center"  />
        </el-table>

      </div>

    </el-form>
    <!--    费用迁移-->
    <FeeMigration  name="feeMigrationCost" :feeMigrationDialog.sync="feeMigrationDialog" v-if="feeMigrationDialog" :row="row" @submit="submitFeeMigration" :isList="false"></FeeMigration>

    <el-dialog :visible.sync="sendCustomerDialog" v-if="sendCustomerDialog" :title="$t('sea.sendConfirmationToCustomer')" width="700px" :before-close="closeSendCustomer" v-loading="loading">
      <div>{{ $t('sea.confirmationWillBeSentAsFollows') }}</div>
      <el-form ref="sendCustomerForm" :model="sendCustomerForm" style="margin-top: 10px;">
        <!--        接收邮箱-->
        <el-form-item :label="$t('sea.receivingMailbox')" prop="receiveEmails" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },{ validator: validateEmail, trigger: 'blur' }]" >
          <el-input v-model="sendCustomerForm.receiveEmails" size="mini" style="width: 500px" :placeholder="$t('sea.multipleMailboxPartitions')" maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="$t('sea.mailNotes')" prop="emailRemark" >
          <el-input v-model="sendCustomerForm.emailRemark" size="mini" style="width: 500px" maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitSendCustomer">{{ $t('sea.sendOut') }}</el-button>
        <el-button size="small" @click="closeSendCustomer">{{ $t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />
    <apply-invoice-dialog ref="applyInvoiceDialogRef" origin="CONFIRMATION" :ids="selectedIds" :isSpecifyInvoiceType="true" businessType="SEA_EXPORT" toPath='FmsSeaApplyForInvoice'></apply-invoice-dialog>

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {
	addChargeRemindApi, chargeConfirmApi, chargeConfirmOneApi, chargeSendToCustomerApi, confirmationChargeDeleteApi, confirmationChargeOrderListApi, confirmationPayOrderListApi, saveSeaChargeCategoryTypeApi
} from "@/api/seaExportOrder"
// import FeeMigration from "./feeMigration"
import { validEmail } from "@/utils/validate"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import { formatNumberToThousands } from "@/utils"
import applyInvoiceDialog from "@/views/financial/components/ApplyInvoiceDialog";
import orderMixin from './orderMixin'

export default {
	name: 'ExpensesCostList',
  mixins: [orderMixin],
	components: {
		FeeMigration: () => import("./feeMigration"),
		reportListDialog, applyInvoiceDialog
	},
	props: {
		confirmationSheetId: { type: Number, default: null },
		orderDetailsData: { type: Object, default: () => { } },
	},
	data() {
		return {
			loading: false,
			id: this.$route.query.id,
			dataList: {
				list: []
			},
			feeMigrationDialog: false,
			row: {},
			sendCustomerDialog: false,
			sendCustomerForm: {},
			reportDialog: { // 打印报表对话框
				isShow: false,
				typeCode: '',
				data: {
					jobId: '',
					assistInfo: '',
					definedInfo: '',
					entityIdList: [],
					remark: ''
				}
			},
			batchPrintMultipleForm: {}, // 批量打印用的条件
			addChargeRemindData: {
			},
			selectedIds: []
		}
	},
	computed: {
		url() {
			return URL
		}
	},
	created() {
		this.getList()
		this.getAddChargeRemindApi()
	},
	methods: {
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
		async getList() {
			this.loading = true
			const res = await confirmationChargeOrderListApi(this.id)
			this.loading = false
			if (res.ok) {
				this.$set(this.dataList, 'list', res.content)
			}
		},
		async getAddChargeRemindApi() {
			const res = await addChargeRemindApi(this.id)
			if (res.ok) {
				this.addChargeRemindData = res.content
			} else {
				this.$set(this.addChargeRemindData, 'vessel', null)
			}
		},
		addExpenseConfirmation() {
			this.$emit('changePage', 2, 'add')
		},
		// 预览
		preview(id) {
			this.$emit('changePage', 2, 'preview', id)
		},
		// 编辑
		edit(id) {
			this.$emit('changePage', 2, 'edit', id)
		},
		// 删除订单
		async deleteOrder(id) {
			this.loading = true
			const res = await confirmationChargeDeleteApi(id)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.successfullyDeleted'))
				this.getList()
			}
		},
		async changeChargeCategory(val) {
			this.loading = true
			let data = {
				id: this.id,
				chargeCategoryType: this.orderDetailsData.chargeCategoryType
			}
			if (val === 1) {
				let res = await confirmationPayOrderListApi(this.id)
				if (res.ok) {
					if (this.$isEmpty(res.content)) {						
						let rs = await saveSeaChargeCategoryTypeApi(data)
						if (!rs.ok || rs.content === undefined) {
							this.orderDetailsData.chargeCategoryType = 0
						}
					} else {
						this.$message.error(this.$t('sea.chargeCategoryTypeTips'))
						this.orderDetailsData.chargeCategoryType = 0
					}
				}
			}else	{
				let rs = await saveSeaChargeCategoryTypeApi(data)
				if (!rs.ok || rs.content === undefined) {
					this.orderDetailsData.chargeCategoryType = 1
				}
			}
			this.loading = false
		},
		// 费用迁移
		async feeMigrationFun(row) {
			this.row = row
			this.feeMigrationDialog = true
		},
		sendToCustomer(item) {
			this.sendCustomerForm = {
				receiveEmails: item.receiveEmails,
				emailRemark: item.emailRemark,
				confirmationId: item.confirmationId
			}
			this.sendCustomerDialog = true
		},
		submitFeeMigration() {
			this.getList()
		},
		// 发送客户
		async submitSendCustomer() {
			this.loading = true
			const res = await chargeSendToCustomerApi(this.sendCustomerForm, this.sendCustomerForm.confirmationId)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$message.success(this.$t('sea.submittedSuccessfully')))
				this.closeSendCustomer()
			}

		},
		closeSendCustomer() {
			this.getList()
			this.sendCustomerDialog = false
			this.sendCustomerForm = {}
		},
		// 费用确认
		chargeConfirm(data) {
			this.$confirm(this.$t('sea.cannotBeChangedAfterConfirmationConfirmationSheetInformation'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.chargePopConfirm(data)
			})
		},
		async chargePopConfirm(data) {
			this.loading = true
			let res
			if (data.confirmationState === 11) { // 调整中
				res = await chargeConfirmOneApi(data.confirmationId)
			} else {
				res = await chargeConfirmApi({ ids: [data.confirmationId] })
			}

			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.submittedSuccessfully'))
				this.getList()
			}
		},
		// * 打印
		printSample(id) {
			this.reportDialog.typeCode = 'SEA_DEBIT_NOTED' // 'SEA_MBL' 打印客户提单 EB_PACKING_INFORMATION 导出装箱数据
			const entityIdList = [id]
			this.reportDialog.data = { jobId: '', entityIdList }
			this.reportDialog.isShow = true
		},
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		},
		invoicingStatus(v) {
			if (v.confirmationState != 2) {
				return false
			}
			if ((v.invoiceState == 1 || v.invoiceState == 2) && (v.invoiceApplyState == 1 || v.invoiceApplyState == 2) && v.settlementMode == 1) {
				// 通过校验
				return true
			} else {
				return false
			}
		},
		// 申请开票
		applyInvoice(id) {
			this.selectedIds = [id]
			// let selectedRows = this.gridApi.getSelectedRows()
			// if (selectedRows.length <= 0) {
			//   this.$message.error(this.$t("receiveFms.please_select_one_then_bill"))
			//   return
			// }
			// let ids = []
			// let settlementCompanyIds = []
			// let settlementOfficeIds = []
			// let businessTypes = []
			// let isPass = true // 账单状态已对账 且 开票状态为部分开票 或者 未开票
			// let isPiecePass = true
			// selectedRows.forEach(v => {
			//   if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
			//     settlementCompanyIds.push(v.settlementCompanyId)
			//   }
			//   if (settlementOfficeIds.indexOf(v.settlementOfficeId) < 0) {
			//     settlementOfficeIds.push(v.settlementOfficeId)
			//   }
			//   // 票结费用需要费用确认单已确认
			//   // if (v.settlementMode == 1) {
			//   if (v.confirmationState != 2) {
			//     isPiecePass = false
			//   }
			//   // } else {
			//   // 其他账期 -> 未开票 部分开票 已对账
			//   if ((v.invoiceState == 1 || v.invoiceState == 2) && (v.invoiceApplyState == 1 || v.invoiceApplyState == 2) && v.settlementMode == 1) {
			//     // 通过校验
			//   } else {
			//     isPass = false
			//   }
			//   // }
			//   ids.push(v.confirmationId)
			// })
			// if (settlementCompanyIds.length > 1) {
			//   this.$message.error(this.$t("receiveFms.need_same_settlement_company"))
			//   return
			// }
			// // 同样的收款账套之后 结算方式肯定相同
			// if (settlementOfficeIds.length > 1) {
			//   this.$message.error(this.$t("receiveFms.need_same_settlement_officeIds"))
			//   return
			// }
			// // 其他账期 -> 未开票 部分开票 已对账 票结费用需要费用确认单已确认
			// if (!isPass) {
			//   this.$message.error(this.$t("receiveFms.need_un_invoice_and_bill_check_sea"))
			//   return
			// }
			// // 其他账期 -> 未开票 部分开票 已对账 票结费用需要费用确认单已确认
			// if (!isPiecePass) {
			//   this.$message.error(this.$t("receiveFms.invoicing_confirmed"))
			//   return
			// }
			// this.selectedIds = ids
			this.$refs.applyInvoiceDialogRef.show()
		},
	}
}
</script>
<style lang="scss" scoped>
.flex-bet {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
}
.box_title {
	border-left: solid 3px rgb(24, 144, 255);
	font-size: 18px;
	color: #199ed8;
	padding-left: 8px;
	height: 28px;
	line-height: 28px;
	margin: 5px 0 8px 0;
	display: flex;
	.operate-buttons-left {
		margin-left: 20px;
	}
}
.box {
	background-color: #f5f7f7;
	padding: 8px;
	::v-deep .el-form-item--medium {
		.el-form-item__content {
			line-height: 28px;
		}
		.el-form-item__label {
			line-height: 28px;
		}
	}
}
::v-deep {
	.el-form-item__label {
		width: 95px;
	}
}
.box_child {
	border: solid 1px rgba(121, 121, 121, 1);
	padding: 20px 30px;
	background: #fff;
	margin-bottom: 15px;
	.box25 {
		width: 20%;
	}
}
::v-deep .el-form--inline .el-form-item {
	display: block;
}
.cost_head {
	display: flex;
	justify-content: space-between;
	border-bottom: #ccc solid 1px;
	padding-bottom: 8px;
}
.cost_mid {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin-top: 12px;
	::v-deep .el-form-item {
		width: 30%;
		margin-bottom: 10px;
	}
	::v-deep .el-form-item__content {
		width: calc(100% - 95px);
		word-break: break-all;
	}
}
.addExpenseConfirmation {
	width: 100%;
	margin: 12px auto;
}
.footer-btn {
	margin-top: 30px;
	text-align: right;
}
//**
</style>
