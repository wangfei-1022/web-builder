<template>
    <div class="page-edit-container bg-white full-page" v-loading="loading">
      <div class="page-edit-content">
        <div style="overflow: hidden;">
            <div class="flex-box mb-10" style="margin-right: 30px; float: left;" v-if="!isConfirm">
                <span >{{getZH('blNo')}}：</span>
                <el-input size="mini" v-model.trim="currentBl" :placeholder="getZH('blNo')" class="w-200"></el-input>
                <el-button size="mini" type="primary" class="ml-10" :disabled="$isEmpty(currentBl)" @click="list">{{getZH('chooseItem')}}</el-button>
            </div>
            <div class="flex-box mb-10" style="margin-right: 30px; float: left;" v-if="isConfirm">
                <span >{{getZH('blNo')}}：</span>
                <span>{{currentBl}}</span>
                <el-button size="mini" type="primary" class="ml-10" @click="resetBl">{{getZH('resetChooseItem')}}</el-button>
            </div>
            <div class="flex-box mb-10" style="margin-right: 30px; float: left;">
                <span >{{getZH('eta')}}：</span>
                <common-picker pikcerType="date" v-model="eta" clearable  class="w-200"></common-picker>
            </div>
        </div>
        <el-table :data="dataList" stripe border size="mini">
          <el-table-column :label="getZH('number')" width="50">
            <template slot-scope="{$index}">
              <span>{{$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column  prop="containerNo" :label="getZH('containerNo')" minWidth="140" showOverflowTooltip></el-table-column>
          <el-table-column  prop="inboundTaskNo" :label="getZH('taskInboundNo')" minWidth="140" showOverflowTooltip></el-table-column>
          <el-table-column  prop="inboundTaskStatusName" :label="getZH('taskState')" minWidth="140" showOverflowTooltip></el-table-column>
          <el-table-column  prop="createTime" :label="getZH('exporTime')" minWidth="140">
            <template slot-scope="{row}">
              <span>{{row.createTime | formatDate('YYYY-MM-DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column  prop="createByName" :label="getZH('exportUser')" minWidth="150"></el-table-column>
        </el-table>
      </div>
      <div class="page-edit-footer">
        <el-button type="primary" v-if="isConfirm && $isNotEmpty(currentBl)" size="mini" @click="pushBl()">{{getZH('pushBtn')}}</el-button>
        <el-button type="default" size="mini" @click="backToList()">{{getZH('backList','common')}}</el-button>
      </div>
    </div>
</template>

<script>
import getZHMixin from './components/getZHMixin'
import { getInboundbBlListApi, pushInboundbBlApi, pushInboundbBlNewApi } from '@/api/OverseasWarehouse/GRNManager'
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant'
export default {
	name: 'InboundBlDetail',
	mixins: [getZHMixin],
	data() {
		return {
			loading: false,
			currentBl: null,
            eta: '',
			isConfirm: false,
			dataList: [],
		};
	},
	created() {

	},
	mounted() {

	},
	computed: {
	},
	methods: {
		//获取列表
		async list() {
			let filterForm = {
				pageSize: 1000,
				pageNum: 1,
				blNo: this.currentBl
			}
			let res = await getInboundbBlListApi(filterForm)
			if (res.ok) {
				this.dataList = res.content.list
				this.isConfirm = true
			}
		},
		/**
		 * 重选
		 */
		resetBl() {
			this.isConfirm = false
		},
		/**
		 * 推送提单
		 */
		async pushBl() {
            if(!this.eta) {
                this.$message.error('ETA不能为空')
                return
            }
			this.loading = true
            let data = {
                blNo: this.currentBl,
                eta: this.eta
            }
			let res = await pushInboundbBlNewApi(data)
			if (res.ok) {
				// 添加日志 记录数据
				this.logBtnSend({
					origin: logOrigin.SYSTEM_OPERATION,
					logCode: pointOvl.OVL_INBOUND_BL_PUSH,
					serviceName: logServiceName.OVL_SERVICE,
					businessType: pointOvl.OVL_INBOUND_BL_PUSH,
					content: {
						currentBl: this.currentBl,
                        eta: this.eta
					}
				})
				this.$message.success(this.getZH('pushSuccess'))
				this.backToList()
			}
			this.loading = false
		},
		// 返回列表
		backToList() {
			// this.isConfirm = false
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `InboundBlList` })
		},

	}
};
</script>

<style scoped lang="less">
</style>
