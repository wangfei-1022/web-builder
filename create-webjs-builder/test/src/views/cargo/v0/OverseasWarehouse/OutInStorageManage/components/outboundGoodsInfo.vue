<template>
  <div>
    <div class="info-title">{{ getZH("outboundGoods") }}</div>
    <div class="page-content mt-20 flex-box">
      <div class="mr-20">
        <span>{{getZH('totalTaskTorus')}}：</span>
        <span>{{data.trayCount || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('totalTaskTorusByOutbound')}}：</span>
        <span>{{data.outboundTrayCount || 0}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('GW')}}：</span>
        <span>{{data.palletWeightCount || 0}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('netWeightTotal')+'（KG）'}}：</span>
        <span>{{data.totalNetWeight || 0}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('outboundCount')}}：</span>
        <span>{{data.outboundCount || 0}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('waitOutboundTrayCount')}}：</span>
        <span>{{data.waitOutboundTrayCount || 0}}</span>
      </div>
    </div>
    <el-table :data="data.outboundTaskDetails || []" stripe border>
      <el-table-column :label="getZH('number')" width="50">
        <template slot-scope="{$index}">
          <span>{{$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" :label="getZH('orderNo')" min-width="120">
        <template slot-scope="{row}">
          <div>{{row.outboundNo || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="containerNumber" :label="getZH('containerNumber')" min-width="120">
        <template slot-scope="{row}">
          <div>{{row.containerNumber || '-'}}</div>
        </template>
      </el-table-column>
       <el-table-column prop="traceId" :label="getZH('trayNo')" min-width="120">
        <template slot-scope="{row}">
          <div>{{row.traceId || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column :label="data.productType === 2 ? getZH('materielCode') : getZH('specifications')"  min-width="140">
        <template slot-scope="{row}">
          <div>{{data.productType === 2 ? (row.productCode || '-') : (row.specifications || '-')}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" :label="getZH('blockNum')" width="140">
        <template slot-scope="{row}">
          {{row.quantity || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" :label="getZH('ownerCode')" show-overflow-tooltip  min-width="120">
        <template slot-scope="{row}">
          {{row.ownerName || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="palletWeight" :label="getZH('trayGW')" width="130">
        <template slot-scope="{row}">
          {{row.palletWeight || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="damageFlag" :label="this.getZH('damageFlag')" width="90">
        <template slot-scope="{row}">
          {{ row.damageFlag ? 'Y' : 'N' }}
        </template>
      </el-table-column>
    </el-table>
    <div class="info-title  mt-20 mb-20">{{ getZH("outgoingGoods") }} <span v-if="!isEdit" class="addBtn fc-blue pointer" @click="addItem()">{{getZH('addBtn','common')}}</span></div>
    <div class="goods-info">
      <!-- 组件 （1）是规格 -->
      <el-table :data="formData.outboundGoodsList || []" stripe border size="mini">
        <el-table-column :label="getZH('number')" width="50">
          <template slot-scope="{$index}">
            <span>{{$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="getZH('containerNumber')" min-width="200">
          <template slot-scope="{row}">
            <el-input size="mini" v-model="row.containerNumber" :placeholder="inputZH('containerNumber')" v-if="row.isEdit" @change="containerNumberChange(row)"></el-input>
            <span v-else>{{row.containerNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="data.productType === 2 ? getZH('materielCode') : getZH('specifications')" min-width="200">
          <template slot-scope="{row}">
            <div v-if="row.isEdit">
              <el-select v-model="row.productCode" v-if="data.productType === 2" :placeholder="selectZH('materielCode')" size="mini">
                <el-option v-for="item in filterOptions(row,'productCode')" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
              <el-select v-else v-model="row.specifications"  :placeholder="selectZH('specifications')" size="mini" @change="productSelected($event,row,'specifications')">
                <el-option v-for="item in filterOptions(row,'specifications')" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </div>
            <span v-else>{{ data.productType === 2 ? row.productCode : row.specifications}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="getZH('actualPalletQuantity')" min-width="120" v-if="data.productType === 1">
          <template slot-scope="{row}">
            <el-input size="mini" v-model="row.palletQuantity" :placeholder="inputZH('actualPalletQuantity')" @change="calcQuantity(row)"  oninput="value=value.replace(/[^\d]/g,'')" v-if="row.isEdit"></el-input>
            <span v-else>{{row.palletQuantity}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="getZH('blockNum')" min-width="120">
          <template slot-scope="{row}">
            <el-input size="mini" v-model="row.quantity" :placeholder="inputZH('blockNum')" @blur="calcNetWeightTotal(row)"  oninput="value=value.replace(/[^\d]/g,'')" v-if="row.isEdit && data.productType === 2"></el-input>
            <span v-else>{{row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="getZH('netWeightTotal')" width="120" prop="totalNetWeight" />
        <el-table-column :label="getZH('operation','common')" width="120" fixed="right">
          <template slot-scope="{row,$index}">
            <div v-if="isEdit">
              <el-button type="text" class="fc-blue" v-if="row.isEdit" @click="saveItem(row)"> {{getZH('save','common')}}</el-button>
              <el-button type="text" class="fc-red" v-if="row.isEdit" @click="cancelItem(row,$index)">{{getZH('cancelBtn','common')}}</el-button>
            </div>
            <div v-else>
              <el-button type="text" class="fc-blue" @click="editItem(row)">{{getZH('editBtn','common')}}</el-button>
              <el-button type="text" class="fc-red" @click="delItem($index)">{{getZH('deleteBtn','common')}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
import getZHMixin from './getZHMixin'
import { checkOutboundTaskGoodsApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
export default {
	name: 'OutboundGoodsInfo',
	mixins: [getZHMixin],
	props: {
		data: {
			type: Object,
			default: () => { }
		},
		formData: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {
			isEdit: false,
			tempData: {}
		};
	},
	created() {

	},
	computed: {
		averageNetWeight() {
			let totalNetWeight = this.data.totalNetWeight
			let totalBlockNum = 0
			let averageNum = 0
			this.data.outboundTaskDetails.forEach(item => {
				totalBlockNum += Number(item.quantity)
			})
			// let Decimal = require('decimal')
			// averageNum = (averageNum = new Decimal(totalNetWeight).div(new Decimal(totalBlockNum))).toNumber()
			averageNum = Number(totalNetWeight) / Number(totalBlockNum)
			return averageNum.toFixed(2)
		}
	},
	methods: {
		addItem() {
			let dataItem = {
				quantity: null,
				tempQuantity: null,
				containerNumber: null,
				productCode: null,
				specifications: null,
				palletQuantity: null,
				totalNetWeight: null,
				isEdit: true
			}
			this.formData.outboundGoodsList.push(dataItem)
			this.isEdit = true
		},
		saveItem(row) {
			let key = this.data.productType === 2 ? 'productCode' : 'specifications'
			if (this.$isEmpty(row[key]) || this.$isEmpty(row.quantity)) {
				this.$message.error(this.getZH('outBoundGoodsError'))
				return
			}
			if (this.data.productType === 1 && this.$isEmpty(row.palletQuantity)) {
				this.$message.error(this.getZH('outBoundGoodsError'))
				return
			}
			if (this.$isEmpty(row.containerNumber)) {
				this.$message.error(this.getZH('outBoundGoodsError'))
				return
			}
			let saveData = {
				id: this.data.id,
				containerNumber: row.containerNumber,
				skuCode: row[key],
				quantity: row.quantity
			}
			this.loading = true
			checkOutboundTaskGoodsApi(saveData).then(res => {
				if (res.ok) {
					this.tempData = {}
					this.isEdit = false
					row.isEdit = false
				}
				this.loading = false
			})

		},
		cancelItem(row, index) {
			if (this.$isNotEmpty(this.tempData)) {
				this.$copyProps(row, this.tempData)
			} else {
				this.formData.outboundGoodsList.splice(index, 1)
			}
			this.tempData = {}
			this.isEdit = false
		},
		editItem(row) {
			this.tempData = this.$extends({}, row)
			this.$set(row, 'isEdit', true)
			this.isEdit = true
		},
		delItem(index) {
			this.formData.outboundGoodsList.splice(index, 1)
		},

		// 计算总净重
		calcNetWeightTotal(row) {
			// let Decimal = require('decimal')
			// let totalNetWeight = new Decimal(row.quantity).mul(new Decimal(this.averageNetWeight)).toNumber()
			let totalNetWeight = Number(row.quantity) * Number(this.averageNetWeight)
			row.totalNetWeight = Number(totalNetWeight.toFixed(2))
		},
		filterOptions(row, key) {
			let arr = []
			if (this.$isNotEmpty(row.containerNumber)) {
				arr = this.data.outboundTaskDetails.filter(item => item.containerNumber === row.containerNumber && (this.$isEmpty(item.outboundNo) || this.data.productType === 2))
			}
			let goods = []
			arr = arr.filter(item => row[key] === item[key] || this.$isEmpty(this.formData.outboundGoodsList.find(data => row.containerNumber === data.containerNumber && data[key] === item[key])))
			arr.forEach(item => {
				let index = goods.findIndex(itemData => item[key] === itemData.value)
				if (index === -1) {
					goods.push({
						value: item[key],
						quantity: item.quantity
					})
				}
			})
			return goods
		},
		productSelected(val, row, key) {
			let dataItem = this.data.outboundTaskDetails.find(item => item[key] === val && this.$isEmpty(item.outboundNo) && row.containerNumber === item.containerNumber)
			if (this.$isNotEmpty(dataItem)) {
				let quantity = dataItem.quantity
				// 数量等于 托盘数
				if (this.$isEmpty(row.palletQuantity)) {
					row.palletQuantity = 1
				}
				this.$set(row, 'tempQuantity', quantity)
				row.quantity = quantity
				this.calcQuantity(row)
			}
		},
		containerNumberChange(row) {
			let quantity = null
			row.palletQuantity = null
			this.$set(row, 'tempQuantity', quantity)
			row.quantity = quantity
			row.productCode = null
			row.specifications = null
			this.calcQuantity(row)
		},
		// 计算块数
		calcQuantity(row) {
			let quantity = null
			if (this.$isNotEmpty(row.palletQuantity) && this.$isNotEmpty(row.tempQuantity)) {
				quantity = Number(row.palletQuantity) * Number(row.tempQuantity)
			}
			row.quantity = quantity
			this.calcNetWeightTotal(row)
		}
	}
};
</script>

<style scoped lang="less">
.goods-info {
	width: 1000px;
}
.addBtn {
	font-size: 12px;
	margin-left: 10px;
}
.page-content {
	color: #606266;
	font-size: 14px;
	flex-wrap: wrap;
	& > div {
		white-space: nowrap;
		margin-bottom: 22px;
		min-width: 200px;
	}
}
</style>
