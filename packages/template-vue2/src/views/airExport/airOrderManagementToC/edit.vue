<template>
  <div class="app-main-inner" v-loading="loading">
    <el-form ref="orderForm" :model="order" :rules="orderRules" label-width="95px" label-position="left"
      class="page-form">

      <!-- 货物信息 -->
      <div class="form-module-title">{{ $t('air.orderInformation') }}</div>
      <div class="form-module-item">
        <!-- 预计航班时间 -->
        <el-form-item :label="$t('air.etd')" prop="etd">
          <CommonPicker v-model="order.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
        </el-form-item>
        <!-- 装货港 -->
        <el-form-item :label="$t('air.pol')" prop="polCode">
          <el-row>
            <el-col :span="8">
              <type-select v-model="order.polCode" type="airport" @selected="selectedPol" />
            </el-col>
            <el-col :span="16" style="padding-left: 10px;">
              <el-input v-model="order.pol" class="job-no-input" size="mini" disabled />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 卸货港 -->
        <el-form-item :label="$t('air.pod2')" prop="podCode">
          <el-row>
            <el-col :span="8">
              <type-select v-model="order.podCode" type="airport" @selected="selectedPod" />
            </el-col>
            <el-col :span="16" style="padding-left: 10px;">
              <el-input v-model="order.pod" class="job-no-input" size="mini" disabled />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 委托件数 -->
        <el-form-item :label="$t('air.orderQuantity')" prop="orderQuantity">
          <el-input v-model="order.orderQuantity" class="job-no-input" size="mini" v-input-limit="[-10, 4]" />
        </el-form-item>
        <!-- 委托毛重 -->
        <el-form-item :label="$t('air.orderGrossWeight')" prop="orderGrossWeight">
          <el-input v-model="order.orderGrossWeight" class="job-no-input" size="mini" v-input-limit="[-10, 4]">
            <template slot="append">KGS</template>
          </el-input>
        </el-form-item>
        <!-- 委托体积 -->
        <el-form-item :label="$t('air.orderVolume')" prop="orderVolume">
          <el-input v-model="order.orderVolume" class="job-no-input" size="mini" v-input-limit="[-10, 4]">
            <template slot="append">CBM</template>
          </el-input>
        </el-form-item>
        <!-- 货物类型 -->
        <el-form-item :label="$t('air.cargoType')" prop="cargoType">
          <el-select v-model="order.cargoType" :placeholder="$t('air.placeholder')" size="mini" clearable>
            <el-option :label="$t('air.generalCargo')" value="0"></el-option>
            <el-option :label="$t('air.dangerousGoods')" value="1"></el-option>
            <el-option :label="$t('air.refrigeratedGoods')" value="2"></el-option>
            <el-option :label="$t('air.overweightCargo')" value="3"></el-option>
            <el-option :label="$t('air.hangGarment')" value="4"></el-option>
          </el-select>
        </el-form-item>
        <!-- 包装类型 -->
        <el-form-item :label="$t('air.packType2')" prop="packType">
          <type-select v-model="order.packType" type="trade" termCode="PACKTYPE" />
        </el-form-item>
        <!-- 订舱备注 -->
        <el-form-item :label="$t('air.remarks')">
          <el-input v-model="order.bookingRemark" class="job-no-input" size="mini" type="textarea" rows="3" />
        </el-form-item>

        <!-- 货物英文品名 -->
        <el-form-item :label="$t('air.cargoEnName')">
          <el-input v-model="order.cargoEnName" class="job-no-input" size="mini" type="textarea" rows="3" />
        </el-form-item>
        <!-- 货物中文品名 -->
        <el-form-item :label="$t('air.cargoCnName')">
          <el-input v-model="order.cargoCnName" class="job-no-input" size="mini" type="textarea" rows="3" />
        </el-form-item>
        <!-- 托盘尺寸 -->
        <el-form-item :label="$t('air.palletSizes')">
          <el-input v-model="order.palletSizes" class="job-no-input" size="mini" type="textarea" rows="3" />
        </el-form-item>

      </div>

      <div class="operation-btn">
        <el-button type="primary" @click="addOrder">{{ $t('air.save') }}</el-button>
        <el-button @click="cancel">{{ $t('air.cancel') }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { addAirOrderExportsaveC2, addAirExportInitApi, getAirLineList, crmCustomerLinkman } from '@/api/airExport'
import { airLineListApi, getCustomerDropDownListByJob, airportListApi, getCustomerDropDownListApi } from '@/api/common'

import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import ElectronicFile from '../components/electronicFile'
import { validEmail } from "@/utils/validate"

export default {
  name: 'AirOrderManagementToCEdit',
  components: { cargoLimitedSelect, ElectronicFile },
  props: {},
  data () {
    return {
      loading: false,
      jobId: null,
      type: null,
      customerMethod: getCustomerDropDownListByJob,
      airCustomerMethod: airLineListApi,
      customerMethodParams: {
        billType: '1'
      },
      productAirlineNameList: [],
      contactList: [],
      order: {

        cargoCnName: '', // 货品中文名
        cargoEnName: '', // 货品英文名
        cargoType: '', // 货物类型;1-普货;2-危险品;3-温控货品;4-超大件
        orderGrossWeight: '', // 委托毛重
        orderQuantity: '', // 委托件数
        orderVolume: '', // 委托体积
        packType: '', // 包装类型
        palletSizes: '', // 托盘尺寸

        etd: '', // 预计开航日期
        flightNo: '', // 航班
        pod: '', // 卸货港/pod描述
        podCode: '', // 卸货港/pod代码
        pol: '', // 起运港描述
        polCode: '', // 起运港代码
        receipt: '', // 交货地
        receiptCode: '', // 交货地代码
        delivery: '', // 收货地
        deliveryCode: '', // 收货地港代码
        bookingRemark: '', // 订舱备注
        productAirlineName: "", // 产品航线名称
        productAirlineId: "", // 产品航线id
        customerId: "",
        customerName: "",
        signDesc: "",
        customerLevel: ""
      },
      orderRules: {

        "orderQuantity": [{ required: true, message: this.$t('air.requiredOrderQuantity'), trigger: 'blur' }],
        "orderGrossWeight": [{ required: true, message: this.$t('air.requiredOrderGrossWeight'), trigger: 'blur' }],
        "orderVolume": [{ required: true, message: this.$t('air.requiredOrderVolume'), trigger: 'blur' }],
        "polCode": [{ required: true, message: this.$t('air.requiredPol'), trigger: 'blur' }],
        "podCode": [{ required: true, message: this.$t('air.requiredPod'), trigger: 'blur' }],
        "etd": [{ required: true, message: this.$t('air.requiredEtd'), trigger: 'blur' }]
        // "cargoType": [{ required: true, message: this.$t('air.requiredCargoType'), trigger: 'blur' }]

      }
    }
  },

  created () {
    this.loading = true
    // 产品航线列表
    getAirLineList().then(res => {
      this.productAirlineNameList = res.content
    })

    // 默认委托单位 深圳一海通全球供应链管理有限公司 深圳市一海通进出口贸易有限公司
    getCustomerDropDownListApi({ name: "深圳一海通全球供应链管理有限公司" }).then(res => {
      if (res.content && res.content.length > 0) {
        this.order.customerId = res.content[0].id
        this.order.customerName = res.content[0].chineseName
        if (this.order.customerId) {
          crmCustomerLinkman(this.order.customerId).then(res => {
            this.order.signDesc = res.content.directCustomerTypeDesc
            this.order.customerLevel = res.content.directCustomerType
            this.loading = false
          })
        }
      } else {
        this.$message.warning("请维护客户数据：深圳一海通全球供应链管理有限公司");
        this.loading = false
      }
    })
    if (this.$route.query.id) {
      this.jobId = this.$route.query.id
      this.type = this.$route.query.type
      this.init()
    }
  },
  mounted () {

  },
  methods: {

    init () {
      addAirExportInitApi(this.jobId).then(res => {
        let order = res.content
        if (this.type === 'copy') {
          this.order.etd = order.etd // 预计航班时间
          this.order.polCode = order.polCode // 装货港
          this.order.pol = order.pol // 装货港
          this.order.podCode = order.podCode // 卸货港
          this.order.pod = order.pod // 卸货港
          this.order.cargoType = order.cargoType + "" // 货物类型
          this.order.cargoEnName = order.cargoEnName // 货物英文品名
          this.order.cargoCnName = order.cargoCnName // 货物中文品名
        }
      })

    },
    // 收货地
    selectedRec (port) {
      this.order.receipt = port.englishName
    },
    // 交货港
    selectedDelivery (port) {
      this.order.delivery = port.englishName
    },

    selectedPol (port) {
      this.order.pol = port.englishName
    },
    selectedPod (port) {
      this.order.pod = port.englishName

      if (!this.order.receiptCode) {
        this.order.receiptCode = port.code3 // 交货地
        this.order.receipt = port.englishName // 交货地
      }

    },
    addOrder () {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          this.loading = true
          let data = this.order
          let fn = addAirOrderExportsaveC2
          if (!this.order.customerId) {
            this.$message.warning("请维护客户数据：深圳一海通全球供应链管理有限公司");
            return
          }
          fn(data).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('air.newSuccess'))
              this.backList()
            }
            this.loading = false
          })
        }
      })
    },
    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirOrderManagementToC` })
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
</style>
