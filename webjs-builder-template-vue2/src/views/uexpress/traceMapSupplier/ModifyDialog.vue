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
            <el-form-item :label='$t("uexpressTrace.channelCode")' prop="channelCode">
              <uexpress-type-select type="traceChannel" v-model="modifyForm.channelCode"
              :defaultDisplay="channelDisplay" clearable filterable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.sourceNodeCode")' prop="sourceNodeCode">
              <el-input v-model="modifyForm.sourceNodeCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.standardNodeCodeModify")' prop="standardNodeCode">
              <uexpress-type-select type="nodeDropdown" v-model="modifyForm.standardNodeCode"
              :defaultDisplay="nodeDisplay" clearable filterable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("uexpressTrace.sourceTrackingDesc")' prop="sourceDesc">
              <el-input type="textarea" rows="3" style="width: 570px;" v-model="modifyForm.sourceDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5" v-for="(item, index) in modifyForm.mappingExpressionDtos" :key="`customer-${item.mappingOperator}-${index}`">
          <el-col :span="8" v-if="index === 0">
            <el-form-item :label='$t("uexpressTrace.mappingInfo")' prop="mappingExpressionDtos">
              <el-select v-model="item.mappingOperator" style="width: 100px;">
                <el-option v-for="opt in mapOptList" :key="`opt-${opt.value}`" :value="opt.value" :label="opt.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-else-if="index === 1" style="padding-left: 9.5px;">
            <el-form-item label='' prop="descRelation" label-width="0">
              <el-select v-model="modifyForm.descRelation" style="width: 100px;">
                <el-option v-for="rel in mapRelList" :key="`rel-${rel.value}`" :value="rel.value" :label="rel.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='' prop="mappingExpressionDtos" label-width="0">
              <el-select v-model="item.mappingOperator" style="width: 100px;">
                <el-option v-for="opt in mapOptList" :key="`opt-${opt.value}`" :value="opt.value" :label="opt.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-else style="padding-left: 124.5px;">
            <el-form-item label='' prop="mappingExpressionDtos">
              <el-select v-model="item.mappingOperator" style="width: 100px;">
                <el-option v-for="opt in mapOptList" :key="`opt-${opt.value}`" :value="opt.value" :label="opt.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='' label-width="0" prop="mappingExpressionDtos">
              <el-input v-model="item.mappingValue" style="width: 360px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <i class="iconfont icon-add-circle inline-icon" @click="addMappingRule" v-if="index === modifyForm.mappingExpressionDtos.length - 1"></i>
            <i class="iconfont icon-minus-circle inline-icon" @click="minusMappingRule(index)" v-if="index > 0"></i>
            <!-- <el-button type="text" size="mini">
              <i class="iconfont icon-add-circle" @click="addMappingRule"></i>
            </el-button> -->
            <!-- <el-button type="text" size="mini">
              <i class="iconfont icon-minus-circle" @click="minusMappingRule(index)"></i>
            </el-button> -->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label='$t("uexpressTrace.replaceFlag")' prop="replaceFlag">
              <el-select v-model="modifyForm.replaceFlag" @change="checkReplaceDesc">
                <el-option v-for="item in replaceFlagFormList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="modifyForm.replaceFlag">
          <el-col :span="24">
            <el-form-item :label='$t("uexpressTrace.replaceDesc")' prop="targetDesc">
              <el-input type="textarea" rows="3" style="width: 570px;" v-model="modifyForm.targetDesc"></el-input>
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
import { createTraceMapApi, updateTraceMapApi } from '@/api/uexpress/traceLine'
import { getDictListApi } from '@/api/uexpress/base'
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
    replaceFlagList: {
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
        channelCode: [
          {required: true, message: this.$t('uexpressTrace.invalidChannelCode'), trigger: 'change'}
        ],
        standardNodeCode: [
          {required: true, message: this.$t('uexpressTrace.invalidStandardNodeCode'), trigger: 'blur'}
        ],
        targetDesc: [
          {required: true, message: this.$t('uexpressTrace.invalidReplaceDesc'), trigger: 'change'}
        ]
      },
      isModify: false,
      channelDisplay: [],
      nodeDisplay: [],
      mapRelList: [],
      mapOptList: []
    }
  },
  computed: {
    replaceFlagFormList: function() {
      return this.replaceFlagList.slice(1)
    }
  },
  methods: {
    init(formData = null) {
      if (formData) {
        this.modifyForm = {...formData}
        this.isModify = true
        this.title = this.$t('uexpressTrace.modifyMap')
        this.$set(this.modifyForm, 'mappingExpressionDtos', [])
        this.$set(this.modifyForm, 'descRelation', null)

        this.channelDisplay = [
          {
            channelCode: this.modifyForm.channelCode,
            channelName: this.modifyForm.channelName
          }
        ]

        this.nodeDisplay = [
          {
            nodeCode: this.modifyForm.standardNodeCode,
            nodeName: this.modifyForm.standardNodeName
          }
        ]

        this.modifyForm.descRelation = formData.descMappingRelation

        if (formData.descRuleDtos && formData.descRuleDtos.length > 0) {
          formData.descRuleDtos.map(item => {
            this.modifyForm.mappingExpressionDtos.push({
              mappingOperator: item.trackingMappingOperator,
              mappingValue: item.mappingValue
            })
          })
        } else {
          this.modifyForm.mappingExpressionDtos.push({
            mappingOperator: 1,
            mappingValue: ''
          })
        }
      } else {
        this.modifyForm = {
          channelCode: '',
          sourceNodeCode: '',
          standardNodeCode: null,
          sourceDesc: '',
          descRelation: null,
          mappingExpressionDtos: [],
          replaceFlag: false,
          targetDesc: '',
          remarks: ''
        }

        this.modifyForm.mappingExpressionDtos.push({
          mappingOperator: 1,
          mappingValue: ''
        })

        this.isModify = false
        this.title = this.$t('uexpressTrace.createMap')
      }

      this.$nextTick(() => {
        this.$refs.modifyForm.clearValidate()
      })

      this.getMapRef()
      this.getMapOpt()
    },
    async getMapRef() {
      const res = await getDictListApi(36)
      if (res.ok) {
        this.mapRelList = []
        res.content.map(item => {
          this.mapRelList.push({
            value: item.code,
            label: item.name
          })
        })
      }
    },
    async getMapOpt() {
      const res = await getDictListApi(37)
      if (res.ok) {
        this.mapOptList = []
        res.content.map(item => {
          this.mapOptList.push({
            value: item.code,
            label: item.name
          })
        })
      }
    },
    addMappingRule() {
      this.modifyForm.mappingExpressionDtos.push({
        mappingOperator: 1,
        mappingValue: ''
      })
    },
    minusMappingRule(id) {
      this.$confirm(this.$t('common.deleteWarnningTips'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.deleteBtn'),
        cancelButtonText: this.$t('packageWarehouse.cancelDrop'),
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      })
      .then(async() => {
        this.modifyForm.mappingExpressionDtos.splice(id, 1)
      }).catch(err => {console.error(err)})
    },
    checkReplaceDesc() {
      this.modifyFormRule.targetDesc[0].required = this.modifyForm.replaceFlag
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
        res = await updateTraceMapApi(this.modifyForm)
      } else {
        res = await createTraceMapApi(this.modifyForm)
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .plus-trigger {
    margin: 0;
    border: 1px solid #ccc;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
  .inline-icon {
    display: inline-block;
    vertical-align: middle;
    font-size: 20px;
    cursor: pointer;
  }
  .icon-minus-circle {
    color: red;
  }
</style>
