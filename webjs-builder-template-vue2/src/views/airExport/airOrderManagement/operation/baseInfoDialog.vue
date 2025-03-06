<template>
  <!-- 订单调整 -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.orderModify')" :visible.sync="visible" @close="closeFn"
    width="900px" v-loading="loading">
    <el-form ref="basicInfoFormRef" :model="basicInfoModel" :rules="basicInfoRules" label-width="90px"
      label-position="left" class="basicInfoForm">
      <!-- 委托单位 -->
      <el-form-item :label="$t('air.requester')" prop="customerId" size="mini">
        <type-select v-model="basicInfoModel.customerName" type="customer" @selected="setCustomerInfo"
          :disabled="businessLockState" />
      </el-form-item>
      <!-- 操作模式 -->
      <el-form-item :label="$t('air.blModeDesc')" prop="blMode" size="mini">
        <el-select v-model="basicInfoModel.blMode" :placeholder="$t('air.placeholder')" style="width:100%"
          :disabled="businessLockState">
          <el-option :label="$t('air.straightSingle')" :value="1"></el-option>
          <el-option :label="$t('air.noStraightSingle')" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <!-- 联系人 -->
      <el-form-item :label="$t('air.contacts')" prop="contactCnName" size="mini">
        <el-select filterable allow-create clearable v-model="basicInfoModel.contactCnName"
          :placeholder="$t('air.placeholder')" @change="contactChange" style="width:100%" :disabled="businessLockState">
          <el-option v-for="(item, index) in contactList" :label="item.contact" :value="item.id" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 联系电话 -->
      <el-form-item :label="$t('air.phone')" prop="contactMobile" size="mini">
        <el-input v-model="basicInfoModel.contactMobile" :placeholder="$t('air.pleaseEnterArrivalContactTel')"
          :disabled="businessLockState" size="mini"></el-input>
      </el-form-item>
      <!-- 联系邮箱 -->
      <el-form-item :label="$t('air.email')" prop="contactEmail" size="mini">
        <el-input v-model="basicInfoModel.contactEmail" :placeholder="$t('air.contactEmailPlaceholder')" maxlength="500"
          :disabled="businessLockState" show-word-limit>
        </el-input>
      </el-form-item>
      <!-- 托书价格 -->
      <!-- <el-form-item :label="$t('air.joeBookPrices')" prop="airOrderExport" size="mini">
        <el-input v-model="basicInfoModel.bookingReceivable" class="job-no-input" size="mini" maxlength="100"
          show-word-limit>
        </el-input>
      </el-form-item> -->
      <!-- 运营人员 -->
      <el-form-item :label="$t('air.operationalStaff')" prop="airOrderExport" size="mini">
        <cargo-limited-select :placeholder="$t('air.placeholder')" :select-label="basicInfoModel.operationName"
          :select-value="basicInfoModel.operationName" type="user" :methodParams="{ range: ['OPERATOR'] }"
          style="width: 100%" @set="setOperationalByInfo" clearable :disabled="businessLockState" />
      </el-form-item>
      <!-- <el-form-item label="分单运费条款" prop="hblFreightTerm" v-if="basicInfoModel.blMode != 1">
        <el-select v-model="basicInfoModel.hblFreightTerm" placeholder="请选择" size="mini">
          <el-option v-for="item in freightTermList" :key="item.code" :label="item.englishName"
            :value="item.englishName">
          </el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div v-if="showAirCustomerTitle" style="margin-top: 0px;height: 10px;color:coral;text-align: center;"> {{
      $t('air.voidContractWarning3')
    }} </div>
    <div v-if="businessLockState" style="margin-top: 0px;height: 10px;color:coral;text-align: center;"> {{
      $t('air.businessLocktWarning')
    }} </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini">{{ $t('air.determine') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateAirExportOrderBaseInfoApi, crmCustomerLinkman, airCustomerTitleList } from '@/api/airExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { getTerminologyListByTypeApi } from '@/api/common'
import { validEmail } from "@/utils/validate"
import { logServiceName, airLogBusinessType, logOrigin } from '@/utils/constant'
import orderMixin from '../orderMixin'

export default {
  name: 'BaseInfoDialog',
  mixins: [orderMixin],
  components: {
    cargoLimitedSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    visible (val) {
      console.log("this.order.baseDTO", this.order.baseDTO)
      if (this.order.baseDTO.businessLockState === true) {
        this.businessLockState = true
      } else {
        this.businessLockState = false
      }
      this.basicInfoModel = {
        signDesc: this.order.baseDTO.signDesc,
        customerLevel: this.order.baseDTO.customerLevel,
        settlementMode: this.order.baseDTO.settlementMode,
        settlementModeDesc: this.order.baseDTO.settlementModeDesc,
        customerName: this.order.baseDTO.customerName,
        customerId: this.order.baseDTO.customerId,
        sellerId: this.order.baseDTO.sellerId,
        sellerName: this.order.baseDTO.sellerName,
        blMode: this.order.spaceDTO.blMode,
        contactCnName: this.order.baseDTO.contactCnName,
        contactMobile: this.order.baseDTO.contactMobile,
        contactEmail: this.order.baseDTO.contactEmail,
        // bookingReceivable: this.order.baseDTO.bookingReceivable,
        operationId: this.order.baseDTO.operationId,
        operationName: this.order.baseDTO.operationName
        // hblFreightTerm: this.order.baseDTO.hblFreightTerm
      }
      this.initBasicData()
    }
  },
  data () {
    return {
      businessLockState: false,
      showAirCustomerTitle: false,
      loading: false,
      contactList: [],
      basicInfoModel: {
        signDesc: "",
        customerLevel: "",
        settlementMode: "",
        settlementModeDesc: "",
        customerName: '',
        customerId: '',
        sellerId: '',
        sellerName: '',
        // hblFreightTerm: '',
        blMode: '',
        contactCnName: '',
        contactMobile: '',
        contactEmail: '',
        // bookingReceivable: '',
        operationId: "",
        operationName: ""
      },
      basicInfoRules: {
        "customerId": [{ required: true, message: this.$t('air.requesterHold'), trigger: 'change' }],
        "blMode": [{ required: true, message: this.$t('air.requiredBlMode'), trigger: 'change' }],
        "contactEmail": [{ message: this.$t('air.contactEmailPlaceholder'), trigger: 'change' }, { validator: this.validateEmail, trigger: 'blur' }]

      },
      freightTermList: []
    }
  },

  // mounted () {
  //   console.log("order", this.order)
  //   this.basicInfoModel = {
  //     customerName: this.order.baseDTO.customerName,
  //     customerId: this.order.baseDTO.customerId,
  //     sellerId: this.order.baseDTO.sellerId,
  //     sellerName: this.order.baseDTO.sellerName,
  //     blMode: this.order.spaceDTO.blMode,
  //     tradeTerm: this.order.spaceDTO.tradeTerm,
  //     contactCnName: this.order.baseDTO.contactCnName,
  //     contactMobile: this.order.baseDTO.contactMobile,
  //     contactEmail: this.order.baseDTO.contactEmail,
  //     bookingReceivable: this.order.baseDTO.bookingReceivable
  //     // hblFreightTerm: this.order.baseDTO.hblFreightTerm
  //   }
  //   this.initBasicData()
  // },
  methods: {
    validateEmail (rule, value, callback) {
      if (value) {
        let emailArr = value.split(';')
        let isSome = emailArr.some(item => {
          if (!validEmail(item)) {
            callback(new Error(item + this.$t('blInfo.emailError')))
            return true
          }
        })
        if (!isSome) {
          callback()
        }
      } else {
        callback()
      }
    },
    // 运营人员
    setOperationalByInfo (createBy) {
      this.basicInfoModel.operationId = createBy.id;
      this.basicInfoModel.operationName = createBy.chineseName;
    },

    contactChange (id) {
      let index = this.contactList.findIndex(item => item.id === id)
      this.basicInfoModel.contactCnName = this.contactList[index].contact
      this.basicInfoModel.contactMobile = this.contactList[index].tel
      this.basicInfoModel.contactEmail = this.contactList[index].email
    },
    initBasicData () {
      getTerminologyListByTypeApi('FREIGHTTERM').then(res => {
        if (res && res.ok) {
          this.freightTermList = res.content
        }
      })
    },
    setCustomerInfo (customer) {
      this.basicInfoModel.customerId = customer.id
      this.basicInfoModel.customerName = customer.chineseName

      if (customer.id) {
        crmCustomerLinkman(customer.id).then(res => {
          console.log("res", res)
          this.basicInfoModel.signDesc = res.content.directCustomerTypeDesc
          this.basicInfoModel.customerLevel = res.content.directCustomerType
          this.basicInfoModel.settlementMode = res.content.rechargeMode
          this.basicInfoModel.settlementModeDesc = res.content.rechargeModeName
          if (res.content && res.content.customerLinkManDTOList.length) {
            this.contactList = res.content.customerLinkManDTOList
            this.basicInfoModel.contactCnName = res.content.customerLinkManDTOList[0].contact
            this.basicInfoModel.contactMobile = res.content.customerLinkManDTOList[0].tel
            this.basicInfoModel.contactEmail = res.content.customerLinkManDTOList[0].email
          }

        })
        // let businessTime = ""
        // if (this.order.spaceDTO.atd) {
        //   businessTime = this.order.spaceDTO.atd
        // } else {
        //   businessTime = this.order.spaceDTO.etd
        // }
        airCustomerTitleList({
          businessTime: this.order.spaceDTO.etd,
          businessType: 'AIR_EXPORT',
          memberId: customer.id
        }).then(res => {
          if (res && res.ok) {
            if (res.content.length > 0) {
              this.showAirCustomerTitle = false
            } else {
              this.showAirCustomerTitle = true
            }
          }
        })
      } else {
        this.contactList = []
        this.basicInfoModel.contactCnName = ''
        this.basicInfoModel.contactMobile = ''
        this.basicInfoModel.contactEmail = ''
      }
    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      let data = this.basicInfoModel
      data.orderId = this.order.id
      this.$refs.basicInfoFormRef.validate(valid => {
        if (valid) {
          this.loading = true

          // let businessTime = ""
          // if (this.order.spaceDTO.atd) {
          //   businessTime = this.order.spaceDTO.atd
          // } else {
          //   businessTime = this.order.spaceDTO.etd
          // }
          airCustomerTitleList({
            businessTime: this.order.spaceDTO.etd,
            businessType: 'AIR_EXPORT',
            memberId: this.basicInfoModel.customerId
          }).then(res => {
            if (res && res.ok) {
              if (res.content.length > 0) {
                // 添加日志 记录数据
                this.logBtnSend({
                  origin: logOrigin.SYSTEM_OPERATION,
                  logCode: airLogBusinessType.ORDER_MODIFY,
                  serviceName: logServiceName.AIR_SERVICE,
                  businessType: airLogBusinessType.ORDER_MODIFY,
                  content: {
                    ...data
                  }
                })
                updateAirExportOrderBaseInfoApi(data).then(res => {
                  if (res && res.ok) {
                    this.$message.success(this.$t('air.updateSuccessfully'))
                    this.closeFn()
                    this.adjustConfirmFn(this.order)
                  }
                  this.loading = false
                })

              } else {
                this.$message.warning(this.$t('air.voidContractWarning3'))
              }
              this.loading = false
            }
          })


        }
      })

    }
  }
}
</script>

<style scoped lang="less">
.dialog-footer {
  text-align: center;
}

.basicInfoForm {
  overflow: hidden;

  ::v-deep .el-form-item {
    width: 33%;
    float: left;
  }

  ::v-deep .el-col {
    margin-top: 0px;
  }

  ::v-deep .el-form-item__label {
    text-align: right;
  }
}
</style>
