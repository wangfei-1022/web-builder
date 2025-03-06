<template>
  <div class="right-main-wrapper">
    <section class="info-wrapper">
      <section class="info-section">
        <SectionTitle :title="$t('spaceRule.ruleSetter.ruleInfo')"></SectionTitle>
        <div class="info-content-wrap">
          <BaseInfoForm ref="baseInfoForm" id="baseInfoForm" :isModify="optType === 1" @checkRuleType="checkRuleType"></BaseInfoForm>
        </div>
      </section>
      <section class="info-section">
        <SectionTitle :title="$t('spaceRule.ruleSetter.spaceLineInfo')"></SectionTitle>
        <div class="info-content-wrap">
          <LineManagerForm id="lineManagerForm" ref="lineManagerForm" :ruleType="ruleType" @cancelRuleType="cancelRuleType"></LineManagerForm>
        </div>
      </section>
      <section class="info-section shot-section">
        <SectionTitle :title="$t('spaceRule.ruleSetter.tacticsConfig')"></SectionTitle>
        <div class="info-content-wrap">
          <OpreationForm id="opreationForm" ref="opreationForm" :ruleType="ruleType"></OpreationForm>
        </div>
      </section>
      <section class="info-section shot-section" v-show="ruleType === 1">
        <SectionTitle :title="$t('spaceRule.ruleSetter.shipperInfo')" :show-switch="true" v-model="showShipper"></SectionTitle>
        <div class="info-content-wrap" v-show="showShipper">
          <ShipperForm id="shipperForm" ref="shipperForm"></ShipperForm>
        </div>
      </section>
      <section class="info-section shot-section" v-show="ruleType === 1">
        <SectionTitle :title="$t('spaceRule.packageForm.packageInfo')"></SectionTitle>
        <div class="info-content-wrap">
          <PackageForm id="packageForm" ref="packageForm"></PackageForm>
        </div>
      </section>
      <section class="info-section shot-section" v-show="ruleType === 1">
        <SectionTitle :title="$t('spaceRule.ruleSetter.contactInfo')"></SectionTitle>
        <div class="info-content-wrap">
          <ContactForm id="contactForm" ref="contactForm"></ContactForm>
        </div>
      </section>
    </section>
    <div class="btn-wrap">
      <el-button type="primary" @click="validateFormAction" :loading="loading" :disabled="loading">{{$t('common.submitBtn')}}</el-button>
      <el-button @click="cancel" :disabled="loading">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </div>
</template>
<script>
  import SectionTitle from '@/components/Cargo/Common/sectionTitle'
  import BaseInfoForm from './components/BaseInfoForm'
  import LineManagerForm from './components/LineManagerForm'
  import OpreationForm from './components/OpreationForm'
  import ShipperForm from './components/ShipperForm'
  import PackageForm from './components/PackageForm'
  import ContactForm from './components/ContactForm'
  import { createRulesApi, updateRulesApi, getRulesDetailApi } from '@/api/spaceManager'
  export default {
    name: 'SpaceRuleSetter',
    data() {
      return {
        showShipper: true,
        loading: false,
        optType: 0,
        optId: '',
        ruleType: 1,
        dtoId: ''
      }
    },
    components: {
      SectionTitle,
      BaseInfoForm,
      LineManagerForm,
      OpreationForm,
      ShipperForm,
      PackageForm,
      ContactForm
    },
    computed: {},
    methods: {
      async getRuleInfo () {
        const res = await getRulesDetailApi(this.optId)
        if (res.ok) {
          const _info = res.content
          if (_info) {
            // 基本信息
            const _baseInfo = {
              policyName: _info.policyName,
              bookingPlatform: _info.bookingPlatform,
              ruleType: _info.ruleType,
              includeInsurance: _info.includeInsurance
            }
            this.$refs.baseInfoForm.setFormInfo(_baseInfo)

            // 航线及舱位信息
            this.$refs.lineManagerForm.setFormInfo({
              containerPolicyList: _info.seaContainerPolicyDTOList,
              includeInsurance: _info.includeInsurance,
              lineType: _info.lineType
            })

            // 策略信息
            const _opreationForm = {
              notifyModeList: _info.notifyModeList,
              notifyNodeList: _info.notifyNodeList,
              beginTime: _info.beginTime,
              endTime: _info.endTime,
              notifyUserIdList: _info.notifyUserIdList
            }
            this.$refs.opreationForm.setFormInfo(_opreationForm)

            // 收发通
            this.showShipper = res.content.seaFlashTemplateDTO.addressFlag
            this.dtoId = res.content.seaFlashTemplateDTO.id
            this.$refs.shipperForm.setFormInfo(res.content.seaFlashTemplateDTO)

            // 货物信息
            this.$refs.packageForm.setFormInfo(res.content.seaFlashTemplateDTO)

            // 订舱人信息
            this.$refs.contactForm.setFormInfo(res.content.seaFlashTemplateDTO)
          }
        }
      },
      validateFormAction() {
        this.loading = true
        // 基础表单验证
        const validateFormArr = [
          this.$refs.baseInfoForm.validateForm(),
          this.$refs.lineManagerForm.validateForm(),
          this.$refs.opreationForm.validateForm()
        ]

        // 联系人信息
        if (this.ruleType === 1 && this.showShipper) {
          validateFormArr.push(this.$refs.shipperForm.validateForm())
        }

        // 抢舱额外表单验证
        if (this.ruleType === 1) {
          validateFormArr.push(this.$refs.packageForm.validateForm())
          validateFormArr.push(this.$refs.contactForm.validateForm())
        }

        // 是否表单全部通过验证
        Promise.all(validateFormArr).then(res => {
          let validatedForm = {
            containerPolicyList: [],
            seaFlashTemplateDTO: {
              addressFlag: this.showShipper
            }
          }
          res.forEach(item => {
            // if (this.$isArray(item)) {
            //   validatedForm.containerPolicyList = item
            // }
            if (item.contactForm) {
              validatedForm.seaFlashTemplateDTO = {...validatedForm.seaFlashTemplateDTO, ...item.contactForm}
            } else if (item.shipperForm) {
              validatedForm.seaFlashTemplateDTO = {...validatedForm.seaFlashTemplateDTO, ...item.shipperForm}
            } else if (item.packageForm) {
              validatedForm.seaFlashTemplateDTO = {...validatedForm.seaFlashTemplateDTO, ...item.packageForm}
            } else {
              validatedForm = {...validatedForm, ...item}
            }
          })
          // 全部通过，提交表单
          this.submitForm(validatedForm)
        }).catch(err => {
          this.loading = false
          const dom = document.querySelector(`#${err}`)
          dom.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      },
      async submitForm(_form) {
        let res = null
        if (this.optType === 0 || this.optType === 2) {
          res = await createRulesApi(JSON.stringify(_form))
        } else {
          _form.seaFlashTemplateDTO.id = this.dtoId
          res = await updateRulesApi(this.optId, JSON.stringify(_form))
        }

        if (res.ok) {
          this.$message({
            message: this.$t('spaceRule.ruleSetter.saveRuleSuccess'),
            type: 'success'
          })
          this.$router.push({name: 'SpaceRuleList'})
        }
        this.loading = false
      },
      cancel() {
        // 点击取消按钮
        this.$confirm(this.$t('spaceRule.ruleSetter.unSaveWarnningTips'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.dropEditBtn'),
          cancelButtonText: this.$t('spaceRule.ruleSetter.thinkOver'),
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('tagsView/delView', {
            path: this.$route.path,
            name: 'SpaceRuleSetter'
          }).then(res => {
            this.$router.push('/shippingManager/shippingRuleList')
          })
        }).catch(() => {})
      },
      checkRuleType(val) {
        // 抢舱/订阅
        if (val === 1) {
          this.$refs.shipperForm.clearForm()
          this.$refs.packageForm.clearForm()
        }
        this.ruleType = val
      },
      cancelRuleType(val) {
        this.$refs.baseInfoForm.baseInfoForm.ruleType = val
        this.checkRuleType(val)
      }
    },
    created() {},
    beforeMount() {
      // 判断 新建/编辑/复制
      switch (this.$route.query.options) {
        case 'create': this.optType = 0; break;
        case 'edit': this.optType = 1; break;
        case 'copy': this.optType = 2; break;
        default: this.optType = 0; break;
      }

      // 获取编辑Id
      if (this.$route.params.id) {
        this.optId = this.$route.params.id
      }

      // 执行编辑/复制逻辑
      if (this.optType > 0 && this.optId && this.optId !== '') {
        this.getRuleInfo()
      }
    },
    mounted() {
    }
  }
</script>
<style scoped lang="scss">
.right-main-wrapper{
  overflow: hidden;
  overflow-y: auto;
}
.info-wrapper{
  width: 100%;
  .form-wrap{
    width: 800px;
    padding: 20px 0;
  }
  .shot-section{
    width: 60%;
  }
}
.btn-wrap{
  width: 300px;
  margin: 30px auto;
}
</style>
