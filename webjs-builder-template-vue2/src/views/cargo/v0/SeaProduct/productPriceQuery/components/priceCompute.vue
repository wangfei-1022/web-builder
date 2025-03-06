<template>
  <!-- 运价计算  -->
  <el-dialog :close-on-click-modal="false" :title="$t('seaProduct.priceCompute')" :visible="visible" @close="closeFn"
    width="980px" v-loading="loading">
    <div class="form-module-item">
      <el-form ref="subscriptionMode" :model="priceCompute" label-width="75px" label-position="left"
        class="subscriptionForm">
        <el-form-item label="20GP" prop="twentyGP" size="mini">
          <el-input v-model.trim="priceCompute.twentyGP" :disabled="priceCompute.twentyGPDisabled" class="job-no-input"
            size="mini" v-input-limit="[-9, 2]" @input="calcFn()" />
        </el-form-item>
        <el-form-item label="40GP" prop="fortyGP" size="mini">
          <el-input v-model.trim="priceCompute.fortyGP" :disabled="priceCompute.fortyGPDisabled" class="job-no-input"
            size="mini" v-input-limit="[-9, 2]" @input="calcFn()" />
        </el-form-item>
        <el-form-item label="40HQ" prop="fortyHQ" size="mini">
          <el-input v-model.trim="priceCompute.fortyHQ" :disabled="priceCompute.fortyHQDisabled" class="job-no-input"
            size="mini" v-input-limit="[-9, 2]" @input="calcFn()" />
        </el-form-item>
      </el-form>
    </div>
    <div class="notice">{{ $t('seaProduct.notice') }}</div>
    <div class="title">
      <!-- 运费 -->
      <span style="margin-right:20px;">{{ $t('seaProduct.priceCardCharge') }}</span>
    </div>
    <el-table :data="priceCardList" :border="true">
      <el-table-column prop="feeName" width="150" :label="$t('seaProduct.feeName')">
      </el-table-column>
      <el-table-column prop="currency" width="60" :label="$t('seaProduct.currency')">
      </el-table-column>
      <el-table-column prop="twentyGP" width="90" label="20GP" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.twentyGP }}
            <span v-if="priceCompute.twentyGP && scope.row.twentyGP && scope.row.chargeMode === 10">* {{
              priceCompute.twentyGP }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyGP" width="90" label="40GP" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyGP }}
            <span v-if="priceCompute.fortyGP && scope.row.fortyGP && scope.row.chargeMode === 10">* {{
              priceCompute.fortyGP
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyHQ" width="90" label="40HQ" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyHQ }}
            <span v-if="priceCompute.fortyHQ && scope.row.fortyHQ && scope.row.chargeMode === 10">* {{
              priceCompute.fortyHQ
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" width="90" :label="$t('seaProduct.ticket')" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style="padding-right: 10px">
            {{ scope.row.price }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('seaProduct.remark')">
      </el-table-column>
    </el-table>
    <!-- 金额合计： -->
    <div class="total">
      <span>{{ $t('seaProduct.totalAmount') }}</span>
      <div style="display: inline;margin-right:25px">
        <span style="margin-right:3px">{{ priceCardSum.currency }}</span>
        <span>{{ formatNumberToThousands(priceCardSum.total) }}</span>
      </div>
    </div>


    <div class="title margin-top-15">
      <!-- 起运港费用 -->
      <span style="margin-right:20px">{{ $t('seaProduct.extraPolCharge') }}</span>
    </div>
    <el-table :data="extraPolList" :border="true">
      <el-table-column prop="feeName" width="150" :label="$t('seaProduct.feeName')">
      </el-table-column>
      <el-table-column prop="currency" width="60" :label="$t('seaProduct.currency')">
      </el-table-column>
      <el-table-column prop="twentyGP" width="90" label="20GP" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style="padding-right: 10px">
            {{ scope.row.twentyGP }}
            <span v-if="priceCompute.twentyGP && scope.row.twentyGP && scope.row.chargeMode === 10">* {{
              priceCompute.twentyGP }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyGP" width="90" label="40GP" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style="padding-right: 10px">
            {{ scope.row.fortyGP }}
            <span v-if="priceCompute.fortyGP && scope.row.fortyGP && scope.row.chargeMode === 10">* {{
              priceCompute.fortyGP
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyHQ" width="90" label="40HQ" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style="padding-right: 10px">
            {{ scope.row.fortyHQ }}
            <span v-if="priceCompute.fortyHQ && scope.row.fortyHQ && scope.row.chargeMode === 10">* {{
              priceCompute.fortyHQ
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" width="90" :label="$t('seaProduct.ticket')" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style="padding-right: 10px">
            {{ scope.row.price }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('seaProduct.remark')">
      </el-table-column>
    </el-table>
    <!-- 金额合计： -->
    <div class="total">
      <span>{{ $t('seaProduct.totalAmount') }}</span>
      <div style="display: inline;margin-right:25px">
        <span style="margin-right:3px">{{ extraPolSum.currency }}</span>
        <span>{{ formatNumberToThousands(extraPolSum.total) }}</span>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import { getPriceCardChargesDetailListApi, getChargesDetailSeaExtraPriceCardApi } from '@/api/seaProduct'
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    priceCardId: {
      type: String,
      default: ''
    },
    dataSource: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      right: "right",
      loading: false,
      priceCardList: [],
      extraPolList: [],
      extraPodList: [],
      extraOtherList: [],
      priceCompute: {
        "twentyGP": "",
        "twentyGPDisabled": true,
        "fortyGP": "",
        "fortyGPDisabled": true,
        "fortyHQ": "",
        "fortyHQDisabled": true
      },
      priceCardSum: {
        total: 0,
        currency: ""
      },
      extraPolSum: {
        total: 0,
        currency: ""
      },
      extraPodSum: {
        total: 0,
        currency: ""
      },
      extraOtherSum: {
        total: 0,
        currency: ""
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.priceCompute = {
          "twentyGP": "",
          "twentyGPDisabled": true,
          "fortyGP": "",
          "fortyGPDisabled": true,
          "fortyHQ": "",
          "fortyHQDisabled": true
        }
        this.priceCardList = []
        this.extraPolList = []
        this.extraPodList = []
        this.extraOtherList = []
        this.priceCardSum = {
          total: 0,
          currency: ""
        }
        this.extraPolSum = {
          total: 0,
          currency: ""
        }
        this.extraPodSum = {
          total: 0,
          currency: ""
        }
        this.extraOtherSum = {
          total: 0,
          currency: ""
        }
        this.getAll()
      }
    }
  },
  methods: {
    getAll () {
      this.loading = true
      let fn = getPriceCardChargesDetailListApi
      // 船司合约
      if (Number(this.dataSource) === 20) {
        fn = getChargesDetailSeaExtraPriceCardApi
      }
      fn(this.priceCardId).then(res => {
        if (res.ok && res.content) {
          this.priceCardList = this.detailChargeDetailsData(res.content.priceCardList)
          this.extraPolList = this.detailChargeDetailsData(res.content.extraPolList)
        }
        this.loading = false
      })
    },
    detailChargeDetailsData (item) {
      let that = this
      let seaQuoteChargeList = []
      if (item.length > 0) {
        item.forEach(charge => {
          let chargeInfoList = charge.chargeInfo ? JSON.parse(charge.chargeInfo) : []
          let chargeInfo = {
            "price": "",
            "twentyGP": "",
            "fortyGP": "",
            "fortyHQ": "",
            "fortyFiveHQ": "",
            "twentyGPPrice": "",
            "fortyGPPrice": "",
            "fortyHQPrice": "",
            "fortyFiveHQPrice": "",
            "ticketPrice": "",
            "index": 999
          }
          if (charge.feeCode === "OFRT") {
            chargeInfo.index = 1
          } else if (charge.feeCode === "BAF") {
            chargeInfo.index = 2
          } else if (charge.feeCode === "LSS") {
            chargeInfo.index = 3
          } else if (charge.feeCode === "ODOC") {
            chargeInfo.index = 4
          } else if (charge.feeCode === "OTHC") {
            chargeInfo.index = 5
          } else if (charge.feeCode === "DDOC") {
            chargeInfo.index = 6
          } else if (charge.feeCode === "DTHC") {
            chargeInfo.index = 7
          } else if (charge.feeCode === "NOSHF") {
            chargeInfo.index = 8
          } else if (charge.feeCode === "LRFF") {
            chargeInfo.index = 9
          } else if (charge.feeCode === "AMETF") {
            chargeInfo.index = 10
          }
          if (charge.remark) {
            charge.remark = charge.remark + this.$t("seaProduct.remarkAddTip")
          }
          chargeInfoList.forEach(chargePrice => {
            if (charge.unit === 2005) {
              if (chargePrice.ctnType) {
                switch (chargePrice.ctnType) {
                  case 1:
                    chargeInfo.twentyGP = formatNumberToThousands(chargePrice.price)
                    chargeInfo.twentyGPPrice = chargePrice.price
                    if (charge.feeCode === "OFRT" && chargePrice.price > 0) {
                      that.priceCompute.twentyGPDisabled = false
                    }
                    break;
                  case 2:
                    chargeInfo.fortyGP = formatNumberToThousands(chargePrice.price)
                    chargeInfo.fortyGPPrice = chargePrice.price
                    if (charge.feeCode === "OFRT" && chargePrice.price > 0) {
                      that.priceCompute.fortyGPDisabled = false
                    }
                    break;
                  case 3:
                    chargeInfo.fortyHQ = formatNumberToThousands(chargePrice.price)
                    chargeInfo.fortyHQPrice = chargePrice.price
                    if (charge.feeCode === "OFRT" && chargePrice.price > 0) {
                      that.priceCompute.fortyHQDisabled = false
                    }
                    break;
                  case 4:
                    chargeInfo.fortyFiveHQ = formatNumberToThousands(chargePrice.price)
                    chargeInfo.fortyFivePrice = chargePrice.price
                    break;
                  default:
                    break;
                }
              } else {
                // 箱型 没有业务限制 则 箱类型价格通一个
                chargeInfo.price = formatNumberToThousands(chargePrice.price)
                chargeInfo.twentyGPPrice = chargePrice.price
                chargeInfo.fortyGPPrice = chargePrice.price
                chargeInfo.fortyHQPrice = chargePrice.price
                chargeInfo.fortyFivePrice = chargePrice.price
              }
            } else if (charge.unit === 2004) {
              chargeInfo.price = formatNumberToThousands(chargePrice.price)
              chargeInfo.ticketPrice = chargePrice.price

            }
          })
          if (chargeInfo) {
            charge = { ...charge, ...chargeInfo }
          }
          seaQuoteChargeList.push(charge)
        });

      }
      return seaQuoteChargeList.sort(this.sortBy('index'))
    },
    sortBy (field) {
      // 根据传过来的字段进行排序
      return function (x, y) {
        return x[field] - y[field]
      }
    },
    calcFn () {
      this.priceCardSum = this.priceComputeFn(this.priceCardList)
      this.extraPolSum = this.priceComputeFn(this.extraPolList)
      // this.extraPodSum = this.priceComputeFn(this.extraPodList)
      // this.extraOtherSum = this.priceComputeFn(this.extraOtherList)

    },
    priceComputeFn (priceList) {
      let priceCard = {
        total: 0,
        currency: ""
      }
      if (!this.priceCompute.twentyGP && !this.priceCompute.fortyGP && !this.priceCompute.fortyHQ) {
        return priceCard
      }
      priceList.forEach(chargePrice => {
        if (chargePrice.chargeMode === 10) {
          priceCard.currency = chargePrice.currency
          // 箱
          if (chargePrice.unit === 2005) {
            if (this.priceCompute.twentyGP) {
              priceCard.total += chargePrice.twentyGPPrice * this.priceCompute.twentyGP
            }
            if (this.priceCompute.fortyGP) {
              priceCard.total += chargePrice.fortyGPPrice * this.priceCompute.fortyGP
            }
            if (this.priceCompute.fortyHQ) {
              priceCard.total += chargePrice.fortyHQPrice * this.priceCompute.fortyHQ
            }
          } else if (chargePrice.unit === 2004) {
            // 票
            priceCard.total += chargePrice.ticketPrice * 1
          }
        }
      })
      return priceCard
    },
    formatNumberToThousands (value) {
      return formatNumberToThousands(value)
    },
    closeFn () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.title {
  margin-right: 20px;
  margin-left: 10px;
  font-size: 18px;
  margin-bottom: 10px;
  display: block;
  color: #1890ff;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
  height: 28px;
  line-height: 28px;
}

.margin-top-15 {
  margin: 15px 0;
}

.form-module-item {
  overflow: hidden;
  // padding: 20px 20px 15px 20px;
  // background: #fff;
  // margin-bottom: 20px;
  // box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

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
    width: 33%;
    float: left;
    // padding: 0 20px;
    // min-height: 37px;
  }

  ::v-deep .el-select {
    width: 100%;
  }

  ::v-deep .el-form-item__label {
    text-align: right;
  }
}

.total {
  font-size: 17px;
  color: #D9001B;
  text-align: right;
}

.notice {
  margin-left: 10px;
  margin-top: -13px;
  color: chocolate;
  font-size: 14px;
}

.text-right {
  text-align: right;
}
</style>
