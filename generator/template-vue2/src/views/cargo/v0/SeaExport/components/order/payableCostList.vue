<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="dataList" @submit.native.prevent ref="customerInformationForm">
      <el-checkbox v-model="orderDetailsData.chargeCategoryType" :true-label="2" :false-label="0" @change="changeChargeCategory">{{ $t('sea.chargeCategoryType1') }}</el-checkbox>
      <el-button type="primary" @click="addExpenseConfirmation" size="medium" v-if="orderDetailsData.isUnlocked" icon="el-icon-plus" class="addExpenseConfirmation">{{$t('sea.addExpenseConfirmation')}}</el-button>
      <div style="color: red; font-size: 14px" v-if="$isNotEmpty(addChargeRemindData)">
        {{$t('sea.payAttentionToCurrentCustomers')}} {{addChargeRemindData.vessel}} / {{addChargeRemindData.voyage}} {{$t('sea.payAttentionToCurrentCustomers2')}}
      </div>
      <div class="box_child" v-for="(item,index) in tabelList" :key="index">
        <div class="cost_head">
          <div>{{ $t('sea.confirmationNo') }} {{ item.confirmationNo }}</div>
          <div>{{ $t('sea.totalExpenses') }}：
            <span v-for="val in item.amounts" :key="val.currency" style="margin-right: 10px">
              {{val.currency}} {{formatNumberToThousands(val.value)}}
            </span>
          </div>
          <div class="operate-buttons-left">
            <el-button v-if="orderDetailsData.isUnlocked && (item.confirmationState === 1 || item.confirmationState === 11)" type="primary" size="mini" @click="chargeConfirm(item)">{{ $t('sea.expenseConfirmation') }}</el-button>

            <el-button v-if="orderDetailsData.isUnlocked && (item.confirmationState === 1 || item.confirmationState === 11)" type="primary" size="mini" @click="edit(item.confirmationId)">{{$t('sea.edit')}}</el-button>
            <el-button v-else-if="orderDetailsData.isUnlocked && item.confirmationState === 2" v-permission="['sea:confirmation:pay:list:update_special']" type="primary" size="mini" @click="edit(item.confirmationId)">{{$t('sea.edit')}}</el-button>

            <el-button v-if="orderDetailsData.isUnlocked && item.confirmationState === 1" type="primary" size="mini" @click="feeMigrationFun(item)">{{$t('sea.feeMigration')}}</el-button>

            <el-popconfirm v-if="orderDetailsData.isUnlocked && item.confirmationState === 1"
                           :title="$t('sea.expenseDeletionCannotBeRestored')" style="margin-left: 10px;" @confirm="deleteOrder(item.confirmationId)"
            >
              <el-button slot="reference" type="danger" size="mini">{{$t('sea.delete')}}</el-button>
            </el-popconfirm>
          </div>
        </div>
        <div class="cost_mid">
          <el-form-item :label="$t('sea.businessNo')" prop="userReferenceNo" >{{item.entityNo}}</el-form-item>
          <el-form-item :label="$t('sea.paymentACSet')" prop="paymentACSet" >{{item.settlementOfficeName}}</el-form-item>
          <el-form-item :label="$t('sea.settlementMethod')" prop="userReferenceNo" >{{item.settlementModeName}}</el-form-item>
          <el-form-item :label="$t('sea.supplierSettlementUnit')" prop="supplierSettlementUnit" >{{item.settlementCompanyName}}</el-form-item>
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
    <FeeMigration  name="feeMigrationCost" :feeMigrationType="false" :feeMigrationDialog.sync="feeMigrationDialog" v-if="feeMigrationDialog" :row="row" @submit="submitFeeMigration" :isList="false"></FeeMigration>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {
	addChargeRemindApi, confirmationPayDeleteApi, confirmationPayOrderListApi, payConfirmApi, payConfirmOneApi, confirmationChargeOrderListApi, saveSeaChargeCategoryTypeApi
} from "@/api/seaExportOrder"
// import FeeMigration from "./feeMigration"
import { validEmail } from "@/utils/validate"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import { formatNumberToThousands } from "@/utils"
import { getGridSelected } from "@/utils/gridChoose"
import orderMixin from './orderMixin'

export default {
	name: 'PayableCostList',
  mixins: [orderMixin],
	components: {
		FeeMigration: () => import("./feeMigration"),
		reportListDialog
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
			},
			feeMigrationDialog: false,
			row: {},
			tabelList: [],
			addChargeRemindData: {
			}
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
		async changeChargeCategory(val) {
			this.loading = true
			let data = {
				id: this.id,
				chargeCategoryType: this.orderDetailsData.chargeCategoryType
			}
			if (val === 2) {
				let res = await confirmationChargeOrderListApi(this.id)
				if (res.ok) {
					if (this.$isEmpty(res.content)) {
						let rs = await saveSeaChargeCategoryTypeApi(data)
						if (!rs.ok || rs.content === undefined) {
							this.orderDetailsData.chargeCategoryType = 0
						}
					} else {
						this.$message.error(this.$t('sea.chargeCategoryTypeTips1'))
						this.orderDetailsData.chargeCategoryType = 0
					}
				}
			}else {
				let rs = await saveSeaChargeCategoryTypeApi(data)
				if (!rs.ok || rs.content === undefined) {
					this.orderDetailsData.chargeCategoryType = 2
				}
			}
			this.loading = false
		},
		async getList() {
			this.loading = true
			const res = await confirmationPayOrderListApi(this.id)

			if (res.ok) {
				this.tabelList = []
				this.loading = false
				this.$nextTick(() => {
					this.tabelList = res.content
				})

			} else {
				this.loading = false
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
				res = await payConfirmOneApi(data.confirmationId)
			} else {
				res = await payConfirmApi({ ids: [data.confirmationId] })
			}
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.submittedSuccessfully'))
				this.getList()
			}
		},
		// 编辑
		edit(id) {
			this.$emit('changePage', 2, 'edit', id)
		},
		// 删除订单
		async deleteOrder(id) {
			this.loading = true
			const res = await confirmationPayDeleteApi(id)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.successfullyDeleted'))
				this.getList()
			}
		},
		// 费用迁移
		async feeMigrationFun(row) {
			this.row = row
			this.feeMigrationDialog = true
		},
		submitFeeMigration() {
			this.getList()
		},
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		}
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
		width: 115px;
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
		width: calc(100% - 115px);
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
