<template>
  <div>
    <div class=" app-main-inner-row">
      <div class="operate-buttons" style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff;width:100%">
        <div class="operate-buttons-left">
          <el-button v-permission="['sys:role:add']" type="primary" size="mini" @click="createRole">{{$t('role.createBtn')}}</el-button>
<!--          <el-button v-permission="['sys:role:add']" type="primary" size="mini" @click="permissionControl">{{$t('role.permissionControl')}}</el-button>-->
          <!--<el-button v-permission="['sys:role:del']" type="danger" size="mini">删除</el-button>-->
        </div>
        <div class="operate-buttons-right">
          <!--<el-button v-permission="['sys:role:copy']" type="success" size="mini">复制</el-button>-->
          <!--<el-button size="mini" type="primary">通用角色模板</el-button>-->
        </div>
      </div>
    </div>
    <div class=" app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnDefs"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :style="innerTableHeight"
        class="ag-theme-balham"
      />
    </div>
    <el-dialog :visible.sync="isShowingRoleDialog" :close-on-click-modal="false" :title="$t('role.editRoleTitle')" width="500px">
      <el-form label-width="100px" label-position="left" :model="editForm" :rules="editFormRules" ref="editForm" size="mini">
        <el-form-item :label="$t('role.roleName')" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item :label="$t('role.roleDesc')" prop="description">
          <el-input v-model="editForm.description" />
        </el-form-item>
        <el-form-item :label="$t('role.roleCode')" prop="code">
          <el-input v-model="editForm.code" :disabled="!isAddingNewRole" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button v-permission="['sys:role:update']" size="mini" @click="doSaveRole">{{$t('common.saveBtn')}}</el-button>
        <el-button size="mini" @click="isShowingRoleDialog = false">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <!-- ↓复制角色↓ -->
    <el-dialog :visible.sync="isShowingRoleCopyDialog" :close-on-click-modal="false" :title="$t('role.copyRole')" width="500px">

      <el-form label-width="100px" label-position="left" :model="copyForm" ref="copyForm" :rules="editFormRules" size="mini">
        <!--<el-form-item label="被复制角色Id">{{ roleIdToBeCopied }}(调试用，将被隐藏)</el-form-item>-->
        <el-form-item :label="$t('role.copiedRole')">{{ roleNameToBeCopied }}</el-form-item>
        <el-form-item :label="$t('role.roleName')" prop="name">
          <el-input v-model="copyForm.name" />
        </el-form-item>
        <el-form-item :label="$t('role.roleDesc')" prop="description">
          <el-input v-model="copyForm.description" />
        </el-form-item>
        <el-form-item :label="$t('role.roleCode')" prop="code">
          <el-input v-model="copyForm.code" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="doCopyRole">{{$t('common.saveBtn')}}</el-button>
        <el-button size="mini" @click="isShowingRoleCopyDialog = false">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <!-- ↑复制角色↑ -->
    <el-dialog :visible.sync="isShowingRolePrivilege" :close-on-click-modal="false" :title="$t('role.copyTitle')">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsOfRolePrivilege"
        :side-bar="sideBarDefsOfRolePrivilege"
        :column-defs="columnDefsOfRolePrivilege"
        :row-data="rowDataOfRolePrivilege"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyOfRolePrivilege"
        style="width: 100%;height:500px"
        class="ag-theme-balham"
      />
      <div slot="footer">
        <el-button v-permission="['sys:role:assignprivilege']" type="primary" size="mini" @click="toSaveRoleAuthorizedPrivilege">{{$t('common.saveBtn')}}</el-button>
        <el-button size="mini" @click="isShowingRolePrivilege = false">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowingAssignedUser" :close-on-click-modal="false" :title="$t('role.assignUserTitle')">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsOfAssignedUser"
        :side-bar="sideBarDefsOfAssignedUser"
        :column-defs="columnDefsOfAssignedUser"
        :row-data="rowDataOfAssignedUser"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyOfAssignedUser"
        style="width: 100%;height:500px"
        class="ag-theme-balham"
      />
      <div slot="footer">
        <el-button type="primary" size="mini" @click="toSaveAssignedUser">{{$t('common.saveBtn')}}</el-button>
        <el-button size="mini" @click="isShowingAssignedUser = false">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import { getRoleList, getRoleById, saveRole, deleteRole, activateRole, deactivateRole,
  getRelatedPrivilege, saveRoleAuthorizedPrivilege, getAssignedUser, saveAssignedUser, copyRole } from '@/api/role'
import roleOperationButton from './CellRendererFramework/roleOperationButton'

export default {
  name: 'Roles',
  components: { AgGridVue, roleOperationButton },
  data() {
    return {
      gridOptions: {},
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnDefs: null,
      rowData: [],
      isShowingSummary: false,
      isShowingMoreSearchCondition: false,
      isShowingRoleDialog: false,
      isAddingNewRole: false,
      roleIdToBeCopied: '',
      roleNameToBeCopied: '',
      isShowingRoleCopyDialog: false,
      code: '',
      isShowingRolePrivilege: false,
      gridOptionsOfRolePrivilege: {},
      sideBarDefsOfRolePrivilege: null,
      columnDefsOfRolePrivilege: null,
      rowDataOfRolePrivilege: [],
      isShowingAssignedUser: false,
      gridOptionsOfAssignedUser: {},
      sideBarDefsOfAssignedUser: null,
      columnDefsOfAssignedUser: null,
      rowDataOfAssignedUser: [],
      innerTableHeight: null,
      editForm: {
        name: '',
        description: '',
        code: ''
      },
      copyForm: {
        name: '',
        description: '',
        code: ''
      },
      editFormRules: {
        name: [
          { required: true, message: this.$t('role.roleNameEmptyError'), trigger: 'blur' }
        ],
        description: [
          { required: true, message: this.$t('role.roleDescEmptyError'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('role.roleCodeEmptyError'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.resetHeight()
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
      context: {
        componentParent: self
      }
    }
    this.columnDefs = [
      { headerName: this.$t('common.enableBtn'), field: 'bActive', hide: true },
      { headerName: this.$t('role.table.name'), field: 'name',
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
      {
        headerName: this.$t('role.roleDesc'), field: 'description',
        cellRenderer: params => {
          return `<i class="iconfont icon-jiaose" style="font-size: 12px; color: #409EFF"></i> ${params.value}`
        }
      },
      { headerName: this.$t('role.roleCode'), field: 'code' },
      { headerName: this.$t('role.table.createByName'), field: 'createByName' },
      { headerName: this.$t('role.table.createTime'), field: 'createTime',
        cellRenderer: params => {
          return this.$moment(Number(params.value)).format('YYYY-MM-DD')
        },
      },
      { headerName: this.$t('role.table.updateBy'), field: 'updateBy' },
      { headerName: this.$t('role.table.updateTime'), field: 'updateTime',
        cellRenderer: params => {
          return this.$moment(Number(params.value)).format('YYYY-MM-DD')
        }
      },
      {
        headerName: this.$t('common.operation'), pinned: 'right', width: 270, suppressSizeToFit: true, suppressResize: true,
        cellRendererFramework: 'roleOperationButton'
      }
    ]
    this.gridOptionsOfRolePrivilege = {
      rowSelection: 'multiple',
      groupDefaultExpanded: 2,
      suppressRowClickSelection: true,
      treeData: true,
      getDataPath: (data) => {
        return data.path.split(',')
      },
      autoGroupColumnDef: {
        headerName: this.$t('role.table.auth'),
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true
        }
      }
    }
    this.columnDefsOfRolePrivilege = [
      {
        headerName: 'OP',
        field: 'checked',
        cellRenderer: params => {
          const iconName = params.value ? 'icon-checkmark-circle-outline' : 'icon-guanbi'
          const color = params.value ? '#34B805' : '#929292'
          return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 14px;"></i>`
        },
        onCellClicked: (params) => {
          const pid = params.data.id
          getRelatedPrivilege(pid).then(res => {
            if(res.ok) {
              return res.content
            }
            return {}
          }).then(lists => {
            const ancestors = lists.parentId === '' ? [] : lists.parentId.split(',')
            const offsprings = lists.childrenId === '' ? [] : lists.childrenId.split(',')
            if (!params.data.checked) { // 如果原先没有勾上（现在是在打钩），接下来勾上所有祖先和子孙
              const idsToCheck = [...ancestors, ...offsprings]
              params.api.forEachNode(n => {
                idsToCheck.forEach(i => {
                  if (i === n.data.id) {
                    n.data.checked = true
                  }
                })
              })
              params.api.refreshCells()
            } else { // 如果原先是钩着的状态（现在是在取消勾选），接下来取消子孙
              params.data.checked = false// 需要个特殊处理：把自己改成checked=false
              const idsToUncheck = offsprings
              params.api.forEachNode(n => {
                idsToUncheck.forEach(i => {
                  if (i === n.data.id) {
                    console.log(i, n.data.id)
                    n.data.checked = false
                  }
                })
              })
              params.api.refreshCells()
            }
          })
        }
      },
      { headerName: this.$t('role.table.id'), field: 'id' },
      { headerName: this.$t('role.table.description'), field: 'description' },
      { headerName: this.$t('role.table.checked'), field: 'checked' }
    ]
    this.gridOptionsOfAssignedUser = {}
    this.columnDefsOfAssignedUser = [
      {
        headerName: this.$t('role.table.bAssigned'), field: 'bAssigned',
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
      { headerName: this.$t('role.table.userName'), field: 'userName' },
      { headerName: this.$t('role.table.chineseName'), field: 'chineseName' },
      { headerName: this.$t('role.table.englishName'), field: 'englishName' },
      { headerName: this.$t('role.table.officeShortName'), field: 'officeShortName' },
      { headerName: this.$t('role.table.departmentName'), field: 'departmentName' }
    ]
  },
  beforeMount() {
    this.fetchList()
  },
  watch: {
    gridHeight: function(newVal, oldVal) {
      const width = {'width': '100%'}
      this.innerTableHeight = {...width, ...newVal}
    },
    isShowingRoleDialog: function(newVal, oldVal) {
      if(!newVal) {
        this.editForm.name = ''
        this.editForm.description = ''
        this.editForm.code = ''
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate()
        })
      }
    },
    isShowingRoleCopyDialog: function(newVal, oldVal) {
      if(!newVal) {
        this.copyForm.name = ''
        this.copyForm.description = ''
        this.copyForm.code = ''
        this.$nextTick(() => {
          this.$refs.copyForm.clearValidate()
        })
      }
    }
  },
  methods: {
    onReady(params) {
      // const self = this
      this.gridApi = params.api
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          // self.onFirstDataRendered(self.gridOptions)
          // params.api.sizeColumnsToFit()
        })
      })
    },
    onReadyOfRolePrivilege(params) {
      this.gridApiOfRolePrivilege = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    onReadyOfAssignedUser(params) {
      this.gridApiOfAssignedUser = params.api
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
    fetchList() {
      getRoleList().then(res => {
        if(res.ok) {
          this.rowData = res.content.list
        }
        // this.$message.success('获取角色列表成功!')
      })
    },
    createRole() {
      this.isAddingNewRole = true;
      this.isShowingRoleDialog = true
    },
    permissionControl(){
      this.$router.push({ name: 'RoleEdit'})
    },
    doSaveRole() {
      this.$refs.editForm.validate(valid => {
        if(valid) {
          const id = this.isAddingNewRole ? null : this.oneRoleId
          saveRole(this.editForm, id).then(res => {
            if (res.ok) {
              this.$message.success(this.$t('role.saveSuccess'))
              this.isShowingRoleDialog = false
              this.fetchList()
            }
          })
        }
      })
    },
    toEditRole(id) {
      getRoleById(id).then(res => {
        if(res.ok) {
          this.editForm.name = res.content.name
          this.editForm.description = res.content.description
          this.editForm.code = res.content.code
          this.oneRoleId = res.content.id
          this.isAddingNewRole = false // 用以标记此时是在修改已有的角色
          this.isShowingRoleDialog = true
        }
      })
    },
    toDeleteRole(id) {
      this.$confirm(this.$t('role.confirmDeleteTip'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        deleteRole(id).then(res => {
          if (res.ok) {
            this.fetchList()
          }
        })
      }).catch(() => {})
    },
    enableRole(id) {
      activateRole(id).then(res => {
        if (res.ok) {
          this.fetchList()
        }
      })
    },
    disableRole(id) {
      deactivateRole(id).then(res => {
        if (res.ok) {
          this.fetchList()
        }
      })
    },
    toAuthorizeRole(id, name, desc) {
      this.$router.push({ name: 'RoleAuthorize', query: { id, name, desc }}) // 原来弹窗的方式已废弃！
    },
    toEditRolePage(id, name, desc) {
      this.$router.push({ name: 'RoleEdit', query: { id, name, desc }})
    },
    toSaveRoleAuthorizedPrivilege() {
      const id = this.oneRoleId
      const assignedIdList = []
      this.gridApiOfRolePrivilege.forEachNode(n => {
        if (n.data.checked) {
          assignedIdList.push(n.data.id)
        }
      })
      saveRoleAuthorizedPrivilege({ id, assignedIdList }).then(res => {
        if (res.ok) {
          this.isShowingRolePrivilege = false
        }
      })
    },
    toAssignUser(id) {
      this.oneRoleId = id
      getAssignedUser(id).then(res => {
        if(res.ok) {
          this.rowDataOfAssignedUser = res.content
          this.isShowingAssignedUser = true
        }
      })
    },
    toSaveAssignedUser() {
      const id = this.oneRoleId
      const assignedIdList = []
      this.gridApiOfAssignedUser.forEachNode(n => {
        if (n.data.bAssigned) {
          assignedIdList.push(n.data.id)
        }
      })
      saveAssignedUser({ id, assignedIdList }).then(res => {
        if (res.ok) {
          this.isShowingAssignedUser = false
        }
      })
    },
    toCopyRole(roleIdToBeCopied, roleNameToBeCopied) {
      this.roleIdToBeCopied = roleIdToBeCopied
      this.roleNameToBeCopied = roleNameToBeCopied
      this.isShowingRoleCopyDialog = true
    },
    doCopyRole() {
      this.$refs.copyForm.validate(valid => {
        if(valid) {
          const roleIdToBeCopied = this.roleIdToBeCopied
          copyRole({ ...this.copyForm, ...{ roleIdToBeCopied: roleIdToBeCopied } }).then(res => {
            if (res.ok) {
              this.$message.success(this.$t('role.copySuccess'))
            }
          }).then(() => {
            return getRoleList()
          }).then(res => {
            if(res.ok) {
              this.rowData = res.content.list
              this.isShowingRoleCopyDialog = false
            }
          })
        }
      })
    }
  }
}
</script>
<style>
  .search-bar-right{
    padding-top: 6px;
  }
  .search-bar-right .el-button--mini{
    height: 28px;
    margin-left: 4px;
    margin-right: 8px;
  }
</style>
