<template>
  <div>
    <div class="restrictions" v-for="(item, index) in payAmountList" :key="index">
      <pay-amount-item
        :ref="'restrictions_item_' + index"
        :item="item"
        :index="index"
        @payAmountChange="payAmountChange"
        @changeBank="changeBank"
        @add="addFn"
        @delete="deleteFn"
        :isCanDelete="payAmountList.length > 1"
        :bankAccountList="bankAccountList"
        :paymentInfo="paymentInfo"
      />
    </div>

    <el-form ref="baseForm" :rules="formRule" :model="form" label-width="110px" size="mini" class="member-form" v-if="paymentInfo.isOverSea">
      <el-form-item :label="$t('fmsPayablePayment.swiftCode')" prop="swiftCode" >
        <el-input v-model="form.swiftCode" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('fmsPayablePayment.bankAddress')" prop="bankAddress" >
        <el-input :value="isOverSea && form.countryCode ? (form.countryCode + '，' + form.bankAddress) : form.bankAddress" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import PayAmountItem from './PayAmountItem';

export default {
	name: "PayAmount",
  components: {
    PayAmountItem
  },
  props: {
    isOverSea: {
      type: Boolean,
      default: false
    },
    paymentInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    amountTotal: {
      type: Array,
      default: function() {
        return []
      }
    },
    bankAccountList: {
      type: Array,
      default: function() {
        return []
      }
    },
    settlementCompanyId: {
      type: [Number, String],
      default: null
    }
  },
  watch: {
    amountTotal: {
      handler(val) {
        this.payAmountList = this.$extends([], true, val)
      }
    }
  },
	data() {
		return {
      payAmountList: [],
      editItem: {},
      channelCode: '',
			index: null,
			visible: false,
      isEdit: false,
      form: {
        swiftCode: '',
        bankAddress: '',
        countryCode: '',
        countryName: ''
      },
      formRule: {
        swiftCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        bankAddress: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
    this.payAmountList = this.$extends([], true, this.amountTotal)
	},
	methods: {
    validate() {
      let valid = true
      let arr = []
      Object.keys(this.$refs).forEach(key => {
        if (this.$refs[key][0]) {
          let v = this.$refs[key][0].validate()
          let item = this.$refs[key][0].getValue()
          if (!v) {
            valid = false
          }
          arr.push(item)
        }
      })
      if (this.paymentInfo.isOverSea) {
        let bankAddressMap = {}
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          if (!item.swiftCode || !item.bankAddress) {
            // 付款币种开户行账号信息不全，请先补充基础数据。
            this.$message.error(this.$t('fmsPayablePayment.bankError1'))
            return false
          }
          bankAddressMap[item.bankAddress] = item.bankAddress
        }
        // 所选中的开户行账号银行地址不一致！
        if (Object.keys(bankAddressMap).length > 1) {
          this.$message.error(this.$t('fmsPayablePayment.bankError2'))
          return false
        }
      }
      let currencyList = []
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        let index = currencyList.findIndex(v => v === item.currency)
        if (index >= 0) {
          // 添加的付款币种不能重复
          this.$message.error(this.$t('fmsPayablePayment.bankError3'))
          return false
        } else {
          currencyList.push(item.currency)
        }
      }
      return valid
    },
		getValue() {
			let arr = []
      Object.keys(this.$refs).forEach(key => {
        if (this.$refs[key][0]) {
          let item = this.$refs[key][0].getValue()
          arr.push(item)
        }
      })
			return arr
		},
		addFn() {
      this.payAmountList.push({
        isNewAdd: true
      })
		},
    changeBank(val) {
      this.form.bankAddress = val.bankAddress
      this.form.countryCode = val.countryCode
      this.form.countryName = val.countryName
      this.form.swiftCode = val.swiftCode
    },
		deleteFn(index, item) {
      if (this.amountTotal.length > 0 && !item.isNewAdd) {
        let arr = []
        this.payAmountList.forEach(v => {
          if (!v.isNewAdd) {
           arr.push(v)
          }
        })
        // 必须得存在一项币种是费用上的
        if (arr.length === 1) {
          this.$message.error(this.$t('fmsPayablePayment.bankError4'))
          return false
        }
      }
      this.payAmountList.splice(index, 1)
      this.$emit('payAmountChange')
		},
    // 金额与币种发生变化 通知父组件 变更上传文件内容显示
    payAmountChange() {
      this.$emit('payAmountChange')
    },
	}
};
</script>
<style scoped lang="scss">
.member-form{
  overflow: hidden;

  ::v-deep .el-form-item{
    width: 50%!important;
    float: left!important;
    padding: 0 5px;
  }
}
</style>
