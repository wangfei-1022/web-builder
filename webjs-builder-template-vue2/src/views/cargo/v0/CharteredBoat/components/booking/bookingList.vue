<!--订舱列表组件-->
<template>
  <div class="booking-list">
    <!-- <el-table
      ref="bookingTable"
      header-row-class-name="el-grid-header"
      :data="grid.data"
      stripe
      :height="450"
      class="grid-list"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="serialNo"
        label="流水号"
        align="center"
        width="200"
      />
      <el-table-column
        prop="soNo"
        label="so"
        align="center"
        width="120"
      />
      <el-table-column
        prop="memberName"
        label="客户"
        align="center"
        width="120"
      />
      <el-table-column
        prop="containerSizeTypeQty"
        label="柜型柜量"
        align="center"
        width="150"
      />
      <el-table-column
        prop="enPolName"
        label="装货港"
        align="center"
        width="120"
      />
      <el-table-column
        prop="enPodName"
        label="卸货港"
        align="center"
        width="150"
      />
      <el-table-column
        label="船名/航次"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.vessel }} / {{ row.voyage }}
        </template>
      </el-table-column>
      <el-table-column
        prop="statusName"
        label="状态"
        width="120"
      >
        <template slot-scope="{row}">
          <span v-if="row.status===1" :style="{color:colors.warning}">待审核</span>
          <span v-else-if="row.status===2" :style="{color:colors.success}">已通过</span>
          <span v-else-if="row.status===3" :style="{color:colors.danger}">已驳回</span>
          <span v-else-if="row.status===4" :style="{color:colors.danger}">已取消</span>
          <span v-else :style="{color:colors.info}">草稿</span>
        </template>

      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="105"
      >
        <template slot-scope="{row}">

          <el-button v-if="row.status===2" type="text" size="mini" @click="edit(row)">
            编辑
          </el-button>
          <el-button v-if="row.status===1" type="text" size="mini" @click="audit(row)">
            审核
          </el-button>
          <el-button v-if="row.status===2" type="text" size="mini" @click="download(row)">
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptionsRight"
      :side-bar="sideBarDefs"
      :column-defs="columnDefsRight"
      :row-data="grid.data"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReadyRight"
      style="height:calc(100vh - 310px)"
      class="ag-theme-balham"
    />
    <Pagination
      :total="grid.total"
      :page.sync="grid.page"
      :limit.sync="grid.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getBookingList, downloadBookingConfirm } from '@/api/charteredBoat/booking4Manager'
import { getGridSelected } from '@/utils/gridChoose'
import BookOperationBtn from '.././BookOperationBtn'
const colors = {
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399'
}

export default {
  name: 'BookingList',
  components: {
    BookOperationBtn
  },
  props: {
    panelData: { type: Array },
    status: { default: '' }, // 0全部
    searchForm: { type: Object }
  },
  data() {
    return {
      columnDefsRight: [
        {
          headerName: '', width: 55, pinned: 'left',
          suppressSorting: true, checkboxSelection: true, headerCheckboxSelection: true,
          suppressMenu: true, suppressSizeToFit: true, suppressResize: true
        },
        {
          headerName: this.$t('charteredBoat.serialNo'),
          field: 'serialNo',
          pinned: 'left',
          width: 130
        }, {
          headerName: this.$t('charteredBoat.booking.soNoText'),
          field: 'soNo',
          minWidth: 100
        },
        {
          headerName: this.$t('charteredBoat.memberName'),
          field: 'memberName',
          width: 140
        },
        {
          headerName: this.$t('charteredBoat.booking.containerSizeTypeQty'),
          field: 'containerSizeTypeQty',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.polCode'),
          field: 'enPolName',
          width: 120
        },
        {
          headerName: this.$t('charteredBoat.podCode'),
          field: 'enPodName',
          width: 140
        },
        {
          headerName: this.$t('charteredBoat.booking.vessel'),
          field: 'vessel',
          width: 140,
          cellRenderer: params => `<div>${params.value}/${params.data.voyage}</div>`
        },
        {
          headerName: this.$t('charteredBoat.booking.status'),
          field: 'status',
          width: 100,
          cellRenderer: params => {
            if (params.value === 1) {
              return `<div class="status-text warning-text">${this.$t('common.waitForVerify')}</div>`
            } else if (params.value === 2) {
              return `<div  class="status-text success-text">${this.$t('common.passed')}</div>`
            } else if (params.value === 3) {
              return `<div  class="status-text danger-text">${this.$t('common.rejected')}</div>`
            } else if (params.value === 4) {
              return `<div  class="status-text danger-text">${this.$t('common.verifyFailed')}</div>`
            } else {
              return `<div  class="status-text ">${this.$t('common.draft')}</div>`
            }
          }
        },
        {
          headerName: this.$t('common.operation'), pinned: 'right', width: 90, suppressSizeToFit: true, suppressResize: true,
          cellRendererFramework: 'BookOperationBtn'
        }
      ],
      gridOptionsRight: {},
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      colors,
      grid: {
        data: [],
        pageSize: 50,
        pageNum: 1,
        total: 0
      }
    }
  },
  created() {
    this.gridOptionsRight = {
      rowSelection: 'multiple',
      rowMultiSelectWithClick: true,
      suppressCellSelection: false,
      suppressRowClickSelection: true,
      context: {
        componentParent: this
      }
    }
  },
  mounted() {
  },
  methods: {
    onReadyRight(params) {
      // const self = this
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
          // self.onFirstDataRendered()
        })
      })
    },
    getSelectedRows() { // 获取选中的行数据
      const selectedRows = getGridSelected(this.gridOptionsRight)
      console.log(selectedRows)
      // const selectedRows = this.$refs.bookingTable.selection
      return selectedRows
    },
    getList({ page, limit } = {}) {
      // status的过滤  0->全部-》null
      const data = {
        ...this.searchForm,
        status: this.status,
        pageNum: page || this.grid.pageNum,
        pageSize: limit || this.grid.pageSize
      }
      getBookingList(data).then(res => {
        if (res.ok) {
          this.grid.data = res.content.list
          this.grid.total = Number(res.content.total)
          this.$emit('success', this.grid.total)
        } else {
          this.$emit('fail')
        }
      }).catch(() => {
        this.$emit('fail')
      })
    },
    audit(row) {
      this.$emit('audit', row)
    },
    edit(row) {
      this.$emit('edit', row)
    },
    async download(row) {
      // 直接下载
      downloadBookingConfirm(row.id).then(res => {
        if (res.ok) {
          window.open(res.content)
          this.$message.success('下载成功！')
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.booking-list {
  //margin-bottom: 20px;

  .grid-list {
  }
}
</style>
