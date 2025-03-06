<template>
  <el-dialog :title="$t('receiveFms.join_bill')" :visible.sync="visible" width="800px">
    <div class='bill-title'>
      <i class="m-icon el-icon-warning-outline" />
      {{$t('receiveFms.joinBillInfo')}}
    </div>
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="right">
      <el-form-item :label="$t('receiveFms.bill_no')" prop="billNo" class="full">
        <el-select v-model="formModel.billNo" size="mini" filterable>
          <el-option v-for="(item, index) in billList" :key="index" :label="item.billNo" :value="item.billNo"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('receiveFms.settlement_company_name')" >
        {{formModel.settlementCompanyName}}
      </el-form-item>
      <el-form-item :label="$t('receiveFms.business_type')" >
         {{formModel.businessTypeName}}
      </el-form-item>
    </el-form>

    <el-table :data="groupArr" style="width: 100%">
      <el-table-column prop="settlementModeName" :label="$t('receiveFms.settlement_mode')" width="180"> </el-table-column>
      <el-table-column prop="date" :label="$t('receiveFms.addCurrencyAmount')" >
        <template slot-scope="{row}">
          <span v-for="(item, index) in row.currencyStr" :key="index">
            {{item.currency}}
            {{item.value | numberToThousands}}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t('common.close')}}</el-button>
      <el-button type="primary" @click="submitFn" size="mini" :loading="loading">{{$t('common.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getReceiptBillNoApi, receiveChargeJoinBillApi } from "@/api/financial/fmsReceive"
import { getPayableBillNoApi } from "@/api/financial/fmsPayable"

export default {
	name: "ApplyInvoiceDialog",
	props: {
		arap: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			billList: [],
			visible: false,
      loading: false,
			keepChargeIds: [],
      groupArr: [],
			formModel: {
				billNo: '',
        settlementCompanyName: '',
        settlementModeName: '',
        businessTypeName: ''
      },
			formRules: {
				"billNo": [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
			}
		}
	},
	created() {

	},
	methods: {
    groupBy(array, name) {
      const groups = {};
      array.forEach(function (o) {
        const group = JSON.stringify(o[name]);
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.values(groups);
    },
		init(list) {
			let fn = null
			if (this.arap === 'AR') {
				fn = getReceiptBillNoApi
			} else {
				fn = getPayableBillNoApi
			}

      let groupArr = []
      let groupList = this.groupBy(list, 'settlementMode')
      groupList.forEach(item => {
        let chargeMap = {}
        item.forEach(v => {
          chargeMap[v.currency] = (Number(chargeMap[v.currency] || 0) + Number(v.entryAmount)).toFixed(2)
        })
        let currencyStr = []
        Object.keys(chargeMap).forEach(v => {
          currencyStr.push({
            currency: v,
            value: chargeMap[v]
          })
        })
        groupArr.push({
          currencyStr: currencyStr,
          settlementMode: item[0].settlementMode,
          settlementModeName: item[0].settlementModeName
        })
      })


      this.formModel.settlementCompanyName = list[0].settlementCompanyName
      this.formModel.businessTypeName = list[0].businessTypeName
      this.formModel.settlementModeName = list[0].settlementModeName
      this.groupArr = groupArr
      let data = {
        billState: 1, // 未对账的账单
        businessType: list[0].businessType,
        settlementCompanyId: list[0].settlementCompanyId
        // settlementMode: list[0].settlementMode
      }
			fn(data).then(res => {
				if (res.ok) {
          let arr = []
          res.content.forEach(v => {
            arr.push({
              billNo: v.billNo
            })
          })
					this.billList = arr
				}
      })
		},
		show(list) {
			this.visible = true
      // 清除
      this.formModel.billNo = ''
      this.billList = []

      let ids = []
      list.forEach(v => {
        ids.push(v.id)
      })
      this.keepChargeIds = ids
      this.init(list)
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
          let data = {
            billNo: this.formModel.billNo,
            keepChargeIds: this.keepChargeIds
          }
          this.loading = true
					receiveChargeJoinBillApi(data).then(res => {
            if (res.ok) {
              this.visible = false
              this.$message.success(this.$t('receiveFms.join_bill_success'))
              this.$emit('success')
            }
            this.loading = false
          })
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.bill-title{
  margin-bottom: 20px;
  line-height: 20px;
  font-size: 16px;
}

.full{
   width: 100% !important;
}
::v-deep .el-form-item{
  width: 50%;
  float: left;
}
.m-icon{
  color: #1890ff;
  font-size: 20px;
  float: left;
  margin-right: 8px;
}
</style>
