<template>
  <div>
    <div class="flex-right mb-10" v-if="clearanceType!=1 && !isEdit && !isDetail">
      <el-button type="primary" size="mini" @click="add">{{$t('seaBl.addCtn')}}</el-button>
      <el-button type="primary" size="mini" @click="dialog.visible=true">{{$t('seaBl.importCtn')}}</el-button>
    </div>
    <el-table :data="dataList" ref="dataTable" size="mini" height="250" border stripe v-loading="loading">
      <el-table-column :label="$t('seaBl.indexNo')" width="60">
        <template slot-scope="{$index}">
          {{$index+1}}
        </template>
      </el-table-column>
      <el-table-column width="140" :label="$t('seaBl.ctnNo')" prop="ctnNo" >
        <template slot-scope="{row}">
          <el-select v-if="row.isEdit" v-model="row.ctnNo" filterable remote placeholder="请输入关键词" size="mini" :remote-method="remoteMethod" :loading="loading1" @change='ctnNoSelected($event,row)'>
            <el-option
              v-for="item in options"
              :key="item.ctnNo"
              :label="item.ctnNo"
              :value="item.ctnNo">
            </el-option>
          </el-select>
          <span v-else>{{row.ctnNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140" :label="$t('seaBl.ctnType')" prop="ctnType" />
      <el-table-column label="SKU" min-width="140" prop="skuCode">
        <template slot-scope="{row}">
          <span>{{row.skuCodeList?row.skuCodeList.join(','):null}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('seaBl.totalTray')" width="120" prop="totalTray" />
      <el-table-column :label="$t('seaBl.nw')+'（KG）'" width="120" prop="totalNw" align="center" />
      <el-table-column :label="$t('seaBl.gw')+'（KG）'" width="120" prop="totalGw" align="center" />
      <el-table-column :label="$t('seaBl.importValue')" width="100" prop="totalImportValue" />
      <el-table-column :label="$t('seaBl.currency')" width="80" prop="currencyName" />
      <el-table-column :label="$t('seaBl.MRN')" width="140" prop="mrn" v-if="clearanceType===2">
        <template slot-scope="{row}">
          <span v-if="!row.isEdit">{{row.mrn}}</span>
          <el-input v-model="row.mrn" size="mini" v-else></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('seaBl.MRNDate')" width="200" prop="mrnDate" v-if="clearanceType===2">
        <template slot-scope="{row}">
          <span v-if="!row.isEdit">{{row.mrnDate | filterDate(vm)}}</span>
          <CommonPicker size="mini" v-model="row.mrnDate" pickerFormat="yyyy-MM-dd" pikcerType="date" v-else />
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" fixed="right" width="140" align="left" v-if="!isDetail && clearanceType===2" prop="id">
        <template slot-scope="{row,$index}">
          <div v-if="row.isEdit">
            <el-button type="text" size="mini" @click="saveItem(row)">{{$t('common.saveBtn')}}</el-button>
            <el-button type="text" size="mini" class="fc-red" @click="cancel(row, $index)">{{$t('common.cancelBtn')}}</el-button>
          </div>
          <div v-else>
            <el-button type="text" size="mini" @click="editItem(row)">{{$t('common.editBtn')}}</el-button>
            <el-button type="text" size="mini" class="fc-red" @click="delItem($index)">{{$t('common.deleteBtn')}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <ExcelUploadDialog ref="ExcelUploadDialog" tempName="集装箱转关导入模板.xls" :visible.sync="dialog.visible" @saved="excelUpload" />
  </div>
</template>

<script>
import ExcelUploadDialog from './ExcelUploadDialog'
import { importSeaCustomsCntApi, getCustomsCntsApi } from '@/api/OvlSeaSitManage/seaBl'
import { deepCloneMethod } from '@/utils'
export default {
  name: 'CtnTable',
  components: { ExcelUploadDialog },
  props: {
    blId: String,
    customsId: String,
    ctnList: Array,
    clearanceType: Number, // 1清关 2转关
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      vm: this,
      options: [],
      isEdit: false,
      loading: false,
      loading1: false,
      originalRow: null
    };
  },
  created() {

  },
  mounted() {

  },
  computed: {
    dataList: function() {
      let _list = this.ctnList ? deepCloneMethod(this.ctnList) : []
      _list.map(item => {
        item.isEdit = false
      })
      return _list
    }
    // {
    //  get: function() {
    //    let _list = JSON.parse(JSON.stringify(this.ctnList))
    //    _list.map(item => {
    //      item['isEdit'] = false
    //    })
    //    return _list
    //  },
    //  set: function(val) {
    //    this.$emit('input:ctnList', val)
    //  }
    // }
  },
  watch: {
    clearanceType: function(newVal, oldVal) {
      this.reRenderTable()
    }
  },
  filters: {
    filterDate: function(date, vm) {
      return date ? vm.$moment(Number(date)).format('YYYY-MM-DD') : ''
    }
  },
  methods: {
    remoteMethod(ctnNo) {
      this.loading1 = true
      let queryData = {
        blId: this.blId,
        ctnNo: ctnNo.trim()
      }
      // ctnNo =
      // if (this.$isNotEmpty(ctnNo)) {
      //  queryData.ctnNo = ctnNo
      // }
      // console.log(queryData);
      getCustomsCntsApi(queryData).then(res => {
        if (res.ok) {
          this.loading1 = false
          this.options = res.content.filter(item => this.$isEmpty(this.dataList.find(data => data.ctnNo === item.ctnNo))) || []
        } else {
          this.loading1 = false
          this.options = []
        }
      })
    },
    saveUpload(data) {
      importSeaCustomsCntApi(data, this.customsId).then(res => {
        if (res.ok) {
          this.$refs.ExcelUploadDialog.loading = false
          this.dialog.visible = false
          let msg = `${this.$t('seaBl.uploadResult1')}${res.content.sumCount}${this.$t('seaBl.uploadResult2')}${Number(res.content.successCount)}${this.$t('seaBl.uploadResult3')}${res.content.errorCount}${this.$t('seaBl.uploadResult4')}`
          if (this.$isNotEmpty(res.content.errorList)) {
            let errTips = this.$t('seaBl.uploadErrTips')
            res.content.errorList.forEach(item => {
              errTips += `【${item.message}】`
            })
            msg += errTips
          }
          this.$alert(msg, this.$t('common.tips'), {
            confirmButtonText: this.$t('common.theKnow'),
            callback: () => {
              this.$emit('saved')
            }
          })
        } else {
          this.$refs.ExcelUploadDialog.loading = false
        }
      })
    },
    // 导入
    excelUpload(data) {
      if (this.$isNotEmpty(this.dataList)) {
        this.confirmTips(this.$t('seaBl.uploadCtnTips')).then(() => {
          this.saveUpload(data)
        }).catch(() => {
          this.$refs.ExcelUploadDialog.loading = false
        })
      } else {
        this.saveUpload(data)
      }
    },
    delItem(index) {
      this.confirmTips().then(() => {
        this.dataList.splice(index, 1)
        this.$message.success(this.$t('common.deleteSuccess'))
        this.reRenderTable()
      })
    },
    editItem(obj) {
      this.originalRow = deepCloneMethod(obj)
      obj.isEdit = true
      this.isEdit = true
    },
    add() {
      let itemData = {
        isEdit: true,
        id: null,
        ctnNo: null,
        ctnType: null,
        skuCodeList: null,
        totalTray: null,
        totalNw: null,
        totalGw: null,
        totalImportValue: null,
        currencyName: null
      }
      this.dataList.push(itemData)
      this.isEdit = true
      this.reRenderTable()
    },
    ctnNoSelected(val, row) {
      let data = this.options.find(item => item.ctnNo === val)
      if (this.$isNotEmpty(data)) {
        this.$copyProps(row, data)
        this.options = []
      }
    },
    cancel(row, index) {
      // 新增时取消
      if (!row.ctnNo) {
        this.dataList.splice(index, 1)
      } else { // 编辑时取消
        row.isEdit = false
        row = deepCloneMethod(this.originalRow)
        this.originalRow = null
      }
      this.isEdit = false
      this.reRenderTable()
    },
    // 保存数据
    saveItem(row) {
      if (this.$isEmpty(row.ctnNo)) {
        this.$message.error(this.$t('seaBl.please_input_ctnNo'))
        return
      }
      this.isEdit = false
      row.isEdit = false
      // let data = {
      //  id: this.customsId,
      //  ctnIdList: [row.id]
      // }
      // this.loading = true
      // saveCustomsCntApi(data).then(res => {
      //  if (res.ok) {
      //    this.$message.success(this.$t('common.saveSuccess'))

      //    row.id = res.content[0]
      //    this.loading = false
      //  } else {
      //    this.loading = false
      //  }
      // })
    },
    reRenderTable() {
      this.$nextTick(() => {
        this.$refs.dataTable.doLayout()
      })
    }
  }
};
</script>

<style scoped lang="less">
</style>
