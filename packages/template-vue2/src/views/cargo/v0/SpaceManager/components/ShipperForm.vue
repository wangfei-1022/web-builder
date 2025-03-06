<template>
  <div class="form-wrap">
    <div class="inner-form-wrap">
      <h3>{{$t('spaceRule.contactForm.companyName')}}</h3>
      <el-form :model="contactForm" ref="contactForm" size="mini" :rules="contactFormRules" label-width="100">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="shipperCompany" label-width="100" :label="$t('spaceRule.shipperForm.shipperCompany')">
              <el-input v-model="contactForm.shipperCompany" maxlength="70"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="shipperArea" :label="$t('spaceRule.shipperForm.shipperArea')">
              <el-input v-model="contactForm.shipperArea" maxlength="35"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="shipperAddress" label-width="100" :label="$t('spaceRule.shipperForm.shipperAddress')">
              <el-input v-model="contactForm.shipperAddress" maxlength="35"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="shipperAdditionalAddress" label-width="100" :label="$t('spaceRule.shipperForm.shipperAdditionalAddress')">
              <el-input v-model="contactForm.shipperAdditionalAddress" maxlength="1200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="shipperMobile" :label="$t('spaceRule.shipperForm.shipperMobile')" required>
              <el-input v-model="contactForm.shipperMobile" maxlength="22"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="shipperEmail" :label="$t('spaceRule.shipperForm.shipperEmail')" required>
              <el-input v-model="contactForm.shipperEmail" maxlength="400"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-divider></el-divider>
    <div class="inner-form-wrap">
      <h3>{{$t('spaceRule.shipperForm.consigneeInfo')}}</h3>
      <el-form :model="contactForm" ref="contactForm2" size="mini" :rules="contactFormRules" label-width="100">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="consigneeCompany" label-width="100" :label="$t('spaceRule.shipperForm.consigneeCompany')">
              <el-input v-model="contactForm.consigneeCompany" maxlength="70"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="consigneeArea" :label="$t('spaceRule.shipperForm.consigneeArea')">
              <el-input v-model="contactForm.consigneeArea" maxlength="35"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="consigneeAddress" label-width="100" :label="$t('spaceRule.shipperForm.consigneeAddress')">
              <el-input v-model="contactForm.consigneeAddress" maxlength="35"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="consigneeAdditionalAddress" label-width="100" :label="$t('spaceRule.shipperForm.consigneeAdditionalAddress')">
              <el-input v-model="contactForm.consigneeAdditionalAddress" maxlength="1200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="consigneeMobile" :label="$t('spaceRule.shipperForm.consigneeMobile')" required>
              <el-input v-model="contactForm.consigneeMobile" maxlength="22"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="consigneeEmail" :label="$t('spaceRule.shipperForm.consigneeEmail')" required>
              <el-input v-model="contactForm.consigneeEmail" maxlength="400"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-divider></el-divider>
    <div class="inner-form-wrap">
      <h3>{{$t('spaceRule.shipperForm.notifyInfo')}}</h3>
      <el-form :model="contactForm" ref="contactForm3" size="mini" :rules="contactFormRules" label-width="100">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="notifyCompany" label-width="100" :label="$t('spaceRule.shipperForm.notifyCompany')">
              <el-input v-model="contactForm.notifyCompany" maxlength="70"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="notifyArea" :label="$t('spaceRule.shipperForm.notifyArea')">
              <el-input v-model="contactForm.notifyArea" maxlength="35"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="notifyAddress" label-width="100" :label="$t('spaceRule.shipperForm.notifyAddress')">
              <el-input v-model="contactForm.notifyAddress" maxlength="35"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="notifyAdditionalAddress" label-width="100" :label="$t('spaceRule.shipperForm.notifyAdditionalAddress')">
              <el-input v-model="contactForm.notifyAdditionalAddress" maxlength="1200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="notifyMobile" :label="$t('spaceRule.shipperForm.notifyMobile')" required>
              <el-input v-model="contactForm.notifyMobile" maxlength="22"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="notifyEmail" :label="$t('spaceRule.shipperForm.notifyEmail')" required>
              <el-input v-model="contactForm.notifyEmail" maxlength="400"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ContactForm',
    data() {
      return {
        contactForm: {
          // 发货人
          shipperCompany: '',
          shipperArea: '',
          shipperAddress: '',
          shipperAdditionalAddress: '',
          shipperMobile: '',
          shipperEmail: '',
          // 收货人
          consigneeCompany: '',
          consigneeArea: '',
          consigneeAddress: '',
          consigneeAdditionalAddress: '',
          consigneeMobile: '',
          consigneeEmail: '',
          // 通知人
          notifyCompany: '',
          notifyArea: '',
          notifyAddress: '',
          notifyAdditionalAddress: '',
          notifyMobile: '',
          notifyEmail: ''

        },
        contactFormRules: {
          // 发货人
          shipperCompany: [
            {required: true, message: this.$t('spaceRule.shipperForm.shipperCompanyEmptyInvalid'), trigger: 'blur'}
          ],
          shipperArea: [
            {required: true, message: this.$t('spaceRule.shipperForm.shipperAreaEmptyInvalid'), trigger: 'blur'}
          ],
          shipperAddress: [
            {required: true, message: this.$t('spaceRule.shipperForm.shipperAddressEmptyInvalid'), trigger: 'blur'}
          ],
          shipperAdditionalAddress: [
            {required: true, message: this.$t('spaceRule.shipperForm.shipperAddressDetailEmptyInvalid'), trigger: 'blur'}
          ],
          shipperMobile: [
            {validator: this.$validators.checkCommonPhone, trigger: 'blur'}
          ],
          shipperEmail: [
            {validator: this.$validators.noEmptyEmail, trigger: 'blur'}
          ],
          // 收货人
          consigneeCompany: [
            {required: true, message: this.$t('spaceRule.shipperForm.consigneeCompanyEmptyInvalid'), trigger: 'blur'}
          ],
          consigneeArea: [
            {required: true, message: this.$t('spaceRule.shipperForm.consigneeAreaEmptyInvalid'), trigger: 'blur'}
          ],
          consigneeAddress: [
            {required: true, message: this.$t('spaceRule.shipperForm.consigneeAddressEmptyInvalid'), trigger: 'blur'}
          ],
          consigneeAdditionalAddress: [
            {required: true, message: this.$t('spaceRule.shipperForm.consigneeAddressDetailEmptyInvalid'), trigger: 'blur'}
          ],
          consigneeMobile: [
            {validator: this.$validators.checkCommonPhone, trigger: 'blur'}
          ],
          consigneeEmail: [
            {validator: this.$validators.noEmptyEmail, trigger: 'blur'}
          ],
          // 通知人
          notifyCompany: [
            {required: true, message: this.$t('spaceRule.shipperForm.notifyCompanyEmptyInvalid'), trigger: 'blur'}
          ],
          notifyArea: [
            {required: true, message: this.$t('spaceRule.shipperForm.notifyAreaEmptyInvalid'), trigger: 'blur'}
          ],
          notifyAddress: [
            {required: true, message: this.$t('spaceRule.shipperForm.notifyAddressEmptyInvalid'), trigger: 'blur'}
          ],
          notifyAdditionalAddress: [
            {required: true, message: this.$t('spaceRule.shipperForm.notifyAddressDetailEmptyInvalid'), trigger: 'blur'}
          ],
          notifyMobile: [
            {validator: this.$validators.checkCommonPhone, trigger: 'blur'}
          ],
          notifyEmail: [
            {validator: this.$validators.noEmptyEmail, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      setFormInfo(formObj) {
        this.contactForm = {
          // 发货人
          shipperCompany: formObj.shipperCompany,
          shipperArea: formObj.shipperArea,
          shipperAddress: formObj.shipperAddress,
          shipperAdditionalAddress: formObj.shipperAdditionalAddress,
          shipperMobile: formObj.shipperMobile,
          shipperEmail: formObj.shipperEmail,
          // 收货人
          consigneeCompany: formObj.consigneeCompany,
          consigneeArea: formObj.consigneeArea,
          consigneeAddress: formObj.consigneeAddress,
          consigneeAdditionalAddress: formObj.consigneeAdditionalAddress,
          consigneeMobile: formObj.consigneeMobile,
          consigneeEmail: formObj.consigneeEmail,
          // 通知人
          notifyCompany: formObj.notifyCompany,
          notifyArea: formObj.notifyArea,
          notifyAddress: formObj.notifyAddress,
          notifyAdditionalAddress: formObj.notifyAdditionalAddress,
          notifyMobile: formObj.notifyMobile,
          notifyEmail: formObj.notifyEmail
        }
      },
      validateForm() {
        return new Promise((resolve, reject) => {
          Promise.all(['contactForm', 'contactForm2', 'contactForm3'].map(item =>
            new Promise((resolve, reject) => {
              this.$refs[item].validate(valid => {
                if (!valid) {
                  reject('shipperForm')
                } else {
                  resolve('Contact validated success')
                }
              })
            })
          )).then(res => {
            resolve({shipperForm: this.contactForm})
          }).catch(() => {
            reject('shipperForm')
          })
        })
      },
      clearForm() {
        this.$refs.contactForm.resetFields()
        this.$refs.contactForm2.resetFields()
        this.$refs.contactForm3.resetFields()
      }
    }
  }
</script>
<style scoped lang="scss">
  .inner-form-wrap{
    padding-left: 16px;
    h3{
      font-size: 16px;
      font-weight: normal;
    }
  }
</style>
