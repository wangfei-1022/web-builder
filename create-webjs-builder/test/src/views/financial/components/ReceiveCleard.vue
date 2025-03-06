<template>
    <el-dialog v-if="visible" :title="$t('receiveFms.receive_cleard')" :visible.sync="visible" width="500px" :close-on-click-modal="false"	>
        <el-form ref="formRef" :inline="true" :model="form" :rules="formRules" label-width="100px" size="mini">
          <el-form-item :label="arap === 'AR' ? $t('receiveFms.receipt_pay_date') : $t('payableFms.payable_pay_date')" prop="receiptPayDate">
            <common-picker v-model="form.receiptPayDate" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="visible = false" size="mini">{{$t("common.cancel")}}</el-button>
          <el-button type="primary" @click="submitFn" size="mini" :loading="loading">{{$t("common.confirm")}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { markClearedBillApi, markClearedConfirmationApi, markClearedChargeApi } from '@/api/financial/fmsReceive'
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "ReceiveInvoice",
	props: {
		info: {
			type: Object,
			default: function () {
				return {
					ids: [],
					totalAmount: {}
				}
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
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	data() {
		return {
			loading: false,
			visible: false,
			form: {
				receiptPayDate: ''
			},
			formRules: {
				receiptPayDate: [{ required: true, message: this.$t('receiveFms.cannot_be_null') }]
			}
		}
	},
	methods: {
		show() {
			this.visible = true
			this.form.receiptPayDate = ''
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					let data = {
						...this.form
					}
					// 核销函数
					let fn = markClearedBillApi
					if (this.type === 'BILL') {
						data.billIds = this.info.ids
						fn = markClearedBillApi
					} else if (this.type === 'CONFIRMATION') {
						data.confirmationIds = this.info.ids
						fn = markClearedConfirmationApi
					} else if (this.type === 'CHARGE') {
						data.chargeIds = this.info.ids
						fn = markClearedChargeApi
					}
					this.loading = true
					fn(data).then(res => {
						if (res.ok) {
							this.visible = false
							let str = ''
							res.content.forEach(function (v) {
								str += `<label style='margin-right:3px;'>${v.currency}</label><label>${formatNumberToThousands(v.value)}</label><br />`
							})
							this.$alert(this.$t('receiveFms.clearInfoTotal') + str, this.$t('receiveFms.clearSuccess'), {
								dangerouslyUseHTMLString: true,
								confirmButtonText: this.$t('common.confirm'),
								callback: () => {
									this.$emit('success')
								}
							});
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

