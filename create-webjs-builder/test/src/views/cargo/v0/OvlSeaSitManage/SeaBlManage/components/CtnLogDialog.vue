<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" title="日志详情" width="800px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <el-table :data="dataList" size="mini" height="250" border stripe v-loading="loading">
          <el-table-column :label="$t('seaBl.indexNo')" width="60">
            <template slot-scope="{$index}">
              {{$index+1}}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('seaBl.logType')" prop="opTypeName"  />
          <el-table-column :label="$t('seaBl.logContent')" prop="opContentData">
            <template slot-scope="{row}">
              <span v-if="row.opType==1">{{row.opContentData}}</span>
              <span v-if="row.opType==9" class="link-box" @click="downFile(row.opContentData)">{{row.opContentData.originFileName}}</span>
              <span v-else>{{row.opContentData}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('seaBl.logTime')" width="140">
            <template slot-scope="{row}">
              {{row.createTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('seaBl.optName')" prop="createByName" width="120" />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">{{$t("common.cancelBtn")}}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { getSeaCtnLogApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'CtnOpDialog',
	props: {
		ctnId: String,
		visible: {
			type: Boolean,
			default: false
		}

	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			dataList: []
		}
	},

	methods: {
		async list() {
			if (this.$isEmpty(this.ctnId)) {
				this.dataList = []
				return
			}
			this.loading = true
			let res = await getSeaCtnLogApi(this.ctnId)
			if (res.ok && res.content) {
				res.content.forEach(item => {
					let opContentData = ''
					if (item.opType) {
						let data = this.$isEmpty(item.opContent) ? {} : JSON.parse(item.opContent)
						if (item.opType === 1) {
							opContentData = '设置ETA为' + this.formatDate(data.eta, 'YYYY-MM-DD')
						}
						if (item.opType === 9) {
							opContentData = {
								url: data.url,
								originFileName: data.originFileName
							}
						}
						if (item.opType === 100) {
							opContentData = "设置备注为" + data.remark
						}
						if (item.opType === 101) {
							opContentData = data.content
						}
					} else {
						opContentData = item.opContent
					}
					item.opContentData = opContentData
				})
				this.dataList = res.content
				this.loading = false
			} else {
				this.loading = false
			}

		},
		downFile(row) {
			let obj = {
				fileName: row.originFileName,
				url: row.url
			}
			this.downloadFile(obj)
		}

	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.list()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
