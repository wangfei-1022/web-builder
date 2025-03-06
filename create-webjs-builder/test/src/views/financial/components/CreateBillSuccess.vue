<template>
  <div>
    <el-dialog :title="$t('receiveFms.create_bill')" :visible.sync="visible" width="500px" :close-on-click-modal="false" @close="closeFn">
      <div v-if="!isSuccess">
        <el-form ref="formRef" :inline="true" :model="form" :rules="formRules" label-width="100px" size="mini">
          <el-form-item :label='$t("receiveFms.accounting_period")' prop="billPeriod">
            <el-select v-model="form.billPeriod" size="mini" >
              <el-option v-for="(item, index) in periodList" :key="index" :label="item.periodName" :value="item.periodCode"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button @click="closeFn" size="mini">{{$t("receiveFms.cancel")}}</el-button>
          <el-button type="primary" @click="submitFn" size="mini" :loading="loading">{{$t("receiveFms.confirm")}}</el-button>
        </div>
      </div>
      <div v-if="isSuccess">
        <div class="create-bill">
          <i class="iconfont icon-yanzhengchenggong"></i>
          <div class="render">{{$t('receiveFms.already_create_bill')}}</div>
          <div class="bill-no-info">
            {{$t('receiveFms.click_bill_no')}}
            <a class="link" @click="billDetail()">{{billInfo.billNo}}</a>
            {{$t('receiveFms.view_detail')}}
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top: 50px;text-align: right;">
          <el-button size="mini" type="primary" plain @click="closeFn">{{$t('common.close')}}</el-button>
          <el-button size="mini" type="primary" @click="sendBill">{{$t("receiveFms.sendBill")}}</el-button>
        </div>
      </div>
    </el-dialog>

    <send-bill-dialog ref="sendBillDialogRef" :arap='arap' :ids="[billInfo.id]"></send-bill-dialog>
  </div>
</template>
<script>
import { payableChargeCreateBillApi, payableConfirmationCreateBillApi } from "@/api/financial/fmsPayable"
import { receiveChargeCreateBillApi, receiveConfirmationCreateBillApi, getPeriodListApi } from "@/api/financial/fmsReceive"
import SendBillDialog from "./SendBillDialog"

export default {
	name: "CreateBillSuccess",
	components: {
		SendBillDialog
	},
	props: {
		createBillInfo: {
			type: Object,
			default: function () {
				return {}
			}
		},
		type: {
			type: String,
			default: ''
		},
		arap: {
			type: String,
			default: ''
		}
	},
	watch: {
		createBillInfo: {
			handler(val, oldVal) {
				// 当结算方式未变化时，则不需要重新请求
				if (val.settlementMode === oldVal.settlementMode && !oldVal.settlementMode) {
					return
				}
				let settlementMode = val.settlementMode === 1 ? 3 : val.settlementMode
				Promise.all([getPeriodListApi(settlementMode)]).then(results => {
					const periodRes = results[0]
					if (periodRes.ok) {
						this.periodList = periodRes.content
					}
				})
			},
			deep: true
		}
	},
	data() {
		return {
			visible: false,
			isSuccess: false,
			loading: false,
			billInfo: {},
			periodList: [],
			form: {
				billPeriod: ''
			},
			formRules: {
				billPeriod: [{ required: true, message: this.$t('receiveFms.cannot_be_null') }]
			}
		}
	},
	methods: {
		closeFn() {
			this.visible = false
			this.isSuccess = false
			this.form = {
				billPeriod: ''
			}
		},
		show() {
			this.visible = true
		},
		billDetail() {
			this.closeFn()
			if (this.arap === 'AP') {
				this.$router.push({ name: `FmsPayableBillDetail`, query: { id: this.billInfo.id } })
			} else {
				this.$router.push({ name: `FmsReceiveBillDetail`, query: { id: this.billInfo.id } })
			}
		},
		sendBill() {
			this.closeFn()
			this.$refs.sendBillDialogRef.show(this.createBillInfo.settlementCompanyId, this.createBillInfo.businessType)
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					let data = {}
					let createFn = null
					if (this.type === 'CHARGE') {
						createFn = this.arap === 'AP' ? payableChargeCreateBillApi : receiveChargeCreateBillApi
						data = { chargeIds: this.createBillInfo.ids }
					} else {
						createFn = this.arap === 'AP' ? payableConfirmationCreateBillApi : receiveConfirmationCreateBillApi
						data = { confirmationIds: this.createBillInfo.ids }
					}
					data.billPeriod = this.form.billPeriod
					data.settlementMode = this.createBillInfo.settlementMode
					this.loading = true
					createFn(data).then(res => {
						if (res.ok) {
							let bill = res.content[0] || {}
							this.billInfo = {
								id: bill.id,
								billNo: bill.billNo
							}
							this.isSuccess = true
							// 操作成功之后 // 清除购物车 // 更新列表
							this.$emit('success')
						}
						this.loading = false
					}).catch(() => {
						this.loading = false
					})
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.create-bill {
	text-align: center;
	i {
		font-size: 60px;
		color: rgb(82, 196, 26);
	}
	.render {
		font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
		font-weight: 650;
		font-style: normal;
		font-size: 24px;
		color: rgba(0, 0, 0, 0.847058823529412);
		line-height: 32px;
		margin: 10px 0;
	}
	.bill-no-info {
		font-family: "PingFangSC-Regular", "PingFang SC";
		font-weight: 400;
		font-style: normal;
		text-align: center;
		line-height: 22px;
	}
	.link {
		color: #108ee9;
		text-decoration: underline;
	}
}
</style>

