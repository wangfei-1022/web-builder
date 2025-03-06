<template>
  <div style="padding: 10px 10px 0 10px;" v-loading="loading">
    <div style="padding-bottom: 10px;">
      <el-button type="primary" size="mini" plain @click="$router.push({name: 'Roles'})">{{ $t('common.backList') }}</el-button>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsOfFunctionalPrivilege"
        :side-bar="sideBarDefsOfFunctionalPrivilege"
        :column-defs="columnDefsOfFunctionalPrivilege"
        :row-data="rowDataOfFunctionalPrivilege"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyOfFunctionalPrivilege"
        style="width: 100%;height:calc(100vh - 260px)"
        class="ag-theme-balham"
      />
    </div>
    <el-dialog v-loading="loading" :visible.sync="dialog.visible" :title="dialog.title" width="550px">
      <el-form v-if="dialog.visible" ref="formData" label-width="120px" label-position="right" :model="formData" size="mini">
        <el-form-item :label="$t('sys.functionPointName')" prop="name" maxlength="30" :rules="[ required ]">
          <el-input v-model.trim="formData.name"  />
        </el-form-item>
<!--        <el-form-item :label="$t('sys.whetherToControlDataPermissions')" prop="bDataPrivilege" :rules="[ required ]">-->
<!--          <el-radio-group v-model="formData.bDataPrivilege">-->
<!--            <el-radio :label="true">{{ $t('common.trueText') }}</el-radio>-->
<!--            <el-radio :label="false">{{ $t('common.falseText') }}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-form-item :label="$t('sys.code')" prop="code" maxlength="30" :rules="[ required ]">
          <el-input v-model.trim="formData.code"  />
        </el-form-item>
        <el-form-item :label="$t('sys.describe')" prop="description" maxlength="50" :rules="[ required ]">
          <el-input  v-model.trim="formData.description" />
        </el-form-item>
        <el-form-item :label="$t('sys.nodeType')" prop="shape" :rules="[ required ]">
          <el-select v-model="formData.shape" style="width: 380px">
            <el-option value="dir">dir</el-option>
            <el-option value="menu">menu</el-option>
            <el-option value="button">button</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sys.parentNode')" prop="parentPrivilegeId" maxlength="50" :rules="[ required ]">
          <el-select v-model="formData.parentPrivilegeId" style="width: 100%;">
            <el-option v-for="(item,i) in parentNodeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sys.serialNumber')" prop="orderIndex" maxlength="50">
          <el-input  v-model.number="formData.orderIndex"/>
        </el-form-item>
        <el-form-item :label="$t('sys.menuPath')" prop="path" maxlength="50">
          <el-input  v-model.trim="formData.path" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="saveForm('formData')"> {{ $t('common.confirmBtn') }} </el-button>
          <el-button size="mini" @click="closeDialog"> {{ $t('common.cancelBtn') }} </el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import lodash from "lodash"
import { getRolePrivilegeById,  saveRoleAuthorizedPrivilege, getDataPrivilege, addDataPrivilegeSave, removeDataPrivilege } from '@/api/role'
import { getOfficeListForSettingDataPrivilege, getDepartmentListForSettingDataPrivilege, getPersonListForSettingDataPrivilege } from '@/api/partner'
import roleEditButton from "@/views/cargo/v0/Management/CellRendererFramework/roleEditButton";
import {detailScheme, saveSchemeData} from "@/api/report";
import {
  getFlatLevelListApi,
  getMappingDelApi,
  getSysPrivilegeApi,
  getSysPrivilegeDelApi,
  getSysPrivilegeDetailApi, getSysPrivilegeEditApi,
  getSysPrivilegeListApi
} from "@/api/system";

export default {
  name: 'RoleAuthorize',
  components: { AgGridVue, roleEditButton,
    goBillDetail: {
      template: `<el-button type="text" size="mini" @click="params.context.componentParent.goBillDetail(params.data)">{{params.value}}</el-button>`,
      methods: {}
    }},
  data() {
    return {
      loading:false,
      required:{ required: true,message:this.$t('sea.pleaseEnter'),trigger: 'change'},
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
      rowDataOfPerson: [],
      dialog: {
        visible: false,
        title: ''
      },
      formData:{
        parentPrivilegeId:null,
        bDataPrivilege:false,
        code:null,
        description:null,
        name:null,
        orderIndex:null,
        path:null,
        shape:null,
      },
      parentNodeList:[]
    }
  },
  created() {

    this.gridOptionsOfFunctionalPrivilege = {
      rowSelection: 'single',
      groupDefaultExpanded: 2,
      // suppressRowClickSelection: true,
      treeData: true,
      context: {
        componentParent: this
      },
      getDataPath: data => data.path.split(','),
      autoGroupColumnDef: {
        headerName: this.$t('sys.functionPoints'),
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
      { headerName: this.$t('sys.serialNumber'), field: 'orderIndex' },
      { headerName: this.$t('sys.describe'), field: 'description' },
      {
        headerName: this.$t('common.operation'), pinned: 'right', width: 110,
        cellRendererFramework: 'roleEditButton'
      },
    ]

  },
  //  beforeRouteEnter(to, from, next) {
  //    next(vm => {
  //      const id = to.query.id
  //      vm.toGetFunctionalPrivilege(id)
  //    })
  //  },
  beforeMount() {
    this.toGetFunctionalPrivilege()
  },
  methods: {
    validateInteger(e) {
      const value = e
      if (value !== null && value !== '') {
        if (String(value).match(/^-?\d+$/)) {
          // 输入是正整数、负整数或零
          this.errorMessage = null;
        } else {
          // 输入不是正整数、负整数或零
          this.errorMessage = '请输入正负整数';
        }
      } else {
        // 输入为空
        this.errorMessage = null;
      }
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
    async toGetFunctionalPrivilege() {
      this.loading=true
      const res = await getSysPrivilegeListApi()
      this.loading=false
      if(res.ok){
        res.content.map(item=>{
          if(item.orderIndex){
            item.orderIndex = Number(item.orderIndex)
          }
        })
        let arr =  lodash.orderBy(res.content, 'orderIndex', ['asc'])
        this.rowDataOfFunctionalPrivilege = arr
      }
    },
    async addRow(data) {
      const resFalt = await getFlatLevelListApi(data.id)
      if(resFalt.ok){
        this.parentNodeList = resFalt.content
        this.formData.parentPrivilegeId = data.id
        this.formData.orderIndex = Number(data.orderIndex)+1
        this.dialog.title = this.$t('sys.addPermissionPoint')
        this.dialog.visible = true
      }

    },
    async editRow(data){
      this.loading = true
      const res = await getSysPrivilegeDetailApi(data.id)
      const resFalt = await getFlatLevelListApi(data.parentPrivilegeId)
      this.loading=false
      if(res.ok && resFalt.ok){
        this.formData = {
          ...res.content
        }
        this.parentNodeList = resFalt.content
        this.dialog.title = this.$t('sys.editPermissionPoints')
        this.dialog.visible = true
      }
    },
    async delRow(id) {
      this.$confirm(this.$t('common.deleteTips'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(async() => {
        this.loading=true
        const res = await getSysPrivilegeDelApi(id)
        this.loading=false
        if(res.ok){
          this.$message.success(this.$t('common.deleteSuccess'))
          this.toGetFunctionalPrivilege()
        }
      })
    },
    saveForm(refName) {
      this.$refs[refName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let url
          if(this.formData.id){
            url = getSysPrivilegeEditApi
          }else{
            url = getSysPrivilegeApi
          }
          const res = await url(this.formData)
          this.loading = false
          if(res.ok){
            this.$message.success('保存成功')
            this.closeDialog()
            this.toGetFunctionalPrivilege()
          }
        }
      })
    },
    /**
     *获取详情数据
     */
    detail(id) {
      detailScheme(id).then(res => {
        if(res.ok) {
          this.$copyProps(this.formData, res.content)
        }
      })

    },
    closeDialog(){
      this.formDataInit()
      this.dialog.visible = false
    },
    formDataInit() {
      this.formData = {
        parentPrivilegeId:null,
        bDataPrivilege:false,
        code:null,
        description:null,
        name:null,
        orderIndex:null,
        path:null,
        shape:null,
      }
      this.$refs.formData.resetFields();
    },
  }
}
</script>
