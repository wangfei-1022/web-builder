<template>
  <!-- 新增产品线路 -->
  <el-dialog :close-on-click-modal="false" :title="$t('seaProduct.productLineAdd')" :visible.sync="visible"
    @close="closeFn" width="980px" v-loading="loading">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="90px" label-position="left"
      class="basicInfoForm">
      <!-- 运输类型 -->
      <el-form-item :label="$t('seaProduct.transportMode')" prop="transportMode" size="mini"
        :rules="[{ required: true, message: $t('seaQuotationExport.placeholder'), trigger: 'change' }]">
        <el-select v-model="formModel.transportMode" :placeholder="$t('seaQuotationExport.placeholder')">
          <el-option :label="$t('seaProduct.linerTrade')" value=10></el-option>
          <el-option :label="$t('seaProduct.tailoredTransportation')" value=20></el-option>
        </el-select>
      </el-form-item>

      <!-- 起运港 -->
      <el-form-item :label="$t('seaProduct.pol')" prop="polCode"
        :rules="[{ required: true, message: $t('seaQuotationExport.placeholder'), trigger: 'change' }]">
        <el-row>
          <el-col :span="10">
            <type-select v-model="formModel.polCode" type="seaport" @selected="selectedPol" size="mini" />
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
            <type-select v-model="formModel.podCode" type="seaport" @selected="selectedPod" size="mini" />
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
          @change="changeTransType">
          <el-option :label="$t('seaProduct.through')" value=10></el-option>
          <el-option :label="$t('seaProduct.transfer')" value=20></el-option>
        </el-select>
      </el-form-item>

      <!-- 转运次数 -->
      <el-form-item :label="$t('seaProduct.transitNumber')" prop="transitNumber" size="mini">
        <el-select v-model="formModel.transitNumber" :placeholder="$t('seaQuotationExport.placeholder')"
          :disabled="Number(formModel.transType) === 10" @change="changeTransit">
          <el-option :label="$t('seaProduct.transfer') + 1 + $t('seaProduct.numberTimes')" value=1></el-option>
          <el-option :label="$t('seaProduct.transfer') + 2 + $t('seaProduct.numberTimes')" value=2></el-option>
          <el-option :label="$t('seaProduct.transfer') + 3 + $t('seaProduct.numberTimes')" value=3></el-option>
          <el-option :label="$t('seaProduct.transfer') + 4 + $t('seaProduct.numberTimes')" value=4></el-option>
          <el-option :label="$t('seaProduct.transfer') + 5 + $t('seaProduct.numberTimes')" value=5></el-option>
          <el-option :label="$t('seaProduct.transfer') + 6 + $t('seaProduct.numberTimes')" value=6></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('seaProduct.transitPort') + '-' + (num + 1)" v-for="(item, num) in transportList"
        :key="num" :rules="[{ required: true, message: $t('seaQuotationExport.placeholder') }]">
        <el-row>
          <el-col :span="10">
            <type-select v-model="item.transCode" type="seaport" @selected="selectedTrans($event, num)" size="mini" />
          </el-col>
          <el-col :span="14" style="padding-left: 10px">
            <el-input v-model="item.trans" class="job-no-input" size="mini" disabled />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn">{{ $t('air.cancel') }} </el-button>
      <el-button type="primary" @click="submitBaseInfo">{{ $t('air.determine') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveSeaProductLineApi } from '@/api/seaProduct'

export default {
  name: 'ProductLineAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    visible (val) {
      if (val) {
        this.formModel = {
          pol: "",
          polCode: "",
          pod: "",
          podCode: "",
          transType: "",
          transJson: "",
          transitNumber: "",
          transportMode: ""
        }
      }
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

  methods: {
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
      this.transportList[num].serial = num + 1
    },
    closeFn () {
      this.$emit('close')
    },
    selectedPol (port) {
      this.formModel.pol = port.englishName
    },
    selectedPod (port) {
      this.formModel.pod = port.englishName
    },
    async submitBaseInfo () {

      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.loading = true
          this.formModel.transitNumber = this.$isEmpty(this.formModel.transitNumber) ? 0 : this.formModel.transitNumber
          let flag = false
          if (Number(this.formModel.transType) === 20) {
            this.transportList.forEach((trans, num) => {
              if (this.$isEmpty(trans.trans)) {
                flag = true
              }
            })
          }
          if (flag) {
            this.$message.warning(this.$t("seaProduct.addTransportWarming"))
            this.loading = false
            return
          }
          this.formModel.transJson = JSON.stringify(this.transportList)
          const res = await saveSeaProductLineApi(this.formModel)
          if (res && res.ok) {
            this.$emit('refresh')
            this.$message.success(this.$t('seaProduct.successSaved'))
            this.closeFn()
          }
          this.loading = false
        }
      })
      this.loading = false
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
