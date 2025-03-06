<template>
  <!-- 入仓  -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.inbound')" :visible.sync="visible" @close="closeFn"
    width="800px" v-loading="loading">

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

export default {
  name: 'OutStorageGoods',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      inboundList: []
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
      inboundInitAirExportOrderApi(this.orderId).then(res => {
        if (res && res.content && res.content.length > 0) {
          this.inboundList = res.content
        } else {
          this.addItem()
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
      let data = {
        orderId: this.orderId,
        list: this.inboundList
      }
      this.loading = true
      inboundAirExportOrderApi(data).then(res => {
        if (res && res.ok) {
          this.$emit('refresh')
          this.$emit('close')
          this.$message.success(this.$t('air.inboundSuccessfulEnd'))
        }
        this.loading = false
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
