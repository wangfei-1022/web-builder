<template>
  <div>
    <div class="info-title">{{ getZH("outboundGoods") }}</div>
    <div class="page-content mt-20 flex-box">
      <el-form-item :label="`${getZH('customsClearanceType')}：`" prop="clearanceType" v-if="isShowClearanceType" style="margin-right: 20px;">
        <el-select v-model="formData.clearanceType" size="mini" class="w-full" :placeholder="selectZH('customsClearanceType')" @change="clearanceTypeChange">
            <el-option label="BONDED" value="BONDED"></el-option>
            <el-option label="FREE" value="FREE"></el-option>
        </el-select>
        </el-form-item>
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
    <el-table :data="data.outboundTaskDetails || []"  ref="multipleTable" :header-cell-class-name="cellClassName" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" :selectable="checkSelectable" />
      <el-table-column :label="getZH('number')" width="50">
        <template slot-scope="{$index}">
          <span>{{$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="containerNumber" :label="getZH('containerNumber')" min-width="120">
        <template slot-scope="{row}">
          <div>{{row.containerNumber || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="clearanceType" :label="getZH('customsClearanceType')" width="120">
        <template slot-scope="{row}">
          <div>{{row.clearanceType || '-'}}</div>
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
  </div>
</template>
<script>
import getZHMixin from './getZHMixin'
export default {
	name: 'OutboundGoodsSelect',
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
			checkArrFlag: false,
			tempData: {},
			selectedRow: [],
            isShowClearanceType: false
		};
	},
	created() {
        this.data.outboundTaskDetails.forEach(v => {
            if(!v.clearanceType) {
                this.isShowClearanceType = true
            }
        })
    let clearanceTypeArr = this.data.outboundTaskDetails.map(item => item.clearanceType)
    let containerNumberArr = this.data.outboundTaskDetails.map(item => item.containerNumber)
    let checkClearanceTypeArr = [...new Set(clearanceTypeArr)]
    let checkContainerNumberArr = [...new Set(containerNumberArr)]
    this.checkArrFlag = checkClearanceTypeArr.length > 1 || checkContainerNumberArr.length > 1
		this.selectedRow = []
	},
	computed: {
	},
	methods: {
        clearanceTypeChange() {
            this.$refs.multipleTable.clearSelection();
        },
    cellClassName({ columnIndex }) {
      if (columnIndex === 0) { // 第一列是全选列
        if (this.checkArrFlag) {
          return 'hide-select-all' // 返回一个类名，用于隐藏全选按钮
        }
      }
    },
		handleSelectionChange(val) {
			let ids = []
			if(val.length > 0) {
                val.forEach(item => {
                    ids.push(item.id)
                    if(item.clearanceType) {
                        this.formData.clearanceType = item.clearanceType
                    }
                })
                
            }
			this.selectedRow = val
			this.formData.outboundTaskDetailIds = ids
		},
		checkSelectable(row) {
			let flag = true
			if (this.$isNotEmpty(this.selectedRow)) {
				let containerNumber = this.selectedRow[0].containerNumber
				flag = (!row.clearanceType || (this.formData.clearanceType ? this.formData.clearanceType === row.clearanceType : true)) && containerNumber === row.containerNumber
			}
			return flag
		}
	}
};
</script>

<style scoped lang="less">
 ::v-deep .hide-select-all .el-checkbox {
  display: none;
}
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
