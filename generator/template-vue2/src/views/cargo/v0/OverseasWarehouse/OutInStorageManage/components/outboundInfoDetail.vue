<template>
  <div>
    <div class="info-title">{{ getZH("outDetail") }}</div>
    <div v-if="$isEmpty(detailContent.outboundDetailList)" class="empty-tips flex-center">
      <span>{{getZH('noOutbound')}}</span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in detailContent.outboundDetailList || []" :key="item.orderNo" :label="item.orderNo" :name="item.orderNo">
        <div class="page-content mt-20 mb-10 flex-box">
          <div class="mr-20">
            <span>{{getZH('orderNo')}}：</span>
            <span class="link" @click="detailFn(item.id)">{{item.orderNo}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('status')}}：</span>
            <span>{{item.statusName || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('trayNum')}}：</span>
            <span>{{item.actualPalletQuantity || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('numberPackages')}}：</span>
            <span>{{item.skuQuantity || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('netWeightTotal')}}：</span>
            <span>{{item.totalWeight || '-'}}</span>
          </div>
        </div>
        <div class="page-content flex-box">
          <div class="mr-20">
            <span>{{getZH('outTime')}}：</span>
            <span>{{item.outTime | formatDate('YYYY-MM-DD','-')}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('pickTime')}}：</span>
            <span>{{item.pickTime | formatDate('YYYY-MM-DD','-')}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('loadingTime')}}：</span>
            <span>{{item.loadingTime | formatDate('YYYY-MM-DD','-')}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('carNo')}}：</span>
            <span>{{item.carNo || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('carrierName')}}：</span>
            <span>{{item.carrierName || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>loadingReference：</span>
            <span>{{item.loadingReference || '-'}}</span>
          </div>
        </div>
        <div class="page-content flex-box">
          <div class="mr-20">
            <span>{{getZH('consigneePhoneno')}}：</span>
            <span>{{item.arrivalContact || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('consigneeTel')}}：</span>
            <span>{{item.arrivalContactTel || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('arrivalAddress')}}：</span>
            <span>{{item.arrivalAddress1 || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('deliveryAddressCountry')}}：</span>
            <span>{{item.arrivalCountry || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('deliveryAddressProvince')}}：</span>
            <span>{{item.arrivalProvince || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('deliveryArrivalCity')}}：</span>
            <span>{{item.arrivalCity || '-'}}</span>
          </div>
          <div class="mr-20">
            <span>{{getZH('deliveryAddressZipCode')}}：</span>
            <span>{{item.arrivalZipcode || '-'}}</span>
          </div>
        </div>
        <div class="page-content" v-if="!detailContent.pickup">
          <div>{{getZH('logicProductName')}}：</div>
          <div class="flex-box ml-20">
            <div>
              {{getZH('childProduct')}}：{{item.productName}}
            </div>
            <div class="ml-20">
              {{getZH('prescription')}}：{{item.aging}}
            </div>
          </div>
          <div class="flex-box ml-20">
            <div class="ml-20" v-for="serviceItem in item.serviceList"  :key="serviceItem.serviceCode">
              <div class="flex-box">
                <div >{{ serviceItem.serviceName }}：</div>
                <div  v-if="serviceItem.serviceContentJson">{{ serviceItem.serviceItemNames }}</div>
                <div  v-if="serviceItem.serviceCode === 'INSURANCE' && ['2','3'].includes(serviceItem.serviceItemValues) && $isNotEmpty(serviceItem.serviceItemCurrency)">{{`${$t("outInStorageManage.amountVal")}（${serviceItem.serviceItemCurrency}）`}}{{serviceItem.serviceItemAmount || '-'}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-content">
            <div >
            <span>{{getZH('remark')}}：</span>
            <span>{{item.remarks }}</span>
          </div>
        </div>
        <el-table border :data="item.batchGoodsList || []" size="mini" stripe style="width: 100%" class="mb-20">
          <el-table-column :label="getZH('number')" width="50">
            <template slot-scope="{$index}">
              <span>{{$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="getZH('containerNumber')" prop="containerNumber" min-width="150" show-overflow-tooltip />
          <el-table-column prop="clearanceType" :label="getZH('customsClearanceType')" width="120">
            <template slot-scope="{row}">
              <div>{{row.clearanceType || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column  :label="getZH('trayNo')" prop="traceId" min-width="150" show-overflow-tooltip />
          <el-table-column min-width="110" :label="detailContent.productType === 2 ? getZH('materielCode') : getZH('specifications')">
            <template slot-scope="{row}">
              <div>{{detailContent.productType === 2 ? (row.productCode || '-') : (row.specifications || '-')}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="getZH('blockNum')" width="110">
            <template slot-scope="{row}">
              {{row.quantity || '-'}}
            </template>
          </el-table-column>
          <el-table-column :label="getZH('location')" min-width="110" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{row.stockLocation || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="SN" prop="sn" min-width="120" show-overflow-tooltip />
          <el-table-column :label="getZH('ownerCode')" min-width="110" show-overflow-tooltip v-if="detailContent.productType === 2">
            <template slot-scope="{row}">
              <span>{{row.ownerName || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="grossWeightPallet" :label="getZH('grossWeightPallet')" width="130" v-if="detailContent.productType === 2">
            <template slot-scope="{row}">
              {{row.palletWeight || '-'}}
            </template>
          </el-table-column>
          <el-table-column :label="getZH('damageFlag')" width="110" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{row.damageFlag ? 'Y' :'N'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import getZHMixin from './getZHMixin'
import OutBoundProduct from './outBoundProduct'
export default {
	name: 'OutboundInfoDetail',
	components: { OutBoundProduct },
	mixins: [getZHMixin],
	props: {
		detailContent: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {
			activeName: this.$isEmpty(this.detailContent.outboundDetailList) ? null : this.detailContent.outboundDetailList[0].orderNo
		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
        detailFn(id, type) {
            type = type || '0';
            this.$router.push({ name: 'OutboundDetail', query: { id: id, time: new Date().getTime(), type } });
        },
		// async getLastService() {
		// 	let data = {
		// 		customerId: this.detailContent.customerId,
		// 		warehouseId: this.detailContent.warehouseId,
		// 		transportMode: 2
		// 	}
		// 	let res = await getLastServiceApi(data)
		// 	if (res.ok) {
		// 		res.content.forEach(v => {
		// 			if (v.id === this.formData.productId) {
		// 				v.services.forEach(service => {
		// 					service.defaultVal = this.lastLegServiceListMap[service.code] ? this.lastLegServiceListMap[service.code].value : service.childrenServices[0].code
		// 				})
		// 			} else {
		// 				v.services.forEach(service => {
		// 					service.defaultVal = service.childrenServices[0].code
		// 				})
		// 			}
		// 		})
		// 		this.productList = res.content
		// 	}
		// }
	}
};
</script>

<style scoped lang="less">
.page-content {
	color: #606266;
	font-size: 14px;
	flex-wrap: wrap;
	& > div {
		white-space: nowrap;
		margin-bottom: 22px;
		min-width: 300px;
	}
}
.empty-tips {
	width: 300px;
	height: 60px;
	font-size: 16px;
	color: #909399;
}
</style>
