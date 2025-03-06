<template>
    <div>
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
</template>

<script>
import { getOpLogApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'LogsTable',
	props: {
		blId: String
	},
	data() {
		return {
			dataList: [],
			loading: false
		};
	},
	created() {
		this.list()
	},
	mounted() {

	},
	methods: {
		// 获取商品列表
		async list() {
			if (this.$isEmpty(this.blId)) {
				return
			}
			this.loading = true
			let res = await getOpLogApi({ blId: this.blId })
			if (res.ok) {
				res.content.list.forEach(item => {
					let opContentData = ''
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
					item.opContentData = opContentData
				})
				this.dataList = res.content.list
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
	}
};
</script>

<style scoped lang="less">
</style>
