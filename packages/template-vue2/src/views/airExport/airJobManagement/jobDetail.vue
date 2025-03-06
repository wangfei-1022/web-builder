<template>
  <div class="air-page">
    <div :class="{'fixed-header-opt':1===1}">
      <div class="air-inner-row">
        <div style="display: flex; justify-content: space-between; width: 100%">
          <div>
            <el-button type="primary" size="mini" @click="backToList" plain>返回列表</el-button>
            <!--<el-button type="primary" size="mini" @click="reloadMaster">刷新</el-button>-->
            <el-button type="primary" size="mini" @click="takeDelivery" v-if="job.jobState != 100 && job.jobState != 95 && job.jobState != 10">收货</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="air-inner-row">
      <el-tabs v-model="activeTabName" type="border-card" style="width:100%" >
        <el-tab-pane label="订单" name="Basic" style="max-width: 1200px;">
          <basic ref="basic" :job="job" @refresh="reloadMaster" />
        </el-tab-pane>
        <el-tab-pane label="MAWB" name="MAWB" style="max-width: 1200px;">
          <BL ref="MAWB" :id="jobId" :state="job.jobState" type="MAWB"/>
        </el-tab-pane>
        <el-tab-pane label="电子文件" name="ElectronicFile" style="max-width: 1200px;">
          <electronic-file ref="electronicFile" :order="job" />
        </el-tab-pane>
      </el-tabs>

      <div
        v-show="loading"
        style="position: fixed;z-index: 9999;height: 100%;width: 100%;background-color: #2d3a4b22;
      display: flex;justify-content: center;align-items:center"
      >
        <svg-icon icon-class="loading-bars" style="font-size:60px;" />
      </div>
    </div>

    <el-dialog
      title="收货"
      :visible.sync="takeDeliveryVisible"
      width="400px">
      <div>提交后主票和小票的业务信息将锁定不允许修改，是否还进行提交操作？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="takeDeliveryVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitDeliveryFn" size="mini">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Basic from './jobDetailBasic'
import BL from '../airOrderManagement/BL'
import ElectronicFile from '../components/electronicFile'
import { getAirExportOrderMasterDetailApi, deliveryAirExportOrderListApi } from '@/api/airExport'

export default {
	name: 'AirJobManagementJobDetail',
	components: {
		Basic,
		BL,
		ElectronicFile
	},
	data() {
		return {
			jobId: '',
			loading: false,
			takeDeliveryVisible: false,
			job: {
				baseDTO: {},
				spaceDTO: {},
				cargoDTO: {},
				addressDTO: {},
				fileList: [],
				subOrderList: []
			},
			activeTabName: 'Basic'
		}
	},
	activated() {

	},
	created() {
		this.jobId = this.$route.query.id
		this.getDetail()
	},
	methods: {
		getDetail() {
			getAirExportOrderMasterDetailApi(this.jobId).then(res => {
				if (res.content) {
					res.content.baseDTO = res.content.baseDTO || {}
					this.job = res.content
				}
			})
		},
		takeDelivery() {
			this.takeDeliveryVisible = true
		},
		submitDeliveryFn() {
			this.takeDeliveryVisible = false
			deliveryAirExportOrderListApi(this.job.id).then(res => {
				if (res && res.ok) {
					this.$message.success('收货成功！')
				}
			})
		},
		backToList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `AirJobManagement` })
		},
		reloadMaster() {
			this.getDetail()
		}
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.module.scss";

.air-page {
	padding: 8px 16px 0 16px;
}
.air-inner-row {
	margin-bottom: 10px;

	::v-deep .el-tabs {
		background-color: #f5f7fa;
	}
}
</style>
