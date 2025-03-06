<template>
  <div class="app-main-inner" v-loading="loading">
    <el-form ref="orderForm" :model="basicInfoModel" :rules="orderRules" label-width="95px" label-position="left"
      class="page-form">
      <!-- 客户信息 -->
      <div class="form-module-title ">{{ $t('air.customerInformation') }}</div>
      <div class="form-module-item">
        <!-- 航空公司 -->
        <el-form-item :label="$t('air.airlineName')" prop="airlineId">
          <!-- <cargo-limited-select :disabled="isInitMasterOrder" :placeholder="$t('air.placeholder')"
            :method="airCustomerMethod" :select-label="basicInfoModel.airlineName"
            :select-value="basicInfoModel.airlineId" type="customer" style="width: 100%;" @set="setAirCustomerInfo" /> -->

          <type-select :placeholder="$t('air.placeholder')" v-model="basicInfoModel.airlineName" type="airLine"
            style="width: 100%;" @selected="setAirCustomerInfo" :disabled="isInitMasterOrder" />
        </el-form-item>

        <!-- 订舱代理 -->
        <el-form-item :label="$t('air.bookingAgentPort')" prop="bookingAgentId">
          <!-- <cargo-limited-select :disabled="isInitMasterOrder" :select-label="basicInfoModel.bookingAgentName"
            :select-value="basicInfoModel.bookingAgentId" :method-params="{ range: ['b_booking_agent'] }"
            type="customer" style="width: 100%;" @set="setBookingAgentInfo" /> -->

          <type-select :disabled="isInitMasterOrder" v-model="basicInfoModel.bookingAgentName" type="supplier"
            style="width: 100%;" :request-params="{ 'partnerRole': 14014, 'businessType': 'AIR_EXPORT' }"
            @selected="setBookingAgentInfo" />

        </el-form-item>

        <!-- 货物类型 多选-->
        <el-form-item :label="$t('air.cargoType')" prop="cargoType">
          <el-select v-model="basicInfoModel.cargoType" :placeholder="$t('air.placeholder')" size="mini" multiple>
            <el-option :label="$t('air.generalCargo')" value="0"></el-option>
            <el-option :label="$t('air.dangerousGoods')" value="1"></el-option>
            <el-option :label="$t('air.refrigeratedGoods')" value="2"></el-option>
            <el-option :label="$t('air.overweightCargo')" value="3"></el-option>
            <el-option :label="$t('air.hangGarment')" value="4"></el-option>
          </el-select>
        </el-form-item>

        <!-- 产品模式-->
        <el-form-item :label="$t('air.productModel')" prop="productModel">
          <el-select v-model="basicInfoModel.productModel" :placeholder="$t('air.placeholder')" size="mini"
            @change="productModelChange">
            <el-option :label="$t('air.charteredAirplane')" value="1"></el-option>
            <el-option :label="$t('air.wrapperSheet')" value="2"></el-option>
            <el-option :label="$t('air.packageQuantity')" value="3"></el-option>
            <el-option :label="$t('air.foreignPurchasing')" value="4"></el-option>
          </el-select>
        </el-form-item>

        <!-- 产品协议-->
        <el-form-item :label="$t('air.productAgreement')" prop="productAgreement">
          <el-select v-model="basicInfoModel.productAgreement" :placeholder="$t('air.placeholder')" size="mini">
            <el-option v-for="(item, index) in productAgreementList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <!-- 外采代码 -->
        <el-form-item :label="$t('air.outsideCode')" prop="outsourcingCode"
          :rules="[{ required: Number(basicInfoModel.productModel) === 4, message: $t('air.requiredOutsideCode'), trigger: 'blur' }]">
          <el-input v-model.trim="basicInfoModel.outsourcingCode" oninput="value=value.replace(/[^a-zA-Z]/g,'')"
            size="mini" maxlength="5" show-word-limit>
          </el-input>
        </el-form-item>

        <!-- 产品航线 -->
        <el-form-item :label="$t('air.productLine')" size="mini" :rules="[{ required: true }]">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="polCode" style="width: 130%;margin-left: -20%;">
                <!-- 装货港 -->
                <type-select v-model="basicInfoModel.polCode" type="airport" @selected="selectedPol"
                  :disabled="isInitMasterOrder" />
              </el-form-item>
            </el-col>
            <!-- 卸货港 -->
            <el-col :span="11" :offset="2">
              <el-form-item prop="podCode" style="width: 130%;margin-left: -10%;">
                <type-select v-model="basicInfoModel.podCode" type="airport" @selected="selectedPod"
                  :disabled="isInitMasterOrder" />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form-item>

        <!-- 产品有效期 -->
        <el-form-item :label="$t('air.productIsValid')" prop="validTimeRange">
          <CommonPicker pikcerType="daterange" v-model="basicInfoModel.validTimeRange" clearable />
        </el-form-item>

        <!-- 产品人员-->
        <el-form-item :label="$t('air.productPersonnel')" prop="managerId">
          <el-select v-model="basicInfoModel.managerId" :placeholder="$t('air.placeholder')" size="mini">
            <el-option v-for="(item, index) in productPersonnelList" :key="index" :label="item.chineseName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>

      </div>

      <!-- 货物信息 -->
      <div class="form-module-title">{{ $t('air.productRequirement') }}</div>
      <div class="form-module">
        <!-- 航司考核周期 -->
        <el-form-item :label="$t('air.airlineAssessmentCycle')" prop="assessCycle">
          <el-radio-group v-model="basicInfoModel.assessCycle">
            <el-radio label="1" class="checkbox-width"> {{ $t('air.assessmentOfASingleClass') }}</el-radio>
            <el-radio label="2" class="checkbox-width">{{ $t('air.assessmentOfWeeks') }}</el-radio>
            <el-radio label="3" class="checkbox-width">{{ $t('air.halfTheInspection') }}</el-radio>
            <el-radio label="4" class="checkbox-width">{{ $t('air.onTheInspection') }}</el-radio>
            <el-radio label="5" class="checkbox-width">{{ $t('air.quarterlyReview') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 星期 -->
        <el-form-item style="display: inline-block;" class="checkbox-width">
          <el-checkbox v-model="basicInfoModel.mondayFlightFlag" style="margin-left:0px">{{ $t('air.MON') }}
          </el-checkbox>
        </el-form-item>
        <!-- 星期 -->
        <el-form-item style="display: inline-block;" class="checkbox-width checkbox-left2">
          <el-checkbox v-model="basicInfoModel.tuesdayFlightFlag">{{ $t('air.TUE') }}
          </el-checkbox>
        </el-form-item>
        <el-form-item style="display: inline-block;" class="checkbox-width checkbox-left3">
          <el-checkbox v-model="basicInfoModel.wednesdayFlightFlag">{{ $t('air.WED') }}
          </el-checkbox>
        </el-form-item>
        <el-form-item style="display: inline-block;" class="checkbox-width checkbox-left3">
          <el-checkbox v-model="basicInfoModel.thursdayFlightFlag">{{ $t('air.THUR') }}
          </el-checkbox>
        </el-form-item>
        <el-form-item style="display: inline-block;" class="checkbox-width checkbox-left3">
          <el-checkbox v-model="basicInfoModel.fridayFlightFlag">{{ $t('air.FRI') }}
          </el-checkbox>
        </el-form-item>
        <el-form-item style="display: inline-block;" class="checkbox-width checkbox-left2">
          <el-checkbox v-model="basicInfoModel.saturdayFlightFlag">{{ $t('air.SAT') }}
          </el-checkbox>
        </el-form-item>
        <el-form-item style="display: inline-block;" class="checkbox-width checkbox-left2">
          <el-checkbox v-model="basicInfoModel.sundayFlightFlag">{{ $t('air.SUN') }}
          </el-checkbox>
        </el-form-item>
        <!-- 单班考核货量 -->
        <el-form-item :label="$t('air.singleAssessmentGoods')">
          <el-form-item prop="mondayAssessWeight" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.mondayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width" size="mini" v-model="basicInfoModel.mondayAssessWeight"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="tuesdayAssessWeight" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.tuesdayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.tuesdayAssessWeight"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="wednesdayAssessWeight" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.wednesdayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.wednesdayAssessWeight"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="thursdayAssessWeight" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.thursdayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.thursdayAssessWeight"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="fridayAssessWeight" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.fridayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.fridayAssessWeight"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="saturdayAssessWeight" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.saturdayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.saturdayAssessWeight"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="sundayAssessWeight" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.sundayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.sundayAssessWeight"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>

        </el-form-item>


        <!-- 理论装载体积 -->
        <el-form-item :label="$t('air.theoreticalVolume')" prop="theoreticalVolume">
          <el-form-item prop="mondayTheoryVolume" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.mondayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width" size="mini" v-model="basicInfoModel.mondayTheoryVolume"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="tuesdayTheoryVolume" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.tuesdayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.tuesdayTheoryVolume"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="wednesdayTheoryVolume" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.wednesdayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.wednesdayTheoryVolume"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="thursdayTheoryVolume" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.thursdayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.thursdayTheoryVolume"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="fridayTheoryVolume" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.fridayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.fridayTheoryVolume"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="saturdayTheoryVolume" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.saturdayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.saturdayTheoryVolume"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>
          <el-form-item prop="sundayTheoryVolume" style="display: inline-block;"
            :rules="[{ required: basicInfoModel.sundayFlightFlag, message: $t('air.pleaseEnter'), trigger: 'blur' }]">
            <el-input class="checkbox-width checkbox-left" size="mini" v-model="basicInfoModel.sundayTheoryVolume"
              v-input-limit="[-9, 2]">
            </el-input>
          </el-form-item>


        </el-form-item>
      </div>

      <div class="operation-btn">
        <el-button type="primary" @click="addOrder(1)">{{ $t('air.staging') }}</el-button>
        <el-button type="primary" @click="addOrder(2)">{{ $t('air.publish') }}</el-button>
        <el-button @click="cancel">{{ $t('air.cancel') }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { addAirProductAirline, getAirLineList, airProductAirlineDetail } from '@/api/airExport'
import { airLineListApi, getCustomerDropDownListByJob, airportListApi } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { getProductApi } from "@/api/partner/base";
export default {
  name: 'AirProductLineManagementAdd',
  components: { cargoLimitedSelect },
  props: {},
  data () {
    return {
      loading: false,
      checked: "",
      isInitMasterOrder: false,
      customerMethod: getCustomerDropDownListByJob,
      airCustomerMethod: airLineListApi,
      productAgreementList: [],
      productAirlineNameList: [],
      productPersonnelList: [],
      contactList: [],
      basicInfoModel: {
        managerId: "",
        managerName: "",
        airlineId: "",
        airlineName: "",
        airlineScacCode: "",
        bookingAgentName: "",
        bookingAgentId: '',
        cargoType: [],
        productModel: "",
        productModelName: "",
        productAgreement: "",
        outsourcingCode: "",
        pol: '',
        polCode: '',
        podCode: '',
        pod: '',
        validTimeRange: [],
        assessCycle: "",
        validityStart: "",
        validityEnd: "",
        productStatus: "",
        mondayAssessWeight: "",
        mondayFlightFlag: false,
        mondayTheoryVolume: "",

        tuesdayAssessWeight: "",
        tuesdayFlightFlag: false,
        tuesdayTheoryVolume: "",

        wednesdayAssessWeight: "",
        wednesdayFlightFlag: false,
        wednesdayTheoryVolume: "",

        thursdayAssessWeight: "",
        thursdayFlightFlag: false,
        thursdayTheoryVolume: "",

        fridayAssessWeight: "",
        fridayFlightFlag: false,
        fridayTheoryVolume: "",

        saturdayAssessWeight: "",
        saturdayFlightFlag: false,
        saturdayTheoryVolume: "",

        sundayAssessWeight: "",
        sundayFlightFlag: false,
        sundayTheoryVolume: ""

      },
      orderRules: {
        "airlineId": [{ required: true, message: this.$t('air.requiredAirline'), trigger: 'change' }],
        "cargoType": [{ required: true, message: this.$t('air.requiredCargoType'), trigger: 'change' }],
        "productModel": [{ required: true, message: this.$t('air.requiredProductModel'), trigger: 'change' }],
        "productAgreement": [{ required: true, message: this.$t('air.requiredProductAgreement'), trigger: 'change' }],
        "polCode": [{ required: true, message: this.$t('air.requiredPol'), trigger: 'change' }],
        "podCode": [{ required: true, message: this.$t('air.requiredPod'), trigger: 'change' }],
        "validTimeRange": [{ required: true, message: this.$t('air.requiredProductIsValid'), trigger: 'change' }],
        "managerId": [{ required: true, message: this.$t('air.requiredProductPersonnel'), trigger: 'change' }],
        "assessCycle": [{ required: true, message: this.$t('air.requiredAirlineAssessmentCycle'), trigger: 'change' }]
      }
    }
  },

  created () {
    if (this.$route.query.type === "copy") {
      airProductAirlineDetail(this.$route.query.id).then(res => {
        if (res && res.ok) {
          res.content.validTimeRange = []
          this.basicInfoModel = res.content
          this.basicInfoModel.assessCycle = res.content.assessCycle + ""
          this.basicInfoModel.productModel = res.content.productModel + ""
          this.basicInfoModel.validTimeRange = [res.content.validityStart, res.content.validityEnd]
          this.productModelChange(res.content.productModel, res.content.productAgreement)
          this.basicInfoModel.cargoType = res.content.cargoType.split(",")
        }
      });
    }
    // 产品航线列表
    getAirLineList().then(res => {
      this.productAirlineNameList = res.content
    })

    // 产品人员
    getProductApi().then(res => {
      this.productPersonnelList = res.content
    })
  },
  mounted () {

  },
  methods: {
    productModelChange (value, selectValue) {
      console.log("value", value)
      this.basicInfoModel.productModelName = ""
      this.basicInfoModel.productAgreement = ""
      if (Number(value) === 1) {
        this.basicInfoModel.productModelName = this.$t('air.charteredAirplane')
        this.productAgreementList = [{
          label: this.$t('air.allFlights'),
          value: "1"
        }, {
          label: this.$t('air.quarterOfFlight'),
          value: "2"
        }, {
          label: this.$t('air.aSingleFlight'),
          value: "3"
        }]
      }
      if (Number(value) === 2 || Number(value) === 3) {
        if (Number(value) === 2) {
          this.basicInfoModel.productModelName = this.$t('air.wrapperSheet')
        }
        if (Number(value) === 3) {
          this.basicInfoModel.productModelName = this.$t('air.packageQuantity')
        }

        this.productAgreementList = [{
          label: this.$t('air.fixedPrice'),
          value: "4"
        }, {
          label: this.$t('air.floatingPrices'),
          value: "5"
        }]
      }
      if (Number(value) === 4) {
        this.basicInfoModel.productModelName = this.$t('air.foreignPurchasing')
        this.productAgreementList = [{
          label: this.$t('air.backToBackProtocol'),
          value: "6"
        }]
      }
      if (selectValue) {
        this.basicInfoModel.productAgreement = selectValue + ""
      }
    },
    setAirCustomerInfo (customer) {
      this.basicInfoModel.airlineId = customer.id
      this.basicInfoModel.airlineName = customer.chineseName
      this.basicInfoModel.airlineScacCode = customer.scacCode
    },
    setBookingAgentInfo (customer) {
      this.basicInfoModel.bookingAgentName = customer.chineseName
      this.basicInfoModel.bookingAgentId = customer.id
    },
    // 收货地
    selectedRec (port) {
      this.basicInfoModelspaceDTO.receipt = port.englishName
    },
    // 交货港
    selectedDelivery (port) {
      this.basicInfoModelspaceDTO.delivery = port.englishName
    },

    selectedPol (port) {
      this.basicInfoModel.pol = port.englishName
    },
    selectedPod (port) {
      this.basicInfoModel.pod = port.englishName

    },

    addOrder (status) {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          if (this.basicInfoModel.validTimeRange) {
            this.basicInfoModel.validityStart = this.basicInfoModel.validTimeRange[0];
            this.basicInfoModel.validityEnd = this.basicInfoModel.validTimeRange[1];
          }
          if (this.basicInfoModel.outsourcingCode) {
            this.basicInfoModel.outsourcingCode = this.basicInfoModel.outsourcingCode.toUpperCase()
          }

          let data = this.basicInfoModel
          this.basicInfoModel.managerName = this.productPersonnelList.find(item => item.id === this.basicInfoModel.managerId).chineseName
          let aa = this.basicInfoModel.cargoType
          data.productStatus = status
          addAirProductAirline({
            ...data,
            "cargoType": aa.join(',')
          }).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('air.newSuccess'))
              this.backList()
            }
          })
        }
      })
    },
    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirProductLineManagement` })
    },
    cancel () {
      this.$confirm(this.$t('air.cancelTip'), this.$t('air.tips'), {
        confirmButtonText: this.$t('air.determine'),
        cancelButtonText: this.$t('air.cancel'),
        type: 'warning'
      }).then(() => {
        this.backList()
      }).catch(() => {
      })
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
  max-width: 1200px;
  padding: 20px 20px;
  min-width: 990px;
}

.form-module-title {
  font-size: 16px;
  margin-bottom: 10px;
  display: block;
  color: #1890ff;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
}

.form-module-item-file {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
}

.form-module {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
}

.form-module-item {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;

  ::v-deep .el-form-item {
    width: 33%;
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

.customer-info {
  // padding-left: 50px;
}

.customer-info .item {
  width: 20%;
  float: left;
  margin-left: 5%;

  label {
    margin-right: 15px;
  }
}

.checkbox-width {
  width: 80px;
}

.checkbox-left {
  margin-left: 25px;
}

.checkbox-left2 {
  margin-left: 25px;
}

.checkbox-left3 {
  margin-left: 28px;
}
</style>
