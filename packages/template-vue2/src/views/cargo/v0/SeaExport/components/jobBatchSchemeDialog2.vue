<template>
  <div>
    <el-dialog v-el-drag-dialog :visible.sync="isShowing" width="70vw" title="批量计费方案" @close="onCloseDialog">
      <div class="app-main-inner">
        <div class="app-main-inner-row">
          <div class="btn-group-left" />
          <div class="btn-group-right" />
        </div>
        <div class="app-main-inner-row">
          <div style="width:25%;">
            <!--<div style="height: 50px;"/>-->
            <ag-grid-vue
              :locale-text-func="_i18nGridLocalText"
              :grid-options="gridOptionsLeft"
              :side-bar="sideBarDefsLeft"
              :column-defs="columnDefsLeft"
              :row-clicked="onRowCLicked"
              :row-data="rowDataLeft"
              :enable-col-resize="true"
              :enable-sorting="true"
              :grid-ready="onReadyLeft"
              style="min-width:190px;height:500px"
              class="ag-theme-balham"
            />
          </div>
          <div style="width:75%;">
            <div style="height: 50px;border:1px silver dashed;">
              <el-form label-width="90px" label-position="left">
                <el-form-item label="计费方案">
                  <el-select v-model="schemeId" size="mini" :placeholder="$t('common.placeholder')" @change="onSchemeChange">
                    <el-option
                      v-for="item in schemeList"
                      :key="item.id"
                      :label="item.schemeName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <ag-grid-vue
              :locale-text-func="_i18nGridLocalText"
              :grid-options="gridOptionsRight"
              :side-bar="sideBarDefsRight"
              :column-defs="columnDefsRight"
              :row-data="rowDataRight"
              :enable-col-resize="true"
              :enable-sorting="true"
              :grid-ready="onReadyRight"
              style="height:450px"
              class="ag-theme-balham"
            />
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button size="mini" type="primary" @click="toBatchProduct">批量生成</el-button>
        <el-button type="primary" size="mini" @click="onCloseDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import lodash from 'lodash'
import { getChargeSchemeListByJobs, showChargeListBySchemeAndJob, commitChargeListByScheme } from '@/api/chargeTabAtJob'

export default {
  name: 'JobBatchSchemeDialog',
  components: { AgGridVue },
  props: {
    jobs: { type: Array, default() { return [] } },
    isShowingDialog: { type: Boolean, default: false }
  },
  data() {
    return {
      isShowing: false,
      jobIds: [],
      currentJobId: '',
      schemeId: '',
      schemeList: [],
      gridOptionsLeft: {},
      gridApiLeft: {},
      gridOptionsRight: {},
      columnDefsLeft: null,
      columnDefsRight: null,
      sideBarDefsLeft: false,
      sideBarDefsRight: false,
      rowDataLeft: [],
      rowDataRight: []
    }
  },
  created() {
    const self = this
    self.gridOptionsRight = {
      suppressRowClickSelection: true,
      context: {
        componentParent: self
      }
    }
    this.columnDefsLeft = [{
      headerName: 'JobId',
      field: 'jobId',
      width: 10
    }, {
      headerName: '工作号',
      field: 'jobNo',
      width: 80
    }, {
      headerName: '委托单位',
      field: 'customerName',
      width: 100
    }, {
      headerName: '委托单位简称',
      field: 'customerAbbreviation'
    }, {
      headerName: '承运人简称',
      field: 'carrierCode'
    }, {
      headerName: '关单号',
      field: 'soNo',
      width: 80
    }]
    this.columnDefsRight = [
      {
        headerName: '#', width: 55, checkboxSelection: true, pinned: 'left',
        suppressSorting: true, suppressMenu: true, suppressSizeToFit: true, suppressResize: true, hide: true
      }, {
        headerName: '工作号',
        width: 150,
        field: 'jobNo'
      }, {
        headerName: '费用名称',
        width: 150,
        field: 'feeItemName'
      }, {
        headerName: '结算单位',
        width: 150,
        field: 'customerName'
      }, {
        headerName: 'P/C',
        width: 70,
        field: 'ppCcDesc'
      }, {
        headerName: '数量',
        width: 100,
        field: 'num'
      }, {
        headerName: '单位',
        width: 100,
        field: 'unit'
      }, {
        headerName: '单价',
        width: 100,
        field: 'price'
      }, {
        headerName: '币种',
        width: 100,
        field: 'currency'
      }, {
        headerName: '金额',
        width: 100,
        field: 'amount'
      }, {
        headerName: '汇率',
        width: 100,
        field: 'bussinessRate'
      }, {
        headerName: '折合金额',
        width: 100,
        field: 'localAmount'
      }]
  },
  beforeMount() {
    this.fetchPageData()
  },
  methods: {
    onReadyLeft(params) {
      // this.gridApiLeft = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    onReadyRight(params) {
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          self.onFirstDataRendered(self.gridOptionsRight)
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
    fetchPageData() {
      // const self = this
      console.log('==========jobBatchScheme=====fetch===', this.jobs)
      const jobIds = lodash.map(this.jobs, 'jobId')
      this.rowDataLeft = this.jobs
      this.jobIds = jobIds
      this.currentJobId = jobIds[0]
      getChargeSchemeListByJobs(jobIds).then(res => {
        if (res.ok) {
          this.schemeList = res.content
          this.isShowing = this.isShowingDialog
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        this.onCloseDialog()
        this.$message.error(err)
      })
    },
    onRowCLicked(params) {
      this.currentJobId = params.data.jobId
      params.node.setSelected(true, true)
      this.onSchemeChange()
    },
    onCloseDialog() {
      this.$emit('close')
    },
    onSchemeChange() {
      showChargeListBySchemeAndJob(this.currentJobId, this.schemeId).then(res => {
        if (res.ok) {
          this.rowDataRight = res.content
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    toBatchProduct() {
      commitChargeListByScheme(this.jobIds, this.schemeId).then(res => {
        if (res.ok) {
          this.$message.success('恭喜你，批量生成费用成功')
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>
<style scoped>
</style>
