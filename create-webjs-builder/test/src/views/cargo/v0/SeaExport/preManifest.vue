<template>
  <div class="pre-manifest-wrapper">
    <div class="customs-row customs-row-two">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="preManifestGrid.gridOptions"
        :column-defs="preManifestGrid.columnDefs"
        :row-data="job.preManifest.list"
        :enable-col-resize="true"
        :enable-sorting="true"
        :row-clicked="preManifestGrid.onRowClicked"
        :grid-ready="preManifestGrid.onReady"
        row-selection="single"
        style="width: 100%;height:160px; margin-bottom: 10px;"
        class="ag-theme-balham"
      />
      <template v-if="!job.bMaster" v-permission="['se:job:detail:premanifest:edit']">
        <el-dropdown style="margin:auto 10px;" size="mini" split-button type="primary" @click="toSingleAddPreManifest" @command="toBatchAddPreManifest">
          新增
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="batch">批量新增</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>

      <el-button size="mini" :disabled="!onePreManifest.id" @click="toSavePreManifest">保存</el-button>
      <el-button v-if="!job.bMaster" v-permission="['se:job:detail:premanifest:del']" type="danger" size="mini" @click="toDeletePreManifest">删除</el-button>
    </div>
    <el-form :model="onePreManifest" label-width="100px" label-position="left">
      <el-row :gutter="25">
        <el-col :span="8">
          <!--<div class="el-form-item-group edi-wrapper">-->
          <!--<el-form-item label="发货人">-->
          <!--<el-input v-model="job.baseFormVO.orderShipperAddress" :rows="7" size="mini" type="textarea" wrap="off" readonly />-->
          <!--</el-form-item>-->
          <!--</div>-->
          <div class="el-form-item-group" style="min-height:614px;">
            <el-form-item label="是否主关单号">
              <el-radio-group v-model="onePreManifest.bMaster" size="mini" :disabled="true">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="关单号">
              <el-input v-model="onePreManifest.soNo" :disabled="onePreManifest.bContainerLoad" size="mini" />
            </el-form-item>
            <el-form-item label="进仓编号">
              <el-input v-model="onePreManifest.warehouseNo" size="mini" />
            </el-form-item>
            <el-form-item label="件数">
              <el-input v-model="onePreManifest.quantity" :disabled="onePreManifest.bContainerLoad" size="mini" />
            </el-form-item>
            <el-form-item label="重量">
              <el-input v-model="onePreManifest.grossWeight" :disabled="onePreManifest.bContainerLoad" size="mini" />
            </el-form-item>
            <el-form-item label="体积">
              <el-input v-model="onePreManifest.volume" :disabled="onePreManifest.bContainerLoad" size="mini" />
            </el-form-item>
            <el-form-item label="发货人代码">
              <el-input v-model="onePreManifest.shipperCode" size="mini" />
            </el-form-item>
            <el-form-item label="发货人名称">
              <el-input v-model="onePreManifest.shipperName" size="mini" />
            </el-form-item>
            <el-form-item label="发货人地址">
              <el-input v-model="onePreManifest.shipperAddress" type="textarea" size="mini" />
            </el-form-item>
            <el-form-item label="发货人电话">
              <el-input v-model="onePreManifest.shipperTel" size="mini" />
            </el-form-item>
            <el-form-item label="发货人传真">
              <el-input v-model="onePreManifest.shipperFax" size="mini" />
            </el-form-item>
            <el-form-item label="发货人邮件">
              <el-input v-model="onePreManifest.shipperEmail" size="mini" />
            </el-form-item>
            <el-form-item label="发货人国家">
              <div style="display: flex">
                <el-input class="width-48-percent" size="mini" /><span class="width-4-percent" />
                <el-input v-model="onePreManifest.shipperCountry" size="mini" class="width-48-percent" />
              </div>
            </el-form-item>
            <el-form-item label="发货人省份">
              <el-input v-model="onePreManifest.shipperProvince" size="mini" />
            </el-form-item>
            <el-form-item label="发货人城市">
              <el-input v-model="onePreManifest.shipperCity" size="mini" />
            </el-form-item>
            <el-form-item label="发货人邮编">
              <el-input v-model="onePreManifest.shipperZipCode" size="mini" />
            </el-form-item>
            <el-form-item label="AEO企业编码">
              <el-input v-model="onePreManifest.shipperAeoCode" size="mini" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <!--<div class="el-form-item-group edi-wrapper">-->
          <!--<el-form-item label="收货人">-->
          <!--<el-input v-model="job.baseFormVO.orderConsigneeAddress" :rows="7" size="mini" type="textarea" wrap="off" readonly />-->
          <!--</el-form-item>-->
          <!--</div>-->
          <div class="el-form-item-group" style="min-height:614px;">
            <el-form-item label="收货人代码">
              <el-input v-model="onePreManifest.consigneeCode" size="mini" />
            </el-form-item>
            <el-form-item label="收货人名称">
              <el-input v-model="onePreManifest.consigneeName" size="mini" />
            </el-form-item>
            <el-form-item label="收货人地址">
              <el-input v-model="onePreManifest.consigneeAddress" type="textarea" size="mini" />
            </el-form-item>
            <el-form-item label="收货人电话">
              <el-input v-model="onePreManifest.consigneeTel" size="mini" />
            </el-form-item>
            <el-form-item label="收货人传真">
              <el-input v-model="onePreManifest.consigneeFax" size="mini" />
            </el-form-item>
            <el-form-item label="收货人邮件">
              <el-input v-model="onePreManifest.consigneeEmail" size="mini" />
            </el-form-item>
            <el-form-item label="收货人国家">
              <div style="display: flex">
                <el-input class="width-48-percent" size="mini" /><span class="width-4-percent" />
                <el-input v-model="onePreManifest.consigneeCountry" size="mini" class="width-48-percent" />
              </div>
            </el-form-item>
            <el-form-item label="收货人省份">
              <el-input v-model="onePreManifest.consigneeProvince" size="mini" />
            </el-form-item>
            <el-form-item label="收货人城市">
              <el-input v-model="onePreManifest.consigneeCity" size="mini" />
            </el-form-item>
            <el-form-item label="具体联系人">
              <el-input v-model="onePreManifest.contact" size="mini" />
            </el-form-item>
            <el-form-item label="联系人电话">
              <el-input v-model="onePreManifest.contactTel" size="mini" />
            </el-form-item>
            <el-form-item label="联系人传真">
              <el-input v-model="onePreManifest.contactFax" size="mini" />
            </el-form-item>
            <el-form-item label="联系人邮件">
              <el-input v-model="onePreManifest.contactEmail" size="mini" />
            </el-form-item>
            <el-form-item label="AEO企业编码">
              <el-input v-model="onePreManifest.consigneeAeoCode" size="mini" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <!--<div class="el-form-item-group edi-wrapper">-->
          <!--<el-form-item label="通知人">-->
          <!--<el-input v-model="job.baseFormVO.orderNotifyAddress" :rows="7" size="mini" type="textarea" wrap="off" readonly />-->
          <!--</el-form-item>-->
          <!--</div>-->
          <div class="el-form-item-group" style="min-height:614px;">
            <el-form-item label="通知人代码">
              <el-input v-model="onePreManifest.notifierCode" size="mini" />
            </el-form-item>
            <el-form-item label="通知人名称">
              <el-input v-model="onePreManifest.notifierName" size="mini" />
            </el-form-item>
            <el-form-item label="通知人地址">
              <el-input v-model="onePreManifest.notifierAddress" type="textarea" size="mini" />
            </el-form-item>
            <el-form-item label="通知人电话">
              <el-input v-model="onePreManifest.notifierTel" size="mini" />
            </el-form-item>
            <el-form-item label="通知人传真">
              <el-input v-model="onePreManifest.notifierFax" size="mini" />
            </el-form-item>
            <el-form-item label="通知人邮件">
              <el-input v-model="onePreManifest.notifierEmail" size="mini" />
            </el-form-item>
            <el-form-item label="通知人国家">
              <div style="display: flex">
                <el-input class="width-48-percent" size="mini" /><span class="width-4-percent" />
                <el-input v-model="onePreManifest.notifierCountry" size="mini" class="width-48-percent" />
              </div>
            </el-form-item>
            <el-form-item label="通知人省份">
              <el-input v-model="onePreManifest.notifierProvince" size="mini" />
            </el-form-item>
            <el-form-item label="通知人城市">
              <el-input v-model="onePreManifest.notifierCity" size="mini" />
            </el-form-item>
            <el-form-item label="联系人邮编">
              <el-input v-model="onePreManifest.notifierZipCode" size="mini" />
            </el-form-item>
            <el-form-item label="AEO企业编码">
              <el-input v-model="onePreManifest.notifierAeoCode" size="mini" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :column-defs="cargoDetailGrid.columnDefs"
      :row-data="cargoDetailGrid.rowData"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="cargoDetailGrid.onReady"
      style="width: 100%;height:350px;margin-top:10px;margin-bottom:10px;"
      class="ag-theme-balham"
    />
    <edi-dialog v-if="isShowEdiViewOrDesignDialog" ref="ediDialog" :params="ediViewOrDesignDialog.params" :is-show="isShowEdiViewOrDesignDialog" @close="closeEdiViewOrDesignDialog" />
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import { getPreManifestList, getPreManifestById, savePreManifest, deletePreManifest, addPreManifest, saveSeaExportJobPreManifest4OneAdd } from '@/api/seaExport'
import ediDialog from '@/components/Cargo/Edi/ediDialog'
import { getGridSelectedIds } from '@/utils/gridChoose'

export default {
  name: 'PreManifest',
  components: { AgGridVue, ediDialog },
  props: { job: { type: Object, default: () => {} }},
  data() {
    return {
      isShowEdiViewOrDesignDialog: false,
      ediViewOrDesignDialog: {
        params: {
          ediType: 'PREMANIFEST',
          entityIdList: [],
          entityList: [],
          jobId: ''
        }
      },
      preManifestGrid: {
        gridOptions: {},
        columnDefs: [
          //          { headerName: '#', width: 55, checkboxSelection: true,
          //            suppressSorting: true, suppressMenu: true, suppressSizeToFit: true, suppressResize: true },
          {
            headerName: '序号',
            width: 80,
            valueGetter: params => params.node.rowIndex + 1
          },
          { headerName: '关单号', field: 'soNo' },

          { headerName: '发货人代码', field: 'shipperCode' },
          { headerName: '收货人代码', field: 'consigneeCode' },
          { headerName: '通知人代码', field: 'notifierCode' },

          { headerName: '中文品名', field: 'cnGoodsName' },
          { headerName: '件数', field: 'quantity' },
          { headerName: '毛重', field: 'grossWeight' },
          { headerName: '体积', field: 'volume' },
          { headerName: '计费重量', field: 'chargeableWeight' }
        ],
        onReady: params => {},
        onRowClicked: event => {
          console.log('===event.node', event.node)
          getPreManifestById(event.node.data.id).then(res => {
            this.onePreManifest = res.content
          })
        }
      },
      cargoDetailGrid: {
        columnDefs: [
          { headerName: '箱型', field: 'a' },
          { headerName: '箱号', field: 'b' },
          { headerName: '封号', field: 'c' },
          // { headerName: '提单号', field: 'd' },
          { headerName: '英文品名', field: 'e' },
          { headerName: 'HS CODE', field: 'f' },
          { headerName: '件数', field: 'g' },
          { headerName: '包装', field: 'h' },
          { headerName: '唛头', field: 'i' },
          { headerName: '毛重', field: 'j' },
          { headerName: '体积', field: 'k' },
          { headerName: '危险品', field: 'l' },
          { headerName: '危险品类别', field: 'm' },
          { headerName: '原产国', field: 'n' },
          { headerName: '商品项补充', field: 'o' },
          { headerName: '海关手续', field: 'p' }
        ],
        rowData: [],
        onReady: params => {}
      },
      onePreManifest: {
        id: '',
        seJobId: '',
        jobId: '',
        warehouseNo: '',
        shipperCode: '',
        consigneeCode: '',
        notifierCode: ''
      },
      initOnePreManifest: {}
    }
  },
  created() {
    this.initOnePreManifest = { ...this.onePreManifest }
    this.preManifestGrid.gridOptions = {
      /* rowClassRules: {
        'grid-row-zebra-even': function(params) {
          return !(params.rowIndex % 2)
        },
        'grid-row-zebra-odd': function(params) {
          return (params.rowIndex % 2)
        }
      }*/
      // rowSelection: 'multiple'
    }
  },
  methods: {
    toSimulateClickFirstRow() { // 模拟点击第一条数据
      if (this.job.preManifest.list.length > 0) {
        console.log('this.gridOptions.api', this.preManifestGrid.gridOptions.api)
        getPreManifestById(this.job.preManifest.list[0].id).then(res => {
          this.onePreManifest = res.content
        })
        this.preManifestGrid.gridOptions.api.forEachNode(node => {
          console.log('====node', node)
        })
      } else { // 没有数据
        this.onePreManifest = { ...this.initOnePreManifest }
      }
    },
    toSingleAddPreManifest() {
      this.onePreManifest = { ...this.initOnePreManifest, id: '-1' }
    },
    toBatchAddPreManifest() {
      this.$prompt('请输入关单号的数量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: 1
      }).then(({ value }) => {
        addPreManifest({ seJobId: this.$route.query.id, jobId: this.$route.query.jobId, shippingOrderQuantity: value }).then(res => {
          getPreManifestList(this.$route.query.id, this.$route.query.jobId).then(r => {
            this.job.preManifest.list = r.content.list
          }).then(() => {
            this.onePreManifest = { ...this.initOnePreManifest } // 手动重置，以免混淆当前是新增还是修改
            this.job.bookingFormVO.shippingOrderQuantity = res.content.bRefreshQuantity ? res.content.shippingOrderQuantity : this.job.bookingFormVO.shippingOrderQuantity
            this.job.bookingFormVO.soNo = res.content.bRefreshSoNo ? res.content.soNo : this.job.bookingFormVO.soNo
            return this.job.preManifest.list[0].id
          }).then(id => getPreManifestById(id))
.then(res => {
            this.onePreManifest = res.content
          })
        })
      }).catch(() => {})
    },
    async toSavePreManifest() {
      this.onePreManifest.jobId = this.$route.query.jobId
      this.onePreManifest.seJobId = this.$route.query.id
      if (!this.onePreManifest.soNo) {
        return this.$message.error('请输入关单号')
      }
      let res
      if (this.onePreManifest.id === '-1') {
        // 单个新增保存
        res = await saveSeaExportJobPreManifest4OneAdd(this.onePreManifest)
      } else {
        res = await savePreManifest(this.onePreManifest, this.onePreManifest.id)
      }
      this.$message.success('保存成功')
      // 额外，更新表单中job.bookingFormVO.soNo
      this.job.bookingFormVO.shippingOrderQuantity = res.content.bRefreshQuantity ? res.content.shippingOrderQuantity : this.job.bookingFormVO.shippingOrderQuantity
      this.job.bookingFormVO.soNo = res.content.bRefreshSoNo ? res.content.soNo : this.job.bookingFormVO.soNo
      getPreManifestList(this.onePreManifest.seJobId, this.onePreManifest.jobId).then(r => {
        // 刷新列表
        this.job.preManifest.list = r.content.list
      }).catch(() => {})
      // this.onePreManifest = { ...this.initOnePreManifest } // 手动重置，以免混淆当前是新增还是修改
    },
    toDeletePreManifest() {
      const selectedRows = this.preManifestGrid.gridOptions.api.getSelectedRows()
      if (selectedRows.length === 1) {
        if (selectedRows[0].bMaster) {
          return this.$message.warning('主关单不允许删除')
        }
      }
      if (selectedRows.length === 1) {
        this.$confirm('确认删除该预配舱单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePreManifest(selectedRows[0].id).then(res => {
            getPreManifestList(this.$route.query.id, this.$route.query.jobId).then(r => {
              this.job.preManifest.list = r.content.list
              this.job.bookingFormVO.shippingOrderQuantity = res.content.bRefreshQuantity ? res.content.shippingOrderQuantity : this.job.bookingFormVO.shippingOrderQuantity
              this.job.bookingFormVO.soNo = res.content.bRefreshSoNo ? res.content.soNo : this.job.bookingFormVO.soNo
              this.toSimulateClickFirstRow()
            })
          })
        }).catch(() => {})
      } else {
        this.$message.error('请您先勾选要删除的关单记录')
      }
    },
    closeEdiViewOrDesignDialog() {
      this.isShowEdiViewOrDesignDialog = false
    },
    toPrintEdi() {
      this.ediViewOrDesignDialog.params.jobId = this.$route.query.jobId

      getGridSelectedIds(this.preManifestGrid.gridOptions).then(ids => {
        this.ediViewOrDesignDialog.params.entityIdList = ids
        this.ediViewOrDesignDialog.params.entityList = ids.map(val => ({ id: val }))
        this.isShowEdiViewOrDesignDialog = true
      }).catch(err => {
        this.$message.error(err)
      })
    },
    toGetGridSelectedIds() {
      return getGridSelectedIds(this.preManifestGrid.gridOptions)
    }
  }
}
</script>
<style scoped>
  .width-4-percent{
    width: 4%;
  }
  .width-48-percent{
    width: 48%;
  }
</style>
