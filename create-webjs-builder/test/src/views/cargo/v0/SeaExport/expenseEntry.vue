<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="customerInformationForm">
      <!--      基础信息-->
      <div class="box_title">{{$t('sea.basicInformation')}}</div>
      <div class="box_child">
        <div class="flex-bet basic-information" style="min-width: 1000px; flex-wrap: wrap; justify-content: left">
            <el-form-item :label="$t('sea.entryMethod')" prop="blSignType" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]" class="shipping_method">
              <el-radio-group v-model="dataForm.blSignType">
                <el-radio :label="1">{{ $t('sea.newBill') }}</el-radio>
                <el-radio :label="2" style="padding-left: 10px">{{ $t('sea.consolidatedStatement') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('sea.customerName')" prop="blSignType" size="mini" class="shipping_method">
              {{dataForm.customerName}}
            </el-form-item>
            <el-form-item :label="$t('sea.customerSettlementUnit')" prop="blSignType" size="mini" class="shipping_method">
              {{dataForm.settlementCompany}}
            </el-form-item>
            <el-form-item :label="$t('sea.settlementMethod')" prop="blSignType" size="mini" class="shipping_method">
              {{dataForm.settlementMode}}
            </el-form-item>
            <el-form-item :label="$t('sea.entryMethod')" prop="blSignType" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]" class="shipping_method">
              <el-input type="number" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sea.totalExpenses')" prop="blSignType" size="mini" class="shipping_method">
              {{dataForm.totalExpenses}}
            </el-form-item>

        </div>
      </div>
      <!--      基础信息-->
      <div class="box_title">{{$t('sea.expenseDetails')}}</div>
      <div class="box_child">
        <el-table class="case-data-table" :data="dataForm.charges">
          <el-table-column type="selection" width="55" fixed></el-table-column>
          <el-table-column prop="feeItemName" :label="$t('sea.feeName')" align="center" />
          <el-table-column prop="unitName1" :label="$t('sea.billingMethod')" align="center"  />
          <el-table-column prop="currency" :label="$t('sea.currency')" align="center"  />
          <el-table-column prop="price" :label="$t('sea.unitPrice')" align="center">
            <template slot-scope="{row}">
              {{formatNumberToThousands(row.price)}}
            </template>
          </el-table-column>
          <el-table-column prop="chargeQuantity1" :label="$t('sea.quantity')" align="center"  />
          <el-table-column prop="invoiceTaxRateName" :label="$t('sea.taxRate')" align="center"/>
          <el-table-column prop="taxAmount" :label="$t('sea.taxAmount')" align="center" >
            <template slot-scope="{row}">
              {{formatNumberToThousands(row.taxAmount)}}
            </template>
          </el-table-column>
          <el-table-column prop="excludeTaxAmount" :label="$t('sea.amountExcludingTax')" align="center" >
            <template slot-scope="{row}">
              {{formatNumberToThousands(row.excludeTaxAmount)}}
            </template>
          </el-table-column>
          <el-table-column prop="amount" :label="$t('sea.expenseAmount')" align="center" >
            <template slot-scope="{row}">
              {{formatNumberToThousands(row.amount)}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('sea.remark')" align="center"  />
        </el-table>
      </div>
    </el-form>
    <div style="text-align: right">
      <el-button size="mini" @click="prev">{{$t('sea.prev')}}</el-button>
      <el-button  type="primary" size="mini" @click="submit">{{$t('sea.submit')}}</el-button>
    </div>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
export default {
	name: 'BookingAdd',
	props: {
	},
	data() {
		return {
			loading: false,
			id: this.$route.query.id,
			dataForm: {}
		}
	},
	computed: {
		url() {
			return URL
		}
	},
	created() { },
	methods: {
		prev() {
			this.$router.push({ name: 'DetailsExpensesReceivableList' })
		},
		submit() {

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
	color: #199ed8;
	padding-left: 8px;
	height: 28px;
	line-height: 28px;
	margin: 5px 0 8px 0;
	display: flex;
	.operate-buttons-left {
		margin-left: 20px;
	}
}
.box {
	background-color: #f5f7f7;
	padding: 8px;
	::v-deep .el-form-item--medium {
		.el-form-item__content {
			line-height: 28px;
		}
		.el-form-item__label {
			line-height: 28px;
		}
	}
}
.box_child {
	border: solid 1px rgba(121, 121, 121, 1);
	padding: 20px 30px;
	background: #fff;
	margin-bottom: 15px;
	.box25 {
		width: 20%;
	}
}
::v-deep .el-form--inline .el-form-item {
	display: block;
}
.basic-information ::v-deep .el-form-item {
	width: 25%;
	margin-right: 0;
}
</style>
