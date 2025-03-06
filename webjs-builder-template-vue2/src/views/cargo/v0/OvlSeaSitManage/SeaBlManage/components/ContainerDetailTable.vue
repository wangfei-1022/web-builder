<template>
    <div>
      <el-table border ref="multipleTable" stripe size="mini" :data="dataList" style="width: 100%" :header-cell-style="{background:'#f5f7f7',color:'#707171'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="getZH('importIinfo')" width="300">
          <template slot-scope="{row}">
            <div class="content-box">
              <div class="flex-box"><span>{{getZH('customerName')}}：</span><span class="color-highlight text-ellipsis">{{row.customerShortName||'-'}}</span> <span @click="updateInfo(row)" class="el-icon-edit fs-16 ml-10 pointer"></span></div>
              <div class="flex-box"><span>{{getZH('importer')}}：</span><span class="text-ellipsis">{{row.importer||'-'}}</span></div>
              <div class="flex-box"><span>{{getZH('saller')}}：</span><span class="text-ellipsis">{{row.saller||'-'}}</span></div>
              <div class="flex-box"><span>{{getZH('purchaser')}}：</span><span class="text-ellipsis">{{row.actualBuyer||'-'}}</span></div>
              <div class="flex-box"><span>{{getZH('warehouseName')}}：</span><span class="text-ellipsis">{{row.warehouseName||'-'}}</span></div>
              <div class="flex-box"><span>{{getZH('clearInvoiceNo')}}：</span><span class="text-ellipsis">{{row.clearInvoiceNo||'-'}}</span></div>
              <div class="flex-box"><span>{{getZH('tradeTerm')}}：</span><span class="text-ellipsis">{{row.tradeTerm||'-'}}</span></div>
              <div class="flex-box"><span>{{getZH('blNo')}}：</span><span class="text-ellipsis">{{row.blNo||'-'}}</span></div>
              <div class="mt-20 color-highlight pointer" @click="showLogs(row)">{{getZH('logInfo')}}》</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="getZH('cabinetIinfo')" min-width="400">
          <template slot-scope="{row}">
            <div class="content-box">
              <el-row :gutter="10">
                <el-col :span="24">
                  <div><span>{{getZH('latestDateOfStorage')}}：</span><span class="color-highlight">{{row.lastInboundDate | formatDate('YYYY-MM-DD','-')}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('containerNo')}}：</span><span class="color-highlight">{{row.ctnNo || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div class="flex-box"><span>{{getZH('blNo')}}：</span ><span class="color-highlight text-ellipsis">{{row.blNo || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div class="flex-box"><span>{{getZH('masterNo')}}：</span><span class="color-highlight text-ellipsis">{{row.mblNo || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('shipowner')}}：</span><span class="color-highlight">{{row.carrierShortName || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('vessel')}}：</span><span class="color-highlight">{{row.vessel || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('voyage')}}：</span><span class="color-highlight">{{row.voyage || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>SKU ID：</span><span class="color-highlight">{{row.goodsSkuCodeJson || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('skuName')}}：</span><span class="color-highlight">{{row.goodsNameJson || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('wattage')}}：</span><span class="color-highlight">{{row.wattNumJson || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('totalTray')}}：</span><span class="color-highlight">{{row.totalTray || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('numberDrag')}}：</span><span class="color-highlight">{{row.trayGoodsNum || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('totalSku')}}：</span><span class="color-highlight">{{row.totalSku || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('nw')}}：</span><span class="color-highlight">{{row.totalNw || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('gw')}}：</span><span class="color-highlight">{{row.totalGw || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('totalWatt')}}：</span ><span class="color-highlight">{{row.totalWatt || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('goodsValue')}}：</span><span class="color-highlight">{{row.totalImportValue || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('oceanFreight')}}：</span><span class="color-highlight">{{row.freight || '-'}}</span></div>
                </el-col>
                <el-col :span="8">
                  <div><span>{{getZH('premium')}}：</span><span class="color-highlight">{{row.premium || '-'}}</span></div>
                </el-col>
                <el-col :span="24" class="mt-20">
                  <div class="flex-box">
                    <span>{{getZH('remark')}}：</span>
                    <span class="color-highlight" v-if="!row.remarkEdit">{{row.remark || '-'}}</span>
                    <el-input size="mini" class="remarkInput" type="textarea" ref="remarkInput" v-model="remarkContent" v-else  :placeholder="inputZH('remark')" ></el-input>
                    <span @click="updateInfoRemark(row)"  v-if="!row.remarkEdit" class="el-icon-edit fs-16 ml-10 pointer"></span>
                    <span @click="saveRemark(row)"  v-else class="el-icon-finished fs-24 ml-10 pointer"></span>

                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="getZH('destinationPortInfo')" width="220">
          <template slot-scope="{row}">
            <div class="content-box">
              <div><span>{{getZH('destinationPort')}}：</span><span>{{row.pod || '-'}}</span></div>
              <div><span>{{getZH('Trayervice')}}：</span><el-checkbox disabled size="mini" v-model="row.tranFlag"></el-checkbox></div>
              <div><span>{{getZH('clearanceService')}}：</span><el-checkbox disabled size="mini"  v-model="row.clearanceFlag"></el-checkbox></div>
              <div><span>{{getZH('exchangeService')}}：</span><el-checkbox disabled size="mini" v-model="row.blFlag"></el-checkbox></div>
              <div><span>{{getZH('returnContainer')}}：</span><span >{{row.returnEmptyDock || '-'}}</span></div>
              <div class="flex-box"><span>{{getZH('delegateCustomsAffairs')}}：</span><span class="text-ellipsis">{{row.customsSupplierShortName  || '-'}}</span></div>
              <div><span>{{getZH('delegationChangeOrder')}}：</span><span>{{row.doSupplierShortName || '-'}}</span></div>
              <el-row :gutter="10">
                <el-col :span="12"> <div class="flex-box"><span>{{getZH('bl')}}：</span>
                  <span class="round-box red" v-if="!row.blFileFlag"></span>
                  <el-tooltip class="item" effect="dark" :content="row.blFileFlagData.originFileName" placement="top-start"  v-else>
                    <span class="round-box green" @click="downFile(row.blFileFlagData)"></span>
                  </el-tooltip>
                  <!-- <span class="round-box" :class="row.blFileFlag?'green':'red'" @click="downFile(row.blFileFlagData)"></span> -->
                </div></el-col>
                <el-col :span="12"><div class="flex-box"><span>{{getZH('ctn')}}：</span>
                  <span class="round-box red" v-if="!row.ctnFlag"></span>
                  <el-tooltip class="item" effect="dark" :content="row.ctnFlagData.originFileName" placement="top-start"  v-else>
                    <span class="round-box green" @click="downFile(row.ctnFlagData)"></span>
                  </el-tooltip>
                  <!-- <span class="round-box " :class="row.ctnFlag?'green':'red'" @click="downFile(row.ctnFlagData)"></span> -->
                </div></el-col>
                <el-col :span="12"><div class="flex-box"><span>{{getZH('invoice')}}：</span>
                  <span class="round-box red" v-if="!row.invoiceFlag"></span>
                  <el-tooltip class="item" effect="dark" :content="row.invoiceFlagData.originFileName" placement="top-start"  v-else>
                    <span class="round-box green" @click="downFile(row.invoiceFlagData)"></span>
                  </el-tooltip>
                  <!-- <span class="round-box " :class="row.invoiceFlag?'green':'red'" @click="downFile(row.invoiceFlagData)"></span> -->
                </div></el-col>
                <el-col :span="12"><div class="flex-box"><span>{{getZH('ctnDetails')}}：</span>
                  <span class="round-box red" v-if="!row.ctnDetailsFlag"></span>
                  <el-tooltip class="item" effect="dark" :content="row.ctnDetailsFlagData.originFileName" placement="top-start"  v-else>
                    <span class="round-box green" @click="downFile(row.ctnDetailsFlagData)"></span>
                  </el-tooltip>
                </div></el-col>
                <el-col :span="12"> <div class="flex-box"><span>DO：</span>
                  <span  v-if="!row.DOFlag">-</span>
                  <el-tooltip class="item" effect="dark" :content="row.DOFlagData.originFileName" placement="top-start"  v-else>
                    <span class="round-box green" @click="downFile(row.DOFlagData)"></span>
                  </el-tooltip>
                <!-- <span v-if="row.DOFlag" class="round-box green"  @click="downFile(row.DOFlagData)"></span>
                <span v-else>-</span> -->
                </div></el-col>
                <el-col :span="12"> <div class="flex-box"><span>{{getZH('customsClearanceData1')}}：</span>
                 <span  v-if="!row.customsFile">-</span>
                  <el-tooltip class="item" effect="dark" :content="row.customsFile.originFileName" placement="top-start"  v-else>
                    <span class="round-box green" @click="downFile(row.customsFile)"></span>
                  </el-tooltip>
                  <!-- <span v-if="row.customsFile" class="round-box green"  @click="downFile(row.customsFile)"></span><span v-else>-</span> -->
                </div></el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="getZH('dateDynamics')" width="200">
          <template slot-scope="{row}">
            <div class="content-box">
              <div><span>{{getZH('declareDate')}}：</span><span>{{row.declareDate | formatDate('YYYY-MM-DD','-')}}</span></div>
              <div><span>{{getZH('ata')}}：</span><span>{{row.ata | formatDate('YYYY-MM-DD','-')}}</span></div>
              <div><span>{{getZH('doFinishDate')}}：</span><span>{{row.doFinishDate | formatDate('YYYY-MM-DD','-')}}</span></div>
              <div><span>{{getZH('freePeriod')}}：</span><span>{{row.freeStorageDay || ''}}</span></div>
              <div><span>{{getZH('deliveryDate')}}：</span><span>{{row.pickUpTime | formatDate('YYYY-MM-DD','-')}}</span></div>
              <div><span>{{getZH('arrivalDate')}}：</span><span>{{row.inboundDate | formatDate('YYYY-MM-DD','-')}}</span></div>
              <div><span>{{getZH('usingBox')}}：</span><span>{{row.freeBoxDay }}</span></div>
              <div><span>{{getZH('returnDate')}}：</span><span>{{row.returnTime  | formatDate('YYYY-MM-DD','-')}}</span></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <ImportInfoDialog :visible.sync="dialog.visible" @saved="$emit('saved')" :initData="initData" />
      <CtnLogDialog :visible.sync="ctnLogVisible" :ctnId="activeId" />
    </div>
</template>

<script>
import { updateSeaCtnRemarkApi } from '@/api/OvlSeaSitManage/seaBl'
import ImportInfoDialog from './ImportInfoDialog'
import CtnLogDialog from './CtnLogDialog'
export default {
	name: 'CustomsDeclarationTable',
	components: { ImportInfoDialog, CtnLogDialog },
	props: {
		dataList: Array
	},
	data() {
		return {
			remarkContent: null,
			selectedData: [],
			ctnLogVisible: false,
			activeId: null,
			tableHeight: document.documentElement.clientHeight - 460,
			initData: {
				id: null,
				ctnNo: null,
				customerName: null,
				customerShortName: null,
				customerId: null
			}
		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		handleSelectionChange(val) {
			this.selectedData = val
		},
		/**
	 * 下拉框
	 */
		selectZH(key) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
		},
		/**
		 * 输入框
		 */
		inputZH(key) {
			return this.getZH('placeholder', 'common') + this.getZH(key)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'seaBl'
			let str = obj + '.' + key
			return this.$t(str)
		},
		// 查看日志
		showLogs(row) {
			this.activeId = row.id
			this.ctnLogVisible = true
		},
		// 更新进口信息
		updateInfo(row) {
			this.$copyProps(this.initData, row)
			this.dialog.visible = true
		},
		// 更新备注
		updateInfoRemark(row) {
			this.remarkContent = null
			this.$set(row, 'remarkEdit', true)
			this.$nextTick(() => {
				this.$refs.remarkInput.focus()
			})
		},
		saveRemark(row) {
			row.remarkEdit = false
			if (this.$isNotEmpty(this.remarkContent)) {
				let data = {
					id: row.id,
					remark: this.remarkContent
				}
				updateSeaCtnRemarkApi(data).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.updateSuccess'))
						this.$emit('saved')
					}
				})

			}

		},
		// 下载文件
		downFile(row) {
			console.log(row);

			if (this.$isEmpty(row)) {
				return
			}
			let obj = {
				fileName: row.originFileName,
				url: row.url
			}
			this.downloadFile(obj)
		}
	}
};
</script>

<style scoped lang="less">
.text-ellipsis {
	width: calc(100% - 100px);
	display: block;
}
.content-box {
	// margin-top: -21px;
	height: 260px;
	.color-highlight {
		color: #15c4c4;
	}
}
.remarkInput {
	width: 70%;
}
.round-box {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	&.green {
		background-color: #36b04b;
		cursor: pointer;
	}
	&.red {
		background-color: #f40000;
	}
}

.label-content {
	font-size: 12px;
	margin-bottom: 10px;
	color: #606266;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.empty-box {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	color: #606266;
	height: 60px;
}
</style>
