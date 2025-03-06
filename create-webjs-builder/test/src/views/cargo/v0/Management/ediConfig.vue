<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row">
      <div style="width:15%;min-width:190px;height:calc(100vh - 200px);border:1px solid #ccc;display: flex;flex-direction: column;cursor: pointer">
        <div v-for="company in companyList" :key="company.id" :class="{'office-bg':currentOfficeId===company.id}" style="padding-left: 6px;" @click="getEdiConfigByCompany(company)"><svg-icon icon-class="company" style="color:#409EFF" /> {{ company.chineseName }}</div>
      </div>
      <ag-grid-vue
        ref="ediConfigGrid"
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefsRight"
        :column-defs="columnDefsRight"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        style="width:85%;height:calc(100vh - 200px)"
        class="ag-theme-balham"
      />
    </div>
    <el-dialog :visible.sync="isShowEdiConfigDialog" width="60vw" title="EDI配置">
      <div style="display: flex;justify-content: space-between;">
        <div style="width:45%;">
          <el-form label-width="80px" label-position="right">
            <el-form-item label="公司名称">
              <el-input v-model="currentOfficeData.chineseName" disabled="" size="mini" />
            </el-form-item>
            <el-form-item label="EDI类型">
              <el-select
                v-model="oneEdiConfig.typeCode"
                size="mini"
                @change="onEdiTypeChange"
              >
                <el-option
                  v-for="item in configDialog.typeList"
                  :key="item.id"
                  :label="item.chineseName"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="类型渠道">
              <el-select
                v-model="oneEdiConfig.typeChannelId"
                size="mini"
                @change="onEdiChannelChange"
              >
                <el-option
                  v-for="item in configDialog.chanelList"
                  :key="item.typeChannelId"
                  :label="item.chineseName"
                  :value="item.typeChannelId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="通信方式">
              <el-select
                v-model="oneEdiConfig.communicationMode"
                size="mini"
              >
                <el-option
                  v-for="item in configDialog.communicationModeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="接收方类型">
              <el-select
                v-model="oneEdiConfig.receiverType"
                size="mini"
              >
                <el-option
                  v-for="item in configDialog.receiverTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="通信方向">
              <el-radio-group v-model="oneEdiConfig.communicationDirection">
                <el-radio :label="1">发送</el-radio>
                <el-radio :label="2">接受</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="oneEdiConfig.communicationMode==='ftp'" label="FTP示例">
              <span>{"ftpHost": "127.0.0.1","ftpPort": "21","ftpUserName": "user","ftpPassword": "123","ftpPath": "/files/"}</span>
            </el-form-item>
            <el-form-item label="通信参数值">
              <el-input v-model="oneEdiConfig.communicationParameterValue" type="textarea" rows="3" size="mini" />
            </el-form-item>
            <el-form-item label="发送方代码">
              <el-input v-model="oneEdiConfig.senderCode" size="mini" />
            </el-form-item>
          </el-form>
          <span slot="footer" style="float:right" class="dialog-footer">
            <el-button v-permission="['sys:ediconfig:update']" type="primary" size="mini" @click="doneSubmitEdiConfig">确定</el-button>
            <el-button size="mini" @click="isShowEdiConfigDialog=false">取消</el-button>
          </span>
        </div>
        <div class="invoice-row" style="width: 50%;">
          <div>
            <!--<el-button type="primary" size="mini" @click="resetReceiverList">重置</el-button>-->
          </div>
          <el-table
            :data="ediReceiverSummaryTable.tableData"
            empty-text="..."
            header-row-class-name="el-table-row-header"
            border
            fit
            highlight-current-row
            style="width: 98%;"
            max-height="530"
          >
            <el-table-column align="center" label="接收人名称" width="180">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <cargo-limited-select
                    ref="portPnr1"
                    :select-label="scope.row.receiverName"
                    :select-value="scope.row.receiverId"
                    :callback-params="{rowIndex:scope.row.incrementIndex}"
                    type="customer"
                    style="width: 100%;"
                    @set="setReceiverCustomerInfo"
                  />
                </template>
                <span v-else>{{ scope.row.receiverName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="接收人代码" width="180">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input v-model="scope.row.receiverCode" class="edit-input" size="small" />
                </template>
                <span v-else>{{ scope.row.receiverCode }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addEdiReceiver(scope.row)">新增</el-button>
                <template v-if="!scope.row.isAssistRow">
                  <el-button type="text" size="small" class="button-in-grid-danger" @click="delEdiReceiver(scope.row)">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import { getCommunicationModeList, getReceiverTypeList, getEdiConfigList, getEdiConfigById, saveEdiConfig, delEdiConfig } from '@/api/ediConfig'
import { getCompanyList } from '@/api/commonComponent'
import { getEdiChannelListByType, getEdiTypeList } from '@/api/edi'
import lodash from 'lodash'
import ediConfigOptBtn from './CellRendererFramework/ediConfigOptBtn'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'

export default {
  name: 'EdiConfig',
  components: { AgGridVue, ediConfigOptBtn, cargoLimitedSelect },
  data() {
    return {
      currentOfficeData: {},
      companyList: [],
      currentEditRowData: {},
      isShowEdiConfigDialog: false,
      ediReceiverSummaryTable: {
        tableData: [],
        initOneReceiverItem: { id: '', receiverCode: '', configId: '', receiverName: '' }
      },
      configDialog: {
        typeList: [],
        chanelList: [],
        receiverTypeList: [],
        communicationModeList: []
      },
      oneEdiConfig: {
        ediTypeId: '',
        channelName: '',
        communicationDirection: 0,
        communicationMode: '',
        communicationModeDesc: '',
        communicationParameterValue: '',
        createBy: 0,
        createByName: '',
        createTime: '',
        ediReceiverList: [],
        id: 0,
        officeId: '',
        officeName: '',
        receiverIdDelList: [],
        receiverType: '',
        receiverTypeDesc: '',
        senderCode: '',
        tenantId: '',
        typeChannelId: '',
        typeName: '',
        typeCode: '',
        updateBy: 0,
        updateByName: '',
        updateTime: ''
      },
      initOneEdiConfig: {},
      gridOptionsRight: {},
      columnDefsRight: null,
      sideBarDefsRight: false,
      rowData: []
    }
  },
  computed: {
    currentOfficeId() {
      return this.currentOfficeData.id
    }
  },
  watch: {
  },
  created() {
    const self = this
    self.initOneEdiConfig = { ...self.oneEdiConfig }
    self.gridOptionsRight = {
      context: {
        componentParent: self
      },
      suppressClickEdit: true
    }
    this.toSetColumnDefs()
    // this.toSetDialogColumnDefs()
  },
  beforeMount() {
    this.fetchPageData()
  },
  methods: {
    onReady(params) {
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    fetchPageData() {
      const self = this
      getCompanyList().then(res => {
        self.companyList = res.content
        this.currentOfficeData = { ...self.companyList[0] }
        return self.toFetchEdiConfigByCompany()
      }).catch((err) => {
        self.$message.error(err)
      })
    },
    getEdiConfigByCompany(company) {
      this.currentOfficeData = { ...company }
      this.toFetchEdiConfigByCompany().then(() => {
        this.$message.success('查询edi配置成功')
      }).catch(err => {
        this.$message.error(err)
        return Promise.reject(err)
      })
    },
    toFetchEdiConfigByCompany() {
      const officeId = this.currentOfficeId
      console.log('officeId', officeId)
      return getEdiConfigList({ officeId }).then(res => {
        console.log('res.content', res.content)
        if (res.ok) {
          if (res.content.list.length <= 0) {
            this.rowData = [{ ...this.initOneEdiConfig }]
          } else {
            this.rowData = res.content.list
          }
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        return Promise.reject(err)
      })
    },
    popAddEdiConfigFormDialog() {
      this.initEdiConfigDialogData().then(() => {
        this.oneEdiConfig = { ...this.initOneEdiConfig, officeId: this.currentOfficeData.id }
        this.isShowEdiConfigDialog = true
        this.ediReceiverSummaryTable.tableData = []
      }).then(() => {
        this.toDealEdiReceiverSummaryTableWhenEmpty()
      }).catch(err => {
        return this.$message.error(err)
      })
    },
    popEditEdiConfigFormDialog(data) {
      this.initEdiConfigDialogData().then(() => {
        return getEdiConfigById(data.id)
      }).then(res => {
        this.oneEdiConfig = { ...this.initOneEdiConfig, ...res.content }
        this.ediReceiverSummaryTable.tableData = [...this.oneEdiConfig.ediReceiverList]
        this.isShowEdiConfigDialog = true
      }).then(() => {
        this.onEdiTypeChange(this.oneEdiConfig.typeCode)
        this.toDealEdiReceiverSummaryTableWhenEmpty()
      }).catch(err => {
        return this.$message.error(err)
      })
    },
    initEdiConfigDialogData() {
      return Promise.all([getEdiTypeList(), getReceiverTypeList()]).then(results => {
        this.configDialog.typeList = results[0].content
        this.configDialog.receiverTypeList = results[1].content
      }).catch(err => {
        return Promise.reject(err)
      })
    },
    delEdiConfig(id) {
      delEdiConfig(id).then(res => {
        this.$message.success('删除成功')
      }).then(() => {
        this.toFetchEdiConfigByCompany()
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    submitEdiConfig() {
      console.log('this.oneEdiConfig.ediReceiverList oldData', this.oneEdiConfig.ediReceiverList)
      console.log('this.oneEdiConfig.ediReceiverList newData', this.ediReceiverSummaryTable.tableData)
      this.oneEdiConfig.ediReceiverList = this.ediReceiverSummaryTable.tableData
      if (this.oneEdiConfig.id) {
        return saveEdiConfig(this.oneEdiConfig, this.oneEdiConfig.id)
      } else {
        return saveEdiConfig(this.oneEdiConfig)
      }
    },
    doneSubmitEdiConfig() {
      this.submitEdiConfig().then(res => {
        this.isShowEdiConfigDialog = false
        this.$message.success('操作成功')
        this.toFetchEdiConfigByCompany()
      }).catch(err => {
        this.$message.error(err)
      })
    },
    onEdiTypeChange(typeCode) {
      console.log('typeCode', typeCode)
      getEdiChannelListByType(typeCode).then(res => {
        this.configDialog.chanelList = res.content
      }).then(() => {
        this.onEdiChannelChange(this.oneEdiConfig.typeChannelId)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    onEdiChannelChange(typeChannelCode) {
      console.log('onEdiChannelChange typeChannelCode', typeChannelCode)
      if (typeChannelCode) {
        getCommunicationModeList(typeChannelCode).then(res => {
          this.configDialog.communicationModeList = res.content
        }).catch(err => {
          this.$message.error(err)
        })
      } else {
        this.configDialog.communicationModeList = []
      }
    },

    delEdiReceiver(row) {
      // TODO
      this.ediReceiverSummaryTable.tableData = lodash.differenceBy(this.ediReceiverSummaryTable.tableData, [row], 'incrementIndex')
      this.toDealEdiReceiverSummaryTableWhenEmpty()
      if (row.id) {
        this.oneEdiConfig.receiverIdDelList.push(row.id)
      }
    },
    addEdiReceiver(row) {
      // TODO
      console.log('row', row)
      if (row.isAssistRow) {
        // 是助攻行-清空
        this.ediReceiverSummaryTable.tableData = []
      }
      this.ediReceiverSummaryTable.tableData.push({ ...this.ediReceiverSummaryTable.initOneReceiverItem })
      this.toDealEdiReceiverSummaryTableWhenEmpty()
    },
    toDealEdiReceiverSummaryTableWhenEmpty() {
      if (this.ediReceiverSummaryTable.tableData.length <= 0) {
        // 助攻一条数据(没有记录的时候，要有新增的地方)
        this.ediReceiverSummaryTable.tableData.push({ ...this.ediReceiverSummaryTable.initOneInvoiceItem, isAssistRow: true })
      }
      let incrementIndex = 0
      this.ediReceiverSummaryTable.tableData = lodash.map(this.ediReceiverSummaryTable.tableData, (item) => {
        if (item.isAssistRow) {
          this.$set(item, 'edit', false)
        } else {
          this.$set(item, 'edit', true)
        }
        this.$set(item, 'incrementIndex', incrementIndex++)
        return item
      })
      // TODO 优化响应属性
      console.log(' toDealEdiReceiverSummaryTableWhenEmpty this.ediReceiverSummaryTable.tableData', this.ediReceiverSummaryTable.tableData)
    },
    setReceiverCustomerInfo(obj) {
      console.log('setReceiverCustomerInfo obj', obj)
      this.ediReceiverSummaryTable.tableData[obj.rowIndex].receiverName = obj.chineseName
      this.ediReceiverSummaryTable.tableData[obj.rowIndex].receiverId = obj.id
    },
    resetReceiverList() {
      this.ediReceiverSummaryTable.tableData = [...this.oneEdiConfig.ediReceiverList]
      this.toDealEdiReceiverSummaryTableWhenEmpty()
    },
    toSetColumnDefs() {
      this.columnDefsRight = [
        {
          headerName: 'ID',
          field: `id`,
          hide: true
        }, {
          headerName: '类型名称',
          field: `typeName`
        }, {
          headerName: '渠道名称',
          field: `channelName`
        }, {
          headerName: '通信方向',
          field: `communicationDirectionDesc`
        }, {
          headerName: '通信方式',
          field: `communicationMode`
        }, {
          headerName: '通信参数值',
          field: `communicationParameterValue`,
          hide: true
        }, {
          headerName: '发送方代码',
          field: `senderCode`
        }, {
          headerName: '接收方类型',
          field: `receiverTypeDesc`
        }, {
          headerName: '更新人',
          field: `updateBy`,
          hide: true
        }, {
          headerName: '操作', pinned: 'right', field: `id`, width: 200,
          cellRendererFramework: 'ediConfigOptBtn'
        }]
    }
  }
}
</script>
<style scoped>
  .office-bg{
    background: #d8d8d8;
  }
</style>
