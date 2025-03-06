<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('receiveFms.detail')" name="first">
          <div class="module">
            <div class="info-container">
              <div class="item">
                <label class="blod"><i
                    class="icon iconfont icon-qiye"></i>{{ $t('receiveFms.settlement_company_name') }}</label>
                <span class="blod">{{ bill.settlementCompanyName }}</span>
              </div>
              <div class="item">
                <label class="blod">{{ $t('receiveFms.bill_status') }}</label>
                <span class="blod">{{ bill.billStateName }}</span>
              </div>
              <div class="item">
                <label>{{ $t('receiveFms.bank_account') }}</label>
                <span>{{ bill.bankAccount }}</span>
              </div>
              <div class="item">
                <label>{{ $t('receiveFms.bank_name') }}</label>
                <span></span>
              </div>
              <div class="item">
                <label>{{ $t('receiveFms.identification') }}</label>
                <span></span>
              </div>
              <div class="item">
                <label>{{ $t('receiveFms.address') }}</label>
                <span></span>
              </div>
              <div class="item">
                <label>{{ $t('receiveFms.tel') }}</label>
                <span></span>
              </div>
            </div>
          </div>
          <div class="module">
            <div class="blod name"
              style="font-size: 18px !important;padding-left: 40px;height: 35px;line-height: 35px;padding-bottom: 52px;">
              {{ $t('receiveFms.bill_name') }}:{{ bill.billName }}
            </div>
            <div class="blod name"><span
                class="icon iconfont icon-dingdandingdanmingxishouzhimingxi"></span>{{ $t('receiveFms.bill_charge_detail') }}
            </div>
            <div style="padding: 0 20px;">
              <el-table size="mini" :data="tableData" style="width: 100%; margin-top: 20px;" row-key="id" border>
                <el-table-column prop="confirmationNo" :label="$t('receiveFms.serial_no')" min-width="150">
                </el-table-column>
                <el-table-column prop="entityNo" :label="$t('receiveFms.entity_no')" min-width="150"></el-table-column>
                <el-table-column prop="businessTypeName" :label="$t('receiveFms.business_type')" min-width="100">
                </el-table-column>
                <el-table-column prop="responsiblePersonName" :label="$t('receiveFms.sales_names')" min-width="100"
                  v-if="type == 'AR'"></el-table-column>
                <el-table-column prop="responsiblePersonName" :label="$t('payableFms.product_names')" min-width="100"
                  v-if="type == 'AP'"></el-table-column>
                <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="100">
                </el-table-column>
                <el-table-column prop="currency" :label="$t('receiveFms.currency')" min-width="80"></el-table-column>
                <el-table-column prop="bussinessDate" :label="$t('receiveFms.business_date')" min-width="150"></el-table-column>
                <el-table-column prop="price" :label="$t('receiveFms.price')" min-width="80">
                  <template slot-scope="scope">
                    <div style='text-align: right'>{{ scope.row.price }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="chargeQuantity1" :label="$t('receiveFms.number')" min-width="80">
                </el-table-column>
                <el-table-column prop="invoiceTaxRateName" :label="$t('receiveFms.tax_rate')" min-width="80">
                </el-table-column>
                <el-table-column prop="taxAmount" :label="$t('receiveFms.tax_amount')" min-width="80">
                  <template slot-scope="scope">
                    <div style='text-align: right'>{{ scope.row.taxAmount }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="excludeTaxAmount" :label="$t('receiveFms.exclude_tax_amount')" min-width="120">
                  <template slot-scope="scope">
                    <div style='text-align: right'>{{ scope.row.excludeTaxAmount }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="entryAmount" :label="$t('receiveFms.entry_amount')" min-width="120">
                  <template slot-scope="scope">
                    <div style='text-align: right'>{{ scope.row.entryAmount }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="operation" :label="$t('receiveFms.operation')" min-width="60" fixed="right">
                  <template slot-scope="scope">
                    <div class="link" @click="removeBillSubmitFn(scope.row)">移出</div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="total">
                <span>{{ type == 'AR' ? $t('receiveFms.receive_sum') : $t('payableFms.payable_sum') }}：</span>
                <span>
                  <span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
                    <span class='value'>{{ item.currency }}</span>
                    <span>{{ item.value }}</span>
                  </span>
                </span>
              </div>
              <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getDetail"/>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList()">{{ $t('common.close') }}</el-button>
    </div>
  </div>

</template>
<script>
import { getReceiveBillDetailApi, getReceiveBillDetailChargeApi, receiveChargeRemoveFromBillApi } from "@/api/financial/fmsReceive"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "FmsReceiveBillDetail",
	props: {
		type: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			id: '',
			activeName: 'first',
			bill: {},
			tableData: [],
			loading: false,
			amountTotal: [],
			pageSize: 50,
			pageNum: 1,
			total: ''
		}
	},
	created() {
		this.id = this.$route.query.id
		this.getDetail()
	},
	methods: {
    getChargeList() {
      let data = {
				id: this.id,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			getReceiveBillDetailChargeApi(data).then(res => {
				if (res.ok) {
					res.content.list.forEach(v => {
						v.taxRate = v.taxRate + '%'
						v.price = formatNumberToThousands(v.price)
						v.amount = formatNumberToThousands(v.amount)
						v.taxAmount = formatNumberToThousands(v.taxAmount)
						v.entryAmount = formatNumberToThousands(v.entryAmount)
						v.excludeTaxAmount = formatNumberToThousands(v.excludeTaxAmount)
						v.bussinessDate = parseTime(v.bussinessDate, '{y}-{m}-{d} {h}:{i}:{s}')
					})
					this.total = res.content.total
					this.tableData = res.content.list
				}
			})
    },
		getDetail() {
      this.getChargeList()
			getReceiveBillDetailApi(this.id).then(res => {
				if (res.ok) {
					res.content.currencyAmounts.forEach(v => {
						v.value = formatNumberToThousands(v.value)
					})
					this.amountTotal = res.content.currencyAmounts
					this.bill = res.content
				}
			})
		},
    removeBillSubmitFn(item) {
      if (item.entryState !== 2 || item.instructionState !== 1 || item.invoiceApplyState !== 1) {
        // 只有未对账、未申请开票、未申请核销的费用才能移出账单
        this.$message.error(this.$t("receiveFms.remove_charge_warn"));
        return
      }

			this.$confirm(this.$t("receiveFms.remove_charge_desc"), this.$t("receiveFms.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          receiveChargeRemoveFromBillApi([item.id]).then(res => {
            if (res.ok) {
              this.$message.success(this.$t("receiveFms.remove_success"));
              this.getChargeList()
            }
          })
        })
    },
		backList() {
			// this.$store.dispatch('tagsView/delView', this.$route)
			// if (this.type == 'AP') {
			// 	this.$router.push({ name: 'FmsPayableBill' })
			// } else {
			// 	this.$router.push({ name: 'FmsReceiveBill' })
			// }
			let name = this.$route.query.origin || (this.type === 'AP' ? 'FmsPayableBill' : 'FmsReceiveBill')
			this.$store.dispatch('tagsView/delView', this.$route)
			// 当传入的是close 则说明来源不是列表 无法回归，则关闭当前即可
			if (name !== 'close') {
				this.$router.push({ name: name })
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.page-edit-container .page-edit-content {
	padding: 0;
}

::v-deep .el-tabs__header {
	background: #fff;
	padding: 0 20px;
}

::v-deep .el-tabs__content {
	padding: 0 20px;
}

::v-deep .el-tabs__item {
	height: 50px;
	line-height: 50px;
}

.total {
	background: rgba(16, 142, 233, 0.1);
	color: #108ee9;
	font-weight: 400;
	font-style: normal;
	font-size: 14px;
	height: 50px;
	line-height: 50px;
	padding: 0px 10px;

	.value-item {
		display: inline-block;
		margin-right: 50px;

		.value {
			display: inline-block;
			margin-right: 5px;
		}
	}
}

.module {
	overflow: hidden;
	padding: 20px 0;
	background: #fff;
	margin-bottom: 20px;
	border-radius: 5px;

	.title {
		font-size: 16px;
		font-weight: 600;
		border-bottom: 1px solid #f0f2f5;
		margin-bottom: 15px;
		padding: 0 20px 15px 20px;
	}

	.content {
		padding: 0 25px;
		overflow: hidden;
	}

	.img {
		display: block !important;
		border: 1px dashed #ccc;
		border-radius: 6px;
		width: 300px;
		height: 180px;
		line-height: 180px;
		text-align: center;
		cursor: pointer;
		padding: 0;
		float: left;

		img {
			width: 100%;
			height: 100%;
			-o-object-fit: conver;
			object-fit: conver;
		}
	}

	.item {
		width: 50%;
		float: left;
		margin-bottom: 15px;
		display: flex;

		label {
			width: 110px;
			display: block;
			text-align: right;
			margin-bottom: 15px;
			font-weight: 500;
			font-size: 14px;
			float: left;
			margin-right: 6px;
		}

		span {
			font-weight: 500;
			font-size: 14px;
			display: inline;
			flex: 1;
		}
	}
}

.blod {
	font-weight: 600 !important;
	font-style: normal;
	font-size: 16px !important;
	color: rgba(0, 0, 0, 0.8);
	height: 34px;
	line-height: 34px;
}

.name {
	padding-left: 26px;
	line-height: 60px;
	height: 60px;
	border-bottom: 1px solid #ddd;
}

.icon {
	color: #1890ff;
	font-size: 28px;
	margin-right: 5px;
}
</style>

