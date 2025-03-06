<template>
  <div class="page-edit-container full-page"  v-loading="loading">
    <div class="page-edit-content custmer-detail ">
      <div class="info-section-module">
        <div class="info-title">
          {{ $t('paymentInfoManage.companyInfo') }}
        </div>
        <div class="info-content">
          <el-form ref="baseDataRef" :model="formData" :rules="formDataRules" label-width="110px" size="mini" class="member-form">
            <el-form-item :label="$t('paymentInfoManage.supplierName')" prop="settlementCompanyId"  style="width: 65%">
              <type-select
                :disabled="!!formData.id"
                :defaultDisplay="formData.settlementCompanyName"
                v-model="formData.settlementCompanyId"
                type="customer"
                :method="selectionsBaseInfoApi"
                @selected="settlementChange" />
            </el-form-item>

            <el-form-item :label="$t('paymentInfoManage.taxNum')" prop="taxNum" style="width: 35%">
              <el-input v-model="formData.taxNum" :disabled="taxNumDisabled" size="mini" v-trim v-input-auto="'en_num_symbol'"/>
            </el-form-item>
            <div style="width: 65%; overflow: hidden;float: left;">
              <el-row>
                <el-col :span="10">
                  <el-form-item :label="$t('paymentInfoManage.address')" prop="countryCode" style="width: 100%">
                    <base-select 
                      type="country" 
                      v-model="formData.countryCode"
                      @selected="countrySelected"
                      placeholder="请选择国家"
                      filterable
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="" prop="address" label-width="0px" style="width: 100%">
                    <el-input v-model="formData.address" size="mini" placeholder="请输入详细公司注册地址" v-trim style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>
            
            </div>
            <el-form-item :label="$t('paymentInfoManage.tel')" prop="tel" style="width: 35%">
              <el-input v-model="formData.tel" size="mini" v-trim />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="info-section-module">
        <div class="info-title">
          {{ $t('paymentInfoManage.bankInfo') }}
          <a class="link" style="margin-left: 10px; font-weight: 500;font-size: 15px;" href="https://www.myswiftcodes.com" target="_blank">{{ $t('paymentInfoManage.swiftSearch') }}</a>
        </div>
        <div class="info-content">
          <div v-for="(item, bankIndex) in formData.bankAccounts" :key="bankIndex" class="bank-item">
            <bank-item :ref="'bankItemRef' + bankIndex"
              :item="item"
              :countryCode="formData.countryCode"
              :len="formData.bankAccounts.length"
              :bankIndex="bankIndex"
              @addBank="addBank"
              @delBank="delBank"
            />
          </div>
          <el-form ref="bankDataRef" :model="formData" :rules="formDataRules" label-width="110px" size="mini" class="member-form">
            <el-form-item :label="$t('paymentInfoManage.paymentCertificates')" prop="paymentCertificates">
              <upload-file v-model="formData.paymentCertificates" multiple accept=".png,.pdf,.rar,.jpeg,.jpg,.png,.doc,.docx"></upload-file>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button size="mini" plain @click="backList" v-if="type === 'VIEW'">{{$t('common.close')}}</el-button>
      <el-button size="mini" plain @click="backList" v-if="type !== 'VIEW'">{{$t('common.cancel')}}</el-button>
      <el-button size="mini" plain @click="save" type="primary" v-if="type !== 'VIEW'">{{$t('common.save')}}</el-button>
    </div>
  </div>

</template>
<script>
import {selectionsBaseInfoApi} from '@/api/commonComponent';
import CurrencySelect from "@/views/cargo/v0/OverseasWarehouse/components/CurrencySelect";
import lodash from 'lodash'
import { partnerPaymentInfoDetailApi, partnerPaymentInfoPutApi, partnerPaymentInfoSaveApi} from "@/api/partner/paymentInfo";
import BankItem from './bankItem';

export default {
	name: 'PartnerPaymentInfoAdd',
  components: {
    BankItem
  },
	props: {
    type: {
      type: String,
      default: ''
    }
	},
	data() {
      const validateTaxNum = (rule, value, callback) => {
      if (value && this.formData.countryCode === 'CN') {
        let reg = /^[a-zA-Z0-9()]{6,20}$/
        if (value) {
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error(this.$t("paymentInfoManage.taxNumberRegular")))
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
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
        checkedEnglish: false,
        paymentCertificates: []
      },
      formDataRules: {
        settlementCompanyId: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
        // taxNum: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}, { validator: validateTaxNum, trigger: 'blur' }],
        periodBegin: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
        countryCode: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
        address: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
        paymentCertificates: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}]
      },
      loading: false,
      defaultFlagNum: 0,
      taxNumDisabled: false
		}
	},
	async created() {
		this.id = this.$route.query.id
    if (this.id) {
      await this.getDetail()
    }
    if (this.$isEmpty(this.formData.bankAccounts)) {
      this.formData.bankAccounts.push({
        accounts: [{
          bankAccount: null,
          defaultFlag: null,
          rechargeCurrency: null
        }],
        bankAddress: null,
        bankBranch: null,
        bankName: null,
        bankNo: null,
        swiftCode: null,
        countryCode: '',
        countryName: ''
      })
    }
	},

	methods: {
    countrySelected(item) {
      this.formData.countryName = item.chineseName
    },
    enChange(val) {
      if (val) {
        if (!this.formData.settlementCompanyEnglishName) {
          this.$message.error(this.$t('paymentInfoManage.enErrorInfo'))
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
      this.$set(this.formData, 'address', val.registeredAddress)
      this.$set(this.formData, 'tel', val.corporateTelephone)
    },
    addBank(bankItem) {
      this.formData.bankAccounts.push(bankItem)
    },
    delBank(index) {
      this.formData.bankAccounts.splice(index, 1)
    },
    async save() {
      if (this.type !== 'view') {
        let VALID_BASE = true
        let VALID_BANK = true
        let VALID_BANK_ITEM = true
        this.$refs.baseDataRef.validate(valid => {
          VALID_BASE = valid
        })
        this.$refs.bankDataRef.validate(valid => {
          VALID_BANK = valid
        })
        let bankAccounts = []
        Object.keys(this.$refs).forEach(v => {
          if (v.indexOf('bankItemRef') >= 0 && this.$refs[v][0]) {
            let VALID = this.$refs[v][0].validate()
            bankAccounts.push(this.$refs[v][0].getValue())
            if (!VALID) {
              VALID_BANK_ITEM = false
            }
          }
        })

        if (!VALID_BASE || !VALID_BANK || !VALID_BANK_ITEM) {
          return
        }

        this.loading = true
        let url = this.formData.id ? partnerPaymentInfoPutApi : partnerPaymentInfoSaveApi
        let data = {
          ...this.formData,
          bankAccounts: bankAccounts
        }
        if (this.formData.checkedEnglish) {
          data.defaultEnglishTitleFlag = true
        } else {
          data.defaultEnglishTitleFlag = false
        }
        const res = await url(data)
        this.loading = false
        if (res.ok) {
          this.$message.success(this.$t('paymentInfoManage.submit_success'))
          this.backList()
        }
      }

    },
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `PartnerPaymentInfoList` })
		},
		async getDetail() {
      this.loading = true
      const res = await partnerPaymentInfoDetailApi(this.id)
      this.loading = false
      if (res.ok) {
        if (this.type === 'copy') {
          delete res.content.id
        }
        if (res.content.taxNum) {
          this.taxNumDisabled = true
        }
        if (res.content.defaultEnglishTitleFlag === true) {
          res.content.checkedEnglish = true
        } else if (res.content.defaultEnglishTitleFlag === false) {
          res.content.checkedCn = true
        }
        this.formData = {
          ...this.formData,
          ...res.content,
          countryName: res.content.countryCnName
        }

      }
		}
	}
}
</script>
<style scoped lang="scss">
.bank-item {
  border: dashed 1px #ccc;
  padding: 20px 80px 20px 20px;
  margin-bottom: 30px;
  position: relative;
  max-width: 1200px;
}
.member-form{
  max-width: 1200px;
  ::v-deep .el-form-item{
    width: 50%;
    float: left;
  }
}
</style>
