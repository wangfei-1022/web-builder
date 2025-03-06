<template>
  <div v-loading="loading" class="right-main-wrapper">
  <top-search-items-slot  :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
      <el-form slot="singleSearch" ref="formData" :inline="true" :model="formData" label-width="80px">
        <el-form-item label="港口" prop="entityCode">
          <TypeSelect v-model="formData.entityCode" type="seaport" @selected="list()"  :podLable="'englishName'" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="mb-10">
      <el-button size="mini" type="primary" :disabled='isEdit' @click="addItem">新增</el-button>
    </div>
    <el-table :data="dataList" style="width: 100%" stripe size="mini" border :height="tableHeight">
      <el-table-column label="港口">
        <template slot-scope="{row}">
          <TypeSelect v-if="row.isEdit" v-model="row.entityCode" type="seaport" :defaultDisplay="row.entityEnName" @selected="seaportSelect($event,row)" :podLable="'englishName'" />
          <span v-else >{{row.entityEnName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="免堆期" >
        <template slot-scope="{row}">
          <el-input size="mini" v-model="row.freeCount" v-if="row.isEdit" placeholder="请输入免堆期"></el-input>
          <span v-else >{{row.freeCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" >
        <template slot-scope="{row}">
          <el-input size="mini" v-model="row.remark" v-if="row.isEdit" placeholder="请输入备注"></el-input>
          <span v-else >{{row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="stateName" width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="{row}">
          <div v-if="row.isEdit">
            <el-button size="mini" type="text" @click="saveItem(row)">保存</el-button>
            <el-button size="mini" type="text" class="fc-red" @click="cancelItem()">取消</el-button>
          </div>
          <div v-else>
            <el-button size="mini" type="text" v-if="row.state==1" @click="editItem(row)">编辑</el-button>
            <el-button size="mini" v-if="row.state==1" type="text"  @click="confirmItem(row)">确认</el-button>
            <el-button size="mini" v-if="row.state==2"  type="text" class="fc-red"  @click="backItem(row)">撤销</el-button>
            <el-button size="mini"  v-if="row.state==1" type="text" class="fc-red"  @click="delItem(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
     <Pagination :total="totalData" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
  </div>
</template>
<script>
import { getFreePagesApi, saveFreeApi, delFreeApi, confirmFreeApi, backFreeApi } from '@/api/free'
export default {
	name: 'FreePeriod',
	components: {},
	filters: {},
	data() {
		return {
			tableHeight: document.documentElement.clientHeight - 300,
			loading: false,
			dataList: [],
			totalData: 0,
			isEdit: false,
			formData: {
				entityCode: '',
				pageSize: 50,
				pageNum: 1
			},
		}
	},
	computed: {},

	created() {
		this.list()
	},
	mounted() {

	},
	methods: {
		// 获取列表
		async list() {
			this.loading = true
			this.isEdit = false
			let res = await getFreePagesApi(this.formData)
			if (res.ok) {
				this.dataList = res.content.list
				this.totalData = res.content.total
				this.loading = false
			}
		},
		// 港口选中
		seaportSelect(data, row) {
			row.entityCnName = data.chineseName
			row.entityEnName = data.englishName
			row.entityId = data.id
		},
		// 新增
		addItem() {
			let itemData = {
				id: null,
				entityCnName: null,
				entityCode: null,
				entityEnName: null,
				entityId: null,
				freeCount: null,
				remark: null,
				state: 1,
				stateName: '草稿',
				isEdit: true
			}
			this.dataList.unshift(itemData)
			this.isEdit = true
			// let res =await 
		},
		// 编辑
		editItem(row) {
			this.$set(row, 'isEdit', true)
			this.isEdit = true
		},
		confirmItem(row) {
			this.confirmTips('是否确认').then(() => {
				confirmFreeApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.confirmSuccess'))
						this.list()
					}
				})
			})
		},
		backItem(row) {
			this.confirmTips('撤回将会回到上一个状态，是够确认？').then(() => {
				backFreeApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
					}
				})
			})
		},
		saveItem(row) {
			if (this.$isEmpty(row.entityCode) || this.$isEmpty(row.freeCount)) {
				this.$message.error('请维护完整数据')
				return
			}
			saveFreeApi(row).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('common.saveSuccess'))
					this.isEdit = false
					this.list()
				}
			})
		},
		// 删除
		delItem(row) {
			this.confirmTips().then(() => {
				delFreeApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
					}
				})
			})
		},
		// 取消
		cancelItem() {
			this.list()
			this.isEdit = false
		},
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>
<style lang="scss" scoped>
.table-wrap {
	margin-top: 0;
}
.btn-wrap {
	text-align: right;
}
</style>
