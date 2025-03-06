<template>
  <div v-loading="loading" class="right-main-wrapper">
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="createNewLine">{{$t('codeManager.subitemList.createBtn')}}</el-button>
      </div>
      <el-table
        :data="codeItemList"
        stripe
        style="width: 100%;"
        border
        :height="tableHeight">
        <el-table-column
          prop="sequence"
          :label="$t('codeManager.subitemList.listNo')"
          width="100">
          <template slot-scope="{row, column, $index}">
            <div v-if="row.edit">
              <NumberInput
                v-model.trim="editRowItem.sequence"
                limitType="positive"
                :limitRange="{digits: 3, decimal: 0}" />
            </div>
            <span v-else>{{row.sequence}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          :label="$t('codeManager.subitemList.itemCode')"
          width="200">
          <template slot-scope="{row, column, $index}">
            <div v-if="row.edit">
              <el-input v-model="editRowItem.code"></el-input>
            </div>
            <span v-else>{{row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('codeManager.subitemList.itemName')"
          width="200">
          <template slot-scope="{ row, column, $index }">
            <div v-if="row.edit">
              <el-input v-model="editRowItem.name"></el-input>
            </div>
            <span v-else>{{row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="$t('codeManager.subitemList.remark')"
          width="280"
          :show-overflow-tooltip="true">
          <template slot-scope="{row,column,$index}">
            <div v-if="row.edit">
              <el-input type="textarea" row="3" v-model="editRowItem.remark"></el-input>
            </div>
            <span v-else>{{row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activeFlag"
          :label="$t('codeManager.subitemList.status')"
          width="200">
          <template slot-scope="{ row, column, $index }">
            {{row.activeFlag | filterActive(vm)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          header-align="center"
          :label="$t('common.operation')"
          width="200">
          <template slot-scope="{row, column, $index}">
            <div class="edit-btn-wrap">
              <el-button type="text" size="mini" @click="saveEdit(row)" v-show="row.edit">{{$t('common.saveBtn')}}</el-button>
              <el-button type="text" size="mini" @click="edit(row)" v-show="!row.activeFlag && !row.edit">{{$t('common.editBtn')}}</el-button>
              <el-button type="text" size="mini" @click="dropEdit" v-show="row.edit"  class="fc-red">{{$t('common.cancelBtn')}}</el-button>
              <el-button type="text" size="mini" @click="enabledSubitem(row.id)" v-show="!row.activeFlag && !row.edit">{{$t('common.enableBtn')}}</el-button>
              <el-button type="text" size="mini" @click="disabledSubitem(row.id)" v-show="row.activeFlag && !row.edit"  class="fc-red">{{$t('common.disableBtn')}}</el-button>
              <el-button type="text" size="mini" @click="deleteSubitem(row.id)" v-show="!row.activeFlag && !row.edit" class="fc-red">{{$t('common.deleteBtn')}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
  </div>
</template>
<script>
import { getSubitemListApi, createSubitemApi, deleteSubitemApi, enableSubitemApi, disableSubitemApi } from '@/api/codeManager'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
export default {
	name: 'CodeItemList',
	components: {
		NumberInput
	},
	filters: {},
	data() {
		return {
			vm: this,
			loading: false,
			codeItemList: [],
			totalData: 0,
			multipleForm: {
				parentId: '',
				pageSize: 50,
				pageNum: 1
			},
			editRowItem: {
				id: null,
				code: '',
				name: '',
				remark: '',
				sequence: '',
				parentId: '',
				activeFlag: false,
				edit: true
			},
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			tableHeight: null,
			tableHeightCalc: null
		}
	},
	computed: {},
	filters: {
		filterActive(val, vm) {
			return val === true ? vm.$t('codeManager.subitemList.statusList[0]') : vm.$t('codeManager.subitemList.statusList[1]')
		}
	},
	created() {
		this.multipleForm.parentId = this.$route.params.id
	},
	mounted() {
		this.getData()
		this.calcTableHeight()
		this.tableHeightCalc = this.throttle(this.calcTableHeight, 200, 300)
		window.addEventListener('resize', this.tableHeightCalc, false)
	},
	methods: {
		async getData() {
			this.loading = true
			const res = await getSubitemListApi(this.multipleForm)
			if (res.ok) {
				this.codeItemList = res.content.list
				this.totalData = parseInt(res.content.total)
			} else {
				this.codeItemList = []
				this.totalData = 0
			}
			this.loading = false
		},
		edit(row) {
			this.$set(row, 'edit', true)
			this.$copyProps(this.editRowItem, row)
		},
		clearSearchForm() {
			this.$refs.multipleForm.resetFields()
			this.getData()
		},
		// 新建一行代码
		createNewLine() {
			const curr_edit = this.codeItemList.filter(item => item.edit)
			if (curr_edit.length > 0) {
				this.$message.warning(this.$t('common.saveTips'))
				return false
			}

			this.editRowItem.parentId = this.$route.params.id
			this.codeItemList.unshift(this.editRowItem)
		},
		calcTableHeight() {
			const ori_height = this.calcHeight()
			const fixedHeaderHeight = document.body.offsetHeight
			this.tableHeight = fixedHeaderHeight - ori_height
		},
		async saveEdit(obj) {
			if (this.checkForm(obj)) {
				this.loading = true
				const res = await createSubitemApi(this.editRowItem)
				if (res && res.ok) {
					this.$message.success(this.$t('codeManager.subitemList.savedSuccess'))
					obj.edit = false
					this.clearEditRow()
					this.getData()
				}
				this.loading = false
			}
		},
		dropEdit() {
			this.$confirm(this.$t('codeManager.subitemList.dropEditWarnning'), this.$t('common.warnningText'), {
				confirmButtonText: this.$t('common.dropEditBtn'),
				cancelButtonText: this.$t('codeManager.subitemList.thinkOver'),
				type: 'warning'
			}).then(() => {
				// this.codeItemList.shift()
				this.getData()
			}).catch(() => { })
		},
		deleteSubitem(id) {
			this.$confirm(this.$t('codeManager.subitemList.deleteWarnning'), this.$t('common.warnningText'), {
				confirmButtonText: this.$t('common.deleteBtn'),
				cancelButtonText: this.$t('codeManager.subitemList.thinkOver'),
				type: 'warning'
			}).then(async () => {
				const res = await deleteSubitemApi(id)
				if (res && res.ok) {
					this.$message.success(this.$t('codeManager.subitemList.deletedSuccess'))
					this.getData()
				}
			}).catch(() => { })
		},
		async enabledSubitem(id) {
			const res = await enableSubitemApi(id)
			if (res && res.ok) {
				this.getData()
			}
		},
		async disabledSubitem(id) {
			const res = await disableSubitemApi(id)
			if (res && res.ok) {
				this.getData()
			}
		},
		clearEditRow() {
			this.editRowItem = {
				id: null,
				code: '',
				name: '',
				remark: '',
				sequence: '',
				parentId: this.$route.params.id,
				activeFlag: false,
				edit: true
			}
		},
		checkForm(obj) {
			if (obj.sequence.length === 0) {
				this.$message.error(this.$t('codeManager.subitemList.sequenceEmptyErr'))
				return false
			} else if (obj.code.length === 0) {
				this.$message.error(this.$t('codeManager.subitemList.codeEmptyErr'))
				return false
			} else if (obj.name.length === 0) {
				this.$message.error(this.$t('codeManager.subitemList.nameEmptyErr'))
				return false
			} else if (this.codeItemList.filter(item => item.sequence == obj.sequence).length > 1) {
				this.$message.error(this.$t('codeManager.subitemList.sameSequenceErr'))
				return false
			} else if (this.codeItemList.filter(item => item.code == obj.code).length > 1) {
				this.$message.error(this.$t('codeManager.subitemList.sameCodeErr'))
				return false
			} else if (this.codeItemList.filter(item => item.name == obj.name).length > 1) {
				this.$message.error(this.$t('codeManager.subitemList.sameNameErr'))
				return false
			} else {
				return true
			}
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
