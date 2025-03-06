<template>
  <!-- 船期信息  -->
  <el-dialog :close-on-click-modal="false" :title="$t('seaProduct.costDetails')" :visible="visible" @close="closeFn"
    width="980px" v-loading="loading">
    <div class="title">
      <!-- 运费 -->
      <span style="margin-right:20px;">{{ $t('seaProduct.priceCardCharge') }}</span>
    </div>
    <el-table :data="priceCardList" :border="true">
      <el-table-column prop="feeName" width="150" :label="$t('seaProduct.feeName')">
      </el-table-column>
      <el-table-column prop="currency" width="60" :label="$t('seaProduct.currency')">
      </el-table-column>
      <el-table-column prop="twentyGP" label="20GP" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.twentyGP }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyGP" label="40GP" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyGP }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyHQ" label="40HQ" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyHQ }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" :label="$t('seaProduct.ticket')" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.price }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('seaProduct.remark')">
      </el-table-column>
    </el-table>

    <div class="title margin-top-15">
      <!-- 起运港费用 -->
      <span style="margin-right:20px">{{ $t('seaProduct.extraPolCharge') }}</span>
    </div>
    <el-table :data="extraPolList" :border="true">
      <el-table-column prop="feeName" width="150" :label="$t('seaProduct.feeName')">
      </el-table-column>
      <el-table-column prop="currency" width="60" :label="$t('seaProduct.currency')">
      </el-table-column>
      <el-table-column prop="twentyGP" label="20GP" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.twentyGP }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyGP" label="40GP" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyGP }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyHQ" label="40HQ" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyHQ }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" :label="$t('seaProduct.ticket')" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.price }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('seaProduct.remark')">
      </el-table-column>
    </el-table>

    <div class="title margin-top-15">
      <!-- 目的港费用 -->
      <span style="margin-right:20px">{{ $t('seaProduct.extraPodCharge') }}</span>
    </div>
    <el-table :data="extraPodList" :border="true">
      <el-table-column prop="feeName" width="150" :label="$t('seaProduct.feeName')">
      </el-table-column>
      <el-table-column prop="currency" width="60" :label="$t('seaProduct.currency')">
      </el-table-column>
      <el-table-column prop="twentyGP" label="20GP" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.twentyGP }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyGP" label="40GP" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyGP }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyHQ" label="40HQ" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyHQ }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" :label="$t('seaProduct.ticket')" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.price }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('seaProduct.remark')">
      </el-table-column>
    </el-table>

    <div class="title margin-top-15">
      <!-- 其他费用 -->
      <span style="margin-right:20px">{{ $t('seaProduct.extraOtherCharge') }}</span>
    </div>
    <el-table :data="extraOtherList" :border="true">
      <el-table-column prop="feeName" width="150" :label="$t('seaProduct.feeName')">
      </el-table-column>
      <el-table-column prop="currency" width="60" :label="$t('seaProduct.currency')">
      </el-table-column>
      <el-table-column prop="twentyGP" label="20GP" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.twentyGP }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyGP" label="40GP" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyGP }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="fortyHQ" label="40HQ" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.fortyHQ }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" :label="$t('seaProduct.ticket')" width="90" :align="right" header-align="left">
        <template slot-scope="scope">
          <div style='padding-right: 10px;'>
            {{ scope.row.price }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('seaProduct.remark')">
      </el-table-column>
    </el-table>

  </el-dialog>
</template>
<script>
import { getChargesDetailSeaExtraPriceCardApi, getPriceCardChargesDetailListApi } from '@/api/seaProduct'
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
      extraOtherList: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.priceCardList = []
        this.extraPolList = []
        this.extraPodList = []
        this.extraOtherList = []
        this.getAll()
      }
    }
  },
  methods: {
    async getAll () {
      this.loading = true
      let fn = getPriceCardChargesDetailListApi
      // 船司合约
      if (Number(this.dataSource) === 20) {
        fn = getChargesDetailSeaExtraPriceCardApi
      }
      const res = await fn(this.priceCardId)
      if (res.ok && res.content) {
        this.priceCardList = this.detailChargeDetailsData(res.content.priceCardList)
        this.extraPolList = this.detailChargeDetailsData(res.content.extraPolList)
        this.extraPodList = this.detailChargeDetailsData(res.content.extraPodList)
        this.extraOtherList = this.detailChargeDetailsData(res.content.extraOtherList)
      }
      this.loading = false


    },
    detailChargeDetailsData (item) {
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
                    break;
                  case 2:
                    chargeInfo.fortyGP = formatNumberToThousands(chargePrice.price)
                    break;
                  case 3:
                    chargeInfo.fortyHQ = formatNumberToThousands(chargePrice.price)
                    break;
                  case 4:
                    chargeInfo.fortyFiveHQ = formatNumberToThousands(chargePrice.price)
                    break;
                  default:
                    break;
                }
              } else {
                // 箱型 没有业务限制 则 箱类型价格通一个
                chargeInfo.twentyGP = formatNumberToThousands(chargePrice.price)
                chargeInfo.fortyGP = formatNumberToThousands(chargePrice.price)
                chargeInfo.fortyHQ = formatNumberToThousands(chargePrice.price)
                chargeInfo.fortyFiveHQ = formatNumberToThousands(chargePrice.price)
              }
            } else if (charge.unit === 2004) {
              chargeInfo.price = formatNumberToThousands(chargePrice.price)
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
</style>
