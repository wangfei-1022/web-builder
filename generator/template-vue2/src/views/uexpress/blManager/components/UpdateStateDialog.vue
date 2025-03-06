<template>
  <div class="">
    <el-dialog :visible.sync="visible" width="800px" :title="$t('uexpressBL.blUpdateStateDialog.dialogTitle')" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true">
      <el-form :inline="true" :model="formData" ref="formDataRef" label-width="100px" :rules="formRule" size="mini">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.blNo')}: `" prop="blNo">
              <el-input v-model="formData.blNo" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.flightNo')}: `" prop="flightNo">
              <el-input v-model="formData.flightNo" clearable disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.polCode')}: `" prop="polCode">
              <type-select v-model="formData.polCode" type="airport" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.podCode')}: `" prop="podCode">
              <type-select v-model="formData.podCode" type="airport" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.atd')}: `" prop="atd">
              <common-picker v-model="formData.atd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" @change="setTimeStr($event, 'atdFormat')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.ata')}: `" prop="ata">
              <common-picker v-model="formData.ata" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" @change="setTimeStr($event, 'ataFormat')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.importDeclareStateTime')}: `" prop="importDeclareStateTime">
              <common-picker v-model="formData.importDeclareStateTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" @change="setTimeStr($event, 'importDeclareStateTimeFormat')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.importDeclareStateFinishTime')}: `" prop="importDeclareStateFinishTime">
              <common-picker v-model="formData.importDeclareStateFinishTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" @change="setTimeStr($event, 'importDeclareStateFinishTimeFormat')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.blUpdateStateDialog.importMailDeliveryTime')}: `" prop="importMailDeliveryTime">
              <common-picker v-model="formData.importMailDeliveryTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" @change="setTimeStr($event, 'importMailDeliveryTimeFormat')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" :loading="loading" @click="resetFn">{{$t('common.resetBtn')}}</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="submitFn">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { submitUpdateStateBLApi } from '@/api/uexpress/blManager'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
export default {
  name: 'UpdateStateDialog',
  components: {
    NumberInput
  },
  data() {
    return {
      bolId: '',
      visible: false,
      loading: false,
      sourceItem: {},
      formData: {
        blNo: '',
        flightNo: '',
        polCode: '',
        podCode: '',
        atd: '',
        ata: '',
        importDeclareStateTime: '',
        importDeclareStateFinishTime: '',
        importMailDeliveryTime: '',
        atdFormat: '',
        ataFormat: '',
        importDeclareTimeFormat: '',
        importDeclareFinishTimeFormat: '',
        mailDeliveryTimeFormat: ''
      },
      formRule: {
        blNo: [
          {required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur'}
        ],
        flightNo: [
          {required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur'}
        ],
        polCode: [
          {required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}
        ],
        podCode: [
          {required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    init() {
      this.formData = {
        blNo: this.sourceItem.blNo,
        flightNo: this.sourceItem.flightNo,
        polCode: this.sourceItem.polCode,
        podCode: this.sourceItem.podCode,

        atd: this.$moment(this.sourceItem.atdFormat).valueOf(),
        atdFormat: this.sourceItem.atdFormat,

        ata: this.$moment(this.sourceItem.ataFormat).valueOf(),
        ataFormat: this.sourceItem.ataFormat,

        importDeclareStateTime: this.$moment(this.sourceItem.importDeclareTimeFormat).valueOf(),
        importDeclareStateTimeFormat: this.sourceItem.importDeclareTimeFormat,

        importDeclareStateFinishTime: this.$moment(this.sourceItem.importDeclareFinishTimeFormat).valueOf(),
        importDeclareStateFinishTimeFormat: this.sourceItem.importDeclareFinishTimeFormat,

        importMailDeliveryTime: this.$moment(this.sourceItem.mailDeliveryTimeFormat).valueOf(),
        importMailDeliveryTimeFormat: this.sourceItem.mailDeliveryTimeFormat
      }
    },
    setTimeStr(val, nameStr) {
      this.formData[nameStr] = val === null ? '' : this.$moment(Number(val)).format('YYYY-MM-DD HH:mm:ss')
    },
    show(item) {
      this.bolId = item.id
      this.sourceItem = {
        ...item
      }
      this.init()
      this.visible = true
    },
    submitFn() {
      this.loading = true
      this.$refs.formDataRef.validate(valid => {
        if (valid) {
          let data = {
            bolId: this.bolId,
            ...this.formData
          }
          submitUpdateStateBLApi(data).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('uexpressBL.blUpdateStateDialog.updateStateSuccess'))
              this.visible = false
              this.$emit('success')
              this.$nextTick(() => {
                this.$refs.formDataRef.clearValidate()
              })
            }
            this.loading = false
          }).catch(err => {
            console.error(err)
            this.loading = false
          })
        }
      })

    },
    resetFn() {
      this.init()
      this.$nextTick(() => {
        this.$refs.formDataRef.clearValidate()
      })
    }
  }
}
</script>
<style scoped lang="scss">
</style>
