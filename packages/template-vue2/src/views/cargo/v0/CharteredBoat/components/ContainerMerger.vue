<template>
  <div class="merge-wrap">
    <h4><span>*</span>{{$t('boatContainerList.selectedNo')}}:</h4>
    <div class="tag-list-wrap">
      <el-tag
        v-for="item in containersList"
        :key="item.id"
        size="medium"
        closable
        effect="dark"
        @close="removeItem(item)"
      >
        {{ item.containerNo }}
      </el-tag>
    </div>
    <el-form
      ref="mergeForm"
      :inline="true"
      :model="mergeForm"
      style="margin-top: 30px;"
      :rules="mergeFormRule"
    >
      <el-form-item :label="$t('boatContainerList.mergeToBl')" prop="billNo">
        <el-input v-model="mergeForm.billNo" size="mini" :disabled="mergeForm.useNewBill" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="mergeForm.useNewBill" style="margin: 0 10px 0 20px;" @change="handleCheckboxChange">{{$t('boatContainerList.createBl')}}</el-checkbox>
      </el-form-item>
      <el-form-item v-show="mergeForm.useNewBill" prop="newBillNo">
        <el-input v-model="mergeForm.newBillNo" size="mini" />
      </el-form-item>
    </el-form>
    <div class="button-wrap">
      <el-button v-loading.fullscreen.lock="loading" type="primary" :loading="loading" :disabled="containersList.length === 0 || loading" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
      <el-button @click="closeDialog(false)">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </div>
</template>
<script>
import { getBLInfoApi, checkExistsApi } from '@/api/containerList'
export default {
  name: 'ContainerMerger',
  props: {
    containers: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    const checkBillNo = async(rule, value, callback) => {
      if (value) {
        // 请求接口验证是否存在
        if (this.isSubmit) {
          this.loading = true
          this.otherBlStatus = null
          const _res = await getBLInfoApi(this.mergeForm.billNo)

          // 如果不存在
          if (!_res.ok || !_res.content) {
            this.loading = false
            return callback(new Error(this.$t('boatContainerList.unexsitBLNo')))
          } else {
            this.otherBlStatus = _res.content.status
            // 提单状态不是已审核或者已签发
            if (_res.content.status === 3 || _res.content.status === 5 || _res.content.status === 7) {
              // 如果不同源
              const { memberId, vessel, voyage, polCode, podCode } = _res.content
              const sameOrigin = this.containersList.every(item => item.memberId === memberId && item.vessel === vessel && item.voyage === voyage && item.polCode === polCode && item.podCode === podCode)

              if (!sameOrigin) {
                this.loading = false
                return callback(new Error(this.$t('boatContainerList.sameOriginError')))
              }

              const checkStatus = this.containersList.every(item => item.blStatus === 3 || item.blStatus === 5 || item.blStatus === 7)
              if (!checkStatus) {
                this.loading = false
                return callback(new Error(this.$t('boatContainerList.checkStatusError')))
              }
            } else {
              this.loading = false
              if (_res.content.status === 6) {
                this.$set(this.mergeForm, 'billNo', '')
                return callback(new Error(this.$t('boatContainerList.mergeNotAllow')))
              } else {
                return callback(new Error(this.$t('boatContainerList.splitNotAllow')))
              }
            }
          }

          // 满足验证条件
          this.mergeForm.blId = _res.content.blId
          this.loading = false
        }

        callback()
      } else {
        return callback(new Error(this.$t('boatContainerList.blNoRequired')))
      }
    }
    const checkNewBillNo = async(rule, value, callback) => {
      if (value) {
        if (this.isSubmit) {
          // 请求接口验证是否存在
          this.loading = true
          const _res = await checkExistsApi(this.mergeForm.newBillNo)
          // 如果已存在
          this.loading = false
          if (!_res.ok) {
            return callback(new Error(this.$t('boatContainerList.blNoExsit')))
          }
        }

        callback()
      } else {
        return callback(new Error(this.$t('boatContainerList.blNoRequired')))
      }
    }
    return {
      loading: false,
      isSubmit: false,
      mergeForm: {
        blId: '',
        billNo: '',
        newBillNo: '',
        useNewBill: false
      },
      mergeFormRule: {
        billNo: {
          validator: checkBillNo,
          trigger: 'blur'
        },
        newBillNo: {
          validator: checkNewBillNo,
          trigger: 'blur'
        }
      },
      otherBlStatus: null
    }
  },
  computed: {
    containersList() {
      return this.containers
    }
  },
  watch: {
    'mergeForm.billNo'(val) {
      if (/^[a-zA-Z0-9]{1,}$/.test(val)) {
        this.mergeForm.billNo = val.toUpperCase()
      } else {
        this.mergeForm.billNo = val.substring(0, val.length - 1).toUpperCase()
      }
    },
    'mergeForm.newBillNo'(val) {
      if (/^[a-zA-Z0-9]{1,}$/.test(val)) {
        this.mergeForm.newBillNo = val.toUpperCase()
      } else {
        this.mergeForm.newBillNo = val.substring(0, val.length - 1).toUpperCase()
      }
    }
  },
  created() {},
  mounted() {
    // setTimeout(() => {
    //   this.setTimeoutClear()
    // }, 10*60*1000)
  },
  methods: {
    removeItem(_obj) {
      // const _id = this.containers.findIndex(item => item.id === _obj.id)
      // this.containersList.splice(_id, 1)
      this.$emit('deleteNo', _obj)
    },
    handleCheckboxChange(val) {
      this.clearForm()
    },
    clearForm() {
      this.$refs.mergeForm.resetFields()
      this.$nextTick(() => {
        this.$refs.mergeForm.clearValidate()
      })
    },
    async validateForm() {
      // 验证表单并跳转
      this.isSubmit = true
      const fieldsToValidate = this.mergeForm.useNewBill ? ['newBillNo'] : ['billNo']
      const valid = await this.checkFormValid(fieldsToValidate)
      this.isSubmit = false

      if (valid.indexOf(false) === -1) { // 验证通过
        const blStatus = this.containersList[0].blStatus
        if (this.mergeForm.useNewBill && blStatus !== 5) {
          this.goBLInfo()
          return
        }
        if (blStatus === 3) { // 已审核
          if (this.otherBlStatus === 3) { // 其他提单”已审核“，无需提示，直接并入
            this.goBLInfo()
          } else if (this.otherBlStatus === 5 || this.otherBlStatus === 7) { // 其他提单”确认放单“/“已签发”
            this.$confirm(this.$t('boatContainerList.payToUnpay'), this.$t('common.tips'), {
              confirmButtonText: this.$t('common.confirmBtn'),
              cancelButtonText: this.$t('common.cancelBtn'),
              type: 'warning'
            }).then(() => {
              this.goBLInfo()
            })
          }
        } else if (blStatus === 7 || blStatus === 5) { // 确认放单 已签发
          if ((this.mergeForm.useNewBill || this.otherBlStatus === 3 || this.otherBlStatus === 7) && blStatus === 5) {
            this.$confirm(this.$t('boatContainerList.amountChanged'), this.$t('common.tips'), {
              confirmButtonText: this.$t('common.confirmBtn'),
              cancelButtonText: this.$t('common.cancelBtn'),
              type: 'warning'
            }).then(() => {
              this.goBLInfo()
            })
            return
          }
          if (this.otherBlStatus === 3 || this.otherBlStatus === 7) { // 其他提单”已审核“/“确认放单”，无需提示，直接并入
            this.goBLInfo()
          } else if (this.otherBlStatus === 5) { // 其他提单“已签发
            this.$confirm(this.$t('boatContainerList.newAmountChanged'), this.$t('common.tips'), {
              confirmButtonText: this.$t('common.confirmBtn'),
              cancelButtonText: this.$t('common.cancelBtn'),
              type: 'warning'
            }).then(() => {
              this.goBLInfo()
            })
          } else if (this.otherBlStatus === 6) { // 其他提单“申请放单”从提单号输入框中过滤掉，不允许并入申请放单的提单
            this.$set(this.mergeForm, 'billNo', '')
            this.$message.warning(this.$t('boatContainerList.mergeNotAllow'))
          }
        }

      }
    },
    goBLInfo() {
      let _query = {}
      if (this.mergeForm.useNewBill) {
        _query = {
          blNo: this.mergeForm.newBillNo,
          blid: false,
          containersIds: this.containersList.map(item => item.id).join(','),
          type: 'mergeFlag'
        }
      } else {
        _query = {
          blNo: this.mergeForm.billNo,
          blid: this.mergeForm.blId,
          containersIds: this.containersList.map(item => item.id).join(','),
          type: 'mergeFlag'
        }
      }
      this.closeDialog(true)
      this.$router.push({ name: 'BLInfo', query: _query })
    },
    checkFormValid(validItems) {
      const promiseList = []
      validItems.forEach(item => {
        const promiseItem = new Promise(resolve => {
          this.$refs.mergeForm.validateField(item, error => {
            if (!error) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        promiseList.push(promiseItem)
      })
      return Promise.all(promiseList)
    },
    closeDialog(clear) {
      this.$refs.mergeForm.resetFields()
      this.otherBlStatus = null
      this.$emit('closeDialog', clear)
    },
    setTimeoutClear() {
      this.$alert(this.$t('boatContainerList.expiredOperation'), this.$t('boatContainerList.overTime'), {
        confirmButtonText: this.$t('common.refreshBtn'),
        callback: action => {
          this.closeDialog(true)
          this.$router.replace({ path: '/refresh' })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .merge-wrap{
    width: 100%;
  }
  h4{
    span{
      color: red;
    }
  }
  .tag-list-wrap{
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
    width: 100%;
    height: 100px;
    overflow: hidden;
    overflow-y: auto;
    ::v-deep .el-tag{
      margin: 5px;
    }
  }
  .button-wrap{
    margin-top: 30px;
    text-align: right;
    padding-right: 20px;
  }
</style>
