<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot  :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
        <el-form slot="singleSearch" ref="formData" :inline="true" :model="formData" label-width="80px">
          <el-form-item label="船公司" prop="entityId">
            <TypeSelect v-model="formData.entityId" type="shippingCompany" @selected="list()"/>
          </el-form-item>
        </el-form>
    </top-search-items-slot>
    <div class="flex">
      <div class="left-table">
        <div class="mb-10">
          <el-button size="mini" type="primary" :disabled='isEdit' @click="addItem(1)">新增</el-button>
        </div>
        <el-table :data="dataList" style="width: 100%" ref="pTable" stripe size="mini" border :highlight-current-row='true' :height="tableHeight" @row-click='rowClick'>
           <el-table-column label="序号" width="60">
            <template slot-scope="{$index}">
              <span>{{$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="船公司">
            <template slot-scope="{row}">
              <TypeSelect v-if="row.isEdit" v-model="row.entityId" type="shippingCompany" @selected="typeSelect($event,row)" :defaultDisplay="row.entityEnName" />
              <span v-else >{{row.entityCnName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="免用箱期" >
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
                <el-button size="mini" type="text" @click="saveItem(row,1)">保存</el-button>
                <el-button size="mini" type="text" class="fc-red" @click="cancelItem()">取消</el-button>
              </div>
              <div v-else>
                <el-button size="mini" type="text" v-if="row.state==1" @click="editItem(row)">编辑</el-button>
                <el-button size="mini" v-if="row.state==1" type="text"  @click="confirmItem(row,1)">确认</el-button>
                <el-button size="mini" v-if="row.state==2"  type="text" class="fc-red"  @click="backItem(row,1)">撤销</el-button>
                <el-button size="mini" type="text" v-if="row.state==1" class="fc-red"  @click="delItem(row,1)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="totalData" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
      </div>
      <div class="right-table" v-if="activeId">
        <div class="mb-10">
          <el-button size="mini" type="primary" :disabled='isEdit' @click="addItem(2)">新增客户</el-button>
        </div>
        <el-table :data="customerList" style="width: 100%" stripe size="mini" border :height="tableHeight">
          <el-table-column label="序号" width="60">
            <template slot-scope="{$index}">
              <span>{{$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户">
            <template slot-scope="{row}">
              <TypeSelect v-if="row.isEdit" v-model="row.entityId" type="customer" @selected="typeSelect($event,row)" :defaultDisplay="row.entityEnName" />
              <span v-else >{{row.entityCnName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="免用箱天数" >
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
                <el-button size="mini" type="text" @click="saveItem(row,2)">保存</el-button>
                <el-button size="mini" type="text" class="fc-red" @click="cancelItem()">取消</el-button>
              </div>
              <div v-else>
                <el-button size="mini" v-if="row.state==1"  type="text" @click="editItem(row)">编辑</el-button>
                <el-button size="mini" v-if="row.state==1" type="text"  @click="confirmItem(row,2)">确认</el-button>
                <el-button size="mini" v-if="row.state==2"  type="text" class="fc-red"  @click="backItem(row,2)">撤销</el-button>
                <el-button size="mini" v-if="row.state==1"  type="text" class="fc-red"  @click="delItem(row,2)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="totalData1" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="listCustomer" />
      </div>
    </div>
  
  </div>
</template>
<script>
import { getFreeCarrierPagesApi, saveFreeCarrierApi, delFreeApi, confirmFreeApi, backFreeApi, getFreeCustomerPagesApi, saveFreeCustomerApi } from '@/api/free'
export default {
	name: 'FreeBox',
	components: {},
	filters: {},
	data() {
		return {
			activeId: '',
			loading: false,
			dataList: [],
			customerList: [],
			totalData: 0,
			totalData1: 0,
			isEdit: false,
			filter: {
				pageSize: 50,
				pageNum: 1
			},
			tableHeight: document.documentElement.clientHeight - 250,
			formData: {
				entityId: '',
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
			let res = await getFreeCarrierPagesApi(this.formData)
			if (res.ok) {
				this.dataList = res.content.list
				this.totalData = res.content.total
				if (this.$isNotEmpty(this.dataList)) {
					this.$nextTick(function () {
						this.$refs.pTable.setCurrentRow(this.dataList[0])
						this.activeId = this.dataList[0].id
						this.listCustomer(this.activeId)
					})
				}
				this.loading = false
			}
		},
		async listCustomer(id) {
			if (!id) {
				return
			}
			this.loading = true
			this.isEdit = false
			let res = await getFreeCustomerPagesApi({ parentId: id, ...this.filter })
			if (res.ok) {
				this.customerList = res.content.list
				this.totalData1 = res.content.total
				this.loading = false
			}
		},
		rowClick(row) {
			if (this.$isEmpty(row.id)) {
				return
			}
			this.activeId = row.id
			this.listCustomer(row.id)
			// this.getBlList(row.id)
		},
		// 港口选中
		typeSelect(data, row) {
			row.entityCnName = data.chineseName
			row.entityEnName = data.englishName
			row.entityId = data.id
		},
		// 新增
		addItem(type) {
			let itemData = {
				id: null,
				entityCnName: null,
				entityCode: null,
				entityEnName: null,
				entityId: null,
				freeCount: null,
				remark: null,
				parentId: this.activeId,
				state: 0,
				stateName: '草稿',
				isEdit: true
			}
			if (type == 1) {
				this.dataList.unshift(itemData)
			} else {
				this.customerList.unshift(itemData)
			}
			this.isEdit = true
			// let res =await 
		},
		// 编辑
		editItem(row) {
			this.$set(row, 'isEdit', true)
			this.isEdit = true
		},
		confirmItem(row, type) {
			this.confirmTips('是否确认').then(() => {
				confirmFreeApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.confirmSuccess'))
						if (type == 1) {
							this.list()
						} else {
							this.listCustomer(this.activeId)
						}
					}
				})
			})
		},
		backItem(row, type) {
			this.confirmTips('撤回将会回到上一个状态，是够确认？').then(() => {
				backFreeApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.revocationSuccess'))
						if (type == 1) {
							this.list()
						} else {
							this.listCustomer(this.activeId)
						}
					}
				})
			})
		},
		saveItem(row, type) {
			if (this.$isEmpty(row.entityId) || this.$isEmpty(row.freeCount)) {
				this.$message.error('请维护完整数据')
				return
			}
			let fn = type == 1 ? saveFreeCarrierApi : saveFreeCustomerApi
			fn(row).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('common.saveSuccess'))
					this.isEdit = false
					if (type == 1) {
						this.list()
					} else {
						this.listCustomer(this.activeId)
					}
				}
			})
		},
		// 删除
		delItem(row, type) {
			this.confirmTips().then(() => {
				delFreeApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						if (type == 1) {
							this.list()
						} else {
							this.listCustomer(this.activeId)
						}

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
.left-table,
.right-table {
	width: 50%;
}
.right-table {
	padding-left: 20px;
}
</style>
