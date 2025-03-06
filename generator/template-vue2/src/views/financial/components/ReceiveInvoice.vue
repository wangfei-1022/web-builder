<template>
    <el-dialog v-if="visible" :title="$t('receiveFms.receive_invoiced')" :visible.sync="visible" width="500px" :close-on-click-modal="false">
        <el-form ref="formRef" :inline="true" :model="form" :rules="formRules" label-width="100px" size="mini">
          <el-form-item :label='$t("receiveFms.invoiced_date")' prop="invoicedDate">
            <common-picker v-model="form.invoicedDate" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini"/>
          </el-form-item>
          <el-form-item :label='$t("receiveFms.invoiced_no")' prop="invoicedNo">
            <el-input v-model="form.invoicedNo" type="text" size="mini" clearable  />
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
import { markInvoicedBillApi, markInvoicedConfirmationApi, markInvoicedChargeApi } from '@/api/financial/fmsReceive'

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
				invoicedNo: '',
				invoicedDate: ''
			},
			formRules: {
				invoicedNo: [{ required: false, message: this.$t('receiveFms.cannot_be_null') }],
				invoicedDate: [{ required: true, message: this.$t('receiveFms.cannot_be_null') }]
			}
		}
	},
	methods: {
		show() {
			this.visible = true
			this.form = {
				invoicedNo: '',
				invoicedDate: ''
			}
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					let data = {
						...this.form
					}
					// 开票函数
					let fn = markInvoicedBillApi
					if (this.type === 'BILL') {
						data.billIds = this.info.ids
						fn = markInvoicedBillApi
					} else if (this.type === 'CONFIRMATION') {
						data.confirmationIds = this.info.ids
						fn = markInvoicedConfirmationApi
					} else if (this.type === 'CHARGE') {
						data.chargeIds = this.info.ids
						fn = markInvoicedChargeApi
					}
					this.loading = true
					fn(data).then(res => {
						if (res.ok) {
							this.visible = false
							let totalAmount = this.info.totalAmount
							let str = ''
							Object.keys(totalAmount).forEach(function (v) {
								str += `<label style='margin-right:3px;'>${v}</label><label>${totalAmount[v]}</label><br />`
							})
							this.$alert(this.$t('receiveFms.invoiceInfoTotal') + str, this.$t('receiveFms.invoiceSuccess'), {
								dangerouslyUseHTMLString: true,
								confirmButtonText: this.$t('common.confirm'),
								callback: action => {
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

