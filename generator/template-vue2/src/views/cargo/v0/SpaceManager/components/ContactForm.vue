<template>
  <div class="form-wrap">
    <div class="inner-form-wrap">
      <h3>{{$t('spaceRule.contactForm.senderInfo')}}</h3>
      <el-form :model="contactForm" ref="contactForm" size="mini" :rules="contactFormRules" label-width="100">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="contactName" label-width="100" :label="$t('spaceRule.contactForm.companyName')">
              <el-input v-model="contactForm.contactName" maxlength="70"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="contactEmail" :label="$t('spaceRule.contactForm.contactEmail')" required>
              <el-input v-model="contactForm.contactEmail" maxlength="400"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="contactMobile" :label="$t('spaceRule.contactForm.contactMobile')" label-width="100" required>
              <el-input v-model="contactForm.contactMobile" maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="contactTel" :label="$t('spaceRule.contactForm.contactTelephone')" label-width="100" required>
              <el-input v-model="contactForm.contactTel" maxlength="22"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-form-item prop="contactAddress" :label="$t('spaceRule.contactForm.contactAddress')">
              <el-input v-model="contactForm.contactAddress" maxlength="22"></el-input>
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
          // 订舱人
          contactName: '',
          contactEmail: '',
          contactMobile: '',
          contactTel: '',
          contactAddress: ''

        },
        contactFormRules: {
          // 订舱人
          contactName: [
            {required: true, message: this.$t('spaceRule.contactForm.nameAndCompanyEmptyInvalid'), trigger: 'blur'}
          ],
          contactEmail: [
            {validator: this.$validators.noEmptyEmail, trigger: 'blur'}
          ],
          contactMobile: [
            {validator: this.$validators.checkCommonMobile, trigger: 'blur'}
          ],
          contactTel: [
            {validator: this.$validators.checkCommonPhone, trigger: 'blur'}
          ],
          contactAddress: [
            {required: true, message: this.$t('spaceRule.contactForm.addressEmptyInvalid'), trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      setFormInfo(formObj) {
        this.contactForm = {
          contactName: formObj.contactName,
          contactEmail: formObj.contactEmail,
          contactMobile: formObj.contactMobile,
          contactTel: formObj.contactTel,
          contactAddress: formObj.contactAddress
        }
      },
      validateForm() {
        return new Promise((resolve, reject) => {
          this.$refs.contactForm.validate(valid => {
            if (!valid) {
              reject('contactForm')
            } else {
              resolve({contactForm: this.contactForm})
            }
          })
        })
      },
      clearForm() {
        this.$refs.contactForm.resetFields()
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
