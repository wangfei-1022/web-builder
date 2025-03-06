<template>
  <div>
    <span class="oper" style="">
      <el-button type="text" icon="el-icon-circle-plus" class="icon blue" @click="addBank"></el-button>
      <el-button v-if="len > 1" type="text" icon="el-icon-remove" class="icon red" @click="delBank"></el-button>
    </span>
    <el-form ref="bankDataRef" :model="formData" :rules="formDataRules" label-width="110px" size="mini" class="member-form">
      <div>
        <el-form-item :label="$t('paymentInfoManage.bankName')" prop="bankName">
          <el-input v-model="item.bankName" size="mini" v-trim />
        </el-form-item>
        <el-form-item :label="$t('paymentInfoManage.bankBranch')" prop="bankBranch" :rules="[{ required: countryCode === 'CN', message: this.$t('common.cannot_be_null'), trigger: 'change'}]">
          <el-input v-model="item.bankBranch" size="mini" v-trim />
        </el-form-item>
        <el-row style="clear: both;">
          <el-col :span="7">
            <el-form-item :label="$t('paymentInfoManage.bankAddress')" prop="countryCode"  style="width: 100%">
              <base-select 
                type="country" 
                v-model="item.countryCode" 
                filterable 
                placeholder="请选择国家"
                @selected="countrySelected"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label="" prop="bankAddress"  style="width: 100%" label-width="0px">
              <el-input v-model="item.bankAddress" size="mini" placeholder="请输入详细银行地址" v-trim />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item :label="'SWIFT CODE'" prop="swiftCode" :rules="[{ required: countryCode !== 'CN', message: $t('common.cannot_be_null'), trigger: 'change'}]">
          <el-input v-model="item.swiftCode" size="mini" v-trim  />
        </el-form-item>
      </div>

      <div class="bank-info" v-if="bankIndex === 0">{{$t("paymentInfoManage.bankInfoMsg")}}</div>
      <div v-for="(val, index) in item.accounts" :key="index" class="flex" style="width: 100%">
        <el-form-item :label="$t('paymentInfoManage.bankAccount')" :prop="`accounts[${index}].bankAccount`" :rules="[{ required: true, message: $t('common.cannot_be_null'), trigger: 'change'}]" style="width: 38%">
          <el-input v-model="val.bankAccount" size="mini" v-trim />
        </el-form-item>
        <el-form-item :prop="`accounts[${index}].rechargeCurrency`" :rules="[{ required: true, message: $t('common.cannot_be_null'), trigger: 'change'}]" class="rechargeCurrency" style="width: 12%">
          <base-select type="currency" v-model="val.rechargeCurrency" />
        </el-form-item>
        <div>
          <el-button type="text" @click="addSubBranch" icon="el-icon-plus" class="icon red" style="font-size: 23px"></el-button>
          <el-button v-if="item.accounts.length > 1" type="text" icon="el-icon-close" class="icon red" @click="delSubBranch(index)" style="margin-left: 5px;font-size: 24px"></el-button>
        </div>
      </div>
    </el-form>
  </div>
 
</template>
<script>
import {selectionsBaseInfoApi} from '@/api/commonComponent';
import CurrencySelect from "@/views/cargo/v0/OverseasWarehouse/components/CurrencySelect";
import lodash from 'lodash'
import { partnerPaymentInfoDetailApi, partnerPaymentInfoPutApi, partnerPaymentInfoSaveApi} from "@/api/partner/paymentInfo";

export default {
	name: 'BankItem',
	props: {
    bankIndex: {
      type: Number,
      default: 0
    },
    len: {
      type: Number,
      default: 0
    },
    countryCode: {
      type: String,
      default: ""
    },
    item: {
      type: Object,
      default: function () {
        return {}
      }
    }
	},
  watch: {
    item: {
      handler(val) {
        this.formData = {
          ...val
        }
      },
      deep: true,
      immediate: true
    }
  },
	data() {
		return {
      formData: {
        accounts: [{
          bankAccount: null,
          defaultFlag: null,
          rechargeCurrency: null
        }],
        bankAddress: null,
        bankBranch: null,
        bankName: null,
        bankNo: null,
        swiftCode: null,
        countryCode: '',
        countryName: ''
      },
      formDataRules: {
        countryCode: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
        bankAddress: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
        bankBranch: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
        bankName: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}],
        accounts: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'change'}]
      }
		}
	},
	methods: {
    countrySelected(item) {
      this.formData.countryName = item.chineseName
    },
    addBank() {
      this.$emit('addBank', {
        accounts: [{
          bankAccount: null,
          defaultFlag: null,
          rechargeCurrency: null,
        }],
        bankAddress: null,
        bankBranch: null,
        bankName: null,
        bankNo: null,
        swiftCode: null,
        countryCode: '',
        countryName: ''
      })
    },
    delBank() {
      this.$emit('delBank', this.bankIndex)
    },
    addSubBranch() {
      this.formData.accounts.push({
        bankAccount: null,
        defaultFlag: null,
        rechargeCurrency: null
      })
    },
    delSubBranch(index) {
      this.formData.accounts.splice(index, 1)
    },
    validate() {
      let VALID_BANK = true
      this.$refs.bankDataRef.validate(valid => {
        VALID_BANK = valid
      })
      return VALID_BANK
    },
    getValue() {
      return this.formData
    }
	}
}
</script>
<style scoped lang="scss">
.member-form{
  ::v-deep .el-form-item{
    float: left;
    width: 50%;
  }
}

.swift-info {
  color: red;
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  margin-left: 10px;
}

.bank-info {
  color: red;
  line-height: 20px;
  font-size: 12px;
  margin-left: 50px;
  text-align: left;
  overflow: hidden;
  width: 100%;
}

.oper {
  position: absolute;
  right: 0;
  z-index: 999;
  width: 70px; 
}
.icon {
  width: auto;
  height: auto;
  margin: 0 0px;
  font-size: 28px;
  transition: all 0.2s ease 0s;
  cursor: pointer;
  user-select: none;
  position: relative;
  top: -10px;
  &:hover {
    transform: scale(1.1);
  }
}

.blue {
  color: #1890ff;
}
.red {
  color: #ff4949;
}

.rechargeCurrency{
  ::v-deep .el-form-item__content{
    margin-left: 0 !important;
  }
}
</style>
