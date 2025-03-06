<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row">
      <div class="btn-group-left">
        <el-button v-permission="['sys:rules:add']" type="primary" size="mini" @click="popRulesFormDialog()">新建</el-button>
        <!-- <el-button v-permission="['sys:rules:copy']" type="primary" size="mini" @click="copyRulesToTargetCompany()">复制</el-button> -->
        <!--<el-button type="primary" size="mini">删除</el-button>-->
      </div>
      <div class="btn-group-right">
        <!--<el-button type="warning" size="mini">复制</el-button>-->
        <!--<el-button type="warning" size="mini">启用</el-button>-->
      </div>
    </div>
    <div class="app-main-inner-row">
      <div style="width:15%;min-width:190px;height:calc(100vh - 135px);border:1px solid #ccc;display: flex;flex-direction: column;cursor: pointer">
        <div v-for="company in companyList" :key="company.value" :class="{'office-bg':currentOfficeId===company.value}" style="padding-left: 6px;" @click="getRulesByCompany(company.value)">
          <i class="iconfont icon-gongsi1" style="color:#409EFF; font-size: 12px;"></i>
          {{ company.label }}
        </div>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefsRight"
        :column-defs="columnDefsRight"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        style="width:85%;height:calc(100vh - 200px);"
        class="ag-theme-balham"
      />
    </div>
    <el-dialog :visible.sync="isShowingRulesForm" title="编号规则" class="rule-dialog" width="750px">
      <!--<img src="@/assets/bianhaoguize.png">-->
      <el-form label-width="90px" :model="oneRules" ref="oneRules" label-position="left" :rules="oneRulesRules">
        <el-form-item label="所属公司" prop="officeId">
          <el-select v-model="oneRules.officeId" size="mini" :disabled="oneRules.id.length > 0">
            <el-option v-for="item in dialogInitData.officeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="编号类型" prop="identifierType">
          <el-select v-model="oneRules.identifierType" size="mini">
            <el-option v-for="item in dialogInitData.identifierTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="编号代码">
          <el-input v-model="oneRules.ruleCode" size="mini" />
        </el-form-item> -->
        <el-form-item label="编号简称" prop="shortName">
          <el-input v-model="oneRules.shortName" size="mini" />
        </el-form-item>
        <el-form-item label="编号规则" prop="ruleExpression"><el-input v-model="oneRules.ruleExpression" size="mini" /></el-form-item>
        <el-form-item label="" class="new-rule-btn-group">
          <template v-for="(item,index) in dialogInitData.ruleExpressionCommonList">
            <el-button v-if="index%4===0" :key="item.value" type="default" size="mini" style="width:120px;margin-left: 0px;" plain @click="setRuleExpression(item)">{{ item.label }}</el-button>
            <el-button v-else :key="item.value" type="default" size="mini" style="width:120px;" plain @click="setRuleExpression(item)">{{ item.label }}</el-button>
          </template>
          <el-button type="primary" size="mini" style="width:120px;margin-left: 6px;" plain @click="showSeniorExpression()">{{ dialogInitData.seniorBtn }}</el-button>
          <template v-for="(item,index) in dialogInitData.ruleExpressionSeniorList">
            <el-button v-show="dialogInitData.isShowSeniorExpression" v-if="index%4===0" :key="item.value" type="default" size="mini" style="width:120px;margin-left: 0px;" plain @click="setRuleExpression(item)">{{ item.label }}</el-button>
            <el-button v-show="dialogInitData.isShowSeniorExpression" v-else :key="item.value" type="default" size="mini" style="width:120px;" plain @click="setRuleExpression(item)">{{ item.label }}</el-button>
          </template>
        </el-form-item>
        <el-form-item label="流水归零" prop="resetType">
          <el-select v-model="oneRules.resetType" size="mini">
            <el-option v-for="item in dialogInitData.sequenceResetTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="流水起始值" prop="startSeq"><el-input v-model="oneRules.startSeq" size="mini" /></el-form-item>
        <el-form-item label="起始号"><el-input v-model="oneRules.currentSequence" size="mini" disabled /></el-form-item>
        <el-form-item label="编号预览">
          <el-select v-model="oneRules.monthType" size="mini" style="width:110px;" @change="generateJobNoExample">
            <el-option label="当月" value="0" />
            <el-option label="下月" value="1" />
          </el-select>
          <span style="display:inline-block;margin-left:16px;color:dodgerblue;font-size:1.2em;">{{ dialogInitData.jobNo }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitRules()"> 确定 </el-button>
        <el-button size="mini" @click="isShowingRulesForm = false"> 取消 </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="copyCompanyDialog.isShowingCompanyForm" title="选择目标公司" width="550px">
      <el-form label-width="90px" label-position="left">
        <el-form-item label="目标公司">
          <el-select v-model="copyCompanyDialog.officeId" size="mini">
            <el-option v-for="item in copyCompanyDialog.officeList" :key="item.id" :label="item.chineseName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="toCopyOfficeRules"> 确定 </el-button>
        <el-button size="mini" @click="copyCompanyDialog.isShowingCompanyForm = false"> 取消 </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="isShowingAssignedUser" title="分配用户">
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
        <el-button type="primary" size="mini" @click="toSaveAssignedUser">保存</el-button>
        <el-button size="mini" @click="isShowingAssignedUser = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import { batchCopyRules, getRulesById, getRulesListByOfficeId, generateJobNoExample, getCompanyList, loadDetailInitInfo, switchRulesStatus, saveRules, delRules, getAssignedUser, saveAssignedUser } from '@/api/rules'
import rulesOptBtn from './CellRendererFramework/rulesOptBtn'

export default {
  name: 'Rules',
  components: { AgGridVue, rulesOptBtn },
  data() {
    return {
      copyCompanyDialog: {
        officeList: [],
        officeId: '',
        isShowingCompanyForm: false
      },
      currentOfficeId: 0,
      dialogInitData: {
        seniorBtn: '显示高级规则',
        rulesExpressionCheckout: [],
        isShowSeniorExpression: false,
        ruleExpressionCommonList: [],
        ruleExpressionSeniorList: [],
        jobNo: '',
        identifierTypeList: [],
        officeList: [],
        sequenceResetTypeList: []
      },
      emptyDialogInitData: {
      },
      companyList: [],
      gridOptionsRight: {},
      columnDefsRight: null,
      sideBarDefsRight: false,
      rowData: [],
      isShowingRulesForm: false,
      initOneRules: {},
      oneRules: {
        bActive: false,
        id: '',
        identifierType: '',
        officeId: '',
        resetType: '',
        ruleCode: '',
        ruleExpression: '',
        currentSequence: '',
        startSeq: 1,
        ruleRemark: '',
        shortName: '',
        monthType: '0' // 拟生成编号月
      },
      oneRulesRules: {
        officeId: [
          {required: true, message: '请选择所属公司', trigger: 'change'}
        ],
        identifierType: [
          {required: true, message: '请选择编号类型', trigger: 'change'}
        ],
        shortName: [
          {required: true, message: '编号简称不能为空', trigger: 'blur'}
        ],
        ruleExpression: [
          {required: true, message: '编号规则不能为空', trigger: 'blur'}
        ],
        resetType: [
          {required: true, message: '请选择流水归零', trigger: 'change'}
        ],
        startSeq: [
          {required: true, message: '流水起始值不能为空', trigger: 'blur'}
        ]
      },
      isShowingAssignedUser: false,
      gridOptionsOfAssignedUser: {},
      sideBarDefsOfAssignedUser: null,
      columnDefsOfAssignedUser: null,
      rowDataOfAssignedUser: []
    }
  },
  computed: {
  },
  watch: {

  },
  created() {
    const self = this
    self.initOneRules = { ...self.oneRules }
    self.emptyDialogInitData = { ...self.dialogInitData }
    self.gridOptionsRight = {
      context: {
        componentParent: self
      }
    }
    this.columnDefsRight = [{
      headerName: '', width: 55, pinned: 'left',
      suppressSorting: true, checkboxSelection: true,
      suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
      headerCheckboxSelection: true
    },
    // {
    //   headerName: '规则代码',
    //   field: 'ruleCode',
    //   cellRenderer: params => {
    //     const iconName = !params.data.bActive ? 'icon-zanting' : 'icon-bofang'
    //     const color = params.data.bActive ? '#67c23a' : '#e6a23c'
    //     return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 12px;"></i> ${params.value}`
    //   }
    // },
    {
      headerName: '规则名称',
      field: 'shortName'
    },
    {
      headerName: '编码规则',
      field: 'ruleExpression',
      suppressMenu: true
    }, {
      headerName: '规则说明',
      field: 'j',
      suppressMenu: true
    }, {
      headerName: '编号类型',
      field: 'identifierTypeDesc'
    }, {
      headerName: '分公司id',
      field: 'officeId',
      hide: true
    }, {
      headerName: '当前流水值',
      field: 'currentSequence'
    }, {
      headerName: '归零方式',
      field: 'resetTypeDesc'
    }, {
      headerName: '起始号',
      field: 'startSeq',
      suppressMenu: true
    }, {
      headerName: '是否启用',
      field: 'bActive',
      cellRenderer: params => {
        // const iconName = !params.data.bActive ? 'grid-icon-enabled' : 'grid-icon-disabled'
        // const color = params.data.bActive ? '#67c23a' : '#e6a23c'
        // return `<svg class="svg-icon" fill="${color}" aria-hidden="true" style="height:1.1em;width:1.1em;">
        //         <use xlink:href="#icon-${iconName}"></use>
        //       </svg>`
        const iconName = !params.data.bActive ? 'icon-zanting' : 'icon-bofang'
        const color = params.data.bActive ? '#67c23a' : '#e6a23c'
        return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 12px;"></i>`
      }
    }, {
      headerName: '操作', pinned: 'right', field: `bActive`, width: 350,
      cellRendererFramework: 'rulesOptBtn'
    }]
    this.columnDefsOfAssignedUser = [
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
      { headerName: '所属部门', field: 'departmentName' },
      { headerName: '所属公司', field: 'officeName' }
    ]
  },
  beforeMount() {
    this.loadPage()
  },
  methods: {
    onReady(params) {
      // const self = this
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          // params.api.sizeColumnsToFit()
          // self.onFirstDataRendered(self.gridOptionsRight)
        })
      })
    },
    onReadyOfAssignedUser(params) {
      const self = this
      this.gridApiOfAssignedUser = params.api
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          self.onFirstDataRendered(self.gridOptionsOfAssignedUser)
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
    showSeniorExpression() {
      this.dialogInitData.isShowSeniorExpression = !this.dialogInitData.isShowSeniorExpression
      this.dialogInitData.seniorBtn = this.dialogInitData.isShowSeniorExpression ? '隐藏高级规则' : '显示高级规则'
    },
    generateJobNoExample(val) {
      const self = this
      const params = { ruleExpression: self.oneRules.ruleExpression, monthType: val }
      generateJobNoExample(params).then(res => {
        if (res.ok) {
          self.dialogInitData.jobNo = res.content
        }
      })
    },
    loadPage() {
      const self = this
      getCompanyList().then(res => {
        if (res.ok) {
          self.companyList = res.content
          self.currentOfficeId = self.companyList[0].value
          self.fetchRulesListByCompany()
        }
      }).catch(err => {
        self.$message.error(err)
      })
    },
    toCopyOfficeRules() {
      batchCopyRules(this.currentOfficeId, this.copyCompanyDialog.officeId).then(res => {
        this.copyCompanyDialog.isShowingCompanyForm = false
        this.$message.success('复制成功')
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getRulesByCompany(officeId) {
      const self = this
      self.currentOfficeId = officeId
      self.fetchRulesListByCompany()
    },
    setRuleExpression(item) {
      const self = this
      console.log(item.value)
      self.oneRules.ruleExpression = self.oneRules.ruleExpression + item.value
      this.generateJobNoExample(self.oneRules.monthType)
    },
    fetchRulesListByCompany() {
      const self = this
      getRulesListByOfficeId(self.currentOfficeId).then(res => {
        if (res.ok) {
          self.rowData = res.content.list
        }
      })
    },
    delRules(id) {
      const self = this
      delRules(id).then(res => {
        self.$message({ type: 'info', message: '删除成功' })
      }).then(() => {
        this.fetchRulesListByCompany()
      })
    },
    copyRulesToTargetCompany() {
      const self = this
      getCompanyList().then(res => {
        if (res.ok) {
          self.copyCompanyDialog.isShowingCompanyForm = true
          self.copyCompanyDialog.officeList = res.content.filter(item =>
            // 排除当前公司
            // return item.id !== self.currentOfficeId
             item.value !== self.currentOfficeId
          )
          console.log('self.copyCompanyDialog.officeList', self.copyCompanyDialog.officeList)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    popRulesFormDialog(id, isCopy) {
      const self = this
      self.oneRules.officeId = ''
      getCompanyList().then(res => {
        if (res.ok) {
          self.oneRules.officeList = res.content.map(item => ({
              value: item.id,
              label: item.chineseName
            }))
        }
      })
      loadDetailInitInfo().then(res => {
        if (res.ok) {
          self.dialogInitData = { ...self.emptyDialogInitData, ...res.content }
          self.dialogInitData.officeList = self.companyList
        }
        return
        // self.dialogInitData.identifierTypeList = res.content.identifierTypeList
        // self.dialogInitData.officeList = res.content.officeList
        // self.dialogInitData.ruleExpressionCommonList = res.content.ruleExpressionCommonList
        // self.dialogInitData.ruleExpressionSeniorList = res.content.ruleExpressionSeniorList
        // self.dialogInitData.sequenceResetTypeList = res.content.sequenceResetTypeList
        // self.dialogInitData = { ... res.content }
      }).then(() => {
        if (id || isCopy) {
          getRulesById(id).then(res => {
            if (res.ok) {
              self.oneRules = res.content
              if (isCopy) {
                self.oneRules.id = ''
              }
              self.isShowingRulesForm = true
            }
          })
        } else {
          self.oneRules = { ...self.initOneRules }
          self.isShowingRulesForm = true
        }
      })
    },
    addRules() {
      return saveRules(this.oneRules).then(res => {
        if (res.ok) {
          this.isShowingRulesForm = false
          this.$message({ message: '保存费用项信息成功', type: 'success' })
        } else {
          this.$message.error(res.message)
        }
      }).then(() => {
        this.fetchRulesListByCompany()
      })
    },
    editRules() {
      const id = this.oneRules.id
      return saveRules(this.oneRules, id).then(res => {
        if (res.ok) {
          this.isShowingRulesForm = false
          this.$message({ message: '编辑费用信息成功', type: 'success' })
        } else {
          this.$message.error(res.message)
        }
      }).then(() => {
        this.fetchRulesListByCompany()
      })
    },
    submitRules() {
      this.$refs.oneRules.validate(valid => {
        if (valid) {
          if (this.oneRules.id) {
            return this.editRules()
          } else {
            return this.addRules()
          }
        }
      })
    },
    switchRulesStatus(id, bActive) {
      const self = this
      switchRulesStatus(id, bActive).then(res => {
        if (res.ok) {
          self.fetchRulesListByCompany()
        } else {
          self.$message.warning(res.message)
        }
      })
    },
    toAssignUser(id) {
      this.oneRuleId = id
      getAssignedUser(id).then(res => {
        if (res.ok) {
          this.rowDataOfAssignedUser = res.content
          this.isShowingAssignedUser = true
        }
      })
    },
    toSaveAssignedUser() {
      const id = this.oneRuleId
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
    }
  }
}
</script>
<style scoped>
  .rule-dialog .el-form-item{
    margin-bottom: 12px!important;
  }
  .new-rule-btn-group {

  }
  .office-bg{
    background: #d8d8d8;
  }
</style>
