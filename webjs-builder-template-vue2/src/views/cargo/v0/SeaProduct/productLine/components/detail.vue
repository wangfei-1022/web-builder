<template>
  <!-- 详情 -->
  <el-dialog :close-on-click-modal="false" :title="$t('seaProduct.productLine')" :visible="visible" @close="closeFn"
    width="980px" v-loading="loading">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="90px" label-position="left"
      class="basicInfoForm">
      <!-- 运输类型 -->
      <el-form-item :label="$t('seaProduct.transportMode')" prop="transportMode" size="mini"
        :rules="[{ required: true, message: $t('seaQuotationExport.placeholder'), trigger: 'change' }]">
        <el-select v-model="formModel.transportMode" :placeholder="$t('seaQuotationExport.placeholder')" disabled>
          <el-option :label="$t('seaProduct.linerTrade')" value=10></el-option>
          <el-option :label="$t('seaProduct.tailoredTransportation')" value=20></el-option>
        </el-select>
      </el-form-item>

      <!-- 起运港 -->
      <el-form-item :label="$t('seaProduct.pol')" prop="polCode"
        :rules="[{ required: true, message: $t('seaQuotationExport.placeholder'), trigger: 'change' }]">
        <el-row>
          <el-col :span="10">
            <type-select v-model="formModel.polCode" type="seaport" @selected="selectedPol" size="mini" disabled />
          </el-col>
          <el-col :span="14" style="padding-left: 10px">
            <el-input v-model="formModel.pol" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 目的港 -->
      <el-form-item :label="$t('seaProduct.pod')" prop="podCode"
        :rules="[{ required: true, message: $t('seaQuotationExport.placeholder'), trigger: 'change' }]">
        <el-row>
          <el-col :span="10">
            <type-select v-model="formModel.podCode" type="seaport" @selected="selectedPod" size="mini" disabled />
          </el-col>
          <el-col :span="14" style="padding-left: 10px">
            <el-input v-model="formModel.pod" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 中转类型 -->
      <el-form-item :label="$t('seaProduct.transType')" prop="transType" size="mini"
        :rules="[{ required: true, message: $t('seaQuotationExport.placeholder'), trigger: 'change' }]">
        <el-select v-model="formModel.transType" :placeholder="$t('seaQuotationExport.placeholder')"
          @change="changeTransType" disabled>
          <el-option :label="$t('seaProduct.through')" value=10></el-option>
          <el-option :label="$t('seaProduct.transfer')" value=20></el-option>
        </el-select>
      </el-form-item>

      <!-- 转运次数 -->
      <el-form-item :label="$t('seaProduct.transitNumber')" prop="transitNumber" size="mini">
        <el-select v-model="formModel.transitNumber" :placeholder="$t('seaQuotationExport.placeholder')"
          @change="changeTransit" disabled>
          <el-option :label="$t('seaProduct.transfer') + 1 + $t('seaProduct.numberTimes')" value=1></el-option>
          <el-option :label="$t('seaProduct.transfer') + 2 + $t('seaProduct.numberTimes')" value=2></el-option>
          <el-option :label="$t('seaProduct.transfer') + 3 + $t('seaProduct.numberTimes')" value=3></el-option>
          <el-option :label="$t('seaProduct.transfer') + 4 + $t('seaProduct.numberTimes')" value=4></el-option>
          <el-option :label="$t('seaProduct.transfer') + 5 + $t('seaProduct.numberTimes')" value=5></el-option>
          <el-option :label="$t('seaProduct.transfer') + 6 + $t('seaProduct.numberTimes')" value=6></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('seaProduct.transitPort') + '-' + (num + 1)" v-for="(item, num) in transportList" :key="num"
        :rules="[{ required: true, message: $t('seaQuotationExport.placeholder') }]">
        <el-row>
          <el-col :span="10">
            <type-select v-model="item.transCode" type="seaport" @selected="selectedTrans($event, num)" size="mini"
              disabled />
          </el-col>
          <el-col :span="14" style="padding-left: 10px">
            <el-input v-model="item.trans" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
<script>
import { getSeaProductLineDetailApi, editSeaProductLineApi } from '@/api/seaProduct'

export default {
  name: 'ProductLineView',
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
      formModel: {
        pol: "",
        polCode: "",
        pod: "",
        podCode: "",
        transType: "",
        transJson: "",
        transitNumber: "",
        transportMode: ""
      },
      transportList: [],
      formRules: {

      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    async init () {
      this.loading = false
      const res = await getSeaProductLineDetailApi(this.orderId)
      if (res && res.ok) {
        this.formModel = res.content
        this.formModel.transType = res.content.transType + ""
        this.formModel.transitNumber = Number(res.content.transitNumber) === 0 ? "" : res.content.transitNumber + ""
        this.formModel.transportMode = res.content.transportMode + ""
        this.transportList = JSON.parse(res.content.transJson)
      }
    },
    changeTransType (item) {
      if (Number(item) === 10) {
        this.transportList = []
        this.formModel.transitNumber = ""
      }
    },
    changeTransit (num) {
      this.transportList = []
      for (let i = 0; i < num; i++) {
        let trans = {
          trans: "",
          transCode: "",
          serial: 0
        }
        this.transportList.push(trans)
      }
    },
    selectedTrans (item, num) {
      this.transportList[num].trans = item.englishName
      this.transportList[num].serial = num
    },
    closeFn () {
      this.$emit('close')
    },
    selectedPol (port) {
      this.formModel.pol = port.englishName
    },
    selectedPod (port) {
      this.formModel.pod = port.englishName
    }
  }
}
</script>

<style scoped lang="less">
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
