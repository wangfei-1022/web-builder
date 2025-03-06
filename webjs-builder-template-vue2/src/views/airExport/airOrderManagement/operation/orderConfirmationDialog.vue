<template>
  <!-- 产品报价编辑 -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.productQuotationEdit')" :visible.sync="visible"
    @close="closeFn" width="900px" v-loading="loading">
    <el-form ref="makingCargoMode" :model="makingCargoMode" label-width="95px" label-position="left"
      class="shippingSpaceForm">
      <el-row>
        <el-col :span="12">
          <!-- 产品分泡(头程) -->
          <el-form-item :label="$t('air.headPartOfTheBubble')" prop="firstProductVolumetric">
            <el-select v-model="makingCargoMode.firstProductVolumetric" size="mini" clearable>
              <el-option v-for="item in customerSplitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 尾程分泡比(尾程) -->
          <el-form-item :label="$t('air.tailSeparationBubble')" prop="lastProductVolumetric">
            <el-select v-model="makingCargoMode.lastProductVolumetric" size="mini" clearable>
              <el-option v-for="item in customerSplitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- 产品备注 -->
          <el-form-item :label="$t('air.productNote')" prop="productRemark" style="width:50%">
            <el-input v-model.trim="makingCargoMode.productRemark" class="job-no-input" size="mini" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form ref="chargeForm" class="order-air-item" :model="makingCargoMode.chargeForm" label-position="left">
      <el-table size="mini" :border="true" :data="makingCargoMode.chargeForm.charges" style="width: 100%; " row-key="id">
        <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].feeItemName`">
              <type-select v-model="row.feeItemName" type="businessFee" :disabled="editStatus()"
                :requestParams="{ businessTypeCode: 'AIR_EXPORT' }" @selected="selectedFee($event, $index)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].unit1`">
              <el-select v-model="row.unit1" size="mini" :disabled="editStatus()">
                <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="currency" :label="$t('receiveFms.currency')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].currency`">
              <el-select v-model="row.currency" size="mini" :disabled="editStatus()">
                <el-option v-for="item in currencyList" :key="item.code" :label="item.code" :value="item.code" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('receiveFms.price')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].price`">
              <el-input v-model="row.price" size="mini" v-input-limit="[-9, 2]" :disabled="editStatus()"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="remark" :label="$t('air.remark')">
          <template slot-scope="{row, $index}">
            <el-form-item :prop="`charges[${$index}].remark`">
              <el-input v-model='row.remark' size="mini" :disabled="editStatus()"></el-input>
            </el-form-item>
          </template>
        </el-table-column>


        <el-table-column prop="oper" :label="$t('receiveFms.operation')" width="60">
          <template slot-scope="{$index }">
            <i class="iconfont icon-minus-circle" v-if="makingCargoMode.chargeForm.charges.length > 1 && !editStatus()"
              @click="deleteFn($index)"></i>
            <i class="iconfont icon-add-circle" v-if="$index === 0 && !editStatus()" @click="addFn($index)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini">{{ $t('air.cancel') }}</el-button>
      <el-button type="primary" @click="submitBaseInfo" size="mini">{{ $t('air.determine') }}</el-button>
    </div>

  </el-dialog>
</template>
<script>
import { getDictDataApi } from '@/api/fmsReceiveAir'
import {
  getCustomerDropDownListApi, getTaxRateListApi
} from '@/api/common'
import { getCurrenciesListApi } from "@/api/common"
import { airOrderAffirmModify, getAirOrderAffirmInfo } from '@/api/airExport'


export default {
  name: 'OrderConfirmationDialog',
  components: {

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: [String, Number],
    order: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.init()
        this.getDetail()
      }
    }
  },
  data () {
    return {
      loading: false,
      customerSplitList: [{
        code: 0.1,
        value: '10%',
        label: '10%'
      }, {
        code: 0.2,
        value: '20%',
        label: '20%'
      }, {
        code: 0.3,
        value: '30%',
        label: '30%'
      }, {
        code: 0.4,
        value: '40%',
        label: '40%'
      }, {
        code: 0.5,
        value: '50%',
        label: '50%'
      }, {
        code: 0.6,
        value: '60%',
        label: '60%'
      }, {
        code: 0.7,
        value: '70%',
        label: '70%'
      }, {
        code: 0.8,
        value: '80%',
        label: '80%'
      }, {
        code: 0.9,
        value: '90%',
        label: '90%'
      }, {
        code: 0.333,
        value: '1/3',
        label: '1/3'
      }, {
        code: 0.666,
        value: '2/3',
        label: '2/3'
      }],
      makingCargoMode: {
        id: "",
        productRemark: "",
        firstProductVolumetric: "",
        lastProductVolumetric: "",
        airOrderExportChargeDtoList: {},
        chargeForm: {
          charges: [{}]
        }
      },
      unitList: [],
      currencyList: []
    }
  },

  methods: {
    // 订单状态为
    editStatus (item) {
      return false

    },
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {
      let vb = false; let ve = false;
      this.$refs.makingCargoMode.validate(valid => {
        if (valid) {
          vb = valid
        }
      })
      this.$refs.chargeForm.validate(valid => {
        if (valid) {
          ve = valid
        }
      })
      if (ve && vb) {
        this.loading = true
        this.makingCargoMode.id = this.id
        this.makingCargoMode.airOrderExportChargeDtoList = this.makingCargoMode.chargeForm.charges
        airOrderAffirmModify(this.makingCargoMode).then(res => {
          if (res && res.ok) {
            this.$emit('refresh')
            this.$message.success(this.$t('air.successSaved'))
            this.closeFn()
          }
          this.loading = false
        })
      }
    },
    init () {
      Promise.all([getDictDataApi(8), getTaxRateListApi(), getCurrenciesListApi()]).then(results => {
        const unitRes = results[0]
        const taxRateRes = results[1]
        const currencyRes = results[2]


        if (unitRes.ok) {
          let unit = [];
          unitRes.content.forEach(v => {
            if (v.code === 1101 || v.code === 2004) {
              unit.push(v)
            }
          })
          this.unitList = unit
        }
        if (taxRateRes.ok) {
          this.taxRateList = taxRateRes.content
        }
        if (currencyRes.ok) {
          this.currencyList = currencyRes.content
        }

      })

    },
    getDetail () {
      this.id = this.$route.query.id
      this.loading = true;
      getAirOrderAffirmInfo(this.id).then(res => {
        if (res.content) {
          this.makingCargoMode.id = this.id
          this.makingCargoMode.firstProductVolumetric = res.content.firstProductVolumetric
          this.makingCargoMode.lastProductVolumetric = res.content.lastProductVolumetric
          this.makingCargoMode.productRemark = res.content.productRemark
          this.makingCargoMode.chargeForm.charges = res.content.apChargeDtoList
        }
        this.loading = false;
      })
    },
    deleteFn (index) {
      this.makingCargoMode.chargeForm.charges.splice(index, 1)
    },
    addFn () {
      this.makingCargoMode.chargeForm.charges.unshift({
        "currency": "CNY"
      })
    },
    selectedFee (charge, index) {
      let item = this.makingCargoMode.chargeForm.charges[index]
      item.feeItemName = charge.chineseName
      item.feeItemCode = charge.code
      this.$set(this.makingCargoMode.chargeForm.charges, index, item)
    }

  }
}
</script>

<style scoped lang="less">
.dialog-footer {
  text-align: center;
}

.basicInfoForm {
  overflow: hidden;

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
</style>
