<template>
  <div class="">
    <el-dialog
    :visible.sync="showConfigDialog"
    width="800px"
    top="50px"
    :title="$t('uexpressCustomer.configurationTitle')"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>{{$t('uexpressCustomer.customerBaseInfo')}}</span>
        </div>
        <el-form :inline="true" :model="customerForm" label-width="100" size="mini">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.customerName')">
                {{customerForm.customerName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.customerCode')">
                {{customerForm.customerCode}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.shortName')">
                {{customerForm.shortName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.englishName')">
                {{customerForm.customerName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.salesName')">
                {{customerForm.salesName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.registerTime')">
                {{customerForm.registerTime | parseTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.contactEmail')">
                <el-input v-model="customerForm.contactEmail" type="text" size="mini" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.contactMobile')">
                <el-input v-model="customerForm.contactMobile" type="text" size="mini" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.claimEmail')">
                <el-input v-model="customerForm.claimEmail" type="text" size="mini" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('uexpressCustomer.customerService')">
                <base-select v-model="customerForm.customerServiceId" type="customerService" filterable clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>{{$t('uexpressCustomer.customerAccountInfo')}}</span>
        </div>
        <el-form :inline="true" :model="customerForm" label-width="100" size="mini">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item :label="$t('uexpressCustomer.settlementMode')">
                {{customerForm.settlementModeName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item :label="$t('uexpressCustomer.accountBalance')">
                <div v-for="(item,index) in customerForm.accountBalances || []" :key="index">
                  {{item.value | numberToThousands}} {{item.currency}}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item :label="$t('uexpressCustomer.overdrawLimit')">
                <div v-for="(item,index) in customerForm.creditLines || []" :key="index">
                  {{item.value | numberToThousands}} {{item.currency}}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item :label="$t('uexpressCustomer.alertLimitValue')">
                <number-input class="currency-input" v-model="customerForm.alertLimitValue" limitType="positive" :limitRange="{digits: 9, decimal: 0}" />
                <el-select class="currency-select" v-model="customerForm.alertLimitCurrencyCode" filterable>
                  <el-option v-for="item in currencyList" :key="item.code" :label="item.aliasCode" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item :label="$t('uexpressCustomer.alertLimitType')">
                <el-checkbox v-model="customerForm.alertByEmail">{{$t('uexpressCustomer.alertByEmail')}}</el-checkbox>
                <el-checkbox v-model="customerForm.alertByMobile">{{$t('uexpressCustomer.alertByMobile')}}</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveForm">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
import { getCurrencyListApi } from '@/api/orderManager'
import { savetCustomerOperationApi } from '@/api/uexpress/customerManager'
export default {
  name: 'ConfigurationDialog',
  props: {
    showConfigDialog: {
      type: Boolean,
      default: false
    },
    dataObj: {
      type: Object,
      default: () => null
    }
  },
  components: {
    NumberInput
  },
  data() {
    return {
      vm: this,
      loading: false,
      currencyList: []
    }
  },
  computed: {
    customerForm() {
      return this.dataObj
    }
  },
  watch: {},
  filters: {
    filterDate(val, vm) {
      return vm.$moment(Number(val)).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    async getCurrencyList() {
      const res = await getCurrencyListApi()
      if (res && res.ok && res.content) {
        this.currencyList = res.content.list
      }
    },
    async saveForm() {
      this.loading = true
      const _obj = {
        customerId: this.customerForm.customerId,
        alertLimitValue: this.customerForm.alertLimitValue,
        alertLimitCurrencyCode: this.customerForm.alertLimitCurrencyCode,
        alertByEmail: this.customerForm.alertByEmail,
        alertByMobile: this.customerForm.alertByMobile,
        claimEmail: this.customerForm.claimEmail,
        contactMobile: this.customerForm.contactMobile,
        contactEmail: this.customerForm.contactEmail,
        customerServiceId: this.customerForm.customerServiceId
      }
      const res = await savetCustomerOperationApi(_obj)

      if (res && res.ok) {
        this.$message.success(this.$t('uexpressCustomer.operationSuccess'))
        this.loading = false
      }
      this.$emit('update:showConfigDialog', false)
      this.$emit('refreshData')
    },
    closeDialog() {
      this.$confirm(this.$t('planManager.unSaveWarnningTips'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.dropEditBtn'),
        cancelButtonText: this.$t('planManager.thinkOver'),
        type: 'warning'
      }).then(() => {
        this.$emit('update:showConfigDialog', false)
      }).catch(() => {})
    }
  },
  mounted() {
    this.getCurrencyList()
  },
  created() {}
}
</script>
<style scoped lang="scss">
  ::v-deep .currency-select{
    width:  100px;
  }
  ::v-deep .currency-input{
    width: 160px;
  }
</style>
