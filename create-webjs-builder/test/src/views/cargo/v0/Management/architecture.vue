<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row">
      <div class="btn-group-left">
        <!--<el-button type="primary" size="mini">新建</el-button>-->
        <!--<el-button type="danger" size="mini">删除</el-button>-->
      </div>
      <div class="btn-group-right">
        <el-button type="warning" size="mini" @click="isShowingVisualCompany=true">
          可视化架构
        </el-button>
      </div>
    </div>
    <div class="app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :column-defs="columnDefs"
        :row-data="rowData"
        :row-clicked="onRowCLick"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :style="innerTableHeight"
        class="ag-theme-balham"
      />
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="userGrid.gridOptions"
        :column-defs="userGrid.columnDefs"
        :row-data="userGrid.rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :row-clicked="onUserRowCLick"
        :grid-ready="onUserReady"
        :style="innerTableHeight"
        class="ag-theme-balham"
      />
    </div>
    <!--可视化公司架构-->
    <el-dialog :visible.sync="isShowingVisualCompany" width="70vw" style="overflow: hidden">
      <div :style="visualCompany.style">
        <el-scrollbar style="height:70vh;" :native="true">
          <org-tree style="overflow: hidden" :node-render="renderOrgNode" :label-class-name="getLabelClassName" :data="visualCompany.data" :collapsable="visualCompany.collapsable" :horizontal="visualCompany.horizontal" />
        </el-scrollbar>
      </div>
      <div slot="title">
        <el-button-group>
          <el-button type="primary" size="mini" icon="el-icon-zoom-out" @click="visualCompany.style.zoom=(visualCompany.style.zoom-(visualCompany.style.zoom>=0.7?0.1:0))" />
          <el-button type="primary" size="mini" icon="el-icon-zoom-in" @click="visualCompany.style.zoom=(visualCompany.style.zoom+(visualCompany.style.zoom>=1.1?0:0.1))" />
        </el-button-group>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowingDeptForm" title="部门信息" width="500px">
      <el-form ref="deptForm" :model="oneDept" :rules="deptRules" inline-message label-width="100px" label-position="left">
        <el-form-item v-show="deptDialog.parentLabel" :label="deptDialog.parentLabel">
          <el-input v-model="deptDialog.parentName" disabled size="mini" />
        </el-form-item>
        <el-form-item label="部门名称(中)" prop="chineseName">
          <el-input v-model="oneDept.chineseName" size="mini" />
        </el-form-item>
        <el-form-item label="部门名称(英)" prop="englishName">
          <el-input v-model="oneDept.englishName" size="mini" />
        </el-form-item>
        <el-form-item label="部门描述">
          <el-input v-model="oneDept.remark" size="mini" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="isShowingDeptForm = false">
          取消
        </el-button>
        <el-button v-permission="['sys:office:update']" size="mini" type="primary" @click="submitDept">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowingCompanyForm" title="新增公司" inline-message width="500px">
      <el-form ref="companyForm" label-width="100px" :model="oneCompany" :rules="companyRules" label-position="left">
        <el-form-item :label="companyDialog.parentLabel">
          <el-input v-model="companyDialog.parentName" disabled size="mini" />
        </el-form-item>
        <el-form-item label="公司名称(中)" prop="chineseName">
          <el-input v-model="oneCompany.chineseName" size="mini" maxlength="100" />
        </el-form-item>
        <el-form-item label="公司名称(英)" prop="englishName">
          <el-input v-model="oneCompany.englishName" size="mini"  maxlength="100"/>
        </el-form-item>
        <el-form-item label="公司代码">
          <el-input v-model="oneCompany.officeCode" size="mini" maxlength="10"/>
        </el-form-item>
        <el-form-item label="账号币种">
          <el-select v-model="oneCompany.localCurrency" size="mini" :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in currencyList"
              :key="item"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公司描述" v-if="false">
          <el-input v-model="oneCompany.remark" size="mini" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="isShowingCompanyForm = false">
          取消
        </el-button>
        <el-button v-permission="['sys:office:update']" size="mini" type="primary" @click="submitCompany">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowingChooseAddTypeDialog" :close-on-click-modal="chooseTypeDialog.isModalClose" :show-close="chooseTypeDialog.isShowClose" title="新增公司/部门" width="300px">
      <div style="display: flex;justify-content: space-between">
        <el-button size="mini" type="primary" @click="chooseAddCompany">
          新增子公司
        </el-button>
        <el-button size="mini" type="primary" @click="chooseAddDept">
          新增部门
        </el-button>
      </div>
      <div slot="footer" />
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import { getArchitectureList, delArchitecture, getDeptById, saveDept, getCompanyVisualView } from '@/api/architecture'
import { getUserList } from '@/api/user'
import { saveCompanyInfo } from '@/api/companyDetail'
import { getCurrencyList } from '@/api/currency'
import architectureOperateButton from './CellRendererFramework/architectureOperateButton'
import OrgTree from 'v-org-tree'
export default {
	name: 'Architecture',
	components: { AgGridVue, architectureOperateButton, OrgTree },
	data() {
		return {
			deptRules: {
				chineseName: [
					{ required: true, message: '请输入中文名称', trigger: 'blur' }
				],
				englishName: [
					{ required: true, message: '请输入英文名称', trigger: 'blur' }
				]
			},
			companyRules: {
				chineseName: [
					{ required: true, message: '请输入中文名称', trigger: 'blur' }
				],
				englishName: [
					{ required: true, message: '请输入英文名称', trigger: 'blur' }
				]
			},
			isShowingVisualCompany: false,
			visualCompany: {
				style: {
					'overflow-x': 'hidden',
					zoom: 0.8
				},
				labelClass: 'org-label',
				collapsable: false,
				horizontal: false,
				data: {},
				props: { id: 'id', label: 'label', children: 'children', expand: 'expand' }
			},
			chooseTypeDialog: {
				isShowClose: true,
				isModalClose: true
			},
			userGrid: {
				gridOptions: {},
				columnDefs: null,
				sideBarDefs: { toolPanels: ['columns', 'filter'] },
				rowData: [],
				gridApi: ''
			},
			gridOptions: {},
			gridApi: '',
			columnDefs: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'] },
			rowData: [],
			currentRowData: '',
			isShowingChooseAddTypeDialog: false,
			isShowingCompanyForm: false,
			isShowingDeptForm: false,
			oneDept: { id: '', parentDepartmentId: '', officeId: '', englishName: '', chineseName: '', remark: '' },
			initOneDept: {},
			oneCompany: { id: '', parentOfficeId: '', englishName: '', officeCode: '', chineseName: '', localCurrency: '', remark: '' },
			initOneCompany: {},
			companyDialog: {
				parentLabel: '',
				parentName: ''
			},
			deptDialog: {
				parentLabel: '',
				parentName: ''
				// parentDeptLabel: '',
				// parentDeptName: '',
				// parentCompanyLabel: '',
				// parentCompanyName: ''
			},
			currencyList: [],
			innerTableHeight: null
		}
	},
	watch: {
		gridHeight: function(newVal, oldVal) {
			const width = {'width': '50%'}
			this.innerTableHeight = {...width, ...newVal}
		}
	},
	created() {
		const self = this
		self.initOneDept = { ...(self.oneDept) }
		self.initOneCompany = { ...(self.oneCompany) }
		this.gridOptions = {
			rowClassRules: {
				'grid-row-zebra-even': function (params) {
					return !(params.rowIndex % 2)
				},
				'grid-row-zebra-odd': function (params) {
					return (params.rowIndex % 2)
				}
			},
			context: {
				componentParent: self
			},
			rowSelection: 'multiple',
			groupDefaultExpanded: 2,
			suppressRowClickSelection: true,
			treeData: true,
			getDataPath: (data) => {
				return data.path.split(',')
			},
			autoGroupColumnDef: {
				headerName: '名称',
				cellRendererParams: {
					suppressCount: true,
					// checkbox: true
					suppressDoubleClickExpand: true,
					innerRenderer: (params) => {
						let icon, fill
						if (params.data.parentId === '0' && params.data.orgType === 0) {
							icon = 'icon-global'
							fill = '#F5640E'
						} else {
							icon = params.data.orgType === 1 ? 'icon-yonghuzu1' : 'icon-gongsi1'
							fill = params.data.orgType === 1 ? '#6DBA4A' : '#4073ED'
						}
						// const icon = params.data.orgType === 1 ? 'dept' : 'company'
						// const size = params.data.orgType === 1 ? '1.1' : '1.2'
						return `<i class="iconfont ${icon}" style="font-size: 12px; color: ${fill}"></i> ${params.value} `
						// return `<svg class="svg-icon" aria-hidden="true" style="height:${size}em;width:${size}em;" fill="${fill}">
						//     <use xlink:href="#icon-${icon}"></use>
						//   </svg> ${params.value} `
					}
				}
			}
		}
		self.columnDefs = [
			{
				headerName: 'id',
				field: 'id',
				hide: true
			}, {
				headerName: '组织级别',
				field: 'orgType',
				cellRenderer: params => {
					return params.data.orgType === 1 ? '部门' : '公司'
				},
				width: 150
			}, {
				headerName: '公司简称',
				field: 'shortName',
				cellRenderer: params => {
					return params.data.orgType === 1 ? '' : params.value
				}
			}, {
				headerName: '人数',
				field: 'userQuantity',
				valueGetter: params => {
					return params.data.userQuantity + '人'
				}
			}, {
				headerName: '操作', pinned: 'right', field: `id`, width: 200,
				cellRendererFramework: 'architectureOperateButton'
			}]
		this.userGrid.columnDefs = [
			{ headerName: 'id', field: `id`, hide: true },
			{ headerName: '租户id', field: `tenantId`, hide: true },
			{ headerName: '所属公司ID', field: `officeId`, hide: true },
			{ headerName: '所属部门ID', field: `departmentId`, hide: true },
			{ headerName: '用户代码', field: `userCode`, hide: true },
			{
				headerName: '用户名', field: `userName`,
				cellRenderer: params => {
					// const iconName = !params.data.bActive ? 'grid-icon-enabled' : 'grid-icon-disabled'
					// const color = params.data.bActive ? '#67c23a' : '#e6a23c'
					// return `<svg class="svg-icon" fill="${color}" aria-hidden="true" style="height:1.1em;width:1.1em;">
					//       <use xlink:href="#icon-${iconName}"></use>
					//     </svg> ${params.value}`
					const iconName = !params.data.bActive ? 'icon-zanting' : 'icon-bofang'
					const color = params.data.bActive ? '#67c23a' : '#e6a23c'
					return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 12px;" />${params.value}`
				}
			},
			{ headerName: '用户密码', field: `password` },
			{
				headerName: '中文名', field: `chineseName`,
				cellRenderer: params => {
					return `<i class="iconfont icon-jiaose" style="font-size: 12px; color: #409EFF"></i> ${params.value}`
					// return `<svg class="svg-icon" aria-hidden="true" style="height:1.2em;width:1.2em;">
					//       <use xlink:href="#icon-${iconName}"></use>
					//     </svg> ${params.value}`
				}
			},
			{ headerName: '英文名', field: `englishName` },
			{ headerName: '用户状态', field: `status`, hide: true },
			{ headerName: '用户传真', field: `fax`, hide: true },
			{ headerName: '用户电话', field: `tel`, hide: true },
			{ headerName: '分机号', field: `extNum`, hide: true },
			{ headerName: '手机', field: `mobile` },
			{ headerName: '邮箱', field: `email` },
			{ headerName: 'qq', field: `qq`, hide: true },
			{ headerName: '微信', field: `wecat`, hide: true },
			{ headerName: '地址', field: `address`, hide: true },
			{ headerName: '备注', field: `remark`, hide: true },
			{ headerName: '是否运营授权账号', field: `bAuthorizer`, hide: true },
			{ headerName: '是否管理员', field: `bAdministrator`, hide: true },
			{ headerName: '创建人', field: `createBy`, hide: true },
			{ headerName: '创建时间', field: `createTime`, hide: true },
			{ headerName: '更新时间', field: `updateTime`, hide: true },
			{ headerName: '更新人', field: `updateBy`, hide: true }
		]
	},
	beforeMount() {
		this.fetchArchitectureList()
	},
	methods: {
		onReady(params) {
			this.gridApi = params.api
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		onUserReady(params) {
			this.userGrid.gridApi = params.api
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		fetchArchitectureList() {
			const self = this
			getArchitectureList({}).then(res => {
				if (res.ok) {
					self.rowData = res.content
				}
			}).then(() => {
				return getCompanyVisualView()
			}).then((res) => {
				if (res.ok) {
					this.visualCompany.data = res.content
					this.fetchUserList({})
				}
			}).catch(() => {
				// self.$message.error('err:' + err)
			})
		},
		onUserRowCLick(event) {
			const id = event.node.data.id
			this.$router.push({ name: 'NewUser', query: { id } })
		},
		onRowCLick(event) {
			this.fetchUserList(event.node.data)
		},
		fetchUserList(data) {
			const searchConditions = {}
			if (data.orgType === 0) {
				if (data.parentId === '0') {
					// 组织架构 根节点
				} else {
					// 公司
					searchConditions.officeId = data.id
				}
			} else {
				// 部门
				searchConditions.departmentId = data.id
			}

			getUserList(searchConditions).then(res => {
				if (res.ok) {
					this.userGrid.rowData = res.content.list
				}
			}).catch(err => {
				this.$message.error(err)
			})
		},
		popCompanyAddDialog: function (data) {
			const self = this
			getCurrencyList().then(res => {
				if (res.ok) {
					self.currencyList = res.content.list
					return self.currencyList
				}
			}).then((list) => {
				console.log('本位币：', list)
				self.isShowingCompanyForm = true
				self.oneCompany = { ...(self.initOneCompany), ...{ parentOfficeId: data.id } }
				console.log('data', data)
				self.companyDialog.parentLabel = '上级公司'
				self.companyDialog.parentName = data.name
			})
		},
		addCompany() {
			// 父公司id
			// this.$router.push({ name: 'CompanyDetails', params: { pCompanyId }})
			const self = this
			saveCompanyInfo(self.oneCompany).then(res => {
				self.$message.success('新增公司成功')
				self.isShowingCompanyForm = false
				this.fetchArchitectureList()
			}).catch(err => {
				this.$message.error(err)
			})
		},
		editCompany(companyId) {
			// 当前公司id
			this.$router.push({ name: 'CompanyDetails', params: { companyId } })
		},
		popChooseAddTypeDialog(data) {
			this.isShowingChooseAddTypeDialog = true
			this.currentRowData = data
		},
		chooseAddCompany() {
			this.isShowingChooseAddTypeDialog = false
			this.popCompanyAddDialog(this.currentRowData)
		},
		chooseAddDept() {
			this.isShowingChooseAddTypeDialog = false
			this.popDeptAddDialog(this.currentRowData)
		},
		renderOrgNode(fun, data) {
			console.log('renderOrgNode fun', fun)
			console.log('renderOrgNode data==>', data)
			let icon = data.bOffice ? 'company' : 'dept'
			if (data.bRoot) {
				icon = 'group'
			}
			const name = data.shortName || data.label
			const size = data.bOffice ? '1.2' : '1.3'
			return fun('cargo-svg-icon', { style: { 'font-size': `${size}em` }, props: { content: `${name}`, iconClass: `${icon}`, className: 'org-node-label' } }, 'd22')
		},
		getLabelClassName(data) {
			const commonClass = 'org-label-common'
			let resultClass = commonClass
			if (data.bLeaf) {
				resultClass = `${resultClass} org-label-leaf`
			}
			if (data.bOffice) {
				// todo
				resultClass = `${resultClass} org-label-company`
			}
			if (data.bRoot) {
				// todo
				resultClass = `${resultClass} org-label-root`
			}
			return resultClass
		},
		popDeptAddDialog(data) {
			console.log('dept data', data)
			const self = this
			let parentDepartmentId = 0
			let officeId = 0
			let parentLabel = '上级公司'
			if (data.orgType === 0) {
				// 公司下加部门
				officeId = data.id
			} else {
				// 部门下加部门
				parentDepartmentId = data.id
				officeId = data.officeId
				parentLabel = '上级部门'
			}
			self.isShowingDeptForm = true
			self.oneDept = { ...(self.initOneDept), ...{ parentDepartmentId, officeId } }
			self.deptDialog.parentLabel = parentLabel
			self.deptDialog.parentName = data.name
		},
		popDeptEditDialog(data) {
			const self = this
			self.isShowingDeptForm = true
			self.deptDialog.parentLabel = ''
			self.deptDialog.parentName = ''
			getDeptById(data.id).then(res => {
				if (res.ok) {
					self.oneDept = res.content
				}
			})
		},
		addDept() {
			const self = this
			saveDept(self.oneDept).then(res => {
				if (res.ok) {
					self.$message.success('新增部门成功')
					self.isShowingDeptForm = false
					this.fetchArchitectureList()
				} else {
					self.$message.error(res.message)
				}
			})
		},
		editDept() {
			const self = this
			saveDept(self.oneDept, self.oneDept.id).then(res => {
				if (res.ok) {
					self.$message.success('编辑部门成功')
					self.isShowingDeptForm = false
					this.fetchArchitectureList()
				} else {
					self.$message.error(res.message)
				}
			})
		},
		delArchitecture(id, orgType) {
			delArchitecture(id, orgType).then(res => {
				if (res.ok) {
					this.$message.success('删除成功')
					this.fetchArchitectureList()
				} else {
					this.$message.error(res.message)
				}
			})
		},
		submitDept() {
			this.$refs.deptForm.validate().then(valid => {
				if (this.oneDept.id) {
					this.editDept()
				} else {
					this.addDept()
				}
			}).catch(err => {
				console.log('error submit!!', err)
			})
		},
		submitCompany() {
			this.$refs.companyForm.validate().then(valid => {
				if (this.oneCompany.id) {
					// todo
				} else {
					this.addCompany()
				}
			}).catch(err => {
				console.log('error submit!!', err)
			})
		}
	},
	mounted() {
		this.resetHeight()
	}
}
</script>

<style scoped>
.icon-and-text-buttons {
	display: inline-block;
	width: 68px;
	/*border: 1px solid red;*/
}
.icon-and-text-buttons .icon-wrapper,
.icon-and-text-buttons .text-wrapper {
	text-align: center;
}
.icon-and-text-buttons .icon-wrapper {
	font-size: 40px;
}
</style>
<style>
.org-node-label {
	color: #fff;
}
.org-label-common {
	/*background: #66CD00;*/
	background: #63b8ff;
	color: white;
}
.org-label-company {
	background: #409eff;
	/*width:240px*/
}
.org-label-root {
	width: 240px;
}
.org-label-leaf {
	background: #63b8ff;
	width: 50px;
}
/* v-org-tree ===>css */
.org-tree-container {
	display: inline-block;
	padding: 15px;
	background-color: #fff;
}
.org-tree {
	display: table;
	text-align: center;
}
.org-tree:after,
.org-tree:before {
	content: "";
	display: table;
}
.org-tree:after {
	clear: both;
}
.org-tree-node,
.org-tree-node-children {
	position: relative;
	margin: 0;
	padding: 0;
	list-style-type: none;
}
.org-tree-node-children:after,
.org-tree-node-children:before,
.org-tree-node:after,
.org-tree-node:before {
	-webkit-transition: all 0.35s;
	transition: all 0.35s;
}
.org-tree-node-label {
	position: relative;
	display: inline-block;
}
.org-tree-node-label .org-tree-node-label-inner {
	padding: 10px 15px;
	text-align: center;
	border-radius: 3px;
	-webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}
.org-tree-button-wrapper {
	position: absolute;
	top: 100%;
	left: 50%;
	width: 0;
	height: 0;
	z-index: 10;
	-webkit-transform: translateX(-50%);
	transform: translateX(-50%);
}
.org-tree-button-wrapper > * {
	position: absolute;
	top: 50%;
	left: 50%;
}
.org-tree-button-wrapper .org-tree-node-btn {
	position: relative;
	display: inline-block;
	width: 20px;
	height: 20px;
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 50%;
	-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	-webkit-transition: all 0.35s ease;
	transition: all 0.35s ease;
	-webkit-transform: translate(-50%, 9px);
	transform: translate(-50%, 9px);
}
.org-tree-button-wrapper .org-tree-node-btn:hover {
	background-color: #e7e8e9;
	-webkit-transform: translate(-50%, 9px) scale(1.15);
	transform: translate(-50%, 9px) scale(1.15);
}
.org-tree-button-wrapper .org-tree-node-btn:after,
.org-tree-button-wrapper .org-tree-node-btn:before {
	content: "";
	position: absolute;
}
.org-tree-button-wrapper .org-tree-node-btn:before {
	top: 50%;
	left: 4px;
	right: 4px;
	height: 0;
	border-top: 1px solid #ccc;
}
.org-tree-button-wrapper .org-tree-node-btn:after {
	top: 4px;
	left: 50%;
	bottom: 4px;
	width: 0;
	border-left: 1px solid #ccc;
}
.org-tree-button-wrapper .org-tree-node-btn.expanded:after {
	border: none;
}
.org-tree-node {
	padding-top: 20px;
	display: table-cell;
	vertical-align: top;
}
.org-tree-node.collapsed,
.org-tree-node.is-leaf {
	padding-left: 10px;
	padding-right: 10px;
}
.org-tree-node:after,
.org-tree-node:before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 50%;
	height: 19px;
}
.org-tree-node:after {
	left: 50%;
	border-left: 1px solid #ddd;
}
.org-tree-node:not(:first-child):before,
.org-tree-node:not(:last-child):after {
	border-top: 1px solid #ddd;
}
.collapsable .org-tree-node.collapsed {
	padding-bottom: 30px;
}
.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
	content: "";
	position: absolute;
	top: 100%;
	left: 0;
	width: 50%;
	height: 20px;
	border-right: 1px solid #ddd;
}
.org-tree > .org-tree-node {
	padding-top: 0;
}
.org-tree > .org-tree-node:after {
	border-left: 0;
}
.org-tree-node-children {
	padding-top: 20px;
	display: table;
}
.org-tree-node-children:before {
	content: "";
	position: absolute;
	top: 0;
	left: 50%;
	width: 0;
	height: 20px;
	border-left: 1px solid #ddd;
}
.org-tree-node-children:after {
	content: "";
	display: table;
	clear: both;
}
.horizontal .org-tree-node {
	display: table-cell;
	float: none;
	padding-top: 0;
	padding-left: 20px;
}
.horizontal .org-tree-node.collapsed,
.horizontal .org-tree-node.is-leaf {
	padding-top: 10px;
	padding-bottom: 10px;
}
.horizontal .org-tree-node:after,
.horizontal .org-tree-node:before {
	width: 19px;
	height: 50%;
}
.horizontal .org-tree-node:after {
	top: 50%;
	left: 0;
	border-left: 0;
}
.horizontal .org-tree-node:only-child:before {
	top: 1px;
	border-bottom: 1px solid #ddd;
}
.horizontal .org-tree-node:not(:first-child):before,
.horizontal .org-tree-node:not(:last-child):after {
	border-top: 0;
	border-left: 1px solid #ddd;
}
.horizontal .org-tree-node:not(:only-child):after {
	border-top: 1px solid #ddd;
}
.horizontal .org-tree-node .org-tree-node-inner {
	display: table;
}
.horizontal .org-tree-node-label {
	display: table-cell;
	vertical-align: middle;
}
.horizontal.collapsable .org-tree-node.collapsed {
	padding-right: 30px;
}
.horizontal.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
	top: 0;
	left: 100%;
	width: 20px;
	height: 50%;
	border-right: 0;
	border-bottom: 0.625em solid #ddd;
}
.horizontal .org-tree-button-wrapper {
	position: absolute;
	top: 50%;
	left: 100%;
	width: 0;
	height: 0;
	z-index: 10;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.horizontal .org-tree-button-wrapper > * {
	position: absolute;
	top: 50%;
	left: 50%;
}
.horizontal .org-tree-button-wrapper .org-tree-node-btn {
	display: inline-block;
	-webkit-transform: translate(9px, -50%);
	transform: translate(9px, -50%);
}
.horizontal > .org-tree-node:only-child:before {
	border-bottom: 0;
}
.horizontal .org-tree-node-children {
	display: table-cell;
	padding-top: 0;
	padding-left: 20px;
}
.horizontal .org-tree-node-children:before {
	top: 50%;
	left: 0;
	width: 20px;
	height: 0;
	border-left: 0;
	border-top: 1px solid #ddd;
}
.horizontal .org-tree-node-children:after {
	display: none;
}
.horizontal .org-tree-node-children > .org-tree-node {
	display: block;
}
</style>
