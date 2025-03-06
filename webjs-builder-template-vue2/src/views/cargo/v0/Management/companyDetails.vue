<template>
  <div class="app-main-inner company-detail">
    <div class="app-main-inner-row">
      <div class="btn-group-left">
        <!--<el-button type="primary" size="mini">新建</el-button>-->
        <!--<el-button type="primary" size="mini">编辑</el-button>-->
        <!--<el-button type="primary" size="mini">删除</el-button>-->
        <el-button type="primary" size="mini" plain @click="$router.push({name: 'Architecture'})">返回列表</el-button>
      </div>
      <div class="btn-group-right">
        <el-button type="primary" size="mini" @click="submitCompanyInfo()">保存</el-button>
        <el-button v-if="!companyStatus" v-permission="['sys:office:enable']" type="success" size="mini" @click="switchCompanyStatus()">{{ companyStatusBtn }}</el-button>
        <el-button v-else v-permission="['sys:office:enable']" type="danger" size="mini" @click="switchCompanyStatus()">{{ companyStatusBtn }}</el-button>
      </div>
    </div>

    <div class="app-main-inner-row">
      <el-form ref="entityForm" label-position="left" label-width="100px" style="width:100%">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="el-form-item-group" style="min-height:436px;">
              <el-form-item label="公司代码"><el-input v-model="oneCompanyInfo.officeCode" size="mini" /></el-form-item>
              <el-form-item label="公司中文简称"><el-input v-model="oneCompanyInfo.shortName" size="mini" /></el-form-item>
              <el-form-item label="公司中文全称"><el-input v-model="oneCompanyInfo.chineseName" size="mini" /></el-form-item>
              <el-form-item label="公司英文全称"><el-input v-model="oneCompanyInfo.englishName" size="mini" /></el-form-item>
              <el-form-item label="上级公司">
                <el-select v-model="oneCompanyInfo.parentOfficeId" size="mini" :placeholder="$t('common.placeholder')">
                  <el-option v-for="company in companyList" v-if="companyId!=company.value" :key="company.value" :label="company.label" :value="company.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="社会信用代码"><el-input v-model="oneCompanyInfo.taxAccount" size="mini" /></el-form-item>
              <el-form-item label="发票抬头"><el-input v-model="oneCompanyInfo.invoiceTitle" size="mini" /></el-form-item>
              <el-form-item label="发票地址"><el-input v-model="oneCompanyInfo.invoiceAddress" size="mini" /></el-form-item>
              <el-form-item label="联系电话"><el-input v-model="oneCompanyInfo.tel" size="mini" /></el-form-item>
              <el-form-item label="负责人"><el-input size="mini" /></el-form-item>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="el-form-item-group" style="min-height:436px;">
              <el-form-item label="国家">
                <el-select v-model="oneCompanyInfo.countryCode" filterable placeholder="" size="mini" @change="handleCountrySelection">
                  <el-option v-for="c in countryOptions" :key="c.id" :value="c.code2" :label="c.chineseName">
                    <div style="display: flex;justify-content: space-between">
                      <span>{{ c.chineseName }}</span>
                      <span>{{ c.englishName }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="省州">
                <el-select v-model="oneCompanyInfo.province" filterable placeholder="" :disabled="provinceOptions.length === 0" size="mini" @change="handleProvinceSelection">
                  <el-option v-for="p in provinceOptions" :key="p.id" :value="p.code" :label="p.chineseName">
                    <div style="display: flex;justify-content: space-between">
                      <span>{{ p.chineseName }}</span>
                      <span>{{ p.englishName }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="城市">
                <el-select v-model="oneCompanyInfo.cityCode" filterable placeholder="" :disabled="cityOptions.length === 0" size="mini" @change="handleCitySelection">
                  <el-option v-for="c in cityOptions" :key="c.id" :value="c.code" :label="c.chineseName">
                    <div style="display: flex;justify-content: space-between">
                      <span>{{ c.chineseName }}</span>
                      <span>{{ c.englishName }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="区县">
                <el-select v-model="oneCompanyInfo.countyCode" filterable placeholder="" :disabled="countyOptions.length === 0">
                  <el-option v-for="d in countyOptions" :key="d.id" :value="d.code" :label="d.chineseName">
                    <div style="display: flex;justify-content: space-between">
                      <span>{{ d.chineseName }}</span>
                      <span>{{ d.englishName }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="中文地址"><el-input v-model="oneCompanyInfo.chineseAddress" size="mini" /></el-form-item>
              <el-form-item label="英文地址"><el-input v-model="oneCompanyInfo.englishAddress" size="mini" /></el-form-item>
              <el-form-item label="邮政编码"><el-input v-model="oneCompanyInfo.zipCode" size="mini" /></el-form-item>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="el-form-item-group" style="min-height:436px;">
              <el-form-item label="默认本位币">
                <cargo-limited-select
                  :select-value="oneCompanyInfo.localCurrency"
                  style="width: 100%;"
                  type="currency"
                  @set="oneCompanyInfo.localCurrency = $event"
                />
              </el-form-item>
              <el-form-item label="海运港口">
                <cargo-limited-select
                  :select-value="oneCompanyInfo.seaPort"
                  :select-label="oneCompanyInfo.seaPort"
                  style="width: 100%;"
                  type="seaport"
                  @set="oneCompanyInfo.seaPort = $event.code5"
                />
              </el-form-item>
              <el-form-item label="空运港口">
                <cargo-limited-select
                  :select-value="oneCompanyInfo.airPort"
                  :select-label="oneCompanyInfo.airPort"
                  style="width: 100%;"
                  type="airport"
                  @set="oneCompanyInfo.airPort = $event.code3"
                />
              </el-form-item>
              <!--<el-form-item label="" />-->
              <el-form-item v-loading="userImageLoading" label="LOGO" style="">
                <el-upload
                  class="avatar-uploader"
                  :headers="avatarUploadHeaders()"
                  :action="`${baseUrl}/api/mdm-service/web/upload/file`"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :on-error="handleAvatarError"
                  :on-process="handleAvatarProcess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="oneCompanyInfo.imageLogo" :src="oneCompanyInfo.imageLogo" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
              <el-form-item label="" style="">
                <el-button size="small" type="primary" @click="saveOfficeLogo">保存LOGO</el-button>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="el-form-item-group" style="min-height:436px;">
              <el-form-item label="海运提单地址"><el-input v-model="oneCompanyInfo.seaBlAddress" type="textarea" rows="9" size="mini" /></el-form-item>
              <el-form-item label="空运提单地址"><el-input v-model="oneCompanyInfo.airBlAddress" type="textarea" rows="10" size="mini" /></el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="app-main-inner-row" style="flex-direction: column;">
      <div class="app-main-inner-row" style="padding-left:0px;padding-right:0px;">
        <div class="btn-group-left">
          <el-tag size="small" style="margin-right:10px;">部门和人员</el-tag>
        </div>
        <div class="btn-group-right" />
      </div>
      <div class="app-main-inner-row" style="padding-left:0px;padding-right:0px;">
        <div class="tree-wrapper" style="width:16%;min-width:190px;height:350px;border:1px solid #ccc">
          <!--:default-expanded-keys="['1']"-->
          <el-tree
            ref="deptTree"
            :data="companyTree"
            :props="defaultProps"
            highlight-current
            accordion
            node-key="id"
            @node-click="handleNodeClick"
          />
        </div>
        <ag-grid-vue
          :locale-text-func="_i18nGridLocalText"
          :grid-options="user.gridOptionsRight"
          :side-bar="user.sideBarDefsRight"
          :column-defs="user.columnDefsRight"
          :row-data="user.rowDataRight"
          :enable-col-resize="true"
          :enable-sorting="true"
          :grid-ready="onUserReady"
          :row-double-clicked="onRowDoubleClicked"
          style="width:84%;height:350px"
          class="ag-theme-balham"
        />
      </div>
    </div>
    <div class="app-main-inner-row" style="flex-direction: column">
      <div class="app-main-inner-row" style="padding-left:0px;padding-right:0px;margin-bottom: 10px;">
        <div class="btn-group-left">
          <el-tag size="small" style="margin-right:10px;">银行账号</el-tag>
        </div>
        <div class="btn-group-right" />
      </div>
      <div class="app-main-inner-row" style="padding-left:0px;padding-right:0px;margin-bottom: 10px;">
        <ag-grid-vue
          :locale-text-func="_i18nGridLocalText"
          :grid-options="bank.gridOptions"
          :side-bar="bank.sideBarDefs"
          :column-defs="bank.columnDefs"
          :row-data="bank.rowData"
          :enable-col-resize="true"
          :enable-sorting="true"
          :grid-ready="onBankReady"
          :pagination="true"
          :pagination-auto-page-size="true"
          style="width: 100%;height:500px"
          class="ag-theme-balham"
        />
      </div>
    </div>
    <el-dialog :visible.sync="isShowingBankForm" title="银行账号" width="500px;">
      <el-form :model="oneBank" label-width="90px" label-position="left">
        <el-form-item label="" style="margin-left: -90px;">
          <el-checkbox v-model="oneBank.bActive" size="mini">启用</el-checkbox>
        </el-form-item>
        <el-form-item label="账号币种">
          <el-select v-model="oneBank.currency" :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in currencyList"
              :key="item"
              :label="item.sign"
              :value="item.sign"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号简称">
          <el-input v-model="oneBank.accountNo" size="mini" />
        </el-form-item>
        <el-form-item label="开户名称(中)">
          <el-input v-model="oneBank.titleChineseName" size="mini" />
        </el-form-item>
        <el-form-item label="开户名称(英)">
          <el-input v-model="oneBank.titleEnglishName" size="mini" />
        </el-form-item>
        <el-form-item label="开户银行(中)">
          <el-input v-model="oneBank.bankChineseName" size="mini" />
        </el-form-item>
        <el-form-item label="开户银行(英)">
          <el-input v-model="oneBank.bankEnglishName" size="mini" />
        </el-form-item>
        <el-form-item label="银行地址(中)">
          <el-input v-model="oneBank.bankChineseAddress" size="mini" />
        </el-form-item>
        <el-form-item label="银行地址(英)">
          <el-input v-model="oneBank.bankEnglishAddress" size="mini" />
        </el-form-item>
        <el-form-item label="SWIFT CODE">
          <el-input v-model="oneBank.swiftCode" size="mini" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="oneBank.remark" size="mini" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitBank()">确定</el-button>
        <el-button size="mini" @click="isShowingBankForm = false">取消</el-button>
        <!--<el-button size="mini" type="primary" @click="submitSeaPortAndContinue">保存并继续</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { getBankById, switchBankStatus, saveBank, delBank, getBankAccountsByOffice, saveOfficeLogo, switchCompanyStatus, saveCompanyInfo, getMembersOfDept, getCompanyInfoById, getDeptTree } from '@/api/companyDetail'
import { getCurrencyList } from '@/api/currency'
import { activateUser, deactivateUser } from '@/api/user'
import userOfCompanyDetailOperateButton from './CellRendererFramework/userOfCompanyDetailOperateButton'
import bankOfCompanyDetailOperateButton from './CellRendererFramework/bankOfCompanyDetailOperateButton'
import { getCompanyList } from '@/api/architecture'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import URL from '@/api/urlTranslator'
import { getToken } from '@/utils/auth'
import { getCountryList } from '@/api/country'
import { getDivisionListV2 } from '@/api/division'

export default {
  name: 'CompanyDetails2',
  components: { AgGridVue, userOfCompanyDetailOperateButton, bankOfCompanyDetailOperateButton, cargoLimitedSelect },
  data: function() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API, // 上传url地址
      officeLogoUploadData: {
        entityId: '',
        entityType: 'SYS_OFFICE',
        documentTypeCode: 'OFFICELOGO',
        documentTypeCodeChineseName: '',
        cloudFileVOList: []
      },
      userImageLoading: false,
      currentDept: {
        name: '',
        id: ''
      },
      tempCompanyId: '1',
      companyList: [],
      currencyList: [],
      companyId: '',
      companyStatusBtn: '停用',
      companyStatus: true,
      bank: {
        gridOptions: {},
        gridApi: {},
        columnDefs: null,
        sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
        rowData: []
      },
      companyTree: [],
      defaultProps: {
        children: 'childNodes',
        label: 'chineseName'
      },
      user: {
        gridApi: {},
        gridOptionsRight: {},
        columnDefsRight: null,
        sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
        rowDataRight: []
      },
      countryOptions: [],
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],
      oneCompanyInfo: {
        imageLogo: '',
        airBlAddress: '',
        airPort: '',
        bActive: false,
        childNodes: [],
        chineseAddress: '',
        chineseName: '',
        cityId: null,
        countryId: null,
        countyId: null,
        createBy: '',
        createTime: '',
        email: '',
        englishAddress: '',
        englishName: '',
        fax: '',
        id: '',
        invoiceAddress: '',
        invoiceTitle: '',
        localCurrency: '',
        localDnAddress: '',
        officeCode: '',
        overseaDnAddress: '',
        parentOfficeId: '',
        provinceId: null,
        seaBlAddress: '',
        seaPort: '',
        seqNo: '',
        shortName: '',
        status: null,
        taxAccount: '',
        tel: '',
        tenantId: '',
        updateBy: '',
        updateTime: '',
        url: '',
        userQuantity: 0,
        zipCode: ''
      },
      oneUser: { id: '', bActive: '', bAuthorizer: '', address: '', chineseName: '', createBy: '' },
      oneBank: { id: '', accountNo: '', bankChineseAddress: '', bankChineseName: '', bankEnglishAddress: '', bankEnglishName: '',
        currency: '', remark: '', officeId: '', shortName: '', swiftCode: '', titleChineseName: '', titleEnglishName: '', createBy: '' },
      initOneBank: {},
      isShowingBankForm: false
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  watch: {
    companyId(newVal, oldVal) {
      sessionStorage.setItem('companyDetailId', newVal)
    }
  },
  created() {
    const self = this
    self.initOneBank = { ...(self.oneBank) }
    this.user.gridOptionsRight = {
      context: {
        componentParent: self
      }
    }
    this.bank.gridOptions = {
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
    this.bank.columnDefs = [{
      headerName: 'id',
      field: 'id',
      hide: true
    }, {
      headerName: '银行账号',
      field: 'accountNo'
    }, {
      headerName: '是否启用',
      field: 'bActive'
    }, {
      headerName: '账户币种',
      field: 'currency'
    }, {
      headerName: '账户简称',
      field: 'shortName'
    }, {
      headerName: '银行国际代码',
      field: 'swiftCode'
    }, {
      headerName: '开户人中文名',
      field: 'titleChineseName'
    }, {
      headerName: '开户人英文名',
      field: 'titleEnglishName'
    }, {
      headerName: '银行中文地址',
      field: 'bankChineseAddress'
    }, {
      headerName: '银行中文地址',
      field: 'banEnglishAddress'
    }, {
      headerName: '银行中文名',
      field: 'bankChineseName'
    }, {
      headerName: '银行中文名',
      field: 'bankEnglishName'
    }, {
      headerName: '创建人',
      field: 'createBy'
    }, {
      headerName: '操作', pinned: 'right', field: `bActive`, width: 400,
      cellRendererFramework: 'bankOfCompanyDetailOperateButton'
    }]
    this.user.columnDefsRight = [{
      headerName: '', width: 55, pinned: 'left',
      suppressSorting: true, checkboxSelection: true,
      suppressMenu: true, suppressSizeToFit: true, suppressResize: true
    }, {
      headerName: 'ID',
      field: 'id'
    }, {
      headerName: '状态',
      field: 'bActive',
      valueGetter: params => {
        let val = params.data.bActive ? '启用' : '禁用'
        if (params.data.bActive === undefined) {
          val = ''
        }
        return val
      }
    }, {
      headerName: '用户中文名',
      field: 'chineseName'
      // cellRenderer: params => {
      //   return `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;">
      //           <use xlink:href="#icon-right" @click="alert(1)"></use></svg>`
      // }
    }, {
      headerName: '地址',
      field: 'address'
    }, {
      headerName: '创建人',
      field: 'createBy'
    }, {
      headerName: '手机',
      field: 'mobile'
    }, {
      headerName: '操作', pinned: 'right', field: `bActive`, width: 300,
      cellRendererFramework: 'userOfCompanyDetailOperateButton'
    }]
  },
  mounted() {
    getCountryList({ pageSize: 300 }).then(res => {
      this.countryOptions = res.content.list
    })
  },
  beforeMount() {
    this.fetchPageData()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('companyDetails to:', to)
      // vm.companyId = '123456'
      // vm.getCompanyInfo()
    })
  },
  methods: {
    fetchPageData() {
      const self = this
      const pCompanyId = self.$route.params.pCompanyId // 父级公司Id
      if (pCompanyId) {
        self.oneCompanyInfo.parentOfficeId = pCompanyId
        self.companyId = 0
      } else {
        self.companyId = self.$route.params.companyId || sessionStorage.getItem('companyDetailId')
        self.getCompanyInfo()
        self.getDeptTree().then(() => {
          self.getUserListByDept()
        })
        self.getBankAccountsByOffice()
      }
    },
    initDataAfterPageLoad() {
      if (this.oneCompanyInfo.countryCode) {
        getDivisionListV2({ pageSize: 300, countryCode: this.oneCompanyInfo.countryCode, areaLevel: 0 }).then(res => {
          this.provinceOptions = res.content.list
        })// get province
      }
      if (this.oneCompanyInfo.province) {
        getDivisionListV2({ pageSize: 300, parentCode: this.oneCompanyInfo.province, areaLevel: 1 }).then(res => {
          this.cityOptions = res.content.list
        })// get city
      }
      if (this.oneCompanyInfo.cityCode) {
        getDivisionListV2({ pageSize: 300, parentCode: this.oneCompanyInfo.cityCode, areaLevel: 2 }).then(res => {
          this.countyOptions = res.content.list
        })// get county
      }
    },
    getBankAccountsByOffice() {
      const self = this
      getBankAccountsByOffice(self.companyId).then(res => {
        if (res.ok) {
          self.bank.rowData = res.content
          if (self.bank.rowData.length <= 0) {
            self.bank.rowData.push({ ...(self.initOneBank) })
            self.bank.rowData[0].chineseName = '中国'
          }
        }
      }).catch(err => {
        console.error(err)
      })
    },
    getUserSelected() {
      const selectedRows = this.user.gridOptionsRight.api.getSelectedRows()
      if (selectedRows.length <= 0) {
        this.$message.warning('没有选择数据')
        return null
      }
      return selectedRows
    },
    getUserIdSelected() {
      const selectedRows = this.getUserSelected()
      const ids = []
      if (selectedRows) {
        selectedRows.forEach(item => {
          ids.push(item.id)
        })
        console.log('user 选中数量:', selectedRows.length)
        return ids
      }
      return null
    },
    onUserReady(params) {
      this.user.gridApi = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    onBankReady(params) {
      this.bank.gridApi = params.api
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          // params.api.sizeColumnsToFit()
        })
      })
    },
    handleNodeClick(data, node, compt) {
      const self = this
      // if (data.childNodes.length === 0) {
      self.currentDept.id = node.data.id
      self.currentDept.name = node.data.name
      self.getUserListByDept()
      // self.user.rowDataRight = []
      // }
    },
    switchCompanyStatus() {
      const self = this
      const bActive = !self.companyStatus
      switchCompanyStatus(self.companyId, bActive).then(res => {
        if (res.ok) {
          self.companyStatus = bActive
          self.oneCompanyInfo.bActive = bActive
          self.companyStatusBtn = bActive ? '停用' : '启用'
        } else {
          self.$message.warning(res.message)
        }
      })
    },
    switchUserStatus(id, bActive) {
      if (bActive) {
        activateUser(id).then(res => {
          this.$message.success('启用成功')
          this.getUserListByDept()
        }).catch(err => {
          this.$message.error(err)
        })
      } else {
        deactivateUser(id).then(res => {
          this.$message.success('禁用成功')
          this.getUserListByDept()
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },
    getDeptTree() {
      return getDeptTree(this.companyId).then(res => {
        this.companyTree = res.content
        // 应给当前 部门赋值
      })
    },
    getUserListByDept() {
      getMembersOfDept(this.currentDept.id).then(res => {
        this.user.rowDataRight = res.content
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getCompanyInfo() {
      const self = this
      const companyId = self.companyId
      Promise.all([getCompanyList(), getCompanyInfoById(companyId)]).then(results => {
        const companyListRes = results[0]
        const companyInfoRes = results[1]
        if (companyListRes.ok) {
          self.companyList = companyListRes.content
        }
        if (companyInfoRes.ok && companyInfoRes.content) {
          self.oneCompanyInfo = companyInfoRes.content
          const bActive = self.oneCompanyInfo.bActive
          self.companyStatus = bActive
          self.companyStatusBtn = bActive ? '停用' : '启用'
        } else {
          self.$message.error('获取内容错误')
        }
      }).then(() => {
        this.initDataAfterPageLoad()
      }).catch(() => {
        self.$message.error('获取内容错误')
      })
    },
    addCompanyInfo() {
      saveCompanyInfo(this.oneCompanyInfo).then(res => {
        if (res.ok) {
          this.$message({ message: '保存公司信息保存成功', type: 'success' })
          self.companyId = res.content.id
          this.getCompanyInfo()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    editCompanyInfo() {
      const id = this.oneCompanyInfo.id
      saveCompanyInfo(this.oneCompanyInfo, id).then(res => {
        if (res.ok) {
          this.$message({ message: '编辑公司信息保存成功', type: 'success' })
          self.companyId = res.content.id
          this.getCompanyInfo()
        }
      })
    },
    submitCompanyInfo() {
      console.log('公司信息：', this.oneCompanyInfo)
      if (this.oneCompanyInfo.id) {
        this.editCompanyInfo()
      } else {
        this.addCompanyInfo()
      }
    },
    onRowDoubleClicked(event) {
      const id = event.node.data.id
      this.$router.push({ name: `NewUser`, query: { id }})
    },
    delUser(id) {
      // todo
      this.$message.info('删除-测试')
    },
    addUser() {
      this.$router.push({ name: `NewUser` })
    },
    batchDelUser() {
      const ids = this.getUserIdSelected()
      if (ids) {
        // 删除
        this.$message.info('删除-测试')
      }
    },
    editUser(id) {
      this.$router.push({ name: 'NewUser', params: { id }})
    },
    delBank(id) {
      const self = this
      delBank(id).then(res => {
        self.$message({ type: 'info', message: '删除成功' })
      }).then(() => {
        this.getBankAccountsByOffice()
      })
    },
    popBankFormDialog(id) {
      const self = this
      getCurrencyList().then(res => {
        if (res.ok) {
          self.currencyList = res.content.list
        }
        if (id) {
          getBankById(id).then(res => {
            self.oneBank = res.content
            self.isShowingBankForm = true
          })
        } else {
          self.oneBank = { ...(self.initOneBank), ...{ officeId: self.companyId }}
          self.isShowingBankForm = true
        }
      }).catch(() => {
        this.$message.error('弹框信息加载失败')
      })
    },
    addBank() {
      return saveBank(this.oneBank).then(res => {
        this.isShowingBankForm = false
        this.$message({ message: '保存费用项信息成功', type: 'success' })
      }).then(() => {
        this.getBankAccountsByOffice()
      })
    },
    editBank() {
      const id = this.oneBank.id
      return saveBank(this.oneBank, id).then(res => {
        this.isShowingBankForm = false
        this.$message({ message: '编辑费用信息成功', type: 'success' })
      }).then(() => {
        this.getBankAccountsByOffice()
      })
    },
    submitBank() {
      if (this.oneBank.id) {
        return this.editBank()
      } else {
        return this.addBank()
      }
    },
    switchBankStatus(id, bActive) {
      const self = this
      switchBankStatus(id, bActive).then(res => {
        if (res.ok) {
          self.getBankAccountsByOffice()
        } else {
          self.$message.warning('银行账号状态变更失败')
        }
      })
    },
    handleAvatarSuccess(res, file) {
      console.log('===this.oneCompanyInfo.imageLogo', res, file)
      if (res.ok) {
        // todo
        this.oneCompanyInfo.imageLogo = res.content.url
        this.officeLogoUploadData.cloudFileVOList = [res.content]
        this.officeLogoUploadData.entityId = this.oneCompanyInfo.id
      } else {
        this.$message.error(res.message)
      }
      this.userImageLoading = false
    },
    handleAvatarError(err, file) {
      this.$message.error(err)
      this.userImageLoading = false
    },
    handleAvatarProcess(event, file, fileList) { // 上传时的回调
      this.userImageLoading = true
    },
    avatarUploadHeaders() {
      const Authorization = getToken()
      return { Authorization }
    },
    saveOfficeLogo() {
      saveOfficeLogo(this.officeLogoUploadData).then(res => {
        // todo
        this.$message.success('保存LOGO成功')
      }).catch(err => {
        this.$message.error(err)
      })
    },
    beforeAvatarUpload(file) {
      console.log('file.type', file.type)
      const isJPG = (['image/jpeg', 'image/png']).includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!this.oneCompanyInfo.id) {
        this.$message.error('该公司还没保存，请先保存!')
        return false
      }

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG or PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    },
    handleCountrySelection(countryCode) {
      getDivisionListV2({ pageSize: 300, countryCode, areaLevel: 0 }).then(res => {
        this.provinceOptions = res.content.list
        this.cityOptions = []
        this.countyOptions = []
        this.oneCompanyInfo.province = ''
        this.oneCompanyInfo.cityCode = ''
        this.oneCompanyInfo.countyCode = ''
      })
    },
    handleProvinceSelection(parentCode) {
      getDivisionListV2({ pageSize: 300, parentCode, areaLevel: 1 }).then(res => {
        this.cityOptions = res.content.list
        this.countyOptions = []
        this.oneCompanyInfo.cityCode = ''
        this.oneCompanyInfo.countyCode = ''
      })
    },
    handleCitySelection(parentCode) {
      getDivisionListV2({ pageSize: 300, parentCode, areaLevel: 2 }).then(res => {
        this.countyOptions = res.content.list
        this.oneCompanyInfo.countyCode = ''
      })
    }
  }
}
</script>

<style>
 .company-detail .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
 .company-detail .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
 .company-detail .avatar-uploader-icon {
    font-size: 26px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
 .company-detail .avatar {
    /*width: 178px;*/
    /*height: 178px;*/
    display: block;
   width: 100%;
   height: 100%;
  }
</style>
