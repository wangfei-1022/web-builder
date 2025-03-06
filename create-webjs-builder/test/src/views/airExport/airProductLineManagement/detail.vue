<template>
  <div class="app">

    <div class="page-form">
      <div class="form-module-title ">
        <!--基础信息    -->
        <span>{{ $t('air.basicInformation') }}</span>

        <el-button style="margin-left:50px" type="primary" size="mini" @click="backToList">{{ $t('air.returnList')
        }}</el-button>

      </div>
      <div class="form-module-item">
        <div class="item">
          <!--航空公司    -->
          <label>{{ $t('air.airlineName') }}</label>
          <span>{{ order.airlineName }}</span>
        </div>
        <div class="item">
          <!--订舱代理   -->
          <label>{{ $t('air.bookingAgentPort') }}</label>
          <span>{{ order.bookingAgentName }}</span>
        </div>
        <div class="item">
          <!--货物类型  -->
          <label>{{ $t('air.cargoType') }}</label>
          <span>{{ order.cargoTypeName }}</span>
        </div>
        <div class="item">
          <!--产品模式 -->
          <label> {{ $t('air.productModel') }} </label>
          <span>{{ order.productModelName }}</span>
        </div>

        <div class="item">
          <!--产品协议 -->
          <label> {{ $t('air.productAgreement') }} </label>
          <span>{{ order.productAgreementName }}</span>
        </div>
        <div class="item">
          <!--外采代码 -->
          <label> {{ $t('air.outsideCode') }}</label>
          <span>{{ order.outsourcingCode }}</span>
        </div>
        <div class="item">
          <!--产品航线 -->
          <label>{{ $t('air.productLine') }}</label>
          <span>{{ order.polCode }} - </span>
          <span>{{ order.podCode }}</span>
        </div>
        <div class="item">
          <!-- 产品有效期  -->
          <label>{{ $t('air.productIsValid') }}</label>
          <span>{{ parseTime(order.validityStart, '{y}-{m}-{d}') }}</span>
          <span style="margin-left:30px">{{ parseTime(order.validityEnd, '{y}-{m}-{d}') }}</span>
        </div>
        <div class="item">
          <!--产品人员 -->
          <label> {{ $t('air.productPersonnel') }}</label>
          <span>{{ order.managerName }}</span>
        </div>
      </div>

      <div class="form-module-title">
        <!-- 产品要求 -->
        <span>{{ $t('air.productRequirement') }}</span>
      </div>
      <div class="form-product-item">
        <div class="item">
          <!-- 航司考核周期 -->
          <label>{{ $t('air.airlineAssessmentCycle') }}</label>
          <span>
            <el-radio-group v-model="order.assessCycle" disabled>
              <el-radio label="1" class="checkbox-width"> {{ $t('air.assessmentOfASingleClass') }}</el-radio>
              <el-radio label="2" class="checkbox-width">{{ $t('air.assessmentOfWeeks') }}</el-radio>
              <el-radio label="3" class="checkbox-width">{{ $t('air.halfTheInspection') }}</el-radio>
              <el-radio label="4" class="checkbox-width">{{ $t('air.onTheInspection') }}</el-radio>
              <el-radio label="5" class="checkbox-width">{{ $t('air.quarterlyReview') }}</el-radio>
            </el-radio-group>
          </span>
        </div>
        <div class="item" style="margin-left:110px">
          <!-- 星期 -->

          <el-checkbox v-model="order.mondayFlightFlag" disabled>{{ $t('air.MON') }}
          </el-checkbox>
          <el-checkbox v-model="order.tuesdayFlightFlag" disabled class="checkbox-left">{{ $t('air.TUE') }}
          </el-checkbox>
          <el-checkbox v-model="order.wednesdayFlightFlag" disabled class="checkbox-left">{{ $t('air.WED') }}
          </el-checkbox>
          <el-checkbox v-model="order.thursdayFlightFlag" disabled class="checkbox-left">{{ $t('air.THUR') }}
          </el-checkbox>
          <el-checkbox v-model="order.fridayFlightFlag" disabled class="checkbox-left">{{ $t('air.FRI') }}
          </el-checkbox>
          <el-checkbox v-model="order.saturdayFlightFlag" disabled class="checkbox-left">{{ $t('air.SAT') }}
          </el-checkbox>
          <el-checkbox v-model="order.sundayFlightFlag" disabled class="checkbox-left">{{ $t('air.SUN') }}
          </el-checkbox>


        </div>
        <div class="item">
          <!--单班考核货量-->
          <label>{{ $t('air.singleAssessmentGoods') }}</label>
          <div class="checkbox-width" style="display: inline-block;">
            {{ order.mondayAssessWeight }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.tuesdayAssessWeight }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.wednesdayAssessWeight }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.thursdayAssessWeight }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.fridayAssessWeight }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.saturdayAssessWeight }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.sundayAssessWeight }}
          </div>
        </div>

        <div class="item">
          <!--理论装载体积-->
          <label>{{ $t('air.theoreticalVolume') }}</label>
          <div class="checkbox-width" style="display: inline-block;">
            {{ order.mondayTheoryVolume }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.tuesdayTheoryVolume }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.wednesdayTheoryVolume }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.thursdayTheoryVolume }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.fridayTheoryVolume }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.saturdayTheoryVolume }}
          </div>
          <div class="checkbox-width checkbox-left2" style="display: inline-block;">
            {{ order.sundayTheoryVolume }}
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
<script>

import { parseTime } from '@/utils/index'
import {
  airProductAirlineDetail
} from "@/api/airExport";
export default {
  name: 'AirProductLineManagementDetail',
  components: {

  },
  props: {
    // order: {
    //   type: Object,
    //   default () {
    //     return {

    //     }
    //   }
    // }
  },
  data () {
    return {
      order: {
        assessCycle: "",
        productAgreement: "",
        cargoTypeName: "",
        productAgreementName: ""
      }
    }
  },

  created () {
    this.init()
  },
  mounted () {

  },
  methods: {
    init () {
      let id = this.$route.query.id
      airProductAirlineDetail(id).then(res => {
        if (res && res.ok) {
          this.order = res.content
          let cargoTypeName = ""
          let that = this;
          console.log("cargoType", res.content.cargoType)
          res.content.cargoType.split(",").forEach(function (element) {
            let res = ""
            switch (element) {
              case 0:
                res = that.$t('air.generalCargo') + ","
                break
              case 1:
                res = that.$t('air.dangerousGoods') + ","
                break
              case 2:
                res = that.$t('air.refrigeratedGoods') + ","
                break
              case 3:
                res = that.$t('air.overweightCargo') + ","
                break
              case 4:
                res = that.$t('air.hangGarment') + ","
                break
              default:
                return
            }
            cargoTypeName = cargoTypeName + res
          });
          if (cargoTypeName) {
            this.order.cargoTypeName = cargoTypeName.substring(0, cargoTypeName.length - 1)
          }
          this.order.assessCycle = this.order.assessCycle + ""
          switch (this.order.productAgreement) {
            case 1:
              this.order.productAgreementName = this.$t('air.allFlights')
              break
            case 2:
              this.order.productAgreementName = this.$t('air.quarterOfFlight')
              break
            case 3:
              this.order.productAgreementName = this.$t('air.aSingleFlight')
              break
            case 4:
              this.order.productAgreementName = this.$t('air.fixedPrice')
              break
            case 5:
              this.order.productAgreementName = this.$t('air.floatingPrices')
              break
            case 6:
              this.order.productAgreementName = this.$t('air.backToBackProtocol')
              break
            default:
              return
          }
        }
      });
    },

    parseTime (value) {
      return parseTime(value, '{y}-{m}-{d}')
    },
    backToList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirProductLineManagement` })
    }
  }
}
</script>

<style scoped lang="less">
.app {
  height: 100%;
  background: #f5f7fa;
}

.page-form {
  width: 100%;
  max-width: 1200px;
  min-width: 990px;
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
    width: 33%;
    float: left;
    padding: 0 20px;
    margin-bottom: 15px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
  }
}

.form-product-item {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

  .item {
    padding: 0 20px;
    margin-bottom: 15px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
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

.checkbox-width {
  width: 80px;
}

.checkbox-left {
  margin-left: 23px;
}

.checkbox-left2 {
  margin-left: 15px;
}
</style>
