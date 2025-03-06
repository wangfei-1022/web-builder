<template>
  <el-dialog
    :visible.sync="showDialog"
    width="600px"
    :title="$t('containerManager.modifyDynamic')"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
    <el-form ref="editForm" :model="editForm" size="mini" label-width="90px" label-position="right" style="width: 90%;">
      <el-row>
        <el-col :span="16">
          <el-form-item :label="`${$t('containerManager.opreatorTime')}: `" required :error="checkTimeErr">
            <CommonPicker
              v-model="editForm.operationTime"
              pickerFormat="yyyy-MM-dd HH:mm"
              :startDependence="startDate"
              :endDependence="endDate"
              :parentOption="'betweenDependence'"
              pikcerType="datetime"
              @change="checkTimeRange">
            </CommonPicker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="4">
        <el-col :span="12">
          <el-form-item :label="`${$t('containerManager.vesselName')}: `" prop="vesselName">
            <el-input v-model="editForm.vesselName" type="text" :placeholder="$t('common.placeholder')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('containerManager.voyageNo')}: `" prop="voyageNo">
            <el-input v-model="editForm.voyageNo" type="text" :placeholder="$t('common.placeholder')" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="4">
        <el-col :span="12">
          <el-form-item :label="`${$t('containerManager.dynamicList.soNo')}: `" prop="soNo">
            <el-input v-model="editForm.soNo" type="text" :placeholder="$t('common.placeholder')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('containerManager.dynamicList.blNo')}: `" prop="blNo">
            <el-input v-model="editForm.blNo" type="text" :placeholder="$t('common.placeholder')" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" size="mini" :disabled="!editForm.operationTime" @click="saveForm">{{$t('containerManager.confirmBtn')}}</el-button>
      <el-button size="mini" :loading="loading" @click="$emit('closeDialog')">{{$t('common.cancelBtn')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveDynamicModifyApi } from '@/api/containerDynamic'
export default {
  name: 'DynamicModifyDialog',
  data() {
    return {
      loading: false,
      editForm: {
        operationTime: null,
        vesselName: '',
        voyageNo: '',
        soNo: '',
        blNo: ''
      },
      editFormRules: {
        operationTime: [
          {required: true, message: this.$t('containerManager.opreatorTimeEmptyInvalid'), trigger: 'change'}
        ]
      },
      checkTimeErr: ''
    }
  },
  computed: {
    showDialog: function() {
      return this.$attrs.showEditDialog
    },
    currObj: function() {
      return this.$attrs.data ? this.$attrs.data : {}
    },
    startDate: function() {
      return this.currObj.previousDate ? this.$moment(Number(this.currObj.previousDate)).set({'hour': 0, 'minute': 0, 'second': 0}).valueOf() : this.$moment('1970-01-01 00:00:00').valueOf()
    },
    endDate: function() {
      return this.currObj.nextDate ? this.$moment(Number(this.currObj.nextDate)).set({'hour': 23, 'minute': 59, 'second': 59}).valueOf() : this.$moment().set({'hour': 23, 'minute': 59, 'second': 59}).valueOf()
    },
    dateMode: function() {
      // 新增第一项
      if (!this.currObj.previousDate && !this.currObj.nextDate) {
        return 'default'
      }
      // 修改中间项
      if (this.currObj.previousDate && this.currObj.nextDate) {
        return 'betweenDependence'
      }
      // 修改第一项
      if (!this.currObj.previousDate && this.currObj.nextDate) {
        return 'previousDependence'
      }
      // 修改最后一项
      if (!this.currObj.nextDate && this.currObj.previousDate) {
        return 'followingDependence'
      }

      return 'default'
    }
  },
  watch: {
    showDialog: function(val) {
      if (!val) {
        this.$refs.editForm.resetFields()
      } else {
        this.editForm.operationTime = this.$attrs.data.operationTime
        this.editForm.vesselName = this.$attrs.data.vesselName
        this.editForm.voyageNo = this.$attrs.data.voyageNo
        this.editForm.soNo = this.$attrs.data.soNo
        this.editForm.blNo = this.$attrs.data.blNo
      }
    }
  },
  methods: {
    checkTimeRange(val) {
      if (!val) {
        this.checkTimeErr = this.$t('containerManager.opreatorTimeEmptyInvalid')
        return false
      } else {
        if (this.currObj.previousDate && this.editForm.operationTime <= Number(this.currObj.previousDate)) {
          this.checkTimeErr = this.$t('containerManager.opreatorTimeErrorInvalid')
          return false
        } else if (this.currObj.nextDate && this.editForm.operationTime >= Number(this.currObj.nextDate)) {
          this.checkTimeErr = this.$t('containerManager.opreatorTimeErrorInvalid')
          return false
        } else {
          this.checkTimeErr = ''
          return true
        }
      }
    },
    async saveForm() {
      if (this.checkTimeRange(this.editForm.operationTime)) {
        this.loading = true
        const _submitData = {...this.$attrs.data, ...this.editForm}
        const res = await saveDynamicModifyApi(_submitData.id, _submitData)
        if (res.ok) {
          this.$message({
            type: 'success',
            message: this.$t('containerManager.modifyDynamicSuccess')
          })
        }
        this.loading = false
        this.$emit('closeDialog')
      }
    }
  },
  created() {}
}
</script>
<style>
</style>
