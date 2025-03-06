<template>
  <div style="padding: 10px 10px 0 10px;">
    <div style="padding-bottom: 10px;">
      <el-button type="primary" size="mini" plain @click="$router.push({name: 'Roles'})">返回列表</el-button>
      <el-button type="primary" size="mini" @click="toSaveFunctionPrivilege">保存</el-button>
      <span style="float:right;line-height:30px;">正在编辑：{{ $route.query.name }}, {{ $route.query.desc }}</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <div style="width:49%;">
        <ag-grid-vue
          :locale-text-func="_i18nGridLocalText"
          :grid-options="gridOptionsOfFunctionalPrivilege"
          :side-bar="sideBarDefsOfFunctionalPrivilege"
          :column-defs="columnDefsOfFunctionalPrivilege"
          :row-data="rowDataOfFunctionalPrivilege"
          :enable-col-resize="true"
          :enable-sorting="true"
          :grid-ready="onReadyOfFunctionalPrivilege"
          style="width: 100%;height:calc(100vh - 220px)"
          class="ag-theme-balham"
        />
      </div>
      <div style="width:49%;">
        <!--<div><el-button size="mini" @click="$message.success('数据权限保存成功！')">保存数据权限</el-button></div>-->
        <ag-grid-vue
          :locale-text-func="_i18nGridLocalText"
          :grid-options="gridOptionsOfDataPrivilege"
          :side-bar="sideBarDefsOfDataPrivilege"
          :column-defs="columnDefsOfDataPrivilege"
          :row-data="rowDataOfDataPrivilege"
          :enable-col-resize="true"
          :enable-sorting="true"
          :grid-ready="onReadyOfDataPrivilege"
          style="width: 100%;height:calc(100vh - 220px)"
          class="ag-theme-balham"
        />
      </div>
    </div>
    <el-dialog :visible.sync="isShowingSelectOfficeDialog" title="选择公司">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsOfOffice"
        :side-bar="sideBarDefsOfOffice"
        :column-defs="columnDefsOfOffice"
        :row-data="rowDataOfOffice"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyOfGridInDialog"
        style="width: 100%; height: 400px;"
        class="ag-theme-balham"
      />
      <div slot="footer">
        <el-button size="mini" type="primary" @click="toAddDataPrivilegeSave('office')">确定</el-button>
        <el-button size="mini" @click="isShowingSelectOfficeDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowingSelectDepartmentDialog" title="选择部门">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsOfDepartment"
        :side-bar="sideBarDefsOfDepartment"
        :column-defs="columnDefsOfDepartment"
        :row-data="rowDataOfDepartment"
        :enable-col-resize="true"
        :enable-sorting="true"
        :group-selects-children="true"
        :grid-ready="onReadyOfGridInDialog"
        style="width: 100%; height: 400px;"
        class="ag-theme-balham"
      />
      <div slot="footer">
        <el-button size="mini" type="primary" @click="toAddDataPrivilegeSave('department')">确定</el-button>
        <el-button size="mini" @click="isShowingSelectDepartmentDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowingSelectPersonDialog" title="选择用户">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsOfPerson"
        :side-bar="sideBarDefsOfPerson"
        :column-defs="columnDefsOfPerson"
        :row-data="rowDataOfPerson"
        :enable-col-resize="true"
        :enable-sorting="true"
        :group-selects-children="true"
        :grid-ready="onReadyOfGridInDialog"
        style="width: 100%; height: 400px;"
        class="ag-theme-balham"
      />
      <div slot="footer">
        <el-button size="mini" type="primary" @click="toAddDataPrivilegeSave('person')">确定</el-button>
        <el-button size="mini" @click="isShowingSelectPersonDialog=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { getRolePrivilegeById, getRelatedPrivilege, saveRoleAuthorizedPrivilege, getDataPrivilege, addDataPrivilegeSave, removeDataPrivilege } from '@/api/role'
import { getOfficeListForSettingDataPrivilege, getDepartmentListForSettingDataPrivilege, getPersonListForSettingDataPrivilege } from '@/api/partner'
import RoleAuthorizeDataPrivilegeOperationButton from './CellRendererFramework/roleAuthorizeDataPrivilegeOperationButton'

export default {
  name: 'RoleAuthorize',
  components: { AgGridVue, RoleAuthorizeDataPrivilegeOperationButton },
  data() {
    return {
      isShowingSelectDepartmentDialog: false,
      isShowingSelectOfficeDialog: false,
      isShowingSelectPersonDialog: false,
      gridOptionsOfFunctionalPrivilege: {},
      sideBarDefsOfFunctionalPrivilege: null,
      columnDefsOfFunctionalPrivilege: null,
      rowDataOfFunctionalPrivilege: [],
      gridOptionsOfDataPrivilege: {},
      sideBarDefsOfDataPrivilege: null,
      columnDefsOfDataPrivilege: null,
      rowDataOfDataPrivilege: [],
      gridOptionsOfOffice: {},
      sideBarDefsOfOffice: null,
      columnDefsOfOffice: null,
      rowDataOfOffice: [],
      gridOptionsOfDepartment: {},
      sideBarDefsOfDepartment: null,
      columnDefsOfDepartment: null,
      rowDataOfDepartment: [],
      gridOptionsOfPerson: {},
      sideBarDefsOfPerson: null,
      columnDefsOfPerson: null,
      rowDataOfPerson: []
    }
  },
  created() {
    this.gridOptionsOfFunctionalPrivilege = {
      rowSelection: 'single',
      groupDefaultExpanded: 2,
      // suppressRowClickSelection: true,
      treeData: true,
      getDataPath: data => data.path.split(','),
      autoGroupColumnDef: {
        headerName: '功能点',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: params => {
            let icon, color
            if (params.data.path.split(',').length === 2) {
              // eslint-disable-next-line default-case
              switch (params.data.name) {
                case '系统管理':
                  icon = 'icon-shezhi01'
                  color = '#1e87ff'
                  break
                case '资料管理':
                  icon = 'icon-ziliguanli'
                  color = '#228B22'
                  break
                case '海运出口':
                  icon = 'icon-changzhan'
                  color = '#228B22'
                  break
                case '财务结算管理':
                  icon = 'icon-shuzihuobi'
                  color = '#FF1493'
                  break
                case '审批管理':
                  icon = 'icon-shenhe'
                  color = '#800080'
                  break
                case '智能总控':
                  icon = 'icon-memory'
                  color = '#800080'
                  break
                case '统计分析':
                  icon = 'icon-yunyingguanli'
                  color = '#800080'
                  break
                case '信息管理':
                  icon = 'icon-subtitles'
                  color = '#800080'
                  break
                case '在线服务':
                  icon = 'icon-headsetm'
                  color = '#800080'
                  break
                case '云存储文件':
                  icon = 'icon-clouddownload'
                  color = '#1e87ff'
                  break
                case '定制运力':
                  icon = 'icon-chuan'
                  color = '#1e87ff'
                  break
                case '第三方平台打印服务':
                  icon = 'icon-contentright'
                  color = '#1e87ff'
                  break
              }
            } else if (params.data.path.split(',').length === 3) {
              icon = 'icon-quanxian'
              color = '#3366ff'
            } else {
              return params.value
            }
            const str = `<i class="iconfont ${icon}" style="color: ${color}; font-size: 14px;"></i> ${params.value}`
            return str
          }
        }
      }
    }
    this.columnDefsOfFunctionalPrivilege = [
      { headerName: '描述', field: 'description' },
      {
        headerName: '功能权限',
        field: 'checked',
        width: 110,
        suppressSizeToFit: true,
        cellStyle: { cursor: 'pointer' },
        cellRenderer: params => {
          const iconName = params.value ? 'icon-checkmark-circle-outline' : 'icon-guanbi'
          const color = params.value ? '#34B805' : '#929292'
          return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 14px;"></i>`
        },
        onCellClicked: params => {
          const pid = params.data.id
          getRelatedPrivilege(pid).then(res => res.content).then(lists => {
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
      {
        headerName: '数据权限', field: 'bDataPrivilege',
        width: 110,
        suppressSizeToFit: true,
        cellStyle: params => ({ cursor: params.value ? 'pointer' : '' }),
        cellRenderer: params =>
           params.value ? `<i class="iconfont icon-daizhifu" style="font-size: 14px;"></i>` : '', // return params.value ? `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;">
          //     <use xlink:href="#icon-permission-data-more"></use></svg>` : ''

        onCellClicked: params => {
          if (params.data.bDataPrivilege) {
            this.toGetDataPrivilege(params.data.code, this.$route.query.id)
          } else {
            this.rowDataOfDataPrivilege = []
          }
        }
      },
      { headerName: 'id', field: 'id', hide: true },
      { headerName: '可用', field: 'checked', hide: true }
    ]
    this.gridOptionsOfDataPrivilege = {
      context: { componentParent: this },
      groupDefaultExpanded: -1,
      autoGroupColumnDef: {
        headerName: '授权维度',
        suppressCount: true,
        field: 'authorizedDataName'
      }
    }
    this.columnDefsOfDataPrivilege = [
      { headerName: 'id', field: 'id', hide: true },
      { headerName: 'roleId', field: 'roleId', hide: true },
      { headerName: '授权维度', field: 'permissionDimension', hide: true },
      { headerName: '授权维度名称', field: 'permissionDimensionName', rowGroup: true, hide: true },
      { headerName: '授权数据名称', field: 'authorizedDataName', hide: true },
      { headerName: '授权数据值', field: 'authorizedDataValue', hide: true },
      { headerName: '权限代码', field: 'privilegeCode', hide: true },
      { headerName: '操作', cellRendererFramework: 'RoleAuthorizeDataPrivilegeOperationButton' }
    ]
    this.gridOptionsOfOffice = {
      rowSelection: 'multiple'
    }
    this.columnDefsOfOffice = [
      { headerName: '公司', field: 'label', checkboxSelection: true },
      { headerName: 'id', field: 'value', hide: true }
    ]
    this.gridOptionsOfDepartment = {
      rowSelection: 'multiple',
      autoGroupColumnDef: {
        headerName: '部门',
        field: 'departmentName',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: { checkbox: true }
      }
    }
    this.columnDefsOfDepartment = [
      { headerName: 'department', field: 'label', hide: true },
      { headerName: 'office', field: 'officeName', hide: true, rowGroup: true },
      { headerName: 'id', field: 'value', hide: true }
    ]
    this.gridOptionsOfPerson = {
      rowSelection: 'multiple',
      autoGroupColumnDef: {
        headerName: '用户',
        field: 'userName',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: { checkbox: true }
      }
    }
    this.columnDefsOfPerson = [
      { headerName: 'user', field: 'label', hide: true },
      { headerName: 'office', field: 'officeName', hide: true, rowGroup: true, rowGroupIndex: 0 },
      { headerName: 'department', field: 'departmentName', hide: true, rowGroup: true, rowGroupIndex: 1 },
      { headerName: 'id', field: 'value', hide: true }
    ]
  },
  //  beforeRouteEnter(to, from, next) {
  //    next(vm => {
  //      const id = to.query.id
  //      vm.toGetFunctionalPrivilege(id)
  //    })
  //  },
  beforeMount() {
    this.toGetFunctionalPrivilege(this.$route.query.id)
  },
  methods: {
    onReadyOfGridInDialog(params) {
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    onReadyOfFunctionalPrivilege(params) {
      this.gridApiOfFunctionalPrivilege = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    onReadyOfDataPrivilege(params) {
      this.gridApiOfDataPrivilege = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    toGetFunctionalPrivilege(id) {
      getRolePrivilegeById(id).then(res => {
        this.rowDataOfFunctionalPrivilege = res.content
      })
    },
    toSaveFunctionPrivilege() {
      const id = this.$route.query.id
      const assignedIdList = []
      this.gridApiOfFunctionalPrivilege.forEachNode(n => {
        if (n.data.checked) {
          assignedIdList.push(n.data.id)
        }
      })
      saveRoleAuthorizedPrivilege({ id, assignedIdList }).then(res => {
        if (res.ok) {
          this.$message.success('功能权限保存成功！')
        }
      })
    },
    toGetDataPrivilege(privilegeCode, roleId) {
      getDataPrivilege({ privilegeCode, roleId }).then(res => {
        this.rowDataOfDataPrivilege = res.content.map(r => {
          if (r.id === null) {
            r.authorizedDataName = r.permissionDimensionName
            r.permissionDimensionName = null
          }
          return r
        })
      })
    },
    toAddDataPrivilege({ privilegeCode, permissionDimension, type }) {
      this._privilegeCode = privilegeCode
      this._permissionDimension = permissionDimension
      this.rowDataOfOffice = []
      this.rowDataOfDepartment = []
      switch (type) {
        case 'OFFICE':
          getOfficeListForSettingDataPrivilege({ privilegeCode, permissionDimension, roleId: this.$route.query.id }).then(res => {
            this.rowDataOfOffice = res.content
            this.isShowingSelectOfficeDialog = true
          })
          break
        case 'DEPARTMENT':
          getDepartmentListForSettingDataPrivilege({ privilegeCode, permissionDimension, roleId: this.$route.query.id }).then(res => {
            this.rowDataOfDepartment = res.content
            this.isShowingSelectDepartmentDialog = true
          })
          break
        default:
          getPersonListForSettingDataPrivilege({ privilegeCode, permissionDimension, roleId: this.$route.query.id, range: permissionDimension }).then(res => {
            this.rowDataOfPerson = res.content
            this.isShowingSelectPersonDialog = true
          })
      }
    },
    toGrantDataPrivilegeToCurrent({ privilegeCode, permissionDimension, type }) {
      this._privilegeCode = privilegeCode
      this._permissionDimension = permissionDimension
      const current = {
        roleId: this.$route.query.id,
        privilegeCode: this._privilegeCode,
        permissionDimension: this._permissionDimension
      }
      switch (type) {
        case 'OFFICE':
          current.authorizedDataName = '本公司'
          current.authorizedDataValue = 'CURRENT_OFFICE'
          break
        case 'DEPARTMENT':
          current.authorizedDataName = '本部门'
          current.authorizedDataValue = 'CURRENT_DEPARTMENT'
          break
        default:
          current.authorizedDataName = '本人'
          current.authorizedDataValue = 'CURRENT_PERSON'
      }
      addDataPrivilegeSave([current]).then(res => {
        if (res.ok) {
          this.$message.success('保存成功')
        }
      }).then(() => {
        this.toGetDataPrivilege(this._privilegeCode, this.$route.query.id)
      })
    },
    toAddDataPrivilegeSave(flag) {
      let rows
      if (flag === 'office') {
        rows = this.gridOptionsOfOffice.api.getSelectedRows()
      } else if (flag === 'department') {
        rows = this.gridOptionsOfDepartment.api.getSelectedRows()
      } else if (flag === 'person') {
        rows = this.gridOptionsOfPerson.api.getSelectedRows()
      }
      const body = []
      let roleId, privilegeCode, permissionDimension, authorizedDataName, authorizedDataValue
      rows.forEach(r => {
        roleId = this.$route.query.id
        privilegeCode = this._privilegeCode
        permissionDimension = this._permissionDimension
        authorizedDataName = r.label
        authorizedDataValue = r.value
        body.push({ roleId, privilegeCode, permissionDimension, authorizedDataName, authorizedDataValue })
      })
      addDataPrivilegeSave(body).then(res => {
        if (res.ok) {
          this.$message.success('保存成功')
        }
      }).then(() => {
        this.toGetDataPrivilege(this._privilegeCode, this.$route.query.id)
        this.isShowingSelectOfficeDialog = false
        this.isShowingSelectDepartmentDialog = false
        this.isShowingSelectPersonDialog = false
      })
    },
    toRemoveDataPrivilege(permissionIds, privilegeCode) {
      removeDataPrivilege({ permissionIds }).then(res => {
        if (res.ok) {
          this.$message.success('操作成功')
        }
      }).then(() => {
        this.toGetDataPrivilege(privilegeCode, this.$route.query.id)
      })
    }
  }
}
</script>
