<template>
  <div class="form-wrap">
    <el-form :model="baseInfoForm" ref="baseInfoForm" :rules="baseInfoRule" label-width="80px" size="mini" style="width: 400px;">
      <el-form-item :label="$t('spaceRule.ruleName')" prop="policyName">
        <el-input v-model="baseInfoForm.policyName" :placeholder="$t('spaceRule.baseInfoForm.limit8Input')" maxlength="8" style="width: 178px;" :disabled="isModify"></el-input>
      </el-form-item>
      <el-form-item :label="$t('spaceRule.baseInfoForm.bookingPlatform')" prop="bookingPlatform">
        <el-select v-model="baseInfoForm.bookingPlatform" disabled :placeholder="$t('common.placeholder')">
          <el-option :key="1" label="Syconhub" :value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('spaceRule.ruleType')" prop="ruleType">
        <el-radio v-model="baseInfoForm.ruleType" :label="1" @change="sendRuleType">{{$t('spaceRule.baseInfoForm.purchaseSpace')}}</el-radio>
        <!-- <el-radio v-model="baseInfoForm.ruleType" :label="2" @change="sendRuleType">订阅舱位</el-radio> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'BaseInfoForm',
    props: {
      isModify: {
        default: false,
        type: Boolean
      }
    },
    data() {
      return {
        baseInfoForm: {
          policyName: '',
          bookingPlatform: 1,
          ruleType: 1
        },
        baseInfoRule: {
          policyName: [
            {required: true, message: this.$t('spaceRule.ruleSetter.ruleNameEmptyInvalid'), trigger: 'blur'}
          ],
          bookingPlatform: [
            {required: true, message: this.$t('spaceRule.baseInfoForm.platformsEmptyInvalid'), trigger: 'chage'}
          ]
        }
      }
    },
    computed: {},
    methods: {
      setFormInfo(formObj) {
        this.baseInfoForm = {...this.baseInfoForm, ...formObj}
        this.sendRuleType(this.baseInfoForm.ruleType)
      },
      sendRuleType(val) {
        this.$emit('checkRuleType', val)
      },
      validateForm() {
        return new Promise((resolve, reject) => {
          this.$refs.baseInfoForm.validate(valid => {
            if (!valid) {
              reject('baseInfoForm')
            } else {
              resolve(this.baseInfoForm)
            }
          })
        })
      }
    },
    created() {},
    mounted() {}
  }
</script>
