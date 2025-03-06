<template>
  <!-- 修改船期 -->
  <el-dialog :close-on-click-modal="false" :title="$t('seaProduct.shipScheduleEdit')" :visible.sync="visible"
    @close="closeFn" width="1100px" v-loading="loading">
    <el-form ref="formPrice" label-width="100px" label-position="left" class="basicInfoForm2">
      <el-form-item :label="$t('seaProduct.dataSource')" style="width: 100%;" :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
        <el-select v-model="dataSource" @change="changeDataSource" size="mini" :disabled="addVisible">
          <el-option :label="$t('seaProduct.shipownerContract')" :value=20></el-option>
          <el-option :label="$t('seaProduct.agencyContract')" :value=30></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('seaProduct.priceCard')" :prop="item.priceCardName" v-for="(item, num) in priceCardList"
        :key="num">
        <el-row>
          <el-col :span="6">
            <el-input v-model.trim="item.priceCardNo" size="mini" disabled/>
          </el-col>
          <el-col :span="12">
            <advance-select v-model="item.priceCardName" :method="getSeaProductPriceCardListApiFun" value-key="id"
              label-key="priceCardName" @selected="changePriceCard($event, num)" :fields="['priceCardNo','priceCardName']"
              :headers="[$t('seaProduct.priceCardNo'),$t('seaProduct.name')]" clearable :disabled="num !== 0 || addVisible" :key="templateKey">
            </advance-select></el-col>
          <el-col :span="5">
            <i class="iconfont icon-minus-circle" v-if="priceCardList.length > 1 && !addVisible"
              @click="deleteFn(num)"></i>
            <i class="iconfont icon-add-circle" v-if="num === 0 && !addVisible" @click="addFn(num)"></i></el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <div class="operation-btn" v-show="!addVisible">
      <el-button type="primary" @click="addVisibleFn()">{{ $t('seaProduct.nextStep') }}</el-button>
      <el-button @click="closeFn">{{ $t('seaProduct.cancel') }}</el-button>
    </div>

    <div v-if="addVisible">
      <el-form ref="formRef" :model="formModel" label-width="100px" label-position="left" class="basicInfoForm">
        <div v-for="(item, num) in formModel.sailScheduleDTOS" :key="num">
          <div style="text-align: left;clear: both;">
            <span v-if="num === 0">{{ $t('seaProduct.head') }}{{ $t('seaProduct.sailingDesc') }}</span>
            <span v-else>{{ num + 1 }}{{ $t('seaProduct.sailingDesc') }}</span>
            <span>：{{ item.transCode }}</span>

          </div>

          <!-- 船名 -->
          <el-form-item :label="$t('seaProduct.vessel')" size="mini"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-input v-model.trim="item.vessel" size="mini" />
          </el-form-item>

          <!-- ETD -->
          <el-form-item :label="$t('seaProduct.etd')"
            :rules="[{ required: num === 0, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <CommonPicker v-model="item.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd" size="mini"
              @change="processTime(item)" />
          </el-form-item>

          <!-- 航线代码 -->
          <el-form-item :label="$t('seaProduct.routeCode')">
            <el-input v-model.trim="item.routeCode" size="mini" />
          </el-form-item>

          <!-- voyage -->
          <el-form-item :label="$t('seaProduct.voyage')" size="mini"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-input v-model.trim="item.voyage" size="mini" />
          </el-form-item>

          <!-- ETA -->
          <el-form-item :label="$t('seaProduct.eta')"
            :rules="[{ required: num === 0, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <CommonPicker v-model="item.eta" pikcer-type="datetime" pickerFormat="yyyy-MM-dd" size="mini"
              @change="processTime(item)" />
          </el-form-item>

          <!-- 航程 -->
          <el-form-item :label="$t('seaProduct.voyageDays')" size="mini"
            :rules="[{ required: num === 0, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-input v-model.trim="item.voyageDays" size="mini" v-input-limit="[-9, 2]" />
          </el-form-item>
        </div>
      </el-form>

      <div class="operation-btn">
        <el-button @click="closeFn">{{ $t('seaProduct.cancel') }} </el-button>
        <el-button @click="prevFn">{{ $t('seaProduct.prev') }} </el-button>
        <el-button type="primary" @click="submitBaseInfo">{{ $t('seaProduct.determine') }}</el-button>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import { editSeaProductSailScheduleApi, getSeaProductPriceCardManageListApi, getSeaProductSailScheduleDetailApi } from '@/api/seaProduct'

export default {
  name: 'ProductSailScheduleEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    order: {
      type: Object,
      default: () => {}
    }
  },

  watch: {
    visible (val) {
      if (val) {
        this.dataSource = this.order.dataSource
        this.beforeStorageValue = this.dataSource
        this.init()
      }
    },
    dataSource: {
        immediate: true,
        handler(val, old) {
          if (this.beforeStorageValue) {
            if (val !== this.beforeStorageValue) {
              this.$confirm(this.$t('seaProduct.notChangeYetSaved'), this.$t('sea.tips'), {
                confirmButtonText: this.$t('seaProduct.determine'),
                cancelButtonText: this.$t('seaProduct.cancel'),
                type: 'warning'
              }).then(() => {
                this.changeStoreForm()
              }).catch(() => {
                this.changeStoreCancle()
              })
            }
          }
        }
      }
  },

  data () {
    return {
      templateKey: 0,
      dataSource: "",
      addVisible: false,
      maxTransitData: {},
      priceCardList: [{ id: "", priceCardName: "", priceCardNo: "" }],
      loading: false,
      formModel: {
        sailScheduleDTOS: [
          {
            vessel: "",
            voyage: "",
            route: "",
            routeCode: "",
            voyageDays: "",
            etd: "",
            eta: ""
          }
        ]
      }
    }
  },

  methods: {
    changeStoreCancle() {
      this.dataSource = this.beforeStorageValue

    },
    changeStoreForm() {
      this.beforeStorageValue = this.dataSource
      this.templateKey++
      this.addVisible = false
        this.priceCardList = [{ id: "", priceCardName: "", priceCardNo: "" }]
        this.formModel = {
          sailScheduleDTOS: [{
            vessel: "",
            voyage: "",
            route: "",
            routeCode: "",
            voyageDays: "",
            etd: "",
            eta: ""
          }]
        }
    },
    init () {
      this.loading = true
      getSeaProductSailScheduleDetailApi(this.orderId).then(res => {
        if (res.ok && res.content) {
          this.formModel.sailScheduleDTOS = res.content.seaProductSailScheduleList
          if (res.content.priceCardInfoDTOList.length > 0) {
            this.priceCardList = res.content.priceCardInfoDTOList
            this.priceCardList.forEach(x => {
              x.transJsonObj = JSON.parse(x.transJson)
            })
          } else {
            this.priceCardList = [{ id: "", priceCardName: "", priceCardNo: "" }]
          }
        }
        this.addVisibleFn("init")
        this.loading = false
      })
    },
    getSeaProductPriceCardListApiFun (params) {
      let stateArray = [10, 20]
      const data = {
        'dataSource': this.dataSource,
        'shelfState': 20,
        'stateArray': stateArray,
        'priceCardName': params.keyword
      }
      return getSeaProductPriceCardManageListApi(data)
    },
    changeDataSource (value) {
    },
    changePriceCard (item, num) {
      if (!this.$isEmpty(item)) {
        item.transJsonObj = JSON.parse(item.transJson)
      }

      let priceCardTransList = []
      // 获取中转港数据
      this.priceCardList.forEach(x => {
        if (this.$isNotEmpty(x.id) && x.transType === 20) {
          priceCardTransList.push(x)
        }
      })
      if (priceCardTransList.length > 0 && !this.$isEmpty(priceCardTransList[0].id)) {
        // 获取中转港数据中最大值
        let maxValue = priceCardTransList[0];

        for (let i = 1; i < priceCardTransList.length; i++) {
          const currentValue = priceCardTransList[i];
          if (maxValue.transitNumber === null || currentValue.transitNumber > maxValue.transitNumber) {
            maxValue = currentValue;
          }
          maxValue = priceCardTransList[i]
        }

        // 数据比较
        if (item.transType === 20 && item.transitNumber > 0) {
          let maxItem = ""
          let minItem = ""
          if (maxValue.transitNumber > item.transitNumber) {
            maxItem = maxValue
            minItem = item
          } else {
            maxItem = item
            minItem = maxValue
          }
          let transFlag = false
          for (let i = 0; i < minItem.transJsonObj.length; i++) {
            if (minItem.transJsonObj[i].transCode !== maxItem.transJsonObj[i].transCode) {
              transFlag = true
            }
          }
          if (transFlag) {
            this.priceCardList[num].id = ""
            this.priceCardList[num].priceCardNo = ""
            this.priceCardList[num].priceCardName = ""
            this.priceCardList[num].transitNumber = ""
            this.priceCardList[num].transJson = ""
            this.priceCardList[num].transJsonObj = ""
            this.priceCardList[num].transType = ""
            this.priceCardList[num].podCode = ""
            this.priceCardList[num].pod = ""
            this.priceCardList[num].dataSource = ""
            this.$message.warning(this.$t('seaProduct.addPriceCardTransWarming'));

            return
          }
        }

      }

      // 获取

      this.priceCardList[num].id = item.id
      this.priceCardList[num].priceCardNo = item.priceCardNo
      this.priceCardList[num].priceCardName = item.priceCardName
      this.priceCardList[num].transitNumber = item.transitNumber
      this.priceCardList[num].transJson = item.transJson
      this.priceCardList[num].podCode = item.podCode
      this.priceCardList[num].pod = item.pod
      this.priceCardList[num].dataSource = item.dataSource
      if (!this.$isEmpty(item)) {
        this.priceCardList[num].transJsonObj = JSON.parse(item.transJson)
      }
      this.priceCardList[num].transType = item.transType


    },
    deleteFn (index) {
      this.priceCardList.splice(index, 1)
    },
    addFn () {
      let flag = false
      this.priceCardList.forEach(x => {
        if (this.$isEmpty(x.id)) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning(this.$t('seaProduct.addPriceCardWarming'));
        return
      }
      this.priceCardList.unshift({ id: "", priceCardNo: "", priceCardName: "", transitNumber: "", transJson: "", transType: "" })
    },
    addVisibleFn (type) {
      let priceCardTransList = []
      let flag = false
      // 获取中转港数据
      this.priceCardList.forEach(x => {
        if (this.priceCardList.length > 1 && this.$isEmpty(x.id)) {
          flag = true
        }
        if (this.$isNotEmpty(x.id) && x.transType === 20) {
          priceCardTransList.push(x)
        }
      })
      if (flag) {
        this.$message.warning(this.$t('seaProduct.addPriceCardWarming'));
        return
      }
      if (priceCardTransList.length === 0) {
        let podCode = ""
        this.priceCardList.forEach(item => {
          if (this.$isNotEmpty(item.podCode)) {
            podCode += item.podCode + ","
          }
        })
        if (type !== 'init') {
          this.formModel.sailScheduleDTOS = []

          let sailScheduleList = {
            vessel: "",
            voyage: "",
            route: "",
            routeCode: "",
            voyageDays: "",
            etd: "",
            eta: "",
            transCode: podCode,
            serial: 1
          }
          this.formModel.sailScheduleDTOS.push(sailScheduleList)
        } else {
          this.formModel.sailScheduleDTOS[0].transCode = podCode

        }
      } else {
        this.maxTransitData = ""
        if (priceCardTransList.length > 0 && !this.$isEmpty(priceCardTransList[0].id)) {
          // 获取中转港数据中最大值
          let maxValue = priceCardTransList[0];

          for (let i = 1; i < priceCardTransList.length; i++) {
            const currentValue = priceCardTransList[i];
            if (maxValue.transitNumber === null || currentValue.transitNumber > maxValue.transitNumber) {
              maxValue = currentValue;
            }
            maxValue = priceCardTransList[i]
          }
          this.maxTransitData = maxValue

        }
        if (type !== 'init') {
          this.formModel.sailScheduleDTOS = []
          for (let i = 0; i < this.maxTransitData.transitNumber + 1; i++) {
            let sailScheduleList = {}
            if (i < this.maxTransitData.transitNumber) {
              sailScheduleList = {
                vessel: "",
                voyage: "",
                route: "",
                routeCode: "",
                voyageDays: "",
                etd: "",
                eta: "",
                transCode: this.$isEmpty(this.maxTransitData.transJsonObj) ? this.maxTransitData.podCode : this.maxTransitData.transJsonObj[i].transCode,
                serial: i + 1
              }
            } else {
              sailScheduleList = {
                vessel: "",
                voyage: "",
                route: "",
                routeCode: "",
                voyageDays: "",
                etd: "",
                transCode: this.$isEmpty(this.maxTransitData.transJsonObj) ? "" : this.maxTransitData.podCode,
                eta: "",
                serial: i + 1
              }
            }
            this.formModel.sailScheduleDTOS.push(sailScheduleList)
          }
        } else {
          for (let i = 0; i <= this.maxTransitData.transitNumber; i++) {
            if (i < this.maxTransitData.transitNumber && this.$isNotEmpty(this.formModel.sailScheduleDTOS[i])) {
              this.formModel.sailScheduleDTOS[i].transCode = this.$isEmpty(this.maxTransitData.transJsonObj) ? this.maxTransitData.podCode : this.maxTransitData.transJsonObj[i].transCode
            } else {
              this.formModel.sailScheduleDTOS[i].transCode = this.$isEmpty(this.maxTransitData.transJsonObj) ? "" : this.maxTransitData.podCode
            }
          }
        }
      }

      this.addVisible = true

    },
    processTime (item) {
      if (item.etd && item.eta) {
        item.voyageDays = Math.trunc((item.eta - item.etd) / (1 * 24 * 60 * 60 * 1000))
      } else {
        item.voyageDays = ""
      }
    },
    prevFn () {
      this.formModel.sailScheduleDTOS = []
      this.addVisible = false
    },
    closeFn () {
      this.$emit('close')
    },
    selectedRoute (charge) {
      this.formModel.routeCode = charge.code
      this.formModel.route = charge.chineseName
    },
    submitBaseInfo () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.loading = true
          let dataSourceflag = false
          let flag = false
          this.formModel.sailScheduleDTOS.forEach(res => {
            if (this.$isEmpty(res.vessel) || this.$isEmpty(res.voyage)) {
              flag = true
            }
            if (res.serial === 1) {
              if (this.$isEmpty(res.voyageDays) ||
                this.$isEmpty(res.etd) || this.$isEmpty(res.eta)) {
                flag = true
              }
            }
          })
          if (flag) {
            this.$message.warning(this.$t('seaProduct.addSailScheduleWarming'));
            this.loading = false
            return
          }

          let cardList = []
          this.priceCardList.forEach(x => {
            if (this.$isNotEmpty(x.id)) {
              cardList.push(x.id)
              if (x.dataSource !== this.dataSource) {
                dataSourceflag = true
              }
            }
          })
          if (dataSourceflag) {
            this.$message.warning(this.$t('seaProduct.addDataSourceWarming'));
            this.loading = false
            return
          }
          this.formModel.dataSource = this.dataSource
          this.formModel.priceCardIdList = Array.from(cardList)
          editSeaProductSailScheduleApi(this.orderId, this.formModel).then(res => {
            if (res && res.ok) {
              this.$emit('refresh')
              this.$message.success(this.$t('seaProduct.successSaved'))
              this.closeFn()
            }
            this.loading = false
          })
        }
      })
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
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

.basicInfoForm2 {
  overflow: hidden;

  ::v-deep .el-form-item {
    width: 50%;
    float: left;
  }

  ::v-deep .el-col {
    margin-top: 0px;
  }

  ::v-deep .el-form-item__label {
    text-align: right;
  }
}

.operation-btn {
  padding: 20px;
  text-align: right;
  background: #fff;
}
</style>
