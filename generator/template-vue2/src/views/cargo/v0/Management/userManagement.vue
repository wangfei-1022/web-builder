<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row">
      <div
        class="searchConditions-and-triggers"
        style="background-color: #f5f7f7; width:100%; display: flex; justify-content: space-between;padding:5px;"
      >
        <div class="searchConditions">
          <el-form
            :model="searchConditions"
            :inline="true"
            label-width="90px"
            label-position="left"
          >
            <div class="el-form-item-wrapper">
              <el-form-item label="工号/用户名">
                <el-input
                  v-model="searchConditions.userName"
                  size="mini"
                  clearable
                  @clear="toQuery"
                  @keyup.enter.native="toQuery"
                />
              </el-form-item>
              <el-form-item label="中文名">
                <el-input
                  v-model="searchConditions.chineseName"
                  size="mini"
                  clearable
                  @clear="toQuery"
                  @keyup.enter.native="toQuery"
                />
              </el-form-item>
              <el-form-item label="英文名">
                <el-input
                  v-model="searchConditions.englishName"
                  size="mini"
                  clearable
                  @clear="toQuery"
                  @keyup.enter.native="toQuery"
                />
              </el-form-item>
              <el-form-item label="所属分公司">
                <!--<el-input v-model="searchConditions.officeId" size="mini" />-->
                <el-select
                  v-model="searchConditions.officeId"
                  size="mini"
                  placeholder=""
                  clearable
                  @change="refreshDepartmentList"
                >
                  <el-option
                    v-for="o in officeList"
                    :key="o.value"
                    :label="o.label"
                    :value="o.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属部门">
                <!--<el-input v-model="searchConditions.departmentId" size="mini" />-->
                <el-select
                  id="search-condition-department-id"
                  v-model="searchConditions.departmentId"
                  size="mini"
                  placeholder=""
                  clearable
                  :disabled="searchConditions.officeId === ''"
                >
                  <el-option
                    v-for="d in departmentList"
                    :key="d.value"
                    :label="d.label"
                    :value="d.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="triggers">
          <div>
            <el-button
              size="mini"
              style="width:100%"
              @click="toQuery"
            >查询</el-button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="app-main-inner-row"
      style=""
    >
      <div class="btn-group-left">
        <el-button
          type="primary"
          size="mini"
          @click="toCreateUser"
        >新建用户</el-button>
      </div>
      <div class="btn-group-right">
        <!--<el-button type="primary" size="mini">导出用户</el-button>-->
        <!--<el-button type="primary" size="mini">导入用户</el-button>-->
      </div>
    </div>

    <div class="app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnDefs"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :row-double-clicked="onRowDoubleClicked"
        style="width: 100%;height: calc(100vh - 284px)"
        class="ag-theme-balham"
      />
    </div>
    <el-dialog
      :visible.sync="isShowingUserForm"
      title="用户表单"
    >
      <el-form
        :model="oneUser"
        label-width="90px"
        label-position="left"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="oneUser.userName"
            :disabled="oneUser.id !== ''"
          />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="oneUser.mobile" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="oneUser.email" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="oneUser.password" />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submit"
        >确定</el-button>
        <el-button @click="isShowingUserForm = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="isShowingAssignedRole"
      title="分配角色"
    >
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsOfAssignedRole"
        :side-bar="sideBarDefsOfAssignedRole"
        :column-defs="columnDefsOfAssignedRole"
        :row-data="rowDataOfAssignedRole"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyOfAssignedRole"
        style="width: 100%;height:500px"
        class="ag-theme-balham"
      />
      <div slot="footer">
        <el-button
          type="primary"
          size="mini"
          @click="toSaveAssignedRole"
        >保存</el-button>
        <el-button
          size="mini"
          @click="isShowingAssignedRole = false"
        >取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="isShowingAssignedRule"
      title="分配编码规则"
    >
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsOfAssignedRule"
        :side-bar="sideBarDefsOfAssignedRule"
        :column-defs="columnDefsOfAssignedRule"
        :row-data="rowDataOfAssignedRule"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyOfAssignedRule"
        style="width: 100%;height:500px"
        class="ag-theme-balham"
      />
      <div slot="footer">
        <el-button
          type="primary"
          size="mini"
          @click="toSaveAssignedRule"
        >保存</el-button>
        <el-button
          size="mini"
          @click="isShowingAssignedRule = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { getUserList, getUserById, saveUser, activateUser, deactivateUser, getAssignedRole, saveAssignedRole, getAssignedRule, saveAssignedRule, getOffice, getDepartmentByOfficeId } from '@/api/user'
import userOperateButton from './CellRendererFramework/userOperateButton'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import URL from '@/api/urlTranslator'

export default {
  name: 'UserManagement',
  components: { AgGridVue, userOperateButton, cargoAdvanceSelect },
  data() {
    return {
      officeList: [],
      departmentList: [],
      isShowingMoreSearchCondition: false,
      isShowingSummary: false,
      isShowingUserForm: false,
      gridOptions: {},
      gridApi: {},
      columnDefs: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      rowData: [],
      oneUser: { id: '', userName: '', password: '', mobile: '', email: '' },
      searchConditions: {
        userName: '',
        chineseName: '',
        englishName: '',
        officeId: '',
        departmentId: ''
      },
      isShowingAssignedRole: false,
      gridOptionsOfAssignedRole: {},
      sideBarDefsOfAssignedRole: null,
      columnDefsOfAssignedRole: null,
      rowDataOfAssignedRole: [],
      isShowingAssignedRule: false,
      gridOptionsOfAssignedRule: {},
      sideBarDefsOfAssignedRule: null,
      columnDefsOfAssignedRule: null,
      rowDataOfAssignedRule: [],
      innerGridHeight: null
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  created() {
    const self = this
    this.gridOptions = {
      rowClassRules: {
        'grid-row-zebra-even': function(params) {
          return !(params.rowIndex % 2)
        },
        'grid-row-zebra-odd': function(params) {
          return (params.rowIndex % 2)
        }
      },
      suppressRowClickSelection: true,
      context: {
        componentParent: self
      }
    }
    this.columnDefs = [
      { headerName: 'id', field: `id`, hide: true },
      { headerName: '租户id', field: `tenantId`, hide: true },
      { headerName: '所属公司ID', field: `officeId`, hide: true },
      { headerName: '所属部门ID', field: `departmentId`, hide: true },
      { headerName: '用户代码', field: `userCode`, hide: true },
      { headerName: '用户名', field: `userName`,
        cellRenderer: params => {
          // const iconName = !params.data.bActive ? 'grid-icon-enabled' : 'grid-icon-disabled'
          // const color = params.data.bActive ? '#67c23a' : '#e6a23c'
          // return `<svg class="svg-icon" fill="${color}" aria-hidden="true" style="height:1.1em;width:1.1em;">
          //       <use xlink:href="#icon-${iconName}"></use>
          //     </svg> ${params.value}`
          const iconName = !params.data.bActive ? 'icon-zanting' : 'icon-bofang'
          const color = params.data.bActive ? '#67c23a' : '#e6a23c'
          return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 12px;"></i> ${params.value}`
        }
      },
      { headerName: '用户密码', field: `password` },
      {
        headerName: '中文名', field: `chineseName`,
        cellRenderer: params => {
          return `<i class="iconfont icon-jiaose" style="font-size: 12px; color: #409EFF"></i> ${params.value}`
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
      { headerName: '更新人', field: `updateBy`, hide: true },
      {
        headerName: '操作', pinned: 'right', field: `id`, width: 300,
        cellRendererFramework: 'userOperateButton'
      }
    ]
    this.columnDefsOfAssignedRole = [
      {
        headerName: '分配', field: 'bAssigned',
        cellRenderer: params => {
          const iconName = params.value ? 'icon-checkmark-circle-outline' : 'icon-guanbi'
          const color = params.value ? '#34B805' : '#929292'
          return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 14px;"></i>`
          // return `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;">
          //     <use xlink:href="#icon-${iconName}"></use></svg>`
        },
        onCellClicked: params => {
          params.data.bAssigned = !params.data.bAssigned
          params.api.refreshCells()
        }
      },
      { headerName: '名称', field: 'name' },
      { headerName: '描述', field: 'description' }
    ]
    this.columnDefsOfAssignedRule = [
      {
        headerName: '分配', field: 'bAssigned',
        cellRenderer: params => {
          const iconName = params.value ? 'icon-checkmark-circle-outline' : 'icon-guanbi'
          const color = params.value ? '#34B805' : '#929292'
          return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 14px;"></i>`
        },
        onCellClicked: params => {
          params.data.bAssigned = !params.data.bAssigned
          params.api.refreshCells()
        }
      },
      { headerName: '名称', field: 'chineseName' },
      { headerName: '表达式', field: 'ruleExpression' },
      { headerName: '所属公司', field: 'officeName' }
    ]
  },
  beforeMount() {
    this.fetchUserList()
    getOffice().then(res => {
      if(res.ok) {
        this.officeList = res.content
      }
    })
  },
  methods: {
    refreshDepartmentList(val) {
      this.searchConditions.departmentId = ''
      if (!val) {
        return // 如果officeId为空，不继续查
      }
      getDepartmentByOfficeId(val).then(res => {
        if(res.ok) {
          this.departmentList = res.content
        }
      })
    },
    onReady(params) {
      const self = this
      this.gridApi = params.api
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          // params.api.sizeColumnsToFit()
          self.onFirstDataRendered(self.gridOptions)
        })
      })
    },
    onReadyOfAssignedRole(params) {
      this.gridApiOfAssignedRole = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    onReadyOfAssignedRule(params) {
      this.gridApiOfAssignedRule = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    onFirstDataRendered(gridOptions) {
      const allColumnIds = []
      gridOptions.columnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId)
      })
      setTimeout(function() {
        gridOptions.columnApi.autoSizeColumns(allColumnIds)
      })
    },
    onRowDoubleClicked(event) {
      const id = event.node.data.id
      this.$router.push({ name: 'NewUser', query: { id }})
    },
    toEditUser(id) {
      this.$router.push({ name: 'NewUser', query: { id }})
    },
    fetchUserList() {
      const self = this
      getUserList().then(res => {
        if(res.ok) {
          self.rowData = res.content.list
        }
      })
    },
    toQuery() {
      const self = this
      getUserList(self.searchConditions).then(res => {
        if(res.ok) {
          self.rowData = res.content.list
        }
      })
    },
    popUserFormDialog(id) {
      const self = this
      if (id) {
        getUserById(id).then(res => {
          if(res.ok) {
            self.oneUser = res.content
            self.isShowingUserForm = true
            // 放在then里确保等self.user重新赋值后再显示对话框
          }
        })
      } else {
        self.oneUser = { id: '', userName: '', password: '', mobile: '', email: '' }
        self.isShowingUserForm = true
      }
    },
    toCreateUser() {
      this.$router.push({ name: 'NewUser' })
    },
    enableUser(id) {
      activateUser(id).then(res => {
        if (res.ok) {
          this.$message.success('启用成功')
          this.fetchUserList()
        }
      })
    },
    disableUser(id) {
      deactivateUser(id).then(res => {
        if (res.ok) {
          this.$message.success('禁用成功')
          this.fetchUserList()
        }
      })
    },
    addUser(oneUser) {
      saveUser(oneUser).then(res => {
        if(res.ok) {
          this.isShowingUserForm = false
          this.$message('saved')
        }
      }).then(() => {
        this.fetchUserList()
      })
    },
    editUser(oneUser, id) {
      saveUser(oneUser, id).then(res => {
        if(res.ok) {
          this.isShowingUserForm = false
          this.$message('updated')
        }
      }).then(() => {
        this.fetchUserList()
      })
    },
    submit() {
      if (this.oneUser.id) {
        this.editUser(this.oneUser, this.oneUser.id)
      } else {
        this.addUser(this.oneUser)
      }
    },
    toAssignRole(id) {
      this.oneUserId = id
      getAssignedRole(id).then(res => {
        if(res.ok) {
          this.rowDataOfAssignedRole = res.content
          this.isShowingAssignedRole = true
        }
      })
    },
    toSaveAssignedRole() {
      const id = this.oneUserId
      const assignedIdList = []
      this.gridApiOfAssignedRole.forEachNode(n => {
        if (n.data.bAssigned) {
          assignedIdList.push(n.data.id)
        }
      })
      saveAssignedRole({ id, assignedIdList }).then(res => {
        if (res.ok) {
          this.isShowingAssignedRole = false
        }
      })
    },
    toAssignRule(id) {
      this.oneUserId = id
      getAssignedRule(id).then(res => {
        if(res.ok) {
          this.rowDataOfAssignedRule = res.content
          this.isShowingAssignedRule = true
        }
      })
    },
    toSaveAssignedRule() {
      const id = this.oneUserId
      const assignedIdList = []
      this.gridApiOfAssignedRule.forEachNode(n => {
        if (n.data.bAssigned) {
          assignedIdList.push(n.data.ruleId)
        }
      })
      saveAssignedRule({ id, assignedIdList }).then(res => {
        if (res.ok) {
          this.isShowingAssignedRule = false
        }
      })
    }
  }

}
</script>

<style scoped>
.search-bar-right .el-button--mini {
  height: 28px;
  margin-left: 4px;
  margin-right: 8px;
}
.more-search-condition .el-form-item {
  margin-bottom: 4px;
}
.more-search-condition .el-date-editor {
  width: 208px;
}
</style>
<style>
#search-condition-department-id.el-input__inner {
  height: 28px !important;
}
</style>
