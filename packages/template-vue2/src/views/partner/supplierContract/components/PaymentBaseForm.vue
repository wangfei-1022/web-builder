<template>
  <div class="customer-edit">
    <el-form ref="baseFormRef" :rules="formRule" :model="form" label-width="120px" size="mini" class="member-form">
      <el-form-item :label="$t('contract.contract_type')" prop="contractType" required>
        <el-select v-model="form.contractType" size="mini" disabled>
          <el-option v-for="(item, index) in contractTypeList" :key="index" :label="item.name" :value="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('contract.contract_kind_name')" prop="contractNameCode" >
        <el-select v-model="form.contractNameCode" size="mini" disabled>
          <el-option v-for="(item, index) in contractNameList" :key="index" :label="item.chineseName" :value="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('contract.contract_name')" prop="customName">
        <el-input v-model="form.customName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('contract.contract_no')" prop="contractNo">
        <el-input v-model="form.contractNo" size="mini" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('contract.supplier_company_name')" prop="memberCnName">
        <el-input v-model="form.memberCnName" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('contract.yht_name')" prop="signedOfficeId">
        <el-select v-model="form.signedOfficeId" size="mini" :placeholder="$t('contract.please_select')" disabled >
          <el-option v-for="item in YHTList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('contract.supplier_sign_name')" prop="memberSignatoryId">
        <sign-select type="SUPPLIER" v-model="form.memberSignatoryId" :memberId="form.memberId"/>
      </el-form-item>
      <!--一海通经办人-->
      <el-form-item :label="$t('contract.yht_sign_name')" prop="principalName">
        <type-select v-model="form.principalName" type="operation" clearable @selected="selectedSignatory"/>
      </el-form-item>
      <el-form-item :label="$t('contract.contract_start_time')" prop="periodBegin">
        <common-picker v-model="form.periodBegin" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" disabled @change="periodBeginChange"/>
      </el-form-item>
      <el-form-item :label="$t('contract.contract_end_time')" prop="periodEnd">
        <common-picker v-model="form.periodEnd" pikcer-type="date" pickerFormat="yyyy-MM-dd" disabled size="mini" />
      </el-form-item>

      <el-form-item :label="$t('contract.recharge_currency')" prop="rechargeCurrency">
        <el-select v-model="form.rechargeCurrency" size="mini" :placeholder="$t('contract.please_select')" multiple >
          <el-option v-for="item in currenciesList" :key="item.code" :label="item.code" :value="item.code"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('contract.remarks')" prop="remarks">
        <el-input v-model="form.remarks" size="mini"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
	getContractNameListApi,
	getSupplierContractTypeApi, // 供应商合同类型
	getYHTListApi } from "@/api/partner/supplierContract"
import { getCurrenciesListApi } from '@/api/common.js'
import moment from 'moment'
import SignSelect from '@/views/partner/customerContract/components/SignSelect'

export default {
	name: 'CRMContractSupplierPaymentAdd',
  components: {
    SignSelect
  },
	props: {
		baseForm: {
      type: Object,
      default: function () {
        return {}
      }
    }
	},
  watch: {
    baseForm: {
      handler(val) {
        this.form = {
          ...val
        }
      },
      deep: true,
      immediate: true
    }
  },
	data() {
		return {
			id: '',
			contractType: '',
			currenciesList: [],
			YHTList: [], // 一海通签约主体
			YHTSignList: [], // 一海通签约人
			customerSignList: [], // 客户签约人
			supplierSignList: [], // 供应商签约人
			contractTypeList: [], // 合同类型
			contractNameList: [], // 合同名称

			form: {
				contractType: '',
				contractTypeName: '',
				memberSignatoryId: '',
				memberSignatoryName: '',
				periodBegin: '',
				periodEnd: '',
				principalId: '',
				principalName: '',
				signatoryId: '',
				memberId: '',
				memberBusinessNo: '',
				memberCnName: '',
				memberEnName: '',
				signedOfficeId: '',
				signedOfficeName: '',
				contractNameCode: '',
				contractNo: '',
				remarks: '',
        rechargeCurrency: []
			},
			formRule: {
				contractType: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				memberSignatoryId: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				periodBegin: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				periodEnd: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				principalName: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				signatoryId: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				memberCnName: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				memberBusinessNo: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				signedOfficeId: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				contractNameCode: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				customName: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				contractNo: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				rechargeCurrency: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }]
			},
			loading: false
		}
	},
	created() {
		this.getBaseDataFn()
	},
	methods: {
		// 获取所需的基础数据
		getBaseDataFn() {
			Promise.all([getContractNameListApi(), getSupplierContractTypeApi(), getYHTListApi(), getCurrenciesListApi()]).then(results => {
				const contractNameRes = results[0]
				const contractTypeRes = results[1]
				const YHTListRes = results[2]
				const currenciesListRes = results[3]
				if (contractNameRes.ok) {
					this.contractNameList = contractNameRes.content
					if (this.form.contractNameCode) {
						this.contractNameList.forEach(x => {
							if (x.code === this.form.contractNameCode) {
								this.form.contractName = x.chineseName
							}
						})
					}
				}
				if (contractTypeRes.ok) {
					this.contractTypeList = contractTypeRes.content
				}
				if (YHTListRes.ok) {
					this.YHTList = YHTListRes.content
					if (this.form.signedOfficeId) {
						this.YHTList.forEach(x => {
							if (x.value === this.form.signedOfficeId) {
								this.form.signedOfficeName = x.label
							}
						})
					}
				}
				if (currenciesListRes.ok) {
					this.currenciesList = currenciesListRes.content
				}
			})
		},
    validate() {
      let VALID = true
      this.$refs.baseFormRef.validate(valid => {
        VALID = valid
      })
      return VALID
    },
    getValue() {
      return this.form
    },
		// 合同开始时间
		periodBeginChange(val) {
			if (this.form.contractType === 10 || this.form.contractType === 20) {
				this.form.periodEnd = moment(val).valueOf() + 30 * 24 * 60 * 60 * 1000
			}
		},
		selectedSignatory(item) {
			this.form.principalId = item.id
			this.form.principalName = item.chineseName
		}
	}
}
</script>
<style scoped lang="scss">
.customer-edit {
	::v-deep .el-select {
		width: 100%;
	}

	::v-deep .el-form-item {
		width: 50%;
		float: left;
	}
}
</style>
