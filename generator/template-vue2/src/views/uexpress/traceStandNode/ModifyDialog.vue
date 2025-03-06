<template>
  <div>
    <el-dialog
    :visible.sync="visible"
    width="800px"
    :title="title"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form ref="modifyForm" :model="modifyForm" :rules="modifyFormRule" size="mini" label-width="120px" label-position="right" style="width: 100%;" inline>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.trackingNodeSegment")' prop="trackingNodeSegment">
              <el-select v-model="modifyForm.trackingNodeSegment" :disabled="isModify">
                <el-option v-for="item in nodeSegmentList" :value="item.value" :label="item.label" :key="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.nodeName")' prop="nodeName">
              <el-input v-model="modifyForm.nodeName" :disabled="isModify"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.nodeCode")'>
              <el-input style="width: 145px" v-model="modifyForm.customerCode" disabled></el-input>
            </el-form-item>
            <el-form-item label='' label-width="0" prop="nodeSuffix">
              <el-input style="width: 70px;" v-model="modifyForm.nodeSuffix" @input="setNodeCode" :disabled="isModify"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.forwardNecessary")' prop="forwardNecessary">
              <el-select v-model="modifyForm.forwardNecessary">
                <el-option v-for="item in judgementSubList" :value="item.value" :label="item.label" :key="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.abnormal")' prop="abnormal">
              <el-select v-model="modifyForm.abnormal">
                <el-option v-for="item in judgementSubList" :value="item.value" :label="item.label" :key="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.trackingNodeVisible")' prop="trackingNodeVisible">
              <el-select v-model="modifyForm.trackingNodeVisible">
                <el-option v-for="item in judgementSubList" :value="item.value" :label="item.label" :key="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("uexpressTrace.englishDesc")' prop="englishDesc">
              <el-input type="textarea" rows="3" style="width: 570px;" v-model="modifyForm.englishDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("uexpressTrace.localDesc")' prop="localDesc">
              <el-input type="textarea" rows="3" style="width: 570px;" v-model="modifyForm.localDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("common.remark")' prop="remarks">
              <el-input type="textarea" rows="3" style="width: 570px;" v-model="modifyForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="checkForm">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createStandNodeApi, modifyStandNodeApi } from '@/api/uexpress/traceLine'
export default {
  name: "ModifyTraceDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    trackingNodeSegmentList: {
      type: Array,
      default: () => []
    },
    judgementList: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  data() {
    return {
      title: '',
      modifyForm: {},
      modifyFormRule: {
        trackingNodeSegment: [
          {required: true, message: this.$t('uexpressTrace.invalidNodeSegment'), trigger: 'change'}
        ],
        nodeName: [
          {required: true, message: this.$t('uexpressTrace.invalidNodeName'), trigger: 'blur'}
        ],
        nodeSuffix: [
          {required: true, message: this.$t('uexpressTrace.invalidNodeCode'), trigger: 'blur'}
        ],
        forwardNecessary: [
          {required: true, message: this.$t('uexpressTrace.invalidForwardNecessary'), trigger: 'change'}
        ],
        abnormal: [
          {required: true, message: this.$t('uexpressTrace.invalidAbnormal'), trigger: 'change'}
        ],
        trackingNodeVisible: [
          {required: true, message: this.$t('uexpressTrace.invalidNodeVisible'), trigger: 'change'}
        ]
      },
      isModify: false,
      preffixCode: ''
    }
  },
  created() {},
  computed: {
    nodeSegmentList: function() {
      return this.trackingNodeSegmentList.slice(1)
    },
    judgementSubList: function() {
      return this.judgementList.slice(1)
    }
  },
  watch: {
    'modifyForm.trackingNodeSegment': function(newVal, oldVal) {
      if (newVal) {
        this.preffixCode = this.trackingNodeSegmentList.filter(item => item.value === newVal)[0].preffixCode
        this.modifyForm.customerCode = `${this.preffixCode}_${this.modifyForm.nodeSuffix}`
      } else {
        this.modifyForm.customerCode = ''
      }
    }
  },
  methods: {
    init(formData = null) {
      if (formData) {
        this.modifyForm = {...formData}
        this.isModify = true
        this.title = this.$t('uexpressTrace.modifyStandNode')
        this.setNodeCode()
      } else {
        this.modifyForm = {
          trackingNodeSegment: null,
          nodeName: '',
          nodeSuffix: '',
          forwardNecessary: true,
          abnormal: false,
          trackingNodeVisible: true,
          englishDesc: '',
          localDesc: '',
          remarks: '',
          customerCode: ''
        }
        this.isModify = false
        this.title = this.$t('uexpressTrace.createStandNode')
      }
      this.$nextTick(() => {
        this.$refs.modifyForm.clearValidate()
      })
    },
    // validateNodeCode(rule, value, callback) {
    //   const regx = /^YHT_[0-9A-Z]+_[0-9A-Z]+$/
    //   if (!value) {
    //     callback(new Error(this.$t('uexpressTrace.invalidNodeCode')))
    //   } else if (!regx.test(value)) {
    //     callback(new Error(this.$t('uexpressTrace.invalidNodeCode')))
    //   } else {
    //     callback()
    //   }
    // },
    setNodeCode() {
      this.modifyForm.customerCode = `${this.preffixCode}_${this.modifyForm.nodeSuffix}`
    },
    checkForm() {
      this.$refs.modifyForm.validate(valid => {
        if (valid) {
          this.submitForm()
        }
      })
    },
    async submitForm() {
      this.$emit('update:loading', true)
      let res = null
      if (this.isModify) {
        res = await modifyStandNodeApi(this.modifyForm)
      } else {
        res = await createStandNodeApi(this.modifyForm)
      }

      this.$emit('update:loading', false)

      if (res.ok) {
        this.$message.success(this.$t('uexpressTrace.modifySuccess'))
        this.closeDialog()
        this.$emit('refreshData')
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
      this.$refs.modifyForm.resetFields()
      this.modifyForm.customerCode = ''
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
