<template>
  <div class="app-main-inner">
    <div :class="{'fixed-header-opt':1===1}">
      <div class="app-main-inner-row">
        <div style="display: flex; justify-content: space-between; width: 100%">
          <div>
            <el-select id="jobNoHistory" v-model="nonsense"  size="mini" @change="jump">
              <el-option v-for="(h) in jobNoHistoryReversed" :key="h" :label="h.split(':')[0]" :value="h" />
            </el-select>
            <el-button type="primary" size="mini" style="margin-left:10px;height:28px;" plain @click="backToList">返回列表
            </el-button>
            <el-button type="primary" size="mini" style="height:28px;margin-right:15px;" @click="reloadJob">刷新
            </el-button>
          </div>
          <div>
            <el-button type="success" size="mini" style="margin-left: 10px;height:28px;" @click="toShowAbstract">全景
            </el-button>
            <el-button type="primary" size="mini" style="height:28px" @click="goTo(-1)">上一票</el-button>
            <el-button type="primary" size="mini" style="height:28px" @click="goTo(1)">下一票</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="app-main-inner-row">
      <el-form :model="job" label-width="90px" label-position="left" style="width:100%;max-width: 1200px;">
        <el-tabs v-model="activeTabName" type="border-card" style="width:100%" @tab-click="handleTabClick">
          <el-tab-pane label="询盘信息" name="Basic">
            <basic ref="basic" />
          </el-tab-pane>
          <el-tab-pane label="电子文件" name="ElectronicFile">
            <electronic-file ref="electronicFile" :job="job" />
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div
        v-show="loading"
        style="position: fixed;z-index: 9999;height: 100%;width: 100%;background-color: #2d3a4b22;
      display: flex;justify-content: center;align-items:center"
      >
        <svg-icon icon-class="loading-bars" style="font-size:60px;" />
      </div>
    </div>

  </div>
</template>
<script>
import Basic from './basic'
import ElectronicFile from '../components/electronicFile'
import { toSimulateRefreshingCurrentActiveTag, toSimulateRefreshingListBackingTo } from '@/utils'

import {
	getCustomerContactList, getSeaExportJob, getTruckList, getContainerList,
	getPreManifestList, getManifestList, getLadingNoList, getHblTabInfo, getMblTabInfo,
	getWarehouseDetail, getWarehouseInRecordList, getJobPanorama, getJobPanoramaProfit,
	getJobPanoramaState, getDangerousCargo, getJobNoListRowDataOfConsol,
	getSelectableSlave, appendSlave, removeSlave, createSlave, deleteSlave,
	getElectronicFile, fillClipboard, getClipboardConfig, saveClipboardConfig,
	deleteJob, cancelJob, getConfigParams
} from '@/api/seaExport'
import { batchSubmitJob, batchRejectSubmitJob, batchAcceptJob } from '@/api/chargeTabAtJob'
import { getTerminologyListByType } from '@/api/terminology'
import { deepCloneMethod } from '@/utils'

export default {
	name: 'SeaExportOperate',
	components: {
		Basic,
		ElectronicFile
	},
	data() {
		return {
			loading: false,
			job: {
				electronicFile: {}
			},
			nonsense: '',
			activeTabName: 'Basic',
			jobNoHistoryReversed: []
		}
	},
	activated() {

	},
	beforeMount() {

	},
	methods: {
		handleTabClick() { },
		goTo() { },
		jump() { },
		toShowAbstract() { },
		backToList() { },
		reloadJob() { }
	}
}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.module.scss";

.operate .fixed-header-opt {
	position: fixed;
	top: 84px;
	left: calc(0px + #{$sideBarWidth});
	right: 0;
	z-index: 9;
	width: calc(100vw - #{$sideBarWidth});
}

.hideSidebar .operate .fixed-header-opt {
	width: calc(100% - 54px);
}

.hideSidebar .operate .app-main-inner-row .el-tabs__header {
	width: calc(100% - 54px);
}

.operate .app-main-inner-row .el-tabs__content {
	height: calc(100vh - 125px);
	padding-top: 30px !important;
	overflow: auto !important;
}

.operate .app-main-inner-row .el-tabs__header {
	position: fixed !important;
	left: calc(20px + #{$sideBarWidth});
	top: 125px;
	right: 0;
	z-index: 9;
	width: calc(100vw - #{$sideBarWidth});
}

.ag-theme-balham .ag-menu {
	position: absolute;
	top: 43px;
}
</style>
