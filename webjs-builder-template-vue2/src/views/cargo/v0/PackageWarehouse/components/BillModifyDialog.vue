<template>
  <div>
    <el-dialog
    :visible.sync="showDialog"
    width="800px"
    :title="title"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form ref="editForm" :model="editForm" :rules="editFormRule" size="mini" label-width="90px" label-position="right" style="width: 100%;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.billNo')}: `" prop="billNo">
              <el-input v-model="editForm.billNo" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.totalQuantity')}: `" prop="totalQuantity">
              <el-input v-model="editForm.totalQuantity" type="text" :placeholder="$t('common.placeholder')" oninput="value=value.replace(/[^\d]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.totalWeight')}: `" prop="totalWeight">
              <el-input v-model="editForm.totalWeight" type="text" oninput="value=value.replace(/[^\d.-]/g,'')" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.totalVolume')}: `" prop="totalVolume">
              <el-input v-model="editForm.totalVolume" type="text" oninput="value=value.replace(/[^\d.-]/g,'')" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.bookingAgent')}: `" prop="bookingAgent">
              <el-input v-model="editForm.bookingAgent" type="text" :placeholder="$t('common.placeholder')"  clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.bulkyCargoPercentage')}: `" prop="bulkyCargoPercentage">
              <el-input v-model="editForm.bulkyCargoPercentage" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.totalCost')}: `" prop="totalCost">
              <el-input v-model="editForm.totalCost" type="text" oninput="value=value.replace(/[^\d.-]/g,'')" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.airlines')}: `" prop="airlines">
              <el-input v-model="editForm.airlines" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.etd')}: `" prop="etd">
              <CommonPicker
                v-model="editForm.etd"
                pikcer-type="date"
                clearable
                />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.flightNo')}: `" prop="flightNo">
              <el-input v-model="editForm.flightNo" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.polCode')}: `" prop="polCode">
              <el-input v-model="editForm.polCode" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billList.podCode')}: `" prop="podCode">
              <el-input v-model="editForm.podCode" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="checkForm" v-show="!disabled">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { createBillApi, getBillDetailApi, updateBillDetailApi } from '@/api/planManager'
export default {
  name: 'BillModifyDialog',
  props: {
    opreator: {
      type: String,
      default: 'create'
    }
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      editForm: {
        planId: '',
        billNo: '',
        totalQuantity: '',
        totalWeight: '',
        totalVolume: '',
        bookingAgent: '',
        bulkyCargoPercentage: '',
        totalCost: '',
        airlines: '',
        etd: null,
        flightNo: '',
        polCode: '',
        podCode: ''
      },
      editFormRule: {
        billNo: [
          {required: true, message: this.$t('planManager.billList.billNoEmptyError'), trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    disabled() {
      return this.opreator === 'view'
    },
    title() {
      if (this.opreator === 'view') {
        return this.$t('planManager.billList.viewBill')
      } else if (this.opreator === 'modify') {
        return this.$t('planManager.billList.modifyBill')
      } else {
        return this.$t('planManager.billList.createBill')
      }
    }
  },
  watch: {},
  methods: {
    async showModifyDialog(planId = null, billId = null) {
      if (billId === null) {
        // 新增提单
        this.editForm.planId = planId
        this.showDialog = true
      } else {
        // 提单详情
        const res = await getBillDetailApi(billId)
        if (res && res.ok) {
          this.editForm = res.content
          this.showDialog = true
        }
      }
    },
    checkForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (!this.editForm.planId) {
            this.$message.warning(this.$t('planManager.billList.planIdEmpty'))
            return false
          }
          this.saveForm()
        }
      })
    },
    async saveForm() {
      this.loading = true
      let res = null
      if (this.opreator === 'create') {
        // 新增提单
        res = await createBillApi(this.editForm)
      } else {
        // 更新提单
        res = await updateBillDetailApi(this.editForm)
      }
      if (res && res.ok) {
        this.$message({
          type: 'success',
          message: this.$t('planManager.billList.saveSuccess')
        })
      }
      this.$refs.editForm.resetFields()
      this.loading = false
      this.showDialog = false
      this.$emit('refreshData')
    },
    closeDialog() {
      if (this.disabled) {
        this.showDialog = false
      } else {
        this.$confirm(this.$t('planManager.unSaveWarnningTips'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.dropEditBtn'),
          cancelButtonText: this.$t('planManager.thinkOver'),
          type: 'warning'
        }).then(() => {
          this.$refs.editForm.resetFields()
          this.showDialog = false
        }).catch(() => {})
      }
    }
  },
  mounted() {},
  created() {}
}
</script>
<style>
</style>
