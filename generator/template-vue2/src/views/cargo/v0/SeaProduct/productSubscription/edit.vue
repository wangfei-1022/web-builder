<template>
  <div class="app" v-loading="loading">
    <div style="margin-top: 14px;">

      <!-- 基本信息 -->
      <div class="form-module-title">{{ $t('seaProduct.basicInformation') }}</div>
      <div class="form-module-item">
        <el-form ref="subscriptionMode" :model="subscriptionMode" :rules="subscriptionRules" label-width="95px"
          label-position="left" class="subscriptionForm">
          <!-- 订阅任务名称 -->
          <el-form-item :label="$t('seaProduct.subscriptionName')" prop="subscriptionName" size="mini">
            <el-input v-model.trim="subscriptionMode.subscriptionName" class="job-no-input" size="mini" />
          </el-form-item>

          <!-- 轮训周期 -->
          <el-form-item :label="$t('seaProduct.cycleWeek')" prop="cycleWeekList" size="mini">
            <el-select v-model="subscriptionMode.cycleWeekList" multiple :placeholder="$t('seaProduct.placeholder')">
              <el-option :label="$t('seaProduct.MON')" value="Mon"></el-option>
              <el-option :label="$t('seaProduct.TUE')" value="Tues"></el-option>
              <el-option :label="$t('seaProduct.WED')" value="Wed"></el-option>
              <el-option :label="$t('seaProduct.THUR')" value="Thur"></el-option>
              <el-option :label="$t('seaProduct.FRI')" value="Fri"></el-option>
              <el-option :label="$t('seaProduct.SAT')" value="Sat"></el-option>
              <el-option :label="$t('seaProduct.SUN')" value="Sun"></el-option>
            </el-select>
          </el-form-item>

          <!-- 轮询间隔 -->
          <el-form-item :label="$t('seaProduct.cycleTime')" prop="cycleTime" size="mini">
            <el-select v-model="subscriptionMode.cycleTime" :placeholder="$t('seaProduct.placeholder')">
              <el-option :label="$t('seaProduct.twoHour')" value=1></el-option>
              <el-option :label="$t('seaProduct.fourHour')" value=2></el-option>
              <el-option :label="$t('seaProduct.eightHour')" value=3></el-option>
              <el-option :label="$t('seaProduct.twelveHour')" value=4></el-option>
            </el-select>
          </el-form-item>

          <!-- 生效日期 -->
          <el-form-item :label="$t('seaProduct.effectiveDate')" prop="validTimeRange">
            <el-date-picker v-model="subscriptionMode.validTimeRange" value-format="timestamp" type="daterange"
              range-separator="-" start-placeholder="" end-placeholder="" style="width: 100%" size="mini">
            </el-date-picker>
          </el-form-item>

          <!-- 失效日期 -->
          <!-- <el-form-item :label="$t('seaProduct.expiryDate')" prop="expiryDateEnd">
            <CommonPicker v-model="subscriptionMode.expiryDateEnd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
              size="mini" />
          </el-form-item> -->
        </el-form>
      </div>
      <!-- 订阅信息 -->
      <div class="form-module-title">{{ $t('seaProduct.subscriptionInformation') }}</div>

      <el-form ref="chargeForm" class="order-air-item" :model="subscriptionMode.chargeForm" label-position="left">
        <el-table size="mini" :border="true" :data="subscriptionMode.chargeForm.charges" style="width: 100%; "
          row-key="id">
          <el-table-column prop="carrierJsonListId" :label="$t('seaProduct.shippingCompany')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].carrierJsonListId`">
                <el-select v-model="row.carrierJsonListId" multiple clearable :placeholder="$t('seaProduct.placeholder')"
                  @change="selectedCarrier($event, $index)" size="mini" style="width:100%">
                  <el-option v-for="item in carrierJsonSelect" :key="item.carrierId" :label="item.carrierName"
                    :value="item.carrierId"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="polCode" :label="$t('seaProduct.pol')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].polCode`">
                <type-select v-model="row.polCode" type="seaport" @selected="selectedpol($event, $index)" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="podJsonListName" :label="$t('seaProduct.pod')">
            <template slot-scope="{row,$index}">
              <el-form-item :prop="`charges[${$index}].podJsonListName`">
                <el-select v-model="row.podJsonListName" multiple filterable :placeholder="$t('seaProduct.placeholder')"
                  @change="selectedpodCode($event, $index)" size="mini" style="width:100%" clearable
                  :disabled="row.podJsonFalg">
                  <el-option v-for="item in seaportlistAll" :key="item.code5" :label="item.code5" :value="item.code5">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="routeCode" :label="$t('seaProduct.lineCode')">
            <template slot-scope="{row, $index}">
              <el-form-item :prop="`charges[${$index}].routeCode`">
                <!--航线-->
                <type-select v-model="row.routeCode" type="trade" termCode="SEALINE"
                  @selected="selectedRoute($event, $index)" clearable :disabled="row.routeFalg" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column prop="containerTypeList" :label="$t('seaProduct.containerType')">
            <template slot-scope="{row, $index}">
              <el-form-item :prop="`charges[${$index}].containerTypeList`">
                <el-select v-model="row.containerTypeList" multiple :placeholder="$t('seaProduct.placeholder')"
                  size="mini" style="width:100%">
                  <el-option label="20Gp" value=1></el-option>
                  <el-option label="40GP" value=2></el-option>
                  <el-option label="40HQ" value=3></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column prop="oper" :label="$t('receiveFms.operation')" width="60">
            <template slot-scope="{$index }">
              <i class="iconfont icon-minus-circle" v-if="subscriptionMode.chargeForm.charges.length > 1"
                @click="deleteFn($index)"></i>
              <i class="iconfont icon-add-circle" @click="addFn($index)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <div class="operation-btn">
        <el-button type="primary" @click="addOrder">{{ $t('seaProduct.save') }}</el-button>
        <el-button @click="cancel">{{ $t('seaProduct.cancel') }}</el-button>
      </div>
    </div>

  </div>
</template>
<script>
import { seaportlistAllAPi, getSeaProductSubscriptionDetailApi, editSeaProductSubscriptionApi } from '@/api/seaProduct'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { parseTime } from '@/utils/index'

export default {
  name: 'SeaProductSubscriptionEdit',
  components: {
    cargoLimitedSelect
  },

  data () {

    return {
      seaportlistAll: [],
      carrierJsonSelect: [{
        carrierId: 30,
        carrierCode: "OOLU",
        carrierName: "OOCL"
      }, {
        carrierId: 15,
        carrierCode: "HLCU",
        carrierName: "HPL"
      }, {
        carrierId: 50,
        carrierCode: "MSK",
        carrierName: "MSK"
      }],
      subscriptionMode: {
        id: "",
        subscriptionName: '',
        cycleWeekList: [],
        cycleWeek: '',
        cycleTime: '',
        validTimeRange: [],
        expiryDateStart: '',
        expiryDateEnd: '',
        subscriptionDetailDTOList: [],
        chargeForm: {
          charges: [{
            carrierListId: "",
            carrierJson: "",
            carrierJsonList: [{
              carrierId: "",
              carrierCode: "",
              carrierName: ""
            }],
            pol: "",
            polCode: "",
            podJson: "",
            podJsonList: [],
            route: "",
            routeCode: "",
            containerTypeList: [],
            containerType: ""
          }]
        }
      },
      subscriptionRules: {
        "subscriptionName": [{ required: true, message: this.$t('seaProduct.placeholder'), trigger: 'change' }],
        "cycleWeekList": [{ required: true, message: this.$t('seaProduct.placeholder'), trigger: 'blur' }],
        "cycleTime": [{ required: true, message: this.$t('seaProduct.placeholder'), trigger: 'change' }],
        "validTimeRange": [{ required: true, message: this.$t('seaProduct.placeholder'), trigger: 'blur' }]
        // "expiryDateEnd": [{ required: true, message: this.$t('seaProduct.placeholder'), trigger: 'change' }]
      },
      loading: false
    }
  },
  watch: {
  },

  created () {
    this.init()
    this.loading = true

  },

  methods: {
    init () {
      seaportlistAllAPi().then(res => {
        this.seaportlistAll = res.content
      })


      getSeaProductSubscriptionDetailApi(this.$route.query.id).then(res => {
        this.loading = false
        try {
          res.content.cycleTime = res.content.cycleTime + ""
          res.content.cycleWeekList = res.content.cycleWeek.split(",")
          res.content.validTimeRange = [res.content.expiryDateStart, res.content.expiryDateEnd]
          res.content.subscriptionDetailDTOList.forEach(element => {
            element.containerTypeList = element.containerType.split(',')
            element.carrierJsonListName = []
            element.carrierJsonListId = []
            element.carrierJsonList = element.carrierJson ? JSON.parse(element.carrierJson) : []
            element.carrierJsonList.forEach(v => {
              v.id = v.carrierId
              v.chineseName = v.carrierName
              v.englishName = v.carrierCode
              element.carrierJsonListName.push(v.carrierName)
              element.carrierJsonListId.push(v.carrierId)

            })
            element.podJsonListName = []
            element.podJsonList = element.podJson ? JSON.parse(element.podJson) : []
            element.podJsonList.forEach(v => {
              element.podJsonListName.push(v.podCode)
            })
            if (element.routeCode) {
              element.podJsonFalg = true
            }
            if (element.podJsonList.length > 0) {
              element.routeFalg = true
            }
          });
          this.subscriptionMode = res.content
          let chargeForm = { charges: res.content.subscriptionDetailDTOList }
          this.subscriptionMode.chargeForm = chargeForm

        } catch (e) {
          console.log(e)
        }
      })
    },

    selectedCarrier (charge, index) {
      console.log(11, charge, index)
      let item = this.subscriptionMode.chargeForm.charges[index]
      let carrierJsonList = []
      charge.forEach(v => {
        if (v) {
          let carrierJson = this.carrierJsonSelect.find(item => item.carrierId === v)
          carrierJsonList.push(carrierJson)
        }
      })
      item.carrierJsonList = carrierJsonList
      this.$set(this.subscriptionMode.chargeForm.charges, index, item)
      console.log(this.subscriptionMode.chargeForm.charges)
    },
    selectedpol (charge, index) {
      console.log(item)
      let item = this.subscriptionMode.chargeForm.charges[index]
      item.pol = charge.englishName
      item.polCode = charge.code5
      this.$set(this.subscriptionMode.chargeForm.charges, index, item)
    },
    selectedpodCode (charge, index) {
      console.log(charge, index)
      let item = this.subscriptionMode.chargeForm.charges[index]
      let podJsonList = []
      // let podJsonListName = []
      charge.forEach(v => {
        let port = this.seaportlistAll.find(item => item.code5 === v)
        if (port) {
          let podJson = {
            pod: port.englishName,
            podCode: port.code5
          }
          podJsonList.push(podJson)
        }
      })
      item.podJsonList = podJsonList
      if (podJsonList.length > 0) {
        item.routeFalg = true
        item.routeCode = ""
        item.route = ""
      } else {
        item.routeFalg = false
      }
      this.$set(this.subscriptionMode.chargeForm.charges, index, item)
    },
    selectedRoute (charge, index) {
      let item = this.subscriptionMode.chargeForm.charges[index]
      item.routeCode = charge.code
      item.route = charge.chineseName
      if (item.routeCode) {
        item.podJsonFalg = true
        item.podJsonList = []
      } else {
        item.podJsonFalg = false
      }
      this.$set(this.subscriptionMode.chargeForm.charges, index, item)
    },

    parseTime (value) {
      return parseTime(value, '{y}-{m}-{d} {h}:{i}')
    },

    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `SeaProductSubscriptionList` })
    },
    // 保存
    addOrder () {
      let vb = false; let ve = false; let cb = false;
      this.$refs.subscriptionMode.validate(valid => {
        if (valid) {
          vb = valid
        }
      })
      this.$refs.chargeForm.validate(valid => {
        if (valid) {
          ve = valid
        }
      })
      if (ve && vb) {
        this.loading = true
        this.subscriptionMode.expiryDateStart = this.subscriptionMode.validTimeRange[0]
        this.subscriptionMode.expiryDateEnd = this.subscriptionMode.validTimeRange[1]
        this.subscriptionMode.chargeForm.charges.forEach(element => {
          element.containerType = element.containerTypeList.join(',')
          if (element.podJsonList.length > 0 || element.routeCode) {
            if (element.podJsonList.length > 0 && this.$isNotEmpty(element.routeCode)) {
              this.$message({
                type: 'warning',
                message: this.$t('seaProduct.eitherPodOrRoute')
              })
              cb = true
            }
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('seaProduct.pleaseCompleteThePortOrRoute')
            })
            cb = true
          }
        });
        if (cb) {
          this.loading = false
          return
        }

        this.subscriptionMode.subscriptionDetailDTOList = this.subscriptionMode.chargeForm.charges
        this.subscriptionMode.cycleWeek = this.subscriptionMode.cycleWeekList.join(',')

        editSeaProductSubscriptionApi(this.$route.query.id, this.subscriptionMode).then(res => {
          if (res && res.ok) {
            this.$message.success(this.$t('seaProduct.successSaved'))
            this.backList()
          }
          this.loading = false
        })

      }
    },

    cancel () {
      this.$confirm(this.$t('seaProduct.cancelTip'), this.$t('seaProduct.tips'), {
        confirmButtonText: this.$t('seaProduct.determine'),
        cancelButtonText: this.$t('seaProduct.cancel'),
        type: 'warning'
      }).then(() => {
        this.backList()
      }).catch(() => {
      })
    },

    deleteFn (index) {
      this.subscriptionMode.chargeForm.charges.splice(index, 1)
    },
    addFn () {
      this.subscriptionMode.chargeForm.charges.push({
        carrierListId: "",
        carrierJson: "",
        carrierJsonList: [{
          carrierId: "",
          carrierCode: "",
          carrierName: ""
        }],
        pol: "",
        polCode: "",
        podJsonListName: [],
        podJsonFalg: false,
        podJson: "",
        podJsonList: [],
        route: "",
        routeCode: "",
        routeFalg: false,
        containerTypeList: [],
        containerType: ""
      })
    }
  }
}
</script>

<style scoped lang="less">
.app {
  width: 100%;

  // min-width: 1450px;
}

.app-main-inner {
  width: 100%;
  background: #f5f7fa;
}

.page-form {
  width: 100%;
  // max-width: 1200px;
  padding: 20px 10px;
  background: #f5f7fa;
}

.form-module-title {
  margin-left: 10px;
  font-size: 15px;
  margin-bottom: 10px;
  display: block;
  color: #1890ff;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
  height: 28px;
  line-height: 28px;
}

.form-module-item {
  overflow: hidden;
  padding: 20px 20px 15px 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

  .item {
    width: 25%;
    float: left;
    padding: 0 20px;
    margin-bottom: 10px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
  }


  ::v-deep .el-form-item {
    width: 25%;
    float: left;
    padding: 0 20px;
    min-height: 37px;
  }

  ::v-deep .el-select {
    width: 100%;
  }

  ::v-deep .el-form-item__label {
    text-align: right;
  }
}

.charge-list-data {
  margin: 20px 0;
}

.operation-btn {
  padding: 20px;
  text-align: right;
  background: #fff;
}

.order-btn {
  margin-left: 12px;
}

.shipping-info .item label {
  display: block;
  margin-bottom: 8px;
}

.shipping-info .item span {
  display: inline-block;
  min-height: 200px;
  width: 100%;
  border-radius: 5px;

  ::v-deep .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    font-size: 12px;
    color: #000;
  }
}

.dialog-footer {
  text-align: center;
}

.order-air-item {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
  margin-bottom: 20px;
  margin: 10px;

  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  .title {
    font-weight: 600;
    line-height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
  }

  .link {
    font-weight: 500;
    color: #1890ff;
  }

  .company {
    padding: 12px 20px;
    overflow: hidden;

    label {
      font-weight: 500;
      margin-right: 20px;
    }
  }
}

.shippingSpaceForm {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
