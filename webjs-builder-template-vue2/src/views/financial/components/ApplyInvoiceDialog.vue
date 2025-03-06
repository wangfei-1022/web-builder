<template>
    <el-dialog :title="$t('fmsReceiveInvoice.apply_invoice')" :visible.sync="visible" width="500px">
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="right" size="mini">
        <el-form-item :label="$t('fmsReceiveInvoice.invoiceType')" prop="invoiceType">
          <el-select v-model="formModel.invoiceType" size="mini" @change="invoiceTypeChange">
            <el-option v-for="(item, index) in invoiceTypeList" :key="index" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fmsReceiveInvoice.invoiceMedium')" prop="invoiceMedium">
          <el-select v-model="formModel.invoiceMedium" size="mini">
            <el-option v-for="(item, index) in invoiceMaterialTypeList" :key="index" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <div style="padding-left: 120px;">
          <el-checkbox v-model="formModel.retPayFlag">
            <!-- 荣E通付款 -->
            {{$t('fmsReceiveInvoice.retPayFlagInfo')}}
            <el-popover
              placement="top-start"
              title=""
              width="300"
              trigger="hover"
              popper-class="el-popover-file-upload"
              :content="$t('fmsReceiveInvoice.retPayFlagContent')">
              <i slot="reference" class="el-icon-warning-outline" />
            </el-popover>
          </el-checkbox>
        </div>
      </el-form>
      <div v-if="isSpecifyInvoiceType" style="color: red">
        {{$t('sea.specifyInvoiceType')}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitFn" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>

import { invoiceTypeList, invoiceMaterialTypeList } from '@/utils/constant'
import { getDictDataApi, getInvoiceTypeDefaultByBillApi, getInvoiceTypeDefaultByChargeApi, getInvoiceTypeDefaultByConfirmationApi } from "@/api/financial/fmsReceive"

export default {
	name: "ApplyInvoiceDialog",
	props: {
		businessType: {
			type: String,
			default: ''
		},
		// 要跳转的对应的申请开票path
		toPath: {
			type: String,
			default: ''
		},
		origin: {
			type: String,
			default: ''
		},
		ids: {
			type: Array,
			default: function () {
				return []
			}
		},
		isSpecifyInvoiceType: {
			type: Boolean,
			default: false
		},
		originType: {
			type: String,
			default: ''
		}
	},
	watch: {

	},
	data() {
		return {
			invoiceTypeList: [],
			invoiceMaterialTypeList: [],
			visible: false,
			confirmationStateList: [],
			formModel: {
				invoiceType: '',
				invoiceMedium: '',
				retPayFlag: false
			},
			formRules: {
				"invoiceType": [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }],
				"invoiceMedium": [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
			}
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			Promise.all([getDictDataApi(12), getDictDataApi(13)]).then(results => {
				const invoiceTypeRes = results[0]
				const invoiceMaterialTypeRes = results[1]
				if (invoiceTypeRes.ok) {
					this.invoiceTypeList = invoiceTypeRes.content
				}
				if (invoiceMaterialTypeRes.ok) {
					// this.invoiceMaterialTypeList = invoiceMaterialTypeRes.content
				}
			})
		},
		invoiceTypeChange() {
			this.formModel.invoiceMedium = ''
			if (this.formModel.invoiceType === 1) {
				this.invoiceMaterialTypeList = [{
					code: 1,
					name: "纸质"
				}, {
					code: 2,
					name: "电子"
				}]
			} else if (this.formModel.invoiceType === 2) {
				this.invoiceMaterialTypeList = [{
					code: 1,
					name: "纸质"
				}, {
					code: 2,
					name: "电子"
				}]
			} else if (this.formModel.invoiceType === 3) {
				this.invoiceMaterialTypeList = [{
					code: 1,
					name: "纸质"
				}, {
					code: 3,
					name: "扫描件"
				}]
			}
		},
		show(ids) {
			if (this.isSpecifyInvoiceType) {
				this.formModel = {
					invoiceType: 2,
					invoiceMedium: '',
					retPayFlag: false
				}
				this.invoiceTypeChange()
			} else {
				this.formModel = {
					invoiceType: '',
					invoiceMedium: '',
					retPayFlag: false
				}
			}
			this.visible = true

			let fn = null
			if (this.origin === 'BILL') {
				fn = getInvoiceTypeDefaultByBillApi
			} else if (this.origin === 'CONFIRMATION') {
				fn = getInvoiceTypeDefaultByConfirmationApi
			} else if (this.origin === 'CHARGE') {
				fn = getInvoiceTypeDefaultByChargeApi
			}
			if (fn && !this.$isEmpty(ids)) {
				fn(ids).then(res => {
					if (res.ok) {
						if (res.content) {
							this.formModel.invoiceType = res.content
							this.invoiceTypeChange()
						}
					}
				})
			}
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					this.visible = false
					if (!this.toPath) {
						return
					}
					this.$store.dispatch('tagsView/delView', { name: name })
					setTimeout(() => {
						this.$nextTick(() => {
							this.$router.push({
								name: this.toPath,
								query: {
									ids: this.ids.join(','),
									origin: this.origin,
									invoiceType: this.formModel.invoiceType,
									invoiceMedium: this.formModel.invoiceMedium,
									retPayFlag: this.formModel.retPayFlag,
									originType: this.originType,
									businessType: this.businessType,
								}
							})
						})
					}, 0)
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
