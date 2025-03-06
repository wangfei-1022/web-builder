<template>
  <div class="card-content">
    <div v-if="priceCardType == '10'">
      <p>{{$t('warehousePriceCard.cost_price_info_mention_one')}}</p>
      <p>{{$t('warehousePriceCard.cost_price_info_mention_two')}}</p>
      <p>{{$t('warehousePriceCard.cost_price_info_mention_three')}}</p>
    </div>
    <div v-if="priceCardType == '12'">
      <p>{{$t('warehousePriceCard.lower_price_info_mention_one')}}</p>
      <p>{{$t('warehousePriceCard.lower_price_info_mention_two')}}</p>
      <p>{{$t('warehousePriceCard.lower_price_info_mention_three')}}</p>
    </div>
    <div v-if="priceCardType == '11'">
      <p>{{$t('warehousePriceCard.guide_price_info_mention_one')}}</p>
      <p>{{$t('warehousePriceCard.guide_price_info_mention_two')}}</p>
      <p>{{$t('warehousePriceCard.guide_price_info_mention_three')}}</p>
    </div>
    <div v-if="priceCardType == '13'">
      <p>{{$t('warehousePriceCard.customer_price_info_mention_one')}}</p>
      <p>{{$t('warehousePriceCard.customer_price_info_mention_two')}}</p>
    </div>

    <div v-if="priceCardType == '12' || priceCardType == '11' || priceCardType == 'COPY' || priceCardType == '13'">
      <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
        <el-form-item :label="$t('warehousePriceCard.customer_name')" prop="customerId" v-if="priceCardType == '13'">
          <MemberList v-model="formData.customerId"	@selected="setCustomerInfo"	clearable	/>
        </el-form-item>

        <el-form-item :label="$t('warehousePriceCard.warehouse_name')" prop="warehouseId">
          <el-select size="mini" v-model="form.warehouseId" :placeholder="$t('warehousePriceCard.please_select_warehouse_name')" @change="changeWarehouse">
            <el-option v-for="item in warehouseIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('warehousePriceCard.new_price_card_type')" prop="priceCardType" v-if="priceCardType == 'COPY'">
          <el-select size="mini" v-model="form.priceCardType" :placeholder="$t('warehousePriceCard.please_select_price_card_type')" @change="changeGetList">
            <el-option v-for="item in priceCardTypes" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>

        <div style="padding: 10px 20px;">
          <el-table border ref="multipleTable" :data="tableData" @select="select" @select-all="selectAll" v-if="tableData.length > 0" style="width: 100%;">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="priceCardName" :label="$t('warehousePriceCard.price_card_name')" width="100"></el-table-column>
            <el-table-column prop="priceCardTypeName" :label="$t('warehousePriceCard.price_card_type')" width="150"></el-table-column>
            <el-table-column prop="expiryDateStart" :label="$t('warehousePriceCard.effective_start_time')" width="160"></el-table-column>
            <el-table-column prop="expiryDateEnd" :label="$t('warehousePriceCard.effective_end_time')"></el-table-column>
          </el-table>
        </div>

        <div v-if="tableData.length > 0">
          <el-form-item :label="$t('warehousePriceCard.price_card_name')" prop="priceCardName">
            <el-input v-model="form.priceCardName" size="mini"></el-input>
          </el-form-item>
          <el-form-item :label="$t('warehousePriceCard.adjustment_coefficient')" prop="adjustmentCoefficient" v-if="priceCardType != 'COPY'">
            <el-input v-model="form.adjustmentCoefficient" size="mini" oninput="value=value.replace(/[^\d\.]/g,'')"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getWarehousePriceCardsTypeListApi, getWarehouseCustomerPriceCardsTypeListApi, getWarehouseSelectionsApi, checkCardNameExists } from '@/api/OverseasWarehouse/warehousePriceCard'
import { parseTime } from '@/utils/index'
import { priceCardTypes } from '@/utils/constant'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'

export default {
	name: 'Price',
	components: {
		cargoLimitedSelect
	},
	props: {
		priceCardType: {
			type: [String, Number],
			require: true
		}
	},
	data() {
		const validateName = (rule, value, callback) => {
			if (!value) {
				callback(this.$t('warehousePriceCard.please_enter_cost_price_card_name'))
			} else {
				checkCardNameExists({ priceCardName: value, cardType: this.priceCardType }).then(res => {
					if (res.ok && res.content) {
						callback(this.$t('warehousePriceCard.price_card_name_repeat'))
					} else {
						callback()
					}
				})
			}
		}
		return {
			priceCardTypes: priceCardTypes,
			form: {
				// 关联的价卡id
				associatedPriceCardId: '',
				priceCardType: '',
				customerId: '',
				customerName: '',
				warehouseId: '',
				warehouseCode: '',
				warehouseName: '',
				supplierId: '',
				supplierName: '',
				countryName: '',
				countryCode: '',
				priceCardName: '',
				adjustmentCoefficient: ''
			},
			formRules: {
				customerId: [{ required: true, message: this.$t('warehousePriceCard.please_select_customer_name') }],
				warehouseId: [{ required: true, message: this.$t('warehousePriceCard.please_select_warehouse_name') }],
				priceCardType: [{ required: true, message: this.$t('warehousePriceCard.please_select_price_card_type') }],
				priceCardName: [{ required: true, validator: validateName, trigger: 'blur' }],
				adjustmentCoefficient: [{ required: true, message: this.$t('warehousePriceCard.please_enter_adjustment_coefficient') }]
			},
			tableData: [],
			selectionList: [],
			warehouseIdList: []
		}
	},
	created() {
		this.init()
	},
	methods: {
		setCustomerInfo(customer) {
			this.form.customerId = customer.id
			this.form.customerName = customer.chineseName
		},
		init() {
			getWarehouseSelectionsApi().then(res => {
				if (res.ok) {
					this.warehouseIdList = res.content || []
				}
			})
		},
		getValue() {
			this.form.associatedPriceCardId = this.selectionList[0].id
			return this.form
		},
		validate() {
			if (this.selectionList.length === 0) {
				this.$message.warning(this.$t('warehousePriceCard.please_select_price_card_one_data'))
				return false
			}
			let val = true
			this.$refs.form.validate(valid => {
				val = valid
			})
			return val
		},
		changeGetList() {
			let cardType = 10
			if (this.priceCardType === 'COPY') {
				// 如果是复制 则作单独处理
				if (!this.form.priceCardType) {
					return
				}
				cardType = this.form.priceCardType
			}
			let fn = getWarehousePriceCardsTypeListApi
			// 如果是客户使用这个接口
			if (this.priceCardType === 13) {
				fn = getWarehouseCustomerPriceCardsTypeListApi
			}
			fn({ cardType: this.form.priceCardType || 10, warehouseId: this.form.warehouseId }).then(res => {
				if (res.ok) {
					res.content.forEach(function (v) {
						v.expiryDateStart = parseTime(v.expiryDateStart, '{y}-{m}-{d} {h}:{i}:{s}')
						v.expiryDateEnd = parseTime(v.expiryDateEnd, '{y}-{m}-{d} {h}:{i}:{s}')
					})
					this.tableData = res.content || []
				}
			})
		},
		changeWarehouse() {
			let index = this.warehouseIdList.findIndex(item => item.id === this.form.warehouseId)
			this.form.warehouseCode = this.warehouseIdList[index].code
			this.form.warehouseName = this.warehouseIdList[index].name
			this.form.supplierId = this.warehouseIdList[index].supplierId
			this.form.supplierName = this.warehouseIdList[index].supplierName
			this.form.countryName = this.warehouseIdList[index].countryName
			this.form.countryCode = this.warehouseIdList[index].countryCode
			this.changeGetList()
		},

		select(selection, row) {
			if (selection.length > 1) {
				let del_row = selection.shift()
				this.$refs.multipleTable.toggleRowSelection(del_row, false)
			}
			this.selectionList = selection
		},
		selectAll(selection) {
			if (selection.length > 1) {
				selection.length = 1
			}
		}
	}
}
</script>

<style scoped lang="scss">
.card-content {
	height: 400px;
	overflow-y: auto;
	overflow-x: hidden;
	padding-right: 15px;

	font-weight: 500;
	color: #606266;

	p {
		margin-top: 0;
	}
	.icon {
		font-size: 18px;
		cursor: pointer;
	}
}

.el-form-item {
	width: 300px;
	float: left;
	margin-bottom: 10px;
	color: #606266;
}

::v-deep .el-table--medium th,
::v-deep .el-table--medium td {
	font-weight: 500;
	padding: 4px 0;
	color: #606266;
}
</style>
