<template>
    <div>
      <div class="flex-right mb-10" v-if="!isDetail">
         <el-button size="mini" type="primary" class="ml-10" :loading="loading" @click="exportData()">{{$t('seaBl.uploadFile')}}</el-button>
      </div>
      <el-table :data="dataList" size="mini" height="250" border stripe v-loading="loading">
        <el-table-column :label="$t('seaBl.indexNo')" width="60">
          <template slot-scope="{$index}">
            {{$index+1}}
          </template>
        </el-table-column>
        <el-table-column  :label="$t('seaBl.ctnNo')" prop="ctnNo" />
        <el-table-column :label="$t('seaBl.trayId')" prop="trayNo" />
        <el-table-column label="SKU" prop="skuCode" />
        <el-table-column :label="$t('goodsManagement.power')+'MW'" prop="watt" />
        <el-table-column :label="$t('seaBl.skuNum')" prop="num" />
      </el-table>
      <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list"	/>
      <TrayUploadDialog :visible.sync="dialog.visible" :blId='blId' @saved="list" />
    </div>
</template>

<script>
import { getTrayByBlIdApi } from '@/api/OvlSeaSitManage/seaBl'
import TrayUploadDialog from './trayUploadDialog'
export default {
	name: 'TrayTable',
	components: { TrayUploadDialog },
	props: {
		blId: String,
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dataList: [],
			loading: false,
			total: 0,
			filter: {
				pageSize: 50,
				pageNum: 1
			}
		};
	},
	created() {
		this.list()
	},
	mounted() {

	},
	methods: {
		// 获取托盘列表
		async list() {
			if (this.$isEmpty(this.blId)) {
				return
			}
			this.loading = true
			let res = await getTrayByBlIdApi({ blId: this.blId, ...this.filter })
			if (res.ok) {
				this.dataList = res.content.list || []
				this.total = res.content.total
				this.loading = false
			} else {
				this.loading = false
			}
		},
		// 导入托盘明细
		exportData() {
			if (this.$isEmpty(this.dataList)) {
				this.dialog.visible = true
				return
			}
			this.$confirm(this.$t('seaBl.exportDataTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.dialog.visible = true
			}).catch(() => {
				// do nothing
			})
		}
	}
};
</script>

<style scoped lang="less">
</style>
