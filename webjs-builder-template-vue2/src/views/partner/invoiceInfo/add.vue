<template>
  <div class="page-edit-container full-page"  v-loading="loading">
    <div class="custmer-detail page-edit-content">
      <div class="title">{{ $t('invoicingManage.companyInfo') }}</div>
      <el-form  ref="formData" :model="formData" :rules="formDataRules" label-width="100px" size="small" class="member-form">
        <el-form-item :label="$t('customerManage.settlement_subject')" prop="settlementCompanyId"  style="width: 65%">
          <type-select
            :disabled="!!formData.id"
            :defaultDisplay="formData.settlementCompanyName"
            v-model="formData.settlementCompanyId"
            type="customer"
            :method="selectionsBaseInfoApi"
            @selected="settlementChange" />
        </el-form-item>
        <el-form-item label="" prop="checkedCn" style="width: 200px">
          <el-checkbox v-model="formData.checkedCn" @change="cnChange">{{ $t('invoicingManage.defaultInvoiceTitle') }}</el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('invoicingManage.englishName')" prop="settlementCompanyEnglishName" style="width: 65%">
          <el-input v-model="formData.settlementCompanyEnglishName" size="mini" v-trim disabled />
        </el-form-item>
        <el-form-item label="" prop="checkedEnglish" style="width: 200px">
          <el-checkbox v-model="formData.checkedEnglish" @change="enChange">{{ $t('invoicingManage.defaultInvoiceTitle') }}</el-checkbox>
        </el-form-item>

        <el-form-item :label="$t('customerManage.duty_paragraph')" prop="taxNum" style="width: 100%">
          <el-input v-model="formData.taxNum" :disabled="taxNumDisabled" size="mini" v-trim v-input-auto="'en_num_symbol'"/>
        </el-form-item>
        <el-form-item :label="$t('customerManage.company_address')" prop="address" style="width: 65%">
          <el-input v-model="formData.address" size="mini" v-trim />
        </el-form-item>
        <el-form-item :label="$t('customerManage.corporateTelephone')" prop="tel" style="width: 35%">
          <el-input v-model="formData.tel" size="mini" maxlength="20" show-word-limit v-trim />
        </el-form-item>
        <el-form-item :label="$t('customerManage.effective_time')" prop="periodBegin" style="width: 65%">
          <el-date-picker v-model="formData.periodBegin" type="datetime"  value-format="timestamp"></el-date-picker>
        </el-form-item>
        <div class="title">{{ $t('invoicingManage.bankInfo') }}</div>
        <div v-for="(item,index) in formData.bankAccounts" :key="index" class="bank-item">
          <div class="flex">
            <el-form-item :label="$t('customerManage.bank_name')" prop="bankName">
              <el-input v-model="item.bankName" size="mini" v-trim />
            </el-form-item>
            <el-form-item :label="$t('customerManage.branch_name')" prop="bankBranch">
              <el-input v-model="item.bankBranch" size="mini" v-trim />
            </el-form-item>
            <el-form-item :label="'SWIFT CODE'" prop="swiftCode">
              <el-input v-model="item.swiftCode" size="mini" v-trim />
            </el-form-item>
            <el-button type="text" icon="el-icon-circle-plus" class="icon blue" @click="addBank"></el-button>
            <el-button v-if="formData.bankAccounts.length>1" type="text" icon="el-icon-remove" class="icon red" @click="delBank(index)"></el-button>
          </div>
          <div v-for="(val,j) in item.accounts" :key="j" class="flex" style="width: 100%">
            <el-form-item :label="$t('customerManage.bank_account')" prop="bankAccount" style="width: 38%">
              <el-input v-model="val.bankAccount" size="mini" v-trim />
            </el-form-item>
            <el-form-item prop="settlement_subject" class="rechargeCurrency" style="width: 12%">
              <CurrencySelect  v-model="val.rechargeCurrency"  />
            </el-form-item>
            <div>
              <el-button type="text" @click="addSubBranch(index)" icon="el-icon-plus" class="icon red" style="font-size: 23px"></el-button>
              <el-button v-if="item.accounts.length > 1" type="text" icon="el-icon-close" class="icon red" @click="delSubBranch(index,j)" style="margin-left: 5px;font-size: 24px"></el-button>
              <el-checkbox :disabled="defaultFlagNum >= 2 && !val.defaultFlag" v-model="val.defaultFlag" class="defaultChecked">{{$t('customerManage.default')}}</el-checkbox>
            </div>
          </div>
        </div>
      </el-form>

    </div>
    <div class="page-edit-footer">
      <el-button size="mini" plain @click="backList">{{$t('contract.cancel')}}</el-button>
      <el-button v-if="type!=='view'" type="primary" size="mini" plain @click="save">{{$t('customerManage.save')}}</el-button>
    </div>
  </div>

</template>
<script>
import {selectionsBaseInfoApi} from '@/api/commonComponent';
import CurrencySelect from "@/views/cargo/v0/OverseasWarehouse/components/CurrencySelect";
import lodash from 'lodash'
import { crmSettlementCompanyDetailApi, crmSettlementCompanyPutApi, crmSettlementCompanySaveApi} from "@/api/invoicingInfoManagement";

const accounts = {
  bankAccount: null,
  defaultFlag: null,
  rechargeCurrency: null
}

const bankAccounts = {
  accounts: [{
    bankAccount: null,
    defaultFlag: null,
    rechargeCurrency: null
  }],
  bankAddress: null,
  bankBranch: null,
  bankName: null,
  bankNo: null,
  swiftCode: null
}

export default {
	name: 'InformationInvoicingAdd',
	components: {CurrencySelect
	},
	data() {
		return {
      selectionsBaseInfoApi: selectionsBaseInfoApi,
      formData: {
        taxNum: '',
        settlementCompanyId: '',
        settlementCompanyName: '',
        settlementCompanyEnglishName: '',
        countryCode: '',
        bankAccounts: [],
        checkedCn: true,
        checkedEnglish: false
      },
      formDataRules: {},
      loading: false,
      type: null,
      defaultFlagNum: 0,
      taxNumDisabled: false
		}
	},
	created() {
    this.formDataRules = {
      settlementCompanyId: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
      taxNum: [{ required: false, message: this.$t('common.cannot_be_null'), trigger: 'change'}, { validator: this.validateTaxNum, trigger: 'blur' }],
      periodBegin: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
      address: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}]
    }
		this.id = this.$route.query.id
		this.type = this.$route.query.type
    if (this.id) {
      this.getDetail()
    } else {
       if (this.$isEmpty(this.formData.bankAccounts)) {
         this.formData.bankAccounts.push(lodash.cloneDeep(bankAccounts))
       }
    }
	},
  watch: {
    'formData.bankAccounts': {
      handler(val) {
        this.defaultFlagNum = 0
        val.map(item => {
          item.accounts.map(item2 => {
            if (item2.defaultFlag) {
              this.defaultFlagNum++
            }
          })
        })
      },
      deep: true
    },
    'formData.countryCode': {
       handler(val) {
        this.$set(this.formDataRules, "taxNum",
          [{ required: val === "CN", message: this.$t('common.cannot_be_null'), trigger: 'change'}, { validator: this.validateTaxNum, trigger: 'blur' }],
        )
        this.$set(this.formDataRules, "address",
          [{ required: val === "CN", message: this.$t('common.cannot_be_null'), trigger: 'change'}]
        )
      },
      deep: true
    }
  },
	methods: {
    validateTaxNum(rule, value, callback) {
      if (value && this.formData.countryCode === 'CN') {
        let reg = /^[a-zA-Z0-9()]{6,20}$/
        if (value) {
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error(this.$t("customerManage.taxNumberRegular")))
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    enChange(val) {
      if (val) {
        if (!this.formData.settlementCompanyEnglishName) {
          this.$message.error(this.$t('invoicingManage.enErrorInfo'))
          this.$nextTick(() => {
            this.formData.checkedEnglish = false
          })
          return
        } else {
          this.formData.checkedCn = false
        }
      } else {
        this.formData.checkedCn = false
        this.$nextTick(() => {
          this.formData.checkedEnglish = true
        })
      }
    },
    cnChange(val) {
      if (val) {
        this.formData.checkedEnglish = false
      } else {
        this.formData.checkedEnglish = false
        this.$nextTick(() => {
          this.formData.checkedCn = true
        })
      }
    },
    settlementChange(val) {
      this.$set(this.formData, 'settlementCompanyName', val.chineseName)
      this.$set(this.formData, 'countryCode', val.countryCode)
      this.formData.settlementCompanyEnglishName = val.englishName
      if (!val.englishName) {
        this.formData.checkedCn = true
        this.formData.checkedEnglish = false
      }
      if (val.businessLicenceNo) {
        this.$set(this.formData, 'taxNum', val.businessLicenceNo)
        this.taxNumDisabled = true
      } else {
        this.$set(this.formData, 'taxNum', '')
        this.taxNumDisabled = false
      }
    },
    addBank() {
      this.formData.bankAccounts.push(lodash.cloneDeep(bankAccounts))
    },
    delBank(i) {
      this.formData.bankAccounts.splice(i, 1)
    },
    addSubBranch(i) {
      this.formData.bankAccounts[i].accounts.push(lodash.cloneDeep(accounts))
    },
    delSubBranch(i, j) {
      this.formData.bankAccounts[i].accounts.splice(j, 1)
    },
    async save() {
      if (this.type !== 'view') {
        this.$refs.formData.validate(async valid => {
          if (valid) {
            this.loading = true
            let url = this.formData.id ? crmSettlementCompanyPutApi : crmSettlementCompanySaveApi
            let data = {
              ...this.formData
            }
            if (this.formData.checkedEnglish) {
              data.defaultEnglishTitleFlag = true
            } else {
              data.defaultEnglishTitleFlag = false
            }
            const res = await url(data)
            this.loading = false
            if (res.ok) {
              this.$message.success(this.$t('customerManage.submit_success'))
              this.backList()
            }
          }
        })
      }

    },
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `InformationInvoicing` })
		},
		async getDetail() {
      this.loading = true
      const res = await crmSettlementCompanyDetailApi(this.id)
      this.loading = false
      if (res.ok) {
        if (this.type === 'copy') {
          delete res.content.id
        }
        if (res.content.taxNum) {
          this.taxNumDisabled = true
        }
        if (this.$isEmpty(res.content.bankAccounts)) {
          res.content.bankAccounts.push(lodash.cloneDeep(bankAccounts))
        }
        if (res.content.defaultEnglishTitleFlag === true) {
          res.content.checkedEnglish = true
        } else if (res.content.defaultEnglishTitleFlag === false) {
          res.content.checkedCn = true
        }
        this.formData = res.content
      }
		}
	}
}
</script>
<style scoped lang="scss">
.bank-item{
  border: dashed 1px #ccc;
  padding: 20px 50px 20px 20px;
  margin-bottom: 30px;
}
.custmer-detail{
  background: #fff;
  border-radius: 5px
}
.title{
  font-weight: 650;
  font-style: normal;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.847058823529412);
  margin-bottom: 20px;
  width: 100%
}
.member-form{
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;

  ::v-deep .el-form-item{
    width: 50%;
  }
}
.flex{
  display: flex;
  flex-wrap: wrap;
  width: 100%
}
.bank_account{
  width: 30%;

  ::v-deep .el-form-item__content{
    margin-left: 0 !important;
  }
}
.icon {
  width: auto;
  height: auto;
  margin: 0 10px;
  font-size: 28px;
  transition: all 0.2s ease 0s;
  cursor: pointer;
  user-select: none;
  position: relative;
  top: -10px;
  &:hover {
    transform: scale(1.1);
  }
}
.el-icon-circle-close {
  font-size: 14px;
  transition: all 0.2s ease 0s;
  cursor: pointer;
  user-select: none;
  &:hover {
    transform: scale(1.1);
  }
}
.blue {
  color: #1890ff;
}
.red {
  color: #ff4949;
}
.defaultChecked{
  position: relative;
  top: -10px;
}
.rechargeCurrency{
  ::v-deep .el-form-item__content{
    margin-left: 0 !important;
  }
}
</style>
