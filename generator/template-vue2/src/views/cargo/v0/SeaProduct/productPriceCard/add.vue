<template>
  <div class="app" v-loading="loading">
    <div>
      <div class="form-module-title" style="margin: 10px;">
        <span>{{ $t('seaProduct.basicInformation') }}</span>
      </div>
      <div class="form-module-item" style="margin: 10px;">
        <el-form ref="formRef" :model="formModel" label-width="90px" label-position="left" class="basicInfoForm">

          <!-- 产品线路 -->
          <el-form-item :label="$t('seaProduct.productLine')" prop="productLineName" size="mini"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <advance-select v-model="formModel.productLineName" :method="getSeaProductLineListApiFun" value-key="id"
              label-key="productLineName" @selected="changeProductLine" :fields="['productLineName']" :headers="['名称']"
              clearable :disabled="addVisible">
            </advance-select>
          </el-form-item>


          <!-- 船公司 -->
          <el-form-item :label="$t('seaProduct.shippingCompany')"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]" prop="carrierName">
            <cargo-limited-select placeholder="" :select-label="formModel.carrierName" size="mini"
              :select-value="formModel.carrierName" type="carrier" style="width: 100%;" @set="selectedCarrier" clearable
              :disabled="addVisible" />
          </el-form-item>

          <!-- 起运港 -->
          <el-form-item :label="$t('seaProduct.pol')" prop="polCode"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-row>
              <el-col :span="10">
                <type-select v-model="formModel.polCode" type="seaport" size="mini" disabled />
              </el-col>
              <el-col :span="14" style="padding-left: 10px">
                <el-input v-model="formModel.pol" class="job-no-input" size="mini" disabled />
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 目的港 -->
          <el-form-item :label="$t('seaProduct.pod')" prop="podCode"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-row>
              <el-col :span="10">
                <type-select v-model="formModel.podCode" type="seaport" size="mini" disabled />
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

          <!-- 供应商 -->
          <el-form-item :label="$t('seaProduct.supplierName')" prop="supplierName" size="mini">
            <type-select v-model="formModel.supplierName" type="supplier" style="width: 100%;"
              :request-params="{ 'partnerRole': 13012, 'businessType': 'SEA_EXPORT' }" @selected="setBookingAgentInfo"
              :disabled="addVisible" />
          </el-form-item>

          <!-- 中转类型 -->
          <el-form-item :label="$t('seaProduct.transType')" prop="transType" size="mini"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-select v-model="formModel.transType" :placeholder="$t('seaProduct.placeholder')" disabled>
              <el-option :label="$t('seaProduct.through')" value=10></el-option>
              <el-option :label="$t('seaProduct.transfer')" value=20></el-option>
            </el-select>
          </el-form-item>

          <!-- 生效日期 -->
          <el-form-item :label="$t('seaProduct.effectiveDate')" prop="validTimeRange"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <CommonPicker size='mini' v-model="formModel.validTimeRange" pikcerType="daterange" valueFormat="timestamp"
              :disabled="addVisible" :default-time="['00:00:00', '23:59:59']" :clearable="true" />
          </el-form-item>

          <!-- 船司航线 -->
          <el-form-item :label="$t('seaProduct.priceCardRouteCode')" prop="routeCode" size="mini">
            <el-input v-model.trim="formModel.routeCode" size="mini" :disabled="addVisible" />
          </el-form-item>

          <!-- 中转港 -->
          <el-form-item :label="$t('seaProduct.transitPort')" v-for="(item, num) in formModel.transportList" :key="num">
            <el-row>
              <el-col :span="10">
                <type-select v-model="item.transCode" type="seaport" size="mini" disabled />
              </el-col>
              <el-col :span="14" style="padding-left: 10px">
                <el-input v-model="item.trans" class="job-no-input" size="mini" disabled />
              </el-col>
            </el-row>
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
                :chargeTypeTemplate="chargeTypeTemplate[index].sequenceContentDto" :categoryId="item.categoryId"
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
  getSeaProductLineListApi, getPriceCardTemplateApi, saveSeatPriceCardApi, checkValiditySeatPriceCardApi
} from "@/api/seaProduct";
import ChargeTable from './components/chargeTable'
import { deepClone } from '@/utils'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import AdvanceSelect from "@/components/Form/AdvanceSelect"
import { parseTime } from '@/utils/index'


export default {
  name: 'SeaProductPriceCardAdd',
  components: {
    cargoLimitedSelect,
    AdvanceSelect,
    ChargeTable
  },

  data () {

    return {
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
        transportList: [],
        transitNumber: '',
        freightRowSequenceList: []

      },
      chargeTypeList: [],
      loading: false,
      addVisible: false
    }
  },
  watch: {
  },

  created () {
    this.init()

  },

  methods: {
    init () {

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
    changeProductLine (item) {
      this.formModel.productLineId = item.id
      this.formModel.productLineName = item.productLineName
      this.formModel.polCode = item.polCode
      this.formModel.pol = item.pol
      this.formModel.podCode = item.podCode
      this.formModel.pod = item.pod
      this.formModel.transJson = item.transJson
      this.formModel.transitNumber = item.transitNumber
      if (this.$isEmpty(item) || this.$isEmpty(item.transType)) {
        this.formModel.transType = ""
      } else {
        this.formModel.transType = item.transType + ""
      }
      this.formModel.transportList = item.transJson ? JSON.parse(item.transJson) : []
    },
    addVisibleFn () {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.formModel.expiryDateStart = this.formModel.validTimeRange[0]
          this.formModel.expiryDateEnd = this.formModel.validTimeRange[1]
          const res = await checkValiditySeatPriceCardApi(this.formModel)
          if (res && res.ok) {
            this.addVisible = true
          }

        }
      })
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
              if (this.$isEmpty(item.price)) {
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
          saveSeatPriceCardApi(this.formModel).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('seaProduct.successSaved'))
              this.backList()
            }
            this.loading = false
          })

        }
      })

    },

    async selectedCarrier (carrier) {
      this.priceCardTemplate = {}
      this.chargeTypeList = []
      this.formModel.carrierId = carrier.id
      this.formModel.carrierCode = carrier.scacCode
      this.formModel.carrierName = carrier.englishShortname
      if (this.$isNotEmpty(this.formModel.carrierCode)) {
        const res = await getPriceCardTemplateApi({ "carrierCode": this.formModel.carrierCode })
        if (res && res.ok) {
          this.priceCardTemplate = res.content
          this.dealTemplateByCarrier()
        }

      }


    },
    dealTemplateByCarrier () {
      this.priceCard = deepClone(this.priceCardTemplate)
      this.chargeTypeList = []
      this.priceCard.forEach((card, num) => {
        let chargeItemDetailDTOListByCarr = []
        card.sequenceContentDto.chargeItemDetailDTOList.forEach((item, index) => {
          if (item.carrierCodeList.indexOf(this.formModel.carrierName) !== -1) {
            chargeItemDetailDTOListByCarr.push(item)
          }
        })
        card.sequenceContentDto.chargeItemDetailDTOList = chargeItemDetailDTOListByCarr
      })
      this.chargeTypeList = this.priceCard
      this.chargeTypeTemplate = deepClone(this.priceCard)
      this.activeName = this.chargeTypeList[0].sequenceContentDto.id
    },
    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `SeaProductPriceCardList` })
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
