<template>
  <div class="clear-charge-detail">
    <div class="info-section-module">
      <div class="info-title" >
        <svg-icon className="clear-module-icon" iconClass="icon-weixiaozhangdan" />
        <span>
          <span v-if="historyState === 20">本期</span>
          <span v-if="historyState === 10">往期</span>
          应收费用合计：
        </span>
        <span class="currency-value-des" v-for="(item, index) in sourceAmountsAr" :key="index">
          <span style="margin-right: 10px">
            {{item.sourceCurrency || item.currency}} &nbsp;{{item.value| numberToThousands}}
          </span>
        </span>

        <el-select v-model="historyState" size="mini" @change="stageChange" style="float: right;width: 120px;">
          <el-option :label="$t('common.ALL')" value="" />
          <el-option v-for="item in historyStateList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </div>
      <div class="info-content">
        <profit-charge-detail-table :chargeList="arChargeList"/>
      </div>
    </div>

    <div class="info-section-module">
      <div class="info-title" >
        <svg-icon className="clear-module-icon" iconClass="icon-weixiaozhangdan" />
        <span>
          <span v-if="historyState === 20">本期</span>
          <span v-if="historyState === 10">往期</span>
          应付费用合计：
        </span>

        <span class="currency-value-des" v-for="(item, index) in sourceAmountsAp" :key="index">
          <span style="margin-right: 10px">
            {{item.sourceCurrency || item.currency}} &nbsp;{{item.value| numberToThousands}}
          </span>
        </span>
      </div>
      <div class="info-content">
        <profit-charge-detail-table :chargeList="apChargeList"/>
      </div>
    </div>

    <div class="info-section-module UN-CONTENT">
      <div class="info-title" >
        <div class="MAO">毛</div>
        <span v-if="!inner">
          <span>
            <span v-if="historyState === 20">本期</span>
            <span v-if="historyState === 10">往期</span>
            单票毛利：
          </span>

          <span class="currency-value-des" v-for="(item, index) in sourceAmountsProfit" :key="index">
            <span style="margin-right: 10px">
              {{item.sourceCurrency || item.currency}} &nbsp;{{item.value| numberToThousands}}
            </span>
          </span>
        </span>
        <span v-if="inner">
          <span>
            <span v-if="historyState === 20">本期</span>
            <span v-if="historyState === 10">往期</span>
          </span>

          <span v-for="(item, index) in sourceAmountsOfficeProfit">
            {{item.settlementOfficeName}}
            <span class="currency-value-des" v-for="(xx, index) in item.sourceAmountsProfit" :key="index">
              <span style="margin-right: 10px">
                {{item.sourceCurrency || xx.currency}} &nbsp;{{xx.value| numberToThousands}}
              </span>
            </span>
          </span>
        </span>
      </div>
    </div>

  </div>

</template>
<script>
import { getProfitHistoryStateApi } from "@/api/financial/fmsProfitAudit"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import ProfitChargeDetailTable from './ProfitChargeDetailTable'

export default {
	name: "FmsClearChargeDetail",
  components: {
    ProfitChargeDetailTable
  },
	props: {
		chargeList: {
			type: Array,
			default: function() {
        []
      }
		},
    inner: {
      type: Boolean,
      default: false
    }
	},
	data() {
		return {
			loading: false,
			arChargeList: [],
			apChargeList: [],
      sourceAmountsAr: [],
      sourceAmountsAp: [],
      historyStateList: [],
      historyState: '',
      sourceAmountsProfit: [],
      sourceAmountsOfficeProfit: []
		}
	},
	created() {
		this.init()
    this.getBaseDataFn()
	},
	methods: {
    getBaseDataFn() {
      // 当期往期
      getProfitHistoryStateApi().then(res => {
        if(res.ok) {
          this.historyStateList = res.content
        }
      })
    },
    init() {
      let target = this.calcList(this.chargeList)
      this.arChargeList = target.arChargeList
      this.sourceAmountsAr = target.sourceAmountsAr
      this.apChargeList = target.apChargeList
      this.sourceAmountsAp = target.sourceAmountsAp
      this.sourceAmountsProfit = target.sourceAmountsProfit

      if(this.inner) {
        let map = this.chargeList.reduce((arrMap, item) => {
          arrMap[item.settlementOfficeId] = arrMap[item.settlementOfficeId] || {}
          arrMap[item.settlementOfficeId].settlementOfficeId = item.settlementOfficeId
          arrMap[item.settlementOfficeId].settlementOfficeName = item.settlementOfficeName
          arrMap[item.settlementOfficeId].dataList = arrMap[item.settlementOfficeId].dataList || []
          arrMap[item.settlementOfficeId].dataList.push(item)
          return arrMap
        }, {})
        let sourceAmountsOfficeProfit = []
        Object.keys(map).forEach(v => {
          let target = this.calcList(map[v].dataList)
          sourceAmountsOfficeProfit.push({
            settlementOfficeId: map[v].settlementOfficeId,
            settlementOfficeName: map[v].settlementOfficeName,
            sourceAmountsProfit: target.sourceAmountsProfit
          })
        })
        this.sourceAmountsOfficeProfit = sourceAmountsOfficeProfit
      }
    },
		calcList(chargeList) {
      let arChargeList = []
      let apChargeList = []
      let sourceAmountsArMap = {}
      let sourceAmountsApMap = {}
      chargeList.forEach(v => {
        // 全部
        let stateCheck = this.historyState === '' ? true : v.profitChargeHistoryType === this.historyState
        if (v.arAp === 1 && stateCheck) {
          sourceAmountsArMap[v.currency] = (sourceAmountsArMap[v.currency] || 0) + v.amount
          arChargeList.push(v)
        } else if (v.arAp === 2 && stateCheck) { 
          sourceAmountsApMap[v.currency] = (sourceAmountsApMap[v.currency] || 0) + v.amount
          apChargeList.push(v)
        }
      })
      let sourceAmountsAr = []
      let sourceAmountsAp = []
      let sourceAmountsProfit = []
      let sourceAmountsProfitMap = {}
      Object.keys(sourceAmountsArMap).forEach(v => {
        sourceAmountsProfitMap[v] = 0
        sourceAmountsAr.push({
          currency: v,
          value: sourceAmountsArMap[v].toFixed(2)
        })
      })
      Object.keys(sourceAmountsApMap).forEach(v => {
        sourceAmountsProfitMap[v] = 0
        sourceAmountsAp.push({
          currency: v,
          value: sourceAmountsApMap[v].toFixed(2)
        })
      })

      Object.keys(sourceAmountsProfitMap).forEach(v => {
        sourceAmountsProfit.push({
          currency: v,
          value: ((sourceAmountsArMap[v] || 0) - (sourceAmountsApMap[v] || 0)).toFixed(2)
        })
      })
      return {
        arChargeList,
        sourceAmountsAr,
        apChargeList,
        sourceAmountsAp,
        sourceAmountsProfit
      }
      
    },
    stageChange() {
      this.init()
    }
	}
}
</script>
<style lang="scss" scoped>
.clear-charge-detail {
	padding: 0 20px;
  margin-bottom: 20px;
}
.info-section-module {
  margin-bottom: 0px;
  border-radius: unset;

  .info-title {
    color: rgb(21, 126, 213);
  }
}

.MAO {
  display: inline-block;
  border: 2px solid rgb(21, 126, 213);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.UN-CONTENT {
  padding-bottom: 0;
  .info-title {
    margin-bottom: 0;
  }
}
</style>

