<template>
  <div>
    <div class="info-title">{{ getZH("outboundGoods") }} <span class="fc-blue ml-10 fs-12 pointer" @click="exportDetail()">{{getZH('exportBtn','common')}}</span></div>
    <div class="page-content mt-20 flex-box">
      <div class="mr-20">
        <span>{{getZH('trayNum')}}：</span>
        <span>{{detailContent.trayCount || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('totalQuantity')}}：</span>
        <span>{{detailContent.totalQuantity || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('GW')}}：</span>
        <span>{{detailContent.palletWeightCount || '-'}}</span>
      </div>
      <slot name="totalNetWeight" />
    </div>
    <div>
      <el-table :data="detailContent.outboundTaskDetails || []" stripe border class="table-box">
        <el-table-column :label="getZH('number')" width="50">
          <template slot-scope="{$index}">
            <span>{{$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="containerNumber" :label="getZH('containerNumber')"></el-table-column>
        <el-table-column prop="clearanceType" :label="getZH('customsClearanceType')" width="120">
          <template slot-scope="{row}">
            <div>{{row.clearanceType || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="traceId" :label="getZH('trayNo')"></el-table-column>
        <el-table-column :label="detailContent.productType === 2 ? getZH('materielCode') : getZH('specifications')">
          <template slot-scope="{row}">
            <div>{{detailContent.productType === 2 ? (row.productCode || '-') : (row.specifications || '-')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="getZH('blockNum')" minWidth="110">
          <template slot-scope="{row}">
            {{row.quantity || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="ownerName" :label="getZH('ownerCode')" minWidth="110" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.ownerName || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="palletWeight" :label="getZH('trayGW')+ '（KG）'" minWidth="130">
          <template slot-scope="{row}">
            {{row.palletWeight || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="damageFlag" :label="this.getZH('damageFlag')" minWidth="90">
          <template slot-scope="{row}">
            {{ row.damageFlag ? 'Y' : 'N' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import getZHMixin from './getZHMixin'
import { exportDetailOutboundTaskApi } from '@/api/OverseasWarehouse/outInStorageManage.js'
export default {
	name: 'OutBoundInfo',
	mixins: [getZHMixin],
	props: {
		detailContent: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {

		};
	},
	methods: {
		/**
 * 导出明细
 */
		async exportDetail() {
			this.loading = true
			let res = await exportDetailOutboundTaskApi(this.detailContent.id)
			if (res.ok) {
				this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`, this.getZH('handlerTips'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.getZH('theKnow', 'common'),
					callback: () => {
						// this.$router.push({ name: `TaskList`, query: { time: new Date().getTime() } })
						this.loading = false
					}
				})
				this.loading = false
			} else {
				this.loading = false
			}
		}
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
.table-box {
	margin-bottom: 22px;
}
</style>
