<template>
  <el-dialog v-if="visible" :title='$t("receiveFms.sendBill")' :visible.sync="visible" width="600px" :close-on-click-modal="false"	>
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" size="mini">
      <el-form-item :label='$t("receiveFms.receiveEmails")' prop="emails">
        <el-input size="mini" v-model="form.emails" :placeholder='$t("receiveFms.receiveEmailsPlaceholder")' v-if="arap === 'AR'"/>
        <send-batch-email-select
          v-if="arap === 'AP'"
          type="BILL"
          size="mini"
          v-model="form.emails"
          :placeholder='$t("receiveFms.receiveEmailsPlaceholder")'
          :settlementId="settlementId"
        />
      </el-form-item>
      <el-form-item :label='$t("receiveFms.emailRemark")' prop="remark">
        <el-input size="mini" v-model="form.remark" />
      </el-form-item>
      <el-form-item label='' prop="templateLanguage">
        <el-radio-group v-model="form.templateLanguage">
          <el-radio :label="item.id" v-for="item in templateList" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="submitFn" size="mini" :loading="loading">{{$t("common.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { sendReceiveBillEmailApi, getBillSendEmailApi } from '@/api/financial/fmsReceive'
import { sendPayableBillEmailApi } from '@/api/financial/fmsPayable'
import SendBatchEmailSelect from './SendBatchEmailSelect'
import { validateEmail, validateMobile } from "@/utils/validate";

export default {
  name: "SendBillComponent",
  components: {
    SendBatchEmailSelect
  },
  props: {
    ids: {
      type: Array,
      default: function () {
        return []
      }
    },
    settlementId: {
      type: String,
      default: ''
    },
    arap: {
      type: String,
      default: ''
    }
  },
  data() {
    const validEmail = (rule, value, callback) => {
      if (value) {
        if (validateEmail(value)) {
          callback()
        } else {
          return callback(this.$t('receiveFms.emailError'))
        }
      } else {
        callback()
      }
    }

    return {
      loading: false,
      visible: false,
      templateList: [{
        id: 'CN',
        name: this.$t('receiveFms.CN_EMAIL')
      }, {
        id: 'EN',
        name: this.$t('receiveFms.EN_EMAIL')
      }],
      form: {
        emails: '',
        remark: '',
        templateLanguage: 'CN'
      },
      formRules: {
        emails: [
          { required: true, message: this.$t('receiveFms.cannot_be_null'), trigger: "change" },
          { required: true, message: this.$t('receiveFms.cannot_be_null'), trigger: "blur" },
          { validator: validEmail, trigger: "blur" }],
        templateLanguage: [{ required: true, message: this.$t('receiveFms.cannot_be_null') }]
      },
      chargeFile: {}
    }
  },
  created() {},
  methods: {
    show(settlementId, businessType) {
      let data = {
        memberId: settlementId,
        businessType: businessType
      }
      getBillSendEmailApi(data).then(res => {
        if (res.ok) {
          this.visible = true
          let emails = []
          res.content.forEach(v => {
            if (v.defaultFlag) {
              emails.push(v.email)
            }
          })

          this.form = {
            emails: emails.join(';'),
            remark: '',
            templateLanguage: 'CN'
          }
        }
      })
		},
    submitFn() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          let data = {
            chargeDirect: this.arap === 'AR' ? 1 : 2,
            billIds: this.ids,
            ...this.form
          }
          this.loading = true
          let fn = this.arap === 'AR' ? sendReceiveBillEmailApi : sendPayableBillEmailApi
          fn(data).then(res => {
            if (res.ok) {
              this.visible = false
              this.$message.success(this.$t('receiveFms.sendBillSuccess'))
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
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

