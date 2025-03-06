<template>
  <!-- 入仓  -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.inbound')" :visible.sync="visible" @close="closeFn"
    width="800px" v-loading="loading">

    <el-form ref="inboundFormRef" :model="inboundModel" :rules="inboundRules" label-width="90px" label-position="left"
      class="basicInfoForm">
      <!-- 入仓编号 -->
      <el-form-item :label="$t('air.inboundNo')" prop="inboundNo">
        <el-input v-model.trim="inboundModel.inboundNo" class="job-no-input" size="mini"
          oninput="value=value.replace(/[^0-9a-zA-Z]/g,'')" maxlength="32" />
      </el-form-item>
      <!-- 操作代码 -->
      <el-form-item :label="$t('air.handlingCode')" prop="handlingCode">
        <el-input v-model.trim="inboundModel.handlingCode" class="job-no-input" size="mini" maxlength="16"
          oninput="value=value.replace(/[^0-9a-zA-Z]/g,'')" />
      </el-form-item>
      <!-- 分单号 -->
      <el-form-item :label="$t('air.hblNoName')" prop="hblNo">
        <el-input v-model.trim="inboundModel.hblNo" class="job-no-input" size="mini" />
      </el-form-item>

      <!-- 装板备注 -->
      <el-form-item :label="$t('air.packingPlateRemark')" prop="loadingPalletRemark" style="width:100%">
        <el-input v-model.trim="inboundModel.loadingPalletRemark" class="job-no-input" size="mini" style="width:100%"
          maxlength="255" />
      </el-form-item>

      <!-- 货物尺寸 -->
      <el-form-item :label="$t('air.cargoSize')" prop="cargoSize" style="width:100%">
        <el-input v-model.trim="inboundModel.cargoSize" class="job-no-input" size="mini" style="width:100%"
          maxlength="255" />
      </el-form-item>
    </el-form>

    <el-table :data="inboundList" :height="300">
      <!-- 件数 -->
      <el-table-column property="quantity" :label="$t('air.number')" width="100">
        <template slot-scope="{ row }">
          <el-input size="mini" v-model="row.actualQuantity" oninput="value=value.replace(/[^\d]/g,'')" :min="1"
            @input="calcChange(row)" />
        </template>
      </el-table-column>
      <!-- 毛重(KGS) -->
      <el-table-column property="weight" :label="$t('air.weightKGS')" width="100">
        <template slot-scope="{ row }">
          <el-input size="mini" v-model="row.actualGrossWeight" oninput="value=value.replace(/[^\d\.]/g,'')" :min="1" />
        </template>
      </el-table-column>
      <!-- 体积(CBM) -->
      <el-table-column property="volume" :label="$t('air.volume')" width="100">
        <template slot-scope="{ row }">
          <el-input size="mini" v-model="row.actualVolume" oninput="value=value.replace(/[^\d\.]/g,'')" :min="1" />
        </template>
      </el-table-column>
      <!-- 长(CM) -->
      <el-table-column property="length" :label="$t('air.length')" width="100">
        <template slot-scope="{ row }">
          <el-input size="mini" v-model="row.length" oninput="value=value.replace(/[^\d\.]/g,'')" :min="1"
            @input="calcChange(row)" />
        </template>
      </el-table-column>
      <!-- 宽(CM) -->
      <el-table-column property="width" :label="$t('air.width')" width="100">
        <template slot-scope="{ row }">
          <el-input size="mini" v-model="row.width" oninput="value=value.replace(/[^\d\.]/g,'')" :min="1"
            @input="calcChange(row)" />
        </template>
      </el-table-column>
      <!-- 高(CM) -->
      <el-table-column property="height" :label="$t('air.height')" min-width="100">
        <template slot-scope="{ row }">
          <el-input size="mini" v-model="row.height" oninput="value=value.replace(/[^\d\.]/g,'')" :min="1"
            @input="calcChange(row)" />
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column property="operation" :label="$t('air.operating')" width="100">
        <template slot-scope="{ row, $index }">
          <div style="padding: 10px">
            <span @click="addItem" class="pointer" v-if="$index === 0">
              <i class="el-icon-circle-plus"></i>
            </span>
            <span @click="delItem(row, $index)" class="pointer" v-else>
              <i class="el-icon-remove"></i>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitFn" size="mini">{{ $t('air.determine') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { inboundAirExportOrderApi, inboundInitAirExportOrderApi } from '@/api/airExport'
import { logServiceName, airLogBusinessType, logOrigin } from '@/utils/constant'
import orderMixin from '../orderMixin'

export default {
  name: 'OutStorageGoods',
  mixins: [orderMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    order: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      inboundModel: {},
      inboundList: [],
      inboundRules: {

      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.inboundInit()
      }
    }
  },
  mounted () { },
  methods: {
    calcChange (row) {
      if (row.actualQuantity && row.height && row.width && row.length) {
        row.actualVolume = (row.actualQuantity * row.height / 100 * row.width / 100 * row.length / 100).toFixed(3)
      }
    },
    inboundInit () {
      this.inboundList = []
      inboundInitAirExportOrderApi(this.orderId).then(res => {
        if (res && res.content) {
          this.inboundModel = res.content.airCargoBaseDto
          if (res.content.airJobExportInboundDTOList.length > 0) {
            this.inboundList = res.content.airJobExportInboundDTOList
          } else {
            this.addItem()
          }
        }
      })

    },
    closeFn () {
      this.$emit('close')
    },
    submitFn () {
      let flag = true
      this.inboundList.forEach(function (v) {
        // || !v.length || !v.width || !v.height
        if (!v.actualVolume || !v.actualQuantity || !v.actualGrossWeight) {
          flag = false
        }
      })
      if (!flag) {
        this.$message.warning(this.$t('air.requiredWeightVolumeNumber'))
        return
      }
      this.$refs.inboundFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          let data = {
            orderId: this.orderId,
            airCargoBaseDto: this.inboundModel,
            airJobExportInboundDTOList: this.inboundList
          }
          console.log("data", data)

          // 添加日志 记录数据
          this.logBtnSend({
            origin: logOrigin.LOGISTICS_LINKS,
            logCode: airLogBusinessType.INBOUND,
            serviceName: logServiceName.AIR_SERVICE,
            businessType: airLogBusinessType.INBOUND,
            content: {
              ...data
            }
          })
          inboundAirExportOrderApi(data).then(res => {
            if (res && res.ok) {
              this.$emit('refresh')
              this.$emit('close')
              this.$message.success(this.$t('air.inboundSuccessfulEnd'))
              this.adjustConfirmFn(this.order)
            }
            this.loading = false
          })
        }
      })

    },
    addItem () {
      let defaultItem = {
        actualQuantity: '',
        actualGrossWeight: '',
        actualVolume: '',
        length: '',
        width: '',
        height: ''
      }
      let item = this.$extends(true, {}, defaultItem)
      this.inboundList.push(item)
    },
    delItem (row, index) {
      this.inboundList.splice(index, 1)
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
