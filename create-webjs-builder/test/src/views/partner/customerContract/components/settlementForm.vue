<template>
    <el-form ref="settlementForm" :rules="formRule" :model="form" label-width="100px" size="small" class="settlement-form">
      <div class="title">
        <div class="bg"></div>
        {{$t('contract.essentialInformation')}}
      </div>
      <el-form-item v-if="form.id || form.editType ==='new'" :label="$t('contract.settlement_company_name')" prop="settlementCompanyId">
        <type-select
          v-model="form.settlementCompanyId"
          :defaultDisplay="[{chineseName: form.settlementCompanyName, id: form.settlementCompanyId }]"
          type="member"
          :disabled="!!form.id"
          @selected="settlementChangeOne"
        />
      </el-form-item>
      <el-form-item  v-else :label="$t('contract.settlement_company_name')" prop="settlementCompanyArr">
        <type-select type="member" :disabled="!!form.id" multiple collapse-tags @selected="settlementChange"/>
      </el-form-item>
      <el-form-item :label="$t('contract.recharge_mode')" prop="rechargeMode">
        <el-select v-model="form.rechargeMode" size="mini" :placeholder="$t('contract.please_select')" :disabled="type === 'CUSTOMER'">
          <el-option v-for="item in rechargeModeList" :key="item.code" :label="item.name" :value="item.code"/>
        </el-select>
      </el-form-item>
        <el-form-item :label="$t('contract.effective_time')" prop="defaultStartTime" >
            <common-picker v-model="form.defaultStartTime" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
        </el-form-item>
        <el-form-item :label="$t('contract.titleTypeName')" prop="titleType" v-if="(contractType === 1 || contractType === 3 || contractType === 10)">
          <el-select v-model="form.titleType" size="mini" :placeholder="$t('contract.please_select')" clearable  :disabled="type === 'CUSTOMER'">
              <el-option v-for="item in titleTypeList" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.id || form.editType ==='new'" :label="$t('contract.business_type')" prop="businessType">
          <el-select v-model="form.businessType" :disabled="!!form.id" key="businessType" @change="businessTypeOneChange" size="mini" :placeholder="$t('contract.please_select')" clearable >
            <el-option v-for="item in businessList" :key="item.businessType" :label="item.businessTypeName" :value="item.businessType"/>
          </el-select>
        </el-form-item>
      <el-form-item v-else :label="$t('contract.business_type')" prop="businessTypeArr">
        <el-select v-model="form.businessTypeArr" :disabled="!!form.id" key="businessType" collapse-tags value-key="businessType" @change="businessTypeChange" size="mini" :placeholder="$t('contract.please_select')" clearable multiple>
          <el-option v-for="item in businessList" :key="item.businessType" :label="item.businessTypeName" :value="item"/>
        </el-select>
      </el-form-item>
<!--      v-if="step === 2 && (contractType === 2 || contractType === 20)"-->
        <el-form-item :label="$t('contract.attachments')" prop="attachments" :rules='[{ required: form.titleType === 30, message: $t("contract.cannot_be_null"), trigger: "blur"}]'>
          <upload-file v-model="form.attachments" :limit="1"></upload-file>
        </el-form-item>
        <div class="title">
          <div class="bg"></div>
          {{$t('contract.account_period_info')}}
        </div>
        <account-period :business="item" :defaultPeriod="defaultPeriod" ref="accountPeriodRef" />
    </el-form>
</template>
<script>
import { getCurrenciesListApi } from '@/api/common.js'
import {getReceiveSettlementCompanyTitleTypeApi, getRechargeModeApi, getStatementModeApi, getPeriodInfoByBusinessTypeApi} from '@/api/partner/customerContract'
import { byteUNICODELength } from '@/utils/index'
import {contractTypeMap} from "@/utils/constant";
import accountPeriod from "./accountPeriod";
import { validateTaxNum } from "@/utils/validate";

export default {
	name: 'SettlementForm',
	components: {
    accountPeriod
  },
	props: {
		step: {
			type: [String, Number],
			default: 1
		},
		detail: {
			type: Object,
			default: function () {
				return {}
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
          ...this.form,
          ...val
        }
        if (this.$isNotEmpty(val) && val.businessType) {
          this.$set(this.form, 'businessTypeArr', [{
            businessType: val.businessType,
            businessTypeName: val.businessTypeName
          }])
        }
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		const validateTaxNumFn = (rule, value, callback) => {
			if (value) {
				if (validateTaxNum(value)) {
					callback()
				} else {
					// 税号只能是数字和字母，且长度为6-20
					return callback(this.$t("customerManage.taxNumberRegular"))
				}
			} else {
				callback()
			}
		}

		return {
			role: '',
			type: '',
			currenciesList: [],
			titleTypeList: [],

			form: {
        settlementCompanyArr: [],
        defaultStartTime: '',
				settlementCompanyId: '',
				settlementCompanyName: '',
        rechargeMode: '',
				rechargeCurrency: '',
				bankAccount: '',
				bankName: '',
				bankBranch: '',
				bankAddress: '',
				bankNo: '',
				tel: '',
				swiftCode: '',
				address: '',
				taxNum: '',
				titleType: 10,
        attachments: []
			},
			formRule: {
        settlementCompanyArr: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "blur"
				}],
        rechargeMode: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}],
        titleType: [{
          required: true,
          message: this.$t("contract.cannot_be_null"),
          trigger: "blur"
        }],
        defaultStartTime: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "blur"
				}],
        businessTypeArr: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "blur"
				}]
        // attachments: [{
        //   required: this.form.titleType ==== 30,
        //   message: this.$t("contract.cannot_be_null"),
        //   trigger: "blur"
        // }]
			},
      rechargeModeList: [], // 结算类型
      receiptModeList: [], // 收款类型
      receiptOffsetList: [],
      receiptModeMap: {},

      paymentModeList: [], // 付款类型
      paymentOffsetList: [],
      paymentModeMap: {},

      invoiceModeList: [], // 开票类型
      invoiceOffsetList: [],
      invoiceModeMap: {},
      statementModeList: [], // 对账类型
      statementModeMap: {},
      statementOffsetList: [], // 偏移量
      isDisabled: false,
      settlementArr: [],
      defaultPeriod: {}
		};
	},
	created() {
		this.type = this.$route.query.type
		this.role = this.$route.query.role
		this.getBase()

    this.form = {
      ...this.form,
      ...this.item
    }
    if (this.type === 'CUSTOMER') {
      this.form.rechargeMode = 1
      this.form.titleType = 30
      this.form.defaultStartTime = this.detail.periodBegin
    }
    if (this.$isNotEmpty(this.item) && this.item.businessType) {
      this.$set(this.form, 'businessTypeArr', [{
        businessType: this.item.businessType,
        businessTypeName: this.item.businessTypeName
      }])
    }
  },
  methods: {
    businessTypeOneChange(val) { // 业务类型单选
      this.businessList.some(item => {
        if (item.businessType === val) {
          this.form.businessTypeName = item.businessTypeName
          return true
        }
      })
      //  this.getPeriodInfo(this.form.businessType)
    },
    businessTypeChange() {
      if (this.type === 'CUSTOMER') {
        if (this.form.businessTypeArr.length) {
          this.getPeriodInfo(this.form.businessTypeArr[0].businessType)
        } else {
          this.defaultPeriod = {}
        }
      }
    },
    getPeriodInfo(businessType) {
      getPeriodInfoByBusinessTypeApi(businessType).then(res => {
        if (res.ok) {
          this.defaultPeriod = res.content
        }
      })
    },
		setValue(item) {
			this.form.bankName = item.bankName || ''
			this.form.bankBranch = item.bankBranch || ''
			this.form.tel = item.tel || ''
			this.form.swiftCode = item.swiftCode || ''
			this.form.address = item.address || ''
			this.form.taxNum = item.taxNum || ''
		},
    settlementChangeOne(item) {
      this.form.settlementCompanyName = item.chineseName
    },
		settlementChange(item) {
      // settlementCompanyName
      this.form.settlementCompanyArr = item
		},
		getBase() {
			Promise.all([getCurrenciesListApi(), getReceiveSettlementCompanyTitleTypeApi(), getRechargeModeApi(), getStatementModeApi()]).then(results => {
				const currenciesListRes = results[0]
				const titleTypeRes = results[1]
        const rechargeModeRes = results[2]
        const statementModeRes = results[3]
				if (currenciesListRes.ok) {
					this.currenciesList = currenciesListRes.content;
				}
				if (titleTypeRes.ok) {
					this.titleTypeList = titleTypeRes.content;
				}
        if (rechargeModeRes.ok) {
          this.rechargeModeList = rechargeModeRes.content || []
        }
        if (statementModeRes.ok) {
          this.statementModeList = statementModeRes.content || []
          this.statementModeList.forEach(x => {
            this.statementModeMap[x.code] = x.children
          })
        }
			})
		},
		getValue() {
			let titleTypeName = ''
			this.titleTypeList.forEach(v => {
				if (v.code === this.form.titleType) {
					titleTypeName = v.name
				}
			})
			let rechargeModeName = ''
			this.rechargeModeList.forEach(v => {
				if (v.code === this.form.rechargeMode) {
					rechargeModeName = v.name
				}
			})
      let period = this.$refs.accountPeriodRef.getValue()
			let data = {
        ...period,
        ...this.form,
        titleTypeName: titleTypeName,
        rechargeModeName: rechargeModeName
			}
			return data
		},
		validate() {
			let v = true
			this.$refs.settlementForm.validate(valid => {
				v = valid
			})
      if (!v) {
        return v
      }
      v = this.$refs.accountPeriodRef.validate()
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
  .title{
    width: 100%;
    font-family: 'Normal Bold', 'Normal ';
    font-weight: 650;
    font-style: normal;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.847058823529412);
    display: flex;
    line-height: 30px;
    margin-bottom: 15px;
    .bg{width: 10px;
      height: 30px;
      background-color: rgba(24, 144, 255, 1);
      border: 1px  solid rgba(233, 233, 233, 1);
      border-radius: 4px;
      margin-right: 10px;
    }
  }
  ::v-deep .el-select__tags-text {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep .el-tag__close.el-icon-close {
    top: -7px;
  }
}
</style>
