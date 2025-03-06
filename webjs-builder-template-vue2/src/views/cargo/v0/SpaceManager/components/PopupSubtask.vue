<template>
  <div class="popup-wrap">
    <div class="expend-icon-wrap" @click="popupDialog">
      <i class="iconfont icon-zhankai" v-show="!expended"></i>
      <i class="iconfont icon-shouhui" v-show="expended"></i>
    </div>
    <el-dialog
      :title="`${params.data.policyName} - ${$t('spaceRule.spaceRuleList.subtaskText')}`"
      width="1000px"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="expended">
      <el-table
        :data="dataList"
        style="width: 100%;"
        height="400"
        :row-class-name="tableRowClassName">
        <el-table-column
          type="index"
          fixed
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          prop="porCityName"
          :label="$t('spaceRule.polCode')"
          width="180"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          fixed
          prop="fndCityName"
          :label="$t('spaceRule.podCode')"
          width="180"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="containerType"
          :label="$t('spaceRule.containerType')"
          width="80"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="containerQuantity"
          :label="$t('spaceRule.containerRequireQuantity')"
          width="80"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="successQuantity"
          :label="$t('spaceRule.spaceRuleList.successQuantity')"
          width="80"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="etd"
          :label="$t('spaceRule.etd')"
          width="140"
          align="center"
          header-align="center">
          <template slot-scope="scope">
            {{scope.row.etd | formatDate(vm)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="eta"
          :label="$t('spaceRule.eta')"
          width="140"
          align="center"
          header-align="center">
          <template slot-scope="scope">
            {{scope.row.eta | formatDate(vm)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="vessel"
          :label="$t('spaceRule.vesselName')"
          width="80"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="voyage"
          :label="$t('spaceRule.voyageNo')"
          width="80"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('spaceRule.spaceRuleList.priceRange')"
          width="100"
          align="center"
          header-align="center">
          <template slot-scope="scope">
            {{ filterPrice(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('spaceRule.spaceRuleList.statusText')"
          width="80"
          align="center"
          header-align="center">
          <template slot-scope="scope">
            {{scope.row.containerStatus | statusText}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('spaceRule.spaceRuleList.processCount')"
          width="80"
          align="center"
          header-align="center">
          <template slot-scope="scope">
            {{ filterNumber(scope.row.containerStatus, vm)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('spaceRule.spaceRuleList.successCount')"
          width="80"
          align="center"
          header-align="center">
          <template slot-scope="scope">
            {{ filterNumber(scope.row.containerStatus, vm)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('spaceRule.spaceRuleList.successRate')"
          width="80"
          align="center"
          header-align="center">
          <template slot-scope="scope">
            {{ filterNumber(scope.row.containerStatus,vm)}}%
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { getSubtaskListApi } from '@/api/spaceManager'
export default {
  name: 'PopupSubtask',
  data() {
    return {
      expended: false,
      dataList: [],
      vm: this
    }
  },
  computed: {
  },
  filters: {
    formatDate(val, vm) {
      if (val) {
        return vm.$moment(Number(val)).format('YYYY-MM-DD HH:mm')
      }
      return ""
    }
  },
  methods: {
    filterNumber(val, vm) {
      if (vm.params.data.ruleTypeName == this.$t('spaceRule.spaceRuleList.subscribeSpace') || !val) {
        return 'N/A'
      } else {
        return val
      }
    },
    statusText(val) {
      let _statusText = ''
      switch (val) {
        case 1: _statusText = this.$t('spaceRule.spaceRuleList.unStart'); break;
        case 2: _statusText = this.$t('spaceRule.spaceRuleList.processing'); break;
        case 3: _statusText = this.$t('spaceRule.spaceRuleList.finished'); break;
        case 4: _statusText = this.$t('spaceRule.spaceRuleList.stoped'); break;
        default: _statusText = this.$t('spaceRule.spaceRuleList.unStart'); break;
      }
      return _statusText
    },
    filterPrice(obj) {
      if (obj.highestPrice && obj.lowerPrice) {
        return `${obj.lowerPrice}-${obj.highestPrice}`
      } else if (obj.highestPrice) {
        return `${this.$t('spaceRule.lessThan')}${obj.highestPrice}`
      } else if (obj.lowerPrice) {
        return `${this.$t('spaceRule.moreThan')}${obj.lowerPrice}`
      } else {
        return this.$t('spaceRule.unLimited')
      }
    },
    async popupDialog() {
      this.params.showLoading()
      const res = await getSubtaskListApi(this.params.data.id)
      if (res.ok) {
        this.dataList = res.content
      }
      if (!this.expended) {
        this.expended = true
      }
      this.params.closeLoading()
    },
    tableRowClassName({row, rowIndex}) {
      return row.containerStatus === 3 ? 'done-row' : ''
    }
  },
  mounted() {}
}
</script>
<style scoped lang="scss">
  .expend-icon-wrap{
    cursor: pointer;
  }
  ::v-deep.el-table {
    font-weight: bolder;
    .done-row{
      .cell {
        color: green;
      }
    }
  }
</style>
