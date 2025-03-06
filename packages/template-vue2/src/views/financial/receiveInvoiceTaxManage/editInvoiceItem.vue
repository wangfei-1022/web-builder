<template>
  <div class="invoice-container">
    <div class="invoice-container-item">
      <div class="invoice-title set-color">
        {{ invoiceItem.invoiceType===1 ? '增值税专用发票' : '增值税普通发票'}}
        </div>
      <el-row class="invoice-row">
        <el-col :span="5" class="invoice-row-item">
          <!--发票代码-->
          <label class="set-color">{{$t('fmsReceiveInvoice.invoiceCode')}}</label><span></span>
        </el-col>
        <el-col :span="5" class="invoice-row-item">
          <!--发票号码-->
          <label class="set-color">{{$t('fmsReceiveInvoice.invoiceNo')}}</label><span></span>
        </el-col>
        <el-col :span="5" class="invoice-row-item">
          <!--开票日期-->
          <label class="set-color">{{$t('fmsReceiveInvoice.invoiceDate')}}</label><span></span>
        </el-col>
        <el-col :span="5" class="invoice-row-item">
          <!--校验码-->
          <label class="set-color">{{$t('fmsReceiveInvoice.invoiceCheckNo')}}</label><span></span>
        </el-col>
        <el-col :span="4" class="invoice-row-item">
          <!--机器编码-->
          <label class="set-color">{{$t('fmsReceiveInvoice.invoiceMachineNo')}}</label><span></span>
        </el-col>
      </el-row>

      <el-row class="invoice-row-table">
        <el-col :span="1">
          <div class="invoice-column set-color text-h">
            <!--购买方-->
            <span>{{$t('fmsReceiveInvoice.GOU')}}<br>{{$t('fmsReceiveInvoice.MAI')}}<br>{{$t('fmsReceiveInvoice.FANG')}}</span>
          </div>
        </el-col>
        <el-col :span="13">
          <div class="invoice-column">
            <div class="invoice-item">
              <div class="invoice-item-label set-color">{{$t('fmsReceiveInvoice.buyerCompanyName')}}</div>
              <div class="invoice-item-value">
                <span>{{invoiceItem.buyerCompanyName}}</span>
              </div>
            </div>
            <div class="invoice-item">
              <div class="invoice-item-label set-color">{{$t('fmsReceiveInvoice.buyerTaxNo')}}</div>
              <div class="invoice-item-value">
                <span>{{invoiceItem.buyerTaxNo}}</span>
              </div>
            </div>
            <div class="invoice-item">
              <div class="invoice-item-label set-color">{{$t('fmsReceiveInvoice.buyerAddressTel')}}</div>
              <div class="invoice-item-value">
                <el-tooltip class="item" effect="blue" placement="bottom" :visible-arrow="false">
                  <div slot="content">
                    <span>{{invoiceItem.buyerAddress}}</span>
                    <span>{{invoiceItem.buyerTel}}</span>
                  </div>
                  <div class="oh">
                    <span>{{invoiceItem.buyerAddress}}</span>
                    <span>{{invoiceItem.buyerTel}}</span>
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div class="invoice-item">
              <div class="invoice-item-label set-color">{{$t('fmsReceiveInvoice.buyerBank')}}</div>
              <div class="invoice-item-value">
                <el-tooltip class="item" effect="blue" placement="bottom" :visible-arrow="false">
                  <div slot="content">{{invoiceItem.buyerBankAccountsString}}</div>
                  <div class="oh">{{invoiceItem.buyerBankAccountsString}}</div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="1">
          <div class="invoice-column set-color text-h">
            <!--密码区-->
            <span>{{$t('fmsReceiveInvoice.MI')}}<br>{{$t('fmsReceiveInvoice.MA')}}<br>{{$t('fmsReceiveInvoice.QU')}}</span>
          </div>
        </el-col>

        <el-col :span="9">
          <div class="invoice-column">

          </div>
        </el-col>
      </el-row>

      <div class="invoice-row">
        <el-form ref="invoiceItemsRef" class="invoice-items-ref" :model="invoiceItem" label-position="left">
          <el-table :data="invoiceItem.items" :summary-method="getSummaries" border show-summary size='mini' height="333" style="width: 100%; height:333px;" >
            <el-table-column label="" width="50">
              <template slot-scope="{ $index, row }">
                <span class="oper-btn" @click="addItem($index)" v-if="row.itemTypeName">+</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fmsReceiveInvoice.itemTypeName')" >
              <template slot-scope="{ row, $index }">
                <template>
                  <span v-if="row.itemTypeName">
                    *
                    <el-form-item
                      v-if="invoiceItem.businessType === 'SUPPLY_CHAIN_FINANCE'"
                      :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                      :prop="`items[${$index}].itemTypeCode`">
                      <el-select v-model="row.itemTypeCode" size="mini">
                        <el-option v-for="(item, index) in []" :key="index" :label="item.name" :value="item.code"/>
                      </el-select>
                    </el-form-item>
                    <span v-else>{{row.itemTypeName}}</span>
                    *
                    <el-form-item
                      style="width: 160px;display: inline-block;"
                      :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                      :prop="`items[${$index}].itemName`">
                      <el-input v-model="row.itemName"  size="mini" />
                    </el-form-item>
                    <span class="oper-btn" v-if="invoiceItem.items.length > 1" @click="removeItem($index)">-</span>
                  </span>
                  <span v-else style="display:block;height:35px;"></span>
                </template>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fmsReceiveInvoice.itemSpec')" width="120">
              <template slot-scope="{ row, $index }">
                <el-form-item :prop="`items[${$index}].itemSpec`" v-if="row.itemTypeName">
                  <el-input v-model="row.itemSpec"  size="mini" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fmsReceiveInvoice.itemUnit')" width="80">
              <template slot-scope="{ row, $index }">
                <el-form-item :prop="`items[${$index}].itemUnit`" v-if="row.itemTypeName">
                  <el-input v-model="row.itemUnit"  size="mini" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fmsReceiveInvoice.quantity')" width="100" align='right'>
              <template slot-scope="{ row, $index }">
                <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]" :prop="`items[${$index}].quantity`" v-if="row.itemTypeName">
                  <el-input v-model="row.quantity"  size="mini" oninput="value=value.replace(/[^\d.-]/g,'')"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fmsReceiveInvoice.price')" width="120" align='right'>
              <template slot-scope="{ row, $index }">
                <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]" :prop="`items[${$index}].price`" v-if="row.itemTypeName">
                  <el-input v-model="row.price"  size="mini" oninput="value=value.replace(/[^\d.-]/g,'')" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fmsReceiveInvoice.invoiceAmount')" width="125" align='right'>
              <template slot-scope="{ row, $index }">
                <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]" :prop="`items[${$index}].invoiceAmount`" v-if="row.itemTypeName">
                  <el-input v-model="row.invoiceAmount"  size="mini" @change="invoiceAmountChange($index)" oninput="value=value.replace(/[^\d.-]/g,'')"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceTaxRateName" :label="$t('fmsReceiveInvoice.invoiceTaxRateName')" width="80" align='right'></el-table-column>
            <el-table-column prop="taxAmount" :label="$t('fmsReceiveInvoice.taxAmount')" width="100" align='right'></el-table-column>
          </el-table>
        </el-form>
      </div>

      <div class="invoice-row summary">
        <div class="summary-text set-color">{{$t('fmsReceiveInvoice.amountChinese')}}</div>
        <div class="summary-value">
          <span style="margin-left: 10px;color: #333;">{{ invoiceItem.amountChinese }}</span>
          <span style="float: right;margin-right: 10px;display: inline-block;width: 220px;">
            <span class="set-color">({{$t('fmsReceiveInvoice.lowercase')}})</span>
            <span style="color: #333;">¥{{ invoiceItem.invoiceAmountFormat }}</span>
          </span>
        </div>
      </div>

      <el-row class="invoice-row-table">
        <el-col :span="1">
          <div class="invoice-column set-color text-h">
            <!--销售方-->
            <span>{{$t('fmsReceiveInvoice.XIAO')}}<br>{{$t('fmsReceiveInvoice.SHOU')}}<br>{{$t('fmsReceiveInvoice.FANG')}}</span>
          </div>
        </el-col>
        <el-col :span="13">
          <div class="invoice-column">
            <div class="invoice-item">
            <div class="invoice-item-label set-color">{{$t('fmsReceiveInvoice.supplierCompanyName')}}</div>
            <div class="invoice-item-value">
              <span>{{invoiceItem.supplierCompanyName}}</span>
            </div>
          </div>
          <div class="invoice-item">
            <div class="invoice-item-label set-color">{{$t('fmsReceiveInvoice.supplierTaxNo')}}</div>
            <div class="invoice-item-value">
               <span>{{invoiceItem.supplierTaxNo}}</span>
            </div>
          </div>
          <div class="invoice-item">
            <div class="invoice-item-label set-color">{{$t('fmsReceiveInvoice.supplierAddressTel')}}</div>
            <div class="invoice-item-value">
              <el-tooltip class="item" effect="blue" placement="bottom" :visible-arrow="false">
                <div slot="content">
                  <span>{{invoiceItem.supplierAddress}}</span>
                  <span>{{invoiceItem.supplierTel}}</span>
                </div>
                <div class="oh">
                  <span>{{invoiceItem.supplierAddress}}</span>
                  <span>{{invoiceItem.supplierTel}}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="invoice-item">
            <div class="invoice-item-label set-color">{{$t('fmsReceiveInvoice.supplierBank')}}</div>
            <div class="invoice-item-value">
              <el-tooltip class="item" effect="blue" placement="bottom" :visible-arrow="false">
                <div slot="content">{{invoiceItem.supplierBankAccountsString}}</div>
                <div class="oh">{{invoiceItem.supplierBankAccountsString}}</div>
              </el-tooltip>
            </div>
          </div>
          </div>
        </el-col>

        <el-col :span="1">
          <div class="invoice-column set-color text-h">
            <!--销售方-->
            <span>{{$t('fmsReceiveInvoice.BEI')}}<br>{{$t('fmsReceiveInvoice.ZHU')}}</span>
          </div>
        </el-col>

        <el-col :span="9">
          <div class="invoice-column">
            <el-input v-model="invoiceItem.invoiceRemark" :rows="5" type="textarea" />
          </div>
        </el-col>
      </el-row>

      <el-row class="invoice-row">
        <el-col :span="6" class="invoice-row-item">
          <label class="set-color">{{$t('fmsReceiveInvoice.payeeName')}}</label><span>{{invoiceItem.payeeName}}</span>
        </el-col>
        <el-col :span="6" class="invoice-row-item">
          <label class="set-color">{{$t('fmsReceiveInvoice.auditorName')}}</label><span>{{invoiceItem.auditorName}}</span>
        </el-col>
        <el-col :span="6" class="invoice-row-item">
          <label class="set-color">{{$t('fmsReceiveInvoice.drawerName')}}</label><span>{{invoiceItem.drawerName}}</span>
        </el-col>
        <el-col :span="6" class="invoice-row-item">
          <label class="set-color">{{$t('fmsReceiveInvoice.saleSupplierName')}}</label><span></span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getGridSelectedIds, getGridSelected } from '@/utils/gridChoose'
import { getInvoiceOffsetPlatform, generateThirdInvoice, generateThirdRedInvoice, invoiceConfirm } from '@/api/invoice'
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: 'TaxReceiptEditInvoiceItem',
	components: {

	},
	props: {
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
				let items = this.$extends(true, [], val.items)
				if (items.length < 7) {
					let x = 7 - items.length
					for (let i = 0; i < x; i++) {
						// 补充空位
						items.push({})
					}
				}
				this.invoiceItem = {
					...this.invoiceItem,
					...val,
					invoiceAmountFormat: formatNumberToThousands(val.invoiceAmount),
					items: items
				}
			},
			immediate: true,
			deep: true
		}
	},
	data() {
		return {
			loading: false,
			invoiceItem: {
				invoiceType: 1,
				invoiceTypeName: "",
				invoiceMedium: 1,
				invoiceMediumName: "",
				remark: "",
				invoiceAmount: 1,
				taxAmount: 1,
				drawerId: 1,
				drawerName: "",
				auditorId: 1,
				auditorName: "",
				payeeId: 1,
				payeeName: "",
				buyerCompanyName: '',
				buyerTaxNo: "",
				buyerAddress: "",
				buyerTel: "",
				buyerBankAccounts: [],
				supplierCompanyName: '',
				supplierTaxNo: "",
				supplierAddress: "",
				supplierTel: "",
				supplierBankAccounts: [],
				items: [],
				invoiceChargeInfos: []
			},
			taxRateList: [],
			invoiceTextureList: [],
			invoiceTypeList: []
		}
	},
	methods: {
		addItem(index) {
			if (this.invoiceItem.items >= 8 && this.invoiceItem.invoiceMedium === 1) {
        // 纸质税票货物或应税劳务、服务名称不能超过8条！
				this.$message.error(this.$t('fmsReceiveInvoice.itemLengthCheck'))
				return
			}
			let item = this.invoiceItem.items[index]
			let newItem = this.$extends({}, item)
			newItem.price = ''
			newItem.taxAmount = ''
			newItem.invoiceAmount = ''
			newItem.quantity = ''
			newItem.itemSpec = ''
			newItem.itemUnit = ''

			let items = this.$extends(true, [], this.invoiceItem.items)
			let valItem = []
			items.forEach(v => {
				if (v.itemTypeName) {
					valItem.push(v)
				}
			})
			valItem.push(newItem)
			if (valItem.length < 7) {
				let x = 7 - valItem.length
				for (let i = 0; i < x; i++) {
					// 补充空位
					valItem.push({})
				}
			}
			this.invoiceItem.items = valItem
		},
		removeItem(index) {
			this.invoiceItem.items.splice(index, 1)
			if (this.invoiceItem.items.length < 7) {
				this.invoiceItem.items.push({})
			}
		},
		getSummaries(param) {
			const { columns, data } = param
			const sums = []
			let invoiceAmountAll = 0
			let taxAmountAll = 0
			let quantityAll = 0
			data.forEach(v => {
				invoiceAmountAll += Number(v.invoiceAmount) || 0
				taxAmountAll += Number(v.taxAmount) || 0
				quantityAll += Number(v.quantity) || 0
			})
			columns.forEach((column, index) => {
				if (index === 1) {
					sums[index] = '合计'
					return
				}
				if (index === 4) {
					sums[index] = quantityAll
					return
				}
				if (index === 6) {
					sums[index] = formatNumberToThousands(invoiceAmountAll)
					return
				}
				if (index === 8) {
					sums[index] = formatNumberToThousands(taxAmountAll)
					return
				}
			})
			return sums
		},
		validate() {
			if (this.invoiceItem.items >= 8 && this.invoiceItem.invoiceMedium === 1) {
				// 纸质税票货物或应税劳务、服务名称不能超过8条！
				this.$message.error(this.$t('fmsReceiveInvoice.itemLengthCheck'))
				return
			}
			let VR = true
			this.$refs.invoiceItemsRef.validate(valid => {
				VR = valid
			})
			if (!VR) {
				// 请先填写完整
				this.$message.error(this.$t('fmsReceiveInvoice.pleaseInputComplete'))
				return false
			}
			let flag = false
			let total = 0
			this.invoiceItem.items.forEach(v => {
				// 判断这是真实存在的一行
				if (v.itemTypeName) {
					if (Number(v.quantity) * Number(v.price) !== Number(v.invoiceAmount)) {
						flag = true
					}
					total += Number(v.invoiceAmount)
				}
			})

			if (flag) {
				// '金额填写的不对，单价乘以数量与该行金额不一致！'
				this.$message.error(this.$t('fmsReceiveInvoice.priceInputError1'))
				return false
			}
			if (total !== this.invoiceItem.invoiceAmount) {
				// 金额填写的不对，填写的总金额和实际总金额不一致！
				this.$message.error(this.$t('fmsReceiveInvoice.priceInputError2'))
				return false
			}
			return VR
		},
		getValue() {
			let items = []
			this.invoiceItem.items.forEach(v => {
				if (v.itemTypeName) {
					items.push(v)
				}
			})
			let data = {
				...this.invoiceItem,
				items: items
			}
			return data
		},
		invoiceAmountChange(index) {
			// 计算税额
			let item = this.$extends(true, {}, this.invoiceItem.items[index])
			let rate = item.taxRate / 100 || 0
			item.taxAmount = (item.invoiceAmount / (1 + rate) * rate).toFixed(2)
			let items = this.$extends(true, [], this.invoiceItem.items)
			items[index] = item
			this.invoiceItem.items = items
		}

	}
}
</script>
<style lang="scss" scoped>
.invoice-container {
	background: #fff;
	padding: 12px;
	color: #666;
	font-size: 14px;
	font-weight: 500;

	.set-color {
		color: #c97e5f;
		font-size: 14px;
		font-weight: 600;
	}
}
.invoice-container-item {
	background: #fff;
	border: 1px solid #eee;
	border-radius: 6px;
	padding: 20px 10px 10px 10px;
	max-width: 1134px;
}
.invoice-title {
	margin-bottom: 10px;
	font-size: 30px !important;
	color: #c97e5f;
	line-height: 30px;
	font-weight: 400 !important;
	text-align: center;
}
.invoice-row.summary {
	display: flex;
	line-height: 40px;
	border-top: 2px solid #c97e5f;
	border-left: 2px solid #c97e5f;
	border-right: 2px solid #c97e5f;
	.summary-text {
		width: 401px;
		text-align: center;
		border-right: 2px solid #c97e5f;
	}
	.summary-value {
		flex: 1;
	}
}
.text-h {
	text-align: center;
}
.invoice-row {
	background: #fff;
	line-height: 40px;
}

.name-justify i {
	display: inline-block;
	width: 55px;
	height: 5px;
}
.invoice-row-table {
	background: #fff;
	line-height: 40px;
	display: flex;

	::v-deep .el-col {
		border-top: 2px solid #c97e5f;
		border-left: 2px solid #c97e5f;
		border-bottom: 2px solid #c97e5f;
	}
	::v-deep .el-col:last-child {
		border-right: 2px solid #c97e5f;
	}

	.invoice-column {
		height: 100%;
		padding: 0 5px;

		.invoice-item {
			display: flex;
			line-height: 30px;

			.invoice-item-label {
				min-width: 120px;
				padding-right: 10px;
				padding-left: 4px;
			}
			.invoice-item-value {
				flex: 1;
				width: 0;
			}
		}
	}
}

.invoice-row-item label {
	margin-right: 10px;
}

.invoice-row-item span {
	font-size: 14px;
	font-style: normal;
	color: #152441;
}
.invoice-items-ref .el-form-item {
	margin-bottom: 0;
}

.oper-btn {
	font-size: 20px;
	cursor: pointer;
}

::v-deep .el-table th {
	line-height: 25px;
}
::v-deep .el-table__body-wrapper td {
	padding: 0;
}

::v-deep .el-table th > .cell {
	font-weight: 500;
	font-size: 14px;
	color: #ca8263;
}
::v-deep .el-table--border th,
::v-deep .el-table--border td {
	border-right-color: #c97e5f;
	border-right-width: 2px;
}

::v-deep .el-table--border th {
	font-weight: 600;
}

::v-deep .el-table--border tr th:nth-last-child(1),
::v-deep .el-table--border tr th:nth-last-child(2),
::v-deep .el-table--border tr td:last-child,
::v-deep .el-table__footer-wrapper tr td:nth-last-child(1),
::v-deep .el-table__footer-wrapper tr td:nth-last-child(2) {
	border-right: none;
}

::v-deep .el-table--group,
::v-deep .el-table--border {
	border: 2px solid #c97e5f;
	border-bottom: none;
	border-top: none;
}

::v-deep .el-form-item--medium .el-form-item__content {
	line-height: 28px;
	margin-top: 2px;
}
::v-deep .el-table .cell {
	line-height: 32px;
}

::v-deep .el-table__body-wrapper {
	min-height: 252px !important;
}
.oh {
	display: block;
	min-width: 100px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
