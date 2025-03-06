<template>
  <div class="app" v-loading="loading">
    <div>
      <div class="form-module-title" style="margin: 10px;">
        <span>{{ $t('seaProduct.basicInformation') }}</span>
      </div>
      <div class="form-module-item" style="margin: 10px;">
        <el-form ref="formRef" :model="formModel" label-width="90px" label-position="left" class="basicInfoForm">


          <!-- 船公司 -->
          <el-form-item :label="$t('seaProduct.shippingCompany')" prop="carrierName"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <cargo-limited-select placeholder="" :select-label="formModel.carrierName" size="mini"
              :select-value="formModel.carrierName" type="carrier" style="width: 100%;" @set="selectedCarrier" clearable
              :disabled="addVisible" />
          </el-form-item>

          <!-- 供应商 -->
          <el-form-item :label="$t('seaProduct.supplierName')" prop="supplierName" size="mini">
            <type-select v-model="formModel.supplierName" type="supplier" style="width: 100%;"
              :request-params="{ 'partnerRole': 13012, 'businessType': 'SEA_EXPORT' }" @selected="setBookingAgentInfo"
              :disabled="addVisible" />
          </el-form-item>

          <!-- 起运港 -->
          <el-form-item :label="$t('seaProduct.pol')" prop="polCode">
            <el-row>
              <el-col :span="10">
                <type-select v-model="formModel.polCode" type="seaport" size="mini" @selected="selectedPol"
                  :disabled="addVisible" />
              </el-col>
              <el-col :span="14" style="padding-left: 10px">
                <el-input v-model="formModel.pol" class="job-no-input" size="mini" disabled />
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 目的港 -->
          <el-form-item :label="$t('seaProduct.pod')" prop="podCode">
            <el-row>
              <el-col :span="10">
                <type-select v-model="formModel.podCode" type="seaport" size="mini" @selected="selectedPod"
                  :disabled="addVisible || podFalg" />
              </el-col>
              <el-col :span="14" style="padding-left: 10px">
                <el-input v-model="formModel.pod" class="job-no-input" size="mini" disabled />
              </el-col>
            </el-row>
          </el-form-item>


          <!-- 渠道来源 -->
          <el-form-item :label="$t('seaProduct.dataSource')" prop="dataSource" size="mini"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-select v-model="formModel.dataSource" :placeholder="$t('seaProduct.placeholder')" :disabled="addVisible">
              <!-- <el-option :label="$t('seaProduct.ecommercePlatform')" value=10></el-option> -->
              <el-option :label="$t('seaProduct.shipownerContract')" value=20></el-option>
              <el-option :label="$t('seaProduct.agencyContract')" value=30></el-option>
            </el-select>
          </el-form-item>

          <!-- 生效日期 -->
          <el-form-item :label="$t('seaProduct.effectiveDate')" prop="validTimeRange"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <CommonPicker size='mini' v-model="formModel.validTimeRange" pikcerType="daterange" valueFormat="timestamp"
              :disabled="addVisible" :default-time="['00:00:00', '23:59:59']" :clearable="true" />
          </el-form-item>

          <!-- 船司航线 -->
          <el-form-item :label="$t('seaProduct.routeCode')" prop="routeCodeList" size="mini">
            <!--航线-->
            <el-select v-model="formModel.routeCodeList" multiple filterable :placeholder="$t('seaProduct.placeholder')"
              @change="selectedRoute" clearable size="mini" style="width:80%" :disabled="addVisible || routeFalg">
              <el-option v-for="item in routeAllList" :key="item.code" :label="item.code + '---' + item.chineseName"
                :value="item.code">
              </el-option>
            </el-select>
            <el-button type="text" size="mini" @click="allSelect()" :disabled="addVisible || routeFalg">
              {{ $t('seaProduct.selectAll') }}
            </el-button>
          </el-form-item>
        </el-form>


      </div>
      <div class="operation-btn" v-show="!addVisible">
        <el-button type="primary" @click="addVisibleFn()">{{ $t('seaProduct.nextStep') }}</el-button>
        <el-button @click="backList">{{ $t('seaProduct.cancel') }}</el-button>
      </div>

      <div v-show="addVisible">

        <div class="form-module-title" style="margin: 10px;">
          <span>{{ $t('seaProduct.costInformation') }}</span>
        </div>
        <div style="margin: 10px;">
          <el-tabs style="width: 100%" v-model="activeName">
            <el-tab-pane v-for="(item, index) in chargeTypeList" :key="index"
              :label="item.sequenceContentDto.chargeTypeName" :name="item.sequenceContentDto.id">
              <charge-table :chargeTypeItem="item.sequenceContentDto"
                :chargeTypeTemplate="chargeTypeTemplateDate(item.categoryId)" :categoryId="item.categoryId"
                :isDetail="false" @update="updateCharge"></charge-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="operation-btn">
          <el-button @click="prevFn">{{ $t('seaProduct.prev') }} </el-button>
          <el-button type="primary" @click="addOrder">{{ $t('seaProduct.save') }}</el-button>
          <el-button @click="backList">{{ $t('seaProduct.cancel') }}</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import {
  getSeaProductLineListApi, getExtraPriceCardTemplateApi, saveSeaExtraPriceCardApi, checkValiditySeaExtraPriceCardApi
} from "@/api/seaProduct";
import {
  getTerminologyListByTypeApi
} from "@/api/common";
import ChargeTable from './components/chargeTable'
import { deepClone } from '@/utils'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import AdvanceSelect from "@/components/Form/AdvanceSelect"
import { parseTime } from '@/utils/index'


export default {
  name: 'SeaExtraProductPriceCardAdd',
  components: {
    cargoLimitedSelect,
    AdvanceSelect,
    ChargeTable
  },

  data () {

    return {
      routeAllList: [],
      routeFalg: false,
      podFalg: false,
      chargeTypeTemplate: {},
      resultpriceCardList: [],
      priceCard: {},
      priceCardTemplate: {},
      activeName: '',
      formModel: {
        validTimeRange: [],
        expiryDateStart: '',
        expiryDateEnd: '',
        dataSource: "20",
        productLineId: '',
        productLineName: '',
        carrierId: '',
        carrierCode: '',
        carrierName: '',
        pol: '',
        polCode: '',
        pod: '',
        podCode: '',
        supplierId: '',
        supplierName: '',
        supplierShortName: '',
        transType: '',
        transJson: '',
        transitNumber: '',
        freightRowSequenceList: [],
        routeJson: "",
        routeJsonList: [],
        routeCodeList: []
      },
      chargeTypeList: [],
      loading: false,
      addVisible: false
    }
  },
  watch: {
  },

  created () {
    // this.loading = true
    this.init()

  },

  methods: {
    allSelect () {
      this.formModel.routeCodeList = []
      this.routeAllList.forEach(element => {
        this.formModel.routeCodeList.push(element.code)
      });
    },
    async init () {

      const res = await getTerminologyListByTypeApi('SEALINE')
      if (res && res.ok) {
        this.routeAllList = res.content
      }

    },

    chargeTypeTemplateDate (categoryId) {
      let itemData = this.chargeTypeTemplate.find(item => item.categoryId === categoryId)
      if (!this.$isEmpty(itemData)) {
        return itemData.sequenceContentDto
      }

    },
    setBookingAgentInfo (customer) {
      this.formModel.supplierName = customer.chineseName
      this.formModel.supplierId = customer.id
      this.formModel.supplierShortName = customer.shortName
    },
    // 产品线路
    getSeaProductLineListApiFun (params) {
      const data = {
        'state': 20,
        'productLineName': params.keyword
      }
      return getSeaProductLineListApi(data)
    },

    async addVisibleFn () {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          // 船公司、起运港、目的港/航线，必须有一个
          if (this.$isEmpty(this.formModel.carrierCode) && this.$isEmpty(this.formModel.polCode) && this.$isEmpty(this.formModel.routeCodeList) && this.$isEmpty(this.formModel.podCode)) {
            this.$message.warning(this.$t('seaProduct.extraPriceCardVerifyWarming'));
            return
          }
          if (this.$isNotEmpty(this.formModel.routeCodeList) && this.$isNotEmpty(this.formModel.podCode)) {
            this.$message.warning(this.$t('seaProduct.eitherPodOrRoute'));
            return
          }
          this.loading = true
          // 航线代码数据处理
          this.formModel.expiryDateStart = this.formModel.validTimeRange[0]
          this.formModel.expiryDateEnd = this.formModel.validTimeRange[1]
          this.formModel.routeJsonList = []
          this.formModel.routeCodeList.forEach((code, num) => {
            let routerCode = this.routeAllList.find(item => item.code === code)
            let json = {
              "route": routerCode.chineseName,
              "routeCode": routerCode.code
            }
            this.formModel.routeJsonList.push(json)
          })
          this.formModel.routeJson = JSON.stringify(this.formModel.routeJsonList)
          const result = await checkValiditySeaExtraPriceCardApi(this.formModel)
          if (!result || !result.ok) {
            this.loading = false
            return
          }

          const res = await getExtraPriceCardTemplateApi({ "carrierCode": this.formModel.carrierCode })
          if (res && res.ok) {
            this.priceCardTemplate = res.content
            this.dealTemplateByCarrier()
          }
          this.loading = false
        }
      })
    },
    dealTemplateByCarrier () {
      this.priceCard = deepClone(this.priceCardTemplate)
      this.chargeTypeList = []
      this.priceCard.forEach((card, num) => {
        let chargeItemDetailDTOListByCarr = []
        card.sequenceContentDto.chargeItemDetailDTOList.forEach((item, index) => {
          let filterData = item
          if (this.$isEmpty(item.carrierCodeList)) {
            item.carrierCodeList = [""]
          }
          if (this.$isEmpty(item.supplierIdList)) {
            item.supplierIdList = [""]
          }
          if (this.$isEmpty(item.polCodeList)) {
            item.polCodeList = [""]
          }
          if (this.$isEmpty(item.podCodeList)) {
            item.podCodeList = [""]
          }
          if (this.$isEmpty(item.routeCodeList)) {
            item.routeCodeList = [""]
          }
          if (item.carrierCodeList.indexOf(this.formModel.carrierName) !== -1 && item.supplierIdList.indexOf(this.formModel.supplierId) !== -1 &&
            item.polCodeList.indexOf(this.formModel.polCode) !== -1 && item.podCodeList.indexOf(this.formModel.podCode) !== -1
          ) {
            // 航线代码 交集
            let route = item.routeCodeList.filter(v => this.formModel.routeCodeList.includes(v))
            if (route.length > 0) {
              item.chargeItemCurrency = 'CNY'
              chargeItemDetailDTOListByCarr.push(item)
            }
          }
        })
        card.sequenceContentDto.chargeItemDetailDTOList = chargeItemDetailDTOListByCarr
      })
      this.chargeTypeList = this.priceCard
      this.chargeTypeTemplate = deepClone(this.priceCard)
      this.activeName = this.chargeTypeList[0].sequenceContentDto.id
      this.addVisible = true
    },
    prevFn () {
      this.addVisible = false
    },
    updateCharge (data, categoryId) {
      this.chargeTypeList.forEach((item, index) => {
        if (item.categoryId === categoryId) {
          item.sequenceContentDto.chargeItemDetailDTOList = data
        }
      })
    },
    addOrder () {
      this.formModel.expiryDateStart = this.formModel.validTimeRange[0]
      this.formModel.expiryDateEnd = this.formModel.validTimeRange[1]
      this.formModel.route = this.formModel.routeCode
      this.formModel.freightRowSequenceList = this.chargeTypeList
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.loading = true
          // 校验
          let flag = false
          let flagNull = true
          this.formModel.freightRowSequenceList.forEach(card => {
            if (card.sequenceContentDto.chargeItemDetailDTOList.length > 0) {
              flagNull = false
            }

            card.sequenceContentDto.chargeItemDetailDTOList.forEach(item => {
              if (this.$isEmpty(item.price) || this.$isEmpty(item.chargeItemCurrency)) {
                flag = true
              }
            })
          })
          if (flagNull) {
            this.$message.warning(this.$t('seaProduct.addCarrierWarming'));
            this.loading = false
            return
          }
          if (flag) {
            this.$message.warning(this.$t('seaProduct.addFeeWarming'));
            this.loading = false
            return
          }
          // 航线代码数据处理
          this.formModel.routeJsonList = []
          this.formModel.routeCodeList.forEach((code, num) => {
            let routerCode = this.routeAllList.find(item => item.code === code)
            let json = {
              "route": routerCode.chineseName,
              "routeCode": routerCode.code
            }
            this.formModel.routeJsonList.push(json)
          })
          this.formModel.routeJson = JSON.stringify(this.formModel.routeJsonList)
          saveSeaExtraPriceCardApi(this.formModel).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('seaProduct.successSaved'))
              this.backList()
            }
            this.loading = false
          })

        }
      })

    },
    selectedPod (port) {
      this.formModel.pod = port.englishName
      if (this.formModel.podCode) {
        this.routeFalg = true
        this.formModel.routeCodeList = []
      } else {
        this.routeFalg = false
      }
    },
    selectedPol (port) {
      this.formModel.pol = port.englishName
    },
    selectedRoute (charge) {
      this.formModel.routeCodeList = charge
      if (this.$isEmpty(this.formModel.routeCodeList)) {
        this.podFalg = true
        this.formModel.pod = ""
        this.formModel.podCode = ""
      } else {
        this.podFalg = false
      }
    },
    selectedCarrier (carrier) {
      this.formModel.carrierId = carrier.id
      this.formModel.carrierCode = carrier.scacCode
      this.formModel.carrierName = carrier.englishShortname
    },


    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `SeaProductExtraPriceCardList` })
    }

  }
}
</script>

<style scoped lang="less">
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
  padding: 20px;
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
</style>
