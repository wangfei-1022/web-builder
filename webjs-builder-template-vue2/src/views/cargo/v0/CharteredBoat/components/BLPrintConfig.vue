<template>
  <div>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="$t('boatBlList.blPrint')" width="550px">
      <el-form v-if="dialogVisible" ref="formData" label-width="90px" label-position="left" :model="formData">
        <el-form-item :label="`${$t('charteredBoat.blNo')}：`" required>
          <span>{{ detail.blNo }}</span>
        </el-form-item>
        <el-form-item :label="`${$t('boatBlList.blFormat')}：`" prop="blPrintStyle" :rules="[{required:true,message: this.$t('boatBlList.blFormatEmptyError')}]">
          <el-radio-group
            v-model="formData.blPrintStyle"
            @change="blPrintStyleChange"
          >
            <el-radio :label="1">{{$t('boatBlList.nameOfHaite')}}</el-radio>
            <el-radio :label="2">{{$t('boatBlList.nameOfYihaitong')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.blPrintStyle===1" label="M/H BL：" prop="blPrintType" :rules="[{required:true,message: $t('charteredBoat.sampleError')}]">
          <el-radio-group v-model="formData.mhBlVal">
            <el-radio :label="1">{{$t('boatBlList.MBLText')}}</el-radio>
            <el-radio :label="2">{{$t('boatBlList.HBLText')}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.blPrintStyle===1 && formData.mhBlVal === 2 && detail.blNo.substring(0,3) === 'YHT' " :label="`${$t('boatBlList.blPrefix')}`" prop="blPrefix" :rules="[{required:true,message: $t('boatBlList.blPrefixEmptyError')}]">
          <el-radio-group v-model="formData.blPrefix">
            <el-radio :label="1">{{$t('boatBlList.COSLText')}}</el-radio>
            <el-radio :label="2">{{$t('boatBlList.YHTText')}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="`${$t('boatBlList.sailingStart')}：`" prop="openDateType" :rules="[{required:true,message: $t('boatBlList.sailingStartEmptyError')}]">
          <el-radio-group v-model="formData.openDateType">
            <el-radio v-if="$isNotEmpty(detail.atd)" :label="2">
              {{$t('boatBlList.ATDText')}} <span>( {{ detail.atd | formatDate('YYYY-MM-DD') }})</span>
            </el-radio>
            <el-radio v-else :label="1">
              {{$t('charteredBoat.etd')}}({{ detail.etd | formatDate('YYYY-MM-DD') }})
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.blPrintStyle===1" :label="`${$t('charteredBoat.blType')}：`" prop="blPrintType" :rules="[{required:true, message: $t('boatBlList.blTypeEmptyError')}]">
          <el-radio-group v-model="formData.blPrintType">
            <el-radio :label="1">{{$t('boatBlList.blTypeCopy')}}</el-radio>
            <el-radio :label="2">{{$t('boatBlList.blTypeOrignal')}}</el-radio>
            <el-radio :label="3">{{$t('boatBlList.blTypeSeaWayBill')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.blPrintStyle===2" :label="`${$t('boatBlList.blPrintType')}：`" prop="blPrintType" :rules="[{required:true,message:$t('boatBlList.blPrintTypeEmptyError')}]">
          <el-radio-group v-model="formData.blPrintType">
            <el-radio :label="1">{{$t('boatBlList.blSample')}}</el-radio>
            <el-radio v-if="$isNotEmpty(detail.atd)" :label="2">{{$t('boatBlList.blOriginal')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="`${$t('boatBlList.chooseFormat')}：`" prop="outFormat" :rules="[{required:true,message: $t('boatBlList.formatEmptyError')}]">
          <el-radio-group
            v-model="formData.outFormat"
          >
            <el-radio :label="1">{{$t('boatBlList.excelFile')}}</el-radio>
            <el-radio :label="2">{{$t('boatBlList.pdfFile')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :disabled="loading" @click="saveForm('formData')">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" @click="dialogVisible = false">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { billDetail, billPrint } from '@/api/bl.js'
export default {
  name: 'BLPrintConfig',
  props: {
    id: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const defaultForm = {
      billId: null,
      blPrintStyle: 2, // 默认一海通
      mhBlVal: 2, // 默认MBL
      blPrintType: 1, // 默认样单
      openDateType: 2, // 默认选择atd，
      blPrefix: '',
      outFormat: 1
    }
    return {
      defaultForm,
      loading: false,
      dialogVisible: false,
      formData: this.$extends({}, defaultForm),
      detail: {
        blNo: '',
        etd: null,
        atd: null
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
    async visible(val) {
      if (val) {
        this.formData = this.$extends({}, this.defaultForm)
        const res = await billDetail(this.id)
        if (res.ok) {
          res.content.atd = res.content.atd || null
          res.content.etd = res.content.etd || null
          this.$copyProps(this.detail, res.content)
          // 默认选择atd  atd为空时 选择 etd
          if (this.$isEmpty(this.detail.atd)) {
            this.formData.openDateType = 1
          }
        }
      }
      this.dialogVisible = val
    }
  },
  methods: {
    /**
     * 保存接口
     */
    saveForm(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.loading = true
          this.formData.billId = this.id
          if (this.formData.blPrintStyle === 2) {
            delete this.formData.mhBlVal
          }
          billPrint(this.formData).then(res => {
            this.loading = false
            if (res.ok) {
              this.$message.success(this.$t('charteredBoat.saveSuccess'))
              this.dialogVisible = false
              window.open(res.content)
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 提单格式
     */
    blPrintStyleChange(val) {
      // 一海通 默认样单 海特默认 copy
      this.formData.blPrintType = 1
    }
  }

}
</script>

<style>

</style>
