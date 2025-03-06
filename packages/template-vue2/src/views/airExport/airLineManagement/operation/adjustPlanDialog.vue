<template>
  <!-- 到港 -->
  <el-dialog :close-on-click-modal="false" :title="$t('air.adjustPlan')" :visible.sync="visible" @close="closeFn"
    width="800px" v-loading="loading">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" class="makingCargoPlanMode"
      label-position="left">
      <!-- 航班号 -->
      <el-form-item :label="$t('air.flightNo')" prop="flightNo"
        :rules="[{ required: true, message: $t('air.requiredFlightNo'), trigger: 'change' }]">
        <el-input v-model.trim="formModel.flightNo" class="job-no-input" size="mini" />
      </el-form-item>
      <!-- 航班时间 -->
      <el-form-item :label="$t('air.etd')" prop="etd"
        :rules="[{ required: true, message: $t('air.requiredEtd'), trigger: 'change' }]">
        <CommonPicker v-model="formModel.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
      </el-form-item>
      <!-- 考核基重 -->
      <el-form-item :label="$t('air.assessmentBasisWeight')" prop="assessWeight"
        :rules="[{ required: true, message: $t('air.pleaseEnter'), trigger: 'change' }]">
        <el-input v-model.trim="formModel.assessWeight" class="job-no-input" size="mini" />
      </el-form-item>
      <!-- 理论装载体积 -->
      <el-form-item :label="$t('air.theoreticalVolume')" prop="theoryVolume"
        :rules="[{ required: true, message: $t('air.pleaseEnter'), trigger: 'change' }]">
        <el-input v-model.trim="formModel.theoryVolume" class="job-no-input" size="mini" />
      </el-form-item>
      <!-- 板内板外 -->
      <el-form-item :label="$t('air.palletSide')" prop="palletSide">
        <el-select v-model="formModel.palletSide" size="mini" style="width:100%">
          <el-option v-for="item in palletSideList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('air.remark')" prop="remark">
        <el-input v-model.trim="formModel.remark" class="job-no-input" size="mini" />
      </el-form-item>
      <!-- 板型 -->
      <el-form-item :label="$t('air.plateCut')" prop="boardModel">
        <el-input v-model="formModel.boardModel" size="mini"></el-input>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn">{{ $t('air.cancel') }} </el-button>
      <el-button type="primary" @click="submitBaseInfo">{{ $t('air.determine') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import {
  putAirFlightPlan
} from "@/api/airExport";
export default {
  name: 'AdjustPlanDialog',
  components: {

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    order: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  watch: {
    visible (val) {
      console.log(2345)
      this.formModel = this.order
    }
  },

  data () {
    return {
      palletSideList: [{
        code: 1,
        name: this.$t('air.inThePlate')
      }, {
        code: 2,
        name: this.$t('air.offBoard')
      }],
      weekList: [this.$t('air.SUN'), this.$t('air.MON'), this.$t('air.TUE'), this.$t('air.WED'), this.$t('air.THUR'), this.$t('air.FRI'), this.$t('air.SAT')],
      loading: false,
      formModel: {
      },
      formRules: {
      }
    }
  },

  methods: {
    closeFn () {
      this.$emit('close')
    },
    submitBaseInfo () {

      let data = this.formModel
      data.etdDayWeek = this.weekList[new Date(Number(this.formModel.etd)).getDay()]
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.loading = true
          putAirFlightPlan(this.order.id, data).then(res => {
            if (res && res.ok) {
              this.$message.success(this.$t('air.adjustSuccess'))
              this.$emit('refresh')
            }
            this.$emit('close')
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.makingCargoPlanMode {
  overflow: hidden;

  ::v-deep .el-form-item {
    width: 50%;
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
