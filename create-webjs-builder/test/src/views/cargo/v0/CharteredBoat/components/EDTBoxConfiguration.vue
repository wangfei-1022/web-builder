<template>
  <div v-loading="loading">
    <el-form ref="boxConForm" label-position="top" :model="formDate" :rules="rules">
      <div style="display: flex; justify-content: space-between; width: 400px;">
        <el-form-item :label="$t('boatEtdList.selectSailing')" prop="sailingId">
          <el-select v-model="formDate.sailingId" :placeholder="$t('boatEtdList.selectSchedule')" @change="sailingIdChange">
            <el-option :label="$t('common.all')" value="all" />
            <el-option v-for="(val,key) in portList" :key="key" :label="val.label" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formDate.sailingId === 'all'" :label="$t('boatEtdList.releasedTrigger')" prop="releaseFlag">
          <el-radio-group v-model="formDate.releaseFlag">
            <el-radio :label="false">{{$t('common.closed')}}</el-radio>
            <el-radio :label="true">{{$t('common.opened')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item v-if="formDate.sailingId !== 'all' && formDate.sailingId" :label="$t('boatEtdList.releasedSetting')">
        <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="defaultKeys"
          :default-expand-all="true"
          show-checkbox
          @check-change="handleCheckChange"
        />
      </el-form-item>
      <el-form-item :label="$t('boatEtdList.releaseNotice')" prop="releaseNotice">
        <el-input v-model="formDate.releaseNotice" type="textarea" rows="4" style="width: 500px;" />
      </el-form-item>
    </el-form>
    <p style="color: red; font-size: 12px; line-height: 1.5em;">
      {{$t('boatEtdList.closedNotice')}}
    </p>
    <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
      <el-button type="primary" size="mini" @click="confirm">{{$t('common.confirmBtn')}}</el-button>
      <el-button type="" size="mini" @click="cancel">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </div>
</template>

<script>
import { releaseListApi, releaseSettingApi } from '@/api/schedule'
export default {
  name: 'EDTBoxConfiguration',
  components: {
  },
  data() {
    const validatePass = (rule, value, callback) => {
      const arr = this.$refs.tree.getCheckedKeys()
      if (arr.length === 0 || !arr) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      loading: false,
      formDate: {
        sailingId: '', // 船期
        switch: '', // 放箱开关
        setUp: ''
      },
      rules: {
        sailingId: [{ required: true, message: this.$t('boatEtdList.selectSchedule'), trigger: 'blur' }],
        releaseFlag: [{ required: true, message: this.$t('boatEtdList.triggerEmptyInvalid'), trigger: 'blur' }],
        releaseNotice: [{ required: true, message: this.$t('boatEtdList.releasedNoticeEmptyInvalid'), trigger: 'blur' }],
        setUp: [{ required: true, message: this.$t('boatEtdList.releasedSettingEmptyInvalid'), validator: validatePass, trigger: 'change' }]

      },
      portList: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultKeys: []
    }
  },
  async created() {
    const res = await releaseListApi()
    if (res.ok) {
      let id = 0
      res.content.children.map(item => {
        id++
        item.id = id
        this.$set(this.portList, item.sailingId, item)
        item.children.map(item2 => {
          id++
          item2.id = id
          item2.children.map(item3 => {
            id++
            item3.id = id
            item3.children.map(item4 => {
              id++
              item4.id = id
              if (item4.releaseFlag) {
                this.defaultKeys.push(item4.id)
              }
            })
          })
        })
      })
    }
  },
  methods: {
    sailingIdChange(val) {
      this.treeData = [this.portList[val]]
      if (val === 'all') {
        this.$set(this.formDate, 'releaseNotice', '')
      } else {
        this.$set(this.formDate, 'releaseNotice', this.portList[val].releaseNotice)
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      if (data.supportId) {
        data.releaseFlag = checked
      }
    },
    async confirm() {
      this.$refs.boxConForm.validate(async(valid, failFields) => {
        if (valid) {
          this.loading = true
          let children = []
          if (this.formDate.sailingId === 'all') {
            Object.keys(this.portList).map(item => {
              children.push(this.portList[item])
            })
          } else {
            children = [this.portList[this.formDate.sailingId]]
          }

          const data = {
            children: children,
            selectedAll: this.formDate.sailingId === 'all',
            releaseNotice: this.formDate.releaseNotice
          }
          if (this.formDate.sailingId === 'all') {
            data.releaseFlag = this.formDate.releaseFlag
          }
          const res = await releaseSettingApi(data)
          if (res.ok) {
            this.loading = false
            this.$message.success(this.$t('charteredBoat.submitSuccess'))
            this.$emit('update:visible', false)
            this.$refs.boxConForm.resetFields()
          }
        }
      })
    },
    cancel() {
      this.$refs.boxConForm.resetFields()
      this.$emit('update:visible', false)
    }
  }

}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__error {
  padding-top: 4px;
}
::v-deep .el-form-item--medium .el-form-item__label {
  line-height: 14px;
}
</style>
