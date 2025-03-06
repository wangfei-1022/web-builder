<template>
  <el-dialog :visible.sync="allRecordedDialog" v-if="allRecordedDialog" :title="$t('air.expenseDetailsFiltering')"
    width="450px" :before-close="closeDialog" v-loading="loading">
    <el-form v-if="allRecordedType" ref="dataForm" :model="dataForm" :inline="false" class="dataForm"
      style="margin-top: 10px;">
      <el-form-item :label="$t('air.customerName2') + ':'" prop="customerName" size="mini"
        :rules="[{ required: true, message: $t('air.placeholder'), trigger: 'change' }]">
        <el-select v-model="dataForm.customerName" @change="customerNameChange" size="mini" filterable clearable
          style="width: 250px">
          <el-option v-for="item in allRecordedDialogData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('air.settlementUnit') + ':'" prop="settlementUnit" size="mini"
        :rules="[{ required: true, message: $t('air.placeholder'), trigger: 'change' }]">
        <el-select v-model="dataForm.settlementUnit" @change="settlementUnitChange" size="mini" filterable clearable
          style="width: 250px">
          <el-option v-for="item in settlementUnitOps" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('air.settlementMethod') + ':'" prop="settlementMethod" size="mini"
        :rules="[{ required: true, message: $t('air.placeholder'), trigger: 'change' }]">
        <el-select v-model="dataForm.settlementMethod" @change="settlementMethodChange" size="mini" filterable clearable
          style="width: 250px">
          <el-option v-for="item in settlementMethodOps" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-form v-else ref="dataForm" :model="dataForm" :inline="false" class="dataForm" style="margin-top: 10px;">

      <el-form-item :label="$t('air.settlementUnit') + ':'" prop="settlementUnit" size="mini"
        :rules="[{ required: true, message: $t('air.placeholder'), trigger: 'change' }]">
        <el-select v-model="dataForm.settlementUnit" @change="settlementUnitChange" size="mini" filterable clearable
          style="width: 250px">
          <el-option v-for="item in allRecordedDialogData " :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('air.settlementMethod') + ':'" prop="settlementMethod" size="mini"
        :rules="[{ required: true, message: $t('air.placeholder'), trigger: 'change' }]">
        <el-select v-model="dataForm.settlementMethod" @change="settlementMethodChange" size="mini" filterable clearable
          style="width: 250px">
          <el-option v-for="item in settlementMethodOps" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="footer-btn">
      <el-button type="primary" size="small" @click="next">{{ $t('air.next') }}</el-button>
      <!--      <el-button type="primary" size="small" @click="submit">{{ $t('air.submit') }}</el-button>-->
      <el-button size="small" @click="closeDialog">{{ $t('common.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import URL from '@/api/urlTranslator'
import {
  detailAllEntryApi, detailAllEntryChargeApi, detailListEntryApi, detailListEntryChargeApi
} from "@/api/airExport"
export default {
  name: 'AllRecordedDialog',
  components: {},
  props: {
    allRecordedType: { type: Boolean, default: true }, // 默认是应收
    allRecordedDialog: { type: Boolean, default: true },
    allRecordedDialogData: { type: Array, default: () => [] }
  },
  data () {
    return {
      loading: false,
      dataForm: {
      },
      billPeriodOps: [],
      settlementUnitOps: [],
      settlementMethodOps: [],
      allData: {
        memberId: '',
        memberName: '',
        settlementMode: '',
        settlementModeName: '',
        settlementCompanyId: '',
        settlementCompanyName: ''
      }
    }
  },
  computed: {
    url () {
      return URL
    }
  },
  created () {


  },
  methods: {
    customerNameChange (id) {
      const res = this.allRecordedDialogData.find(item => item.id === id)
      this.settlementUnitOps = res.sub
      this.allData.memberId = res.id
      this.allData.memberName = res.name
      this.$set(this.dataForm, 'settlementUnit', [])
      this.$set(this.dataForm, 'settlementMethod', [])
    },
    settlementUnitChange (id) {
      let res
      if (this.allRecordedType) {
        res = this.settlementUnitOps.find(item => item.id === id)
      } else {
        res = this.allRecordedDialogData.find(item => item.id === id)
      }

      this.settlementMethodOps = res.sub
      this.allData.settlementCompanyId = res.id
      this.allData.settlementCompanyName = res.name
      this.$set(this.dataForm, 'settlementMethod', [])
    },
    settlementMethodChange (id) {
      const res = this.settlementMethodOps.find(item => item.id === id)
      this.allData.settlementMode = res.id
      this.allData.settlementModeName = res.name
    },
    next () {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.$emit('filterNextStep', this.allData)
        }
      })
    },
    async submit () {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.loading = true
          let data
          let url
          if (this.entryType) { // 全部入账
            if (this.detailedType) {
              url = detailAllEntryApi
            } else {
              url = detailAllEntryChargeApi
            }

            data = {
              ...this.dataForm,
              ...this.multipleForm

            }
          } else { // 选择入账
            if (this.detailedType) {
              url = detailListEntryApi
            } else {
              url = detailListEntryChargeApi
            }
            data = {
              ...this.dataForm,
              ...this.initialData
            }
          }
          const res = await url(data)
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('air.submittedSuccessfully'))
            this.$emit('submit')
            this.closeDialog()
          }
        }
      })

    },
    closeDialog () {
      this.$emit('update:allRecordedDialog', false)
      this.$refs.dataForm.resetFields()
      this.dataForm = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-bet {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}

.box_title {
  border-left: solid 3px rgb(24, 144, 255);
  font-size: 18px;
  color: #199ED8;
  padding-left: 8px;
  height: 28px;
  line-height: 28px;
  margin: 5px 0 8px 0;
  display: flex;

  .operate-buttons-left {
    margin-left: 20px
  }
}

.box {
  background-color: #f5f7f7;
  padding: 8px;

  ::v-deep .el-form-item--medium {
    .el-form-item__content {
      line-height: 28px
    }

    .el-form-item__label {
      line-height: 28px
    }
  }
}

.box_child {
  border: solid 1px rgba(121, 121, 121, 1);
  padding: 20px 30px;
  background: #fff;
  margin-bottom: 15px;

  .box25 {
    width: 20%
  }
}

//::v-deep .el-form--inline .el-form-item{ display: block}
.cost_head {
  display: flex;
  justify-content: space-between;
  border-bottom: #ccc solid 1px;
  padding-bottom: 8px
}

.cost_mid {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  ::v-deep .el-form-item {
    width: 30%
  }
}

.addExpenseConfirmation {
  width: 100%;
  margin: 12px auto
}

.footer-btn {
  margin-top: 30px;
  text-align: right;
}

::v-deep .el-table__body td {
  padding: 10px 0 !important;
}

.dataForm {
  ::v-deep .el-form-item {
    margin-right: 0;
  }

  ::v-deep .el-form-item__error {
    margin-left: 75px
  }
}
</style>
