<template>
  <el-form ref="settlementForm" :rules="formRule" :model="form" label-width="120px" size="small" class="settlement-form">
    <el-form-item v-if="form.isEdit" :label="$t('contract.settlement_company_name')" prop="settlementCompanyId">
      <type-select v-model="form.settlementCompanyId"  :defaultDisplay="[{chineseName: form.settlementCompanyName, id: form.settlementCompanyId }]" type="member" :disabled="!!form.id" />
    </el-form-item>
    <el-form-item  v-else :label="$t('contract.settlement_company_name')" prop="settlementCompanyIds">
      <type-select v-model="form.settlementCompanyIds" :defaultDisplay="defaultDisplayCompanyList" type="member" multiple collapse-tags @selected="settlementChange" :disabled="!!form.id"/>
    </el-form-item>
    <el-form-item :label="$t('contract.business_type')" prop="businessTypeArr">
      <el-select v-model="form.businessTypeArr" :disabled="!!form.id" key="businessType" collapse-tags value-key="businessType" size="mini" :placeholder="$t('contract.please_select')" clearable multiple>
        <el-option v-for="item in businessList" :key="item.businessType" :label="item.businessTypeName" :value="item.businessType"/>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('contract.recharge_mode')" prop="rechargeMode">
      <el-select v-model="form.rechargeMode" size="mini" :placeholder="$t('contract.please_select')" :disabled="contractType === 20">
        <el-option v-for="item in rechargeModeList" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('contract.default_start_time')" prop="defaultStartTime">
      <common-picker v-model="form.defaultStartTime" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
    </el-form-item>
    <el-form-item :label="$t('contract.payment_base')" prop="paymentBaseType">
      <el-row>
        <el-col :span="10">
          <el-select v-model="form.paymentBaseType" size="mini" :placeholder="$t('contract.please_select')"  @change="paymentChange">
            <el-option v-for="item in paymentModeList" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-col>
        <el-col :span="14">
          <el-select v-model="form.paymentOffset" size="mini" :placeholder="$t('contract.please_select')">
            <el-option v-for="item in paymentOffsetList" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item :label="$t('contract.businessLicence')" prop="businessLicence">
      <upload-file v-model="form.businessLicence" :limit="1"></upload-file>
    </el-form-item>
  </el-form>
</template>
<script>
import { getPayModeApi, getRechargeModeApi } from "@/api/partner/supplierContract";

export default {
	name: 'SettlementForm',
	props: {
    detail: {
			type: Object,
			default: function () {
				return {};
			}
		},
		item: {
			type: Object,
			default: function () {
				return {}
			}
		},
		contractType: {
			type: [String, Number],
			default: ''
		},
    businessList: {
      type: Array,
      default: function () {
        return []
      }
    }
	},
	watch: {
		item: {
			handler(val) {
				this.form = {
          isEdit: val.isEdit,
					id: val.id,
          settlementCompanyId: val.settlementCompanyId,
          settlementCompanyName: val.settlementCompanyName,
          businessTypeArr: val.businessType ? [val.businessType] : [],
          businessType: val.businessType,
          businessTypeName: val.businessTypeName,
          rechargeMode: val.rechargeMode,
          defaultStartTime: val.defaultStartTime,
          paymentBaseType: val.paymentBaseType,
          paymentOffset: val.paymentOffset,
          businessLicence: val.businessLicence ? [val.businessLicence] : ''
				}
        this.paymentOffsetList = this.paymentModeMap[this.form.paymentBaseType] || []

        // 新建的默认设置
        if (!val.isEdit) {
          if (this.businessList.length === 1) {
            this.form.businessTypeArr = [this.businessList[0].businessType]
          }
          this.form.defaultStartTime = this.detail.periodBegin || ''
          this.defaultDisplayCompanyList = [{chineseName: this.detail.settlementCompanyName, id: this.detail.settlementCompanyId }]
          this.form.settlementCompanyIds = [this.detail.settlementCompanyId]
          this.form.settlementCompanyArr = [{chineseName: this.detail.settlementCompanyName, id: this.detail.settlementCompanyId }]
        }
			},
			deep: true,
			immediate: true
		}
	},
	data() {
    const validatePayment = (rule, value, callback) => {
			if (!this.form.paymentOffset || !value) {
				callback(this.$t("contract.cannot_be_null"));
			} else {
				callback();
			}
		};

		return {
			role: '',
			type: '',
      rechargeModeList: [],
      paymentModeList: [], // 付款类型
      paymentOffsetList: [],
      paymentModeMap: {},

      defaultDisplayCompanyList: [], // 新建时候的供应商默认带出值
			form: {
        settlementCompanyIds: [],
        settlementCompanyArr: [],
				settlementCompanyId: '',
        settlementCompanyName: '',
        businessTypeArr: [],
        rechargeMode: '',
        rechargeModeName: '',
        defaultStartTime: '',
        paymentBaseType: '',
        paymentBaseTypeName: '',
        paymentOffset: '',
        paymentOffsetName: '',
        businessLicence: []
			},
			formRule: {
				settlementCompanyIds: [{ required: true, message: this.$t("contract.cannot_be_null"), trigger: "blur"}],
				settlementCompanyId: [{ required: true, message: this.$t("contract.cannot_be_null"), trigger: "blur"}],
        businessTypeArr: [{ required: true, message: this.$t("contract.cannot_be_null"), trigger: "blur"}],
        rechargeMode: [{ required: true, message: this.$t("contract.cannot_be_null"), trigger: "blur"}],
        defaultStartTime: [{ required: true, message: this.$t("contract.cannot_be_null"), trigger: "blur"}],
        paymentBaseType: [{
					required: true,
					message: this.$t("contract.cannot_be_null")
				}, {
					validator: validatePayment,
					trigger: "change"
				}],
        businessLicence: [{ required: true, message: this.$t("contract.cannot_be_null"), trigger: "blur"}]
			}
		};
	},
	created() {
		this.type = this.$route.query.type
		this.role = this.$route.query.role
		this.getBase()
    if (this.contractType === 20) {
      this.form.rechargeMode = 1
    }
	},
	methods: {
    settlementChange(items) {
      this.form.settlementCompanyArr = items
		},
		paymentChange() {
			this.paymentOffset = ''
			this.paymentOffsetList = this.paymentModeMap[this.form.paymentBaseType] || []
		},
		getBase() {
			Promise.all([getPayModeApi(), getRechargeModeApi()]).then(results => {
				const paymentModeRes = results[0]
        const rechargeModeRes = results[1]
				if (paymentModeRes.ok) {
					this.paymentModeList = paymentModeRes.content;
          this.paymentModeList.forEach(x => {
						this.paymentModeMap[x.code] = x.children
					})
          if (this.form.paymentBaseType) {
            this.paymentOffsetList = this.paymentModeMap[this.form.paymentBaseType] || []
          }
				}
        if (rechargeModeRes.ok) {
          this.rechargeModeList = rechargeModeRes.content || []
        }
			})
		},
		getValue() {
      let data = {
        ...this.form
      }
      this.rechargeModeList.forEach(v => {
        if (v.code === this.form.rechargeMode) {
          data.rechargeModeName = v.name
        }
      })
      this.paymentModeList.forEach(v => {
        if (v.code === this.form.paymentBaseType) {
          data.paymentBaseTypeName = v.name
        }
      })
      this.paymentOffsetList.forEach(v => {
        if (v.code === this.form.paymentOffset) {
          data.paymentOffsetTypeName = v.name
        }
      })
      data.businessLicence = data.businessLicence[0]
			return data
		},
		validate() {
			let v = true
			this.$refs.settlementForm.validate(valid => {
				v = valid
			})
			return v
		},
    resetFields() {
      this.$refs.settlementForm.resetFields()
    }
	}
};
</script>
<style scoped lang="scss">
.settlement-form {
	overflow: hidden;

	::v-deep .el-form-item {
		width: 50%;
		float: left;
	}

	::v-deep .el-select {
		width: 100%;
	}
}
</style>
