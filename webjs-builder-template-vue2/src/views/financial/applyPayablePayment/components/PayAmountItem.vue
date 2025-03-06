<template>
  <div class="form-container">
    <el-form ref="baseForm" :rules="formRule" :model="form" label-width="110px" size="mini" class="member-form">
      <el-form-item :label="$t('fmsPayablePayment.paymentValue')" prop="currency" style="width:220px!important">
        <base-select type="currency" v-model="form.currency" style="width: 110px;" @selected="currencyChange" :disabled="!form.isNewAdd"/>
      </el-form-item>
      <el-form-item label-width="0px" prop="value" style="width:calc(50% - 220px)!important">
        <el-input v-model="form.value" clearable @change="amountChange" class="input-with-select" oninput="value=value.replace(/[^\d\.]/g,'')" :disabled="isPayment"></el-input>
      </el-form-item>
      <el-form-item :label="$t('fmsPayablePayment.bankAccountInfo')" prop="bankAccountInfoKey" >
        <el-select v-model="form.bankAccountInfoKey" style="width:100%" @change="changeBank">
          <el-option
            v-for="item in bankAccountListCurrency"
            :key="item.key"
            :label="item.bankName + item.bankBranch + ' ' + item.bankAccount"
            :value="item.key" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="oper" v-if="!isPayment">
      <i class="iconfont icon-minus-circle minus-btn" @click="deleteFn" v-if="isCanDelete"></i>
      <i data-v-2caf994f="" class="iconfont icon-add-circle" @click="addFn" ></i>
    </div>
  </div>
</template>

<script>
export default {
	name: "PayAmountItem",
	components: {

	},
  props: {
    paymentInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    isCanDelete: {
      type: Boolean,
      default: true
    },
    index: {
      type: [String, Number],
      default: ''
    },
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    bankAccountList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    isPayment() {
      return this.paymentInfo.paymentType === 1
    }
  },
  watch: {
    item: {
      handler(val) {
        this.form = {
          isNewAdd: val.isNewAdd,
          currency: val.currency,
          value: val.value,
          bankAccountInfoKey: val.key
        }
        this.currencyChange()
        if(val.key) {
            this.$nextTick(() => {
                this.changeBank()
            })
        }
      },
      deep: true,
      immediate: true
    },
    bankAccountList: {
      handler(val) {
        this.currencyChange()
      },
      deep: true,
      immediate: true
    }
  },
	data() {
		return {
      bankAccountListCurrency: [],
			form: {
        value: '',
        currency: '',
        bankAccountInfoKey: ''
      },
			formRule: {
				currency: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
				value: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
				bankAccountInfoKey: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			loading: false
		};
	},
	methods: {
    amountChange() {
        this.$nextTick( () => {
            this.$emit('payAmountChange')
        })
    },
    currencyChange() {
      let arr = []
      this.bankAccountList.forEach(v => {
        if (v.rechargeCurrency === this.form.currency) {
          arr.push({
            ...v
          })
        }
      })
      this.bankAccountListCurrency = arr
      if (this.bankAccountListCurrency.length === 1) {
        this.$set(this.form, 'bankAccountInfoKey', this.bankAccountListCurrency[0].key)
        this.changeBank()
      }
      this.$nextTick( () => {
        this.$emit('payAmountChange')
      })
    },
    changeBank() {
      this.bankAccountListCurrency.forEach(v => {
        if (v.key === this.form.bankAccountInfoKey) {
          this.$emit('changeBank', v)
        }
      })

    },
    validate() {
      let valid = true
      this.$refs.baseForm.validate(v => {
        valid = v
      })
      return valid
    },
    getValue() {
      let index = this.bankAccountListCurrency.findIndex(item => item.key === this.form.bankAccountInfoKey)
      let data = {
        ...this.form,
        applyCurrency: this.form.currency,
        applyAmount: this.form.value,
        exchangeRate: 1,
        ...this.bankAccountListCurrency[index]
      }
      return data
    },
    addFn() {
      this.$emit('add')
    },
    deleteFn() {
      this.$emit('delete', this.index, this.form)
    }
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

.icon-minus-circle,
.icon-add-circle{
  color: #1890ff;
  font-size: 24px;
}

.form-container{
  position: relative;

  .oper{
    position: absolute;
    width: 55px;
    right: -60px;
    top: 2px;
  }
}
.input-with-select ::v-deep .el-input-group__prepend {
  background-color: #fff;
}
</style>
