<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content">
      <div class="form-module-title" style="margin: 10px;">
        <span>{{ $t('seaProduct.basicInformation') }}</span>
      </div>
      <div class="form-module-item" style="margin: 10px;">
        <el-form ref="formRef" :model="formModel" label-width="90px" label-position="left" class="basicInfoForm">

          <!-- 船公司 -->
          <el-form-item :label="$t('seaProduct.shippingCompany')" prop="carrierName">
            <cargo-limited-select placeholder="" :select-label="formModel.carrierName" size="mini"
              :select-value="formModel.carrierName" type="carrier" style="width: 100%;" @set="selectedCarrier" clearable
              disabled />
          </el-form-item>

          <!-- 供应商 -->
          <el-form-item :label="$t('seaProduct.supplierName')" prop="supplierName" size="mini">
            <type-select v-model="formModel.supplierName" type="supplier" style="width: 100%;"
              :request-params="{ 'partnerRole': 13012, 'businessType': 'SEA_EXPORT' }" @selected="setBookingAgentInfo"
              disabled />
          </el-form-item>

          <!-- 起运港 -->
          <el-form-item :label="$t('seaProduct.pol')" prop="polCode">
            <el-row>
              <el-col :span="10">
                <type-select v-model="formModel.polCode" type="seaport" size="mini" @selected="selectedPol" disabled />
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
                <type-select v-model="formModel.podCode" type="seaport" size="mini" @selected="selectedPod" disabled />
              </el-col>
              <el-col :span="14" style="padding-left: 10px">
                <el-input v-model="formModel.pod" class="job-no-input" size="mini" disabled />
              </el-col>
            </el-row>
          </el-form-item>


          <!-- 渠道来源 -->
          <el-form-item :label="$t('seaProduct.dataSource')" prop="dataSource" size="mini"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-select v-model="formModel.dataSource" :placeholder="$t('seaProduct.placeholder')" disabled>
              <el-option :label="$t('seaProduct.ecommercePlatform')" value=10></el-option>
              <el-option :label="$t('seaProduct.shipownerContract')" value=20></el-option>
              <el-option :label="$t('seaProduct.agencyContract')" value=30></el-option>
            </el-select>
          </el-form-item>

          <!-- 生效日期 -->
          <el-form-item :label="$t('seaProduct.effectiveDate')" prop="validTimeRange"
            :rules="[{ required: true, message: $t('seaProduct.placeholder'), trigger: 'change' }]">
            <el-date-picker v-model="formModel.validTimeRange" value-format="timestamp" type="daterange"
              range-separator="-" start-placeholder="" end-placeholder="" style="width: 100%" size="mini" disabled>
            </el-date-picker>
          </el-form-item>

          <!-- 船司航线 -->
          <el-form-item :label="$t('seaProduct.routeCode')" prop="routeCodeList" size="mini">
            <!--航线-->
            <el-select v-model="formModel.routeCodeList" multiple filterable :placeholder="$t('seaProduct.placeholder')"
              @change="selectedRoute" clearable size="mini" style="width:100%" :disabled="addVisible || routeFalg">
              <el-option v-for="item in routeAllList" :key="item.code" :label="item.code + '---' + item.chineseName"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>


      </div>
      <div class="operation-btn" v-show="!addVisible">
        <el-button type="primary" @click="addVisible = true">{{ $t('seaProduct.nextStep') }}</el-button>
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
                :isDetail="true" @update="updateCharge"></charge-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button @click="backList">{{ $t('seaProduct.cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import {
  getExtraPriceCardTemplateApi, editSeaExtraPriceCardApi, getSeaExtraPriceCardDetailApi
} from "@/api/seaProduct";
import ChargeTable from './components/chargeTable'
import { deepClone } from '@/utils'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import AdvanceSelect from "@/components/Form/AdvanceSelect"
import { parseTime } from '@/utils/index'
import {
  getTerminologyListByTypeApi
} from "@/api/common";

export default {
  name: 'SeaExtraProductPriceCardDetail',
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
    this.loading = true
    this.init()

  },

  methods: {
    async init () {
      const res = await getTerminologyListByTypeApi('SEALINE')
      if (res && res.ok) {
        this.routeAllList = res.content
      }
      this.initDetail()
    },
    async initDetail () {
      const res = await getSeaExtraPriceCardDetailApi(this.$route.query.id)
      if (res && res.ok) {
        this.loading = false
        this.addVisible = true
        this.formModel = res.content
        this.formModel.validTimeRange = [res.content.expiryDateStart, res.content.expiryDateEnd]
        this.formModel.dataSource = res.content.dataSource + ""
        this.chargeTypeList = res.content.freightRowSequenceList
        this.activeName = this.chargeTypeList[0].sequenceContentDto.id
        this.formModel.routeJsonList = res.content.routeJson ? JSON.parse(res.content.routeJson) : []
        this.formModel.routeCodeList = []
        this.formModel.routeJsonList.forEach((code, num) => {
          this.formModel.routeCodeList.push(code.routeCode)
        })
      }

    },
    chargeTypeTemplateDate (categoryId) {
      if (!this.$isEmpty(this.chargeTypeTemplate)) {
        let itemData = this.chargeTypeTemplate.find(item => item.categoryId === categoryId)
        if (!this.$isEmpty(itemData)) {
          return itemData.sequenceContentDto
        }
      }
    },
    setBookingAgentInfo (customer) {
      this.formModel.supplierName = customer.chineseName
      this.formModel.supplierId = customer.id
      this.formModel.supplierShortName = customer.shortName
    },

    updateCharge (data, categoryId) {
      this.chargeTypeList.forEach((item, index) => {
        if (item.categoryId === categoryId) {
          item.sequenceContentDto.chargeItemDetailDTOList = data
        }
      })
    },

    selectedPod (port) {
      this.formModel.pod = port.englishName
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
      this.$router.push({ name: `SeaProductExtraPriceCardList` })
    }

  }
}
</script>

<style scoped lang="less">
.page-edit-container {
  background: #fff;
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
