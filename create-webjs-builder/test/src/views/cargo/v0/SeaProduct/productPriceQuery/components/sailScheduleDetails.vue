<template>
  <!-- 船期信息  -->
  <el-dialog :close-on-click-modal="false" :title="$t('seaProduct.shipScheduleInformation')" :visible="visible"
    @close="closeFn" width="900px">

    <el-table :data="dataList" :height="300" :border="true">
      <el-table-column prop="vessel" :label="$t('seaProduct.vessel')">
      </el-table-column>
      <el-table-column prop="voyage" width="100" :label="$t('seaProduct.voyage')">
      </el-table-column>
      <el-table-column prop="routeCode" width="100" :label="$t('seaProduct.routeCode')">
      </el-table-column>
      <el-table-column prop="etd" width="100" label="ETD">
      </el-table-column>
      <el-table-column prop="eta" width="100" label="ETA">
      </el-table-column>
      <el-table-column prop="scheduleDesc" width="80" :label="$t('seaProduct.schedule')">
      </el-table-column>
      <el-table-column prop="voyageDays" width="80" :label="$t('seaProduct.voyageDays')">
      </el-table-column>
      <el-table-column prop="stateDesc" width="80" :label="$t('seaProduct.state')">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { getSailScheduleDetailListByPriceCardApi } from '@/api/seaProduct'
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: 'SeaSailScheduleDetails',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    priceCardId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      dataList: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.dataList = []
        this.init()
      }
    }
  },
  mounted () { },
  methods: {

    init () {
      this.dataList = []
      getSailScheduleDetailListByPriceCardApi(this.priceCardId).then(res => {
        if (res && res.content) {
          res.content.forEach(v => {
            try {
              v.etd = parseTime(v.etd, '{y}-{m}-{d}')
              v.eta = parseTime(v.eta, '{y}-{m}-{d}')
            } catch (e) {
              console.log(e)
            }
          })
          this.dataList = res.content

        }
      })

    },
    closeFn () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.basicInfoForm {
  overflow: hidden;
  border-bottom: 3px #a29fa0 solid;

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

.pointer {
  cursor: pointer;
}

.el-icon-circle-plus {
  color: rgb(0, 153, 51);
  font-size: 20px;
}

.el-icon-remove {
  color: red;
  font-size: 20px;
}
</style>
