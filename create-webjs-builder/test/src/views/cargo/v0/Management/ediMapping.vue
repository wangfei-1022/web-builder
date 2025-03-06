<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="searchData" :inline="true" :model="searchData" label-width="100px" size="mini">
            <el-form-item :label="$t('sys.channelCode')" prop="channelCode" maxlength="2">
              <el-select v-model="searchData.channelCode" style="width: 100%;" filterable>
                <el-option v-for="(item,i) in channelCodeList" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('sys.dataSourceType')" prop="dataSourceType" maxlength="50">
              <el-select v-model="searchData.dataSourceType" size="mini" style="width: 100%;" filterable>
                <el-option v-for="item in dataSourceTypeList" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('sys.ediCode')" prop="ediCode" maxlength="30">
              <el-input v-model.trim="searchData.ediCode"  />
            </el-form-item>
            <el-form-item :label="$t('sys.sourceCode')" prop="originalCode">
              <el-input  v-model.trim="searchData.originalCode" />
            </el-form-item>
            <el-form-item :label="$t('sys.remark')" prop="remarks">
              <el-input  v-model.trim="searchData.remarks" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="table-wrap" style="width: 100%">
      <div class="top-btn-wrap"  style="padding: 0px 0 10px 0;">
        <el-button type="primary" size="mini" @click="edit()">{{ $t('common.addBtn') }}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefs"
        :column-defs="columnDefsRight"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReadyRight"
        :style="gridHeight"
        class="ag-theme-balham"
      />
       <Pagination :total="total" :limit.sync="searchData.pageSize" :page.sync="searchData.pageNum" @pagination="list" />
    </div>
   
    <el-dialog v-loading="loading" :visible.sync="dialog.visible" :title="dialog.title" width="550px">
      <el-form v-if="dialog.visible" ref="formData" label-width="90px" label-position="right" :model="formData" :rules="rules" size="mini">
        <el-form-item :label="$t('sys.channelCode')" prop="channelCode" maxlength="2" :rules="[ required ]">
          <el-select v-model="formData.channelCode" style="width: 100%;" filterable>
            <el-option v-for="item in channelCodeList" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sys.dataSourceType')" prop="dataSourceType" maxlength="50" :rules="[ required ]">
          <el-select v-model="formData.dataSourceType" size="mini" style="width: 100%;" filterable>
            <el-option v-for="item in dataSourceTypeList" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sys.ediCode')" prop="ediCode" maxlength="30" :rules="[ required ]">
          <el-input v-model.trim="formData.ediCode"  />
        </el-form-item>
        <el-form-item :label="$t('sys.sourceCode')" prop="originalCode" :rules="[ required ]">
          <el-input  v-model.trim="formData.originalCode" />
        </el-form-item>
        <el-form-item :label="$t('sys.remark')" prop="remarks">
          <el-input type="textarea" v-model.trim="formData.remarks" maxlength="250"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="saveForm('formData')"> 确定 </el-button>
          <el-button size="mini" @click="dialog.visible = false"> 取消 </el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import ediMappingBtn from './components/ediMappingBtn'
import { schemeDataList, saveSchemeData, delSchemeData, detailScheme } from '@/api/report'
import {getContactDetail} from "@/api/charteredBoat/booking4Manager";
import {
  getAddEdiMappingApi,
  getMappingChannelCodeSelectionsApi,
  getMappingDataSourceSelectionsApi,
  getMappingDelApi, getMappingDetailApi, getMappingEditApi,
  getMappingListApi
} from "@/api/system";
export default {
  name: 'EdiMapping',
  components: { ediMappingBtn,},
  data() {
    const defaultForm = {
      remarks: '',
      channelCode: '',
      dataSourceType: '',
      ediCode: '',
      originalCode: '',
      id: null,
    }
    return {
      total: 0,
      searchData: {
        channelCode:null,
        dataSourceType:null,
        ediCode:null,
        originalCode:null,
        remarks: '',
        pageNum: 1,
        pageSize: 50
      },
      defaultForm: defaultForm,
      formData: this.$extends({}, defaultForm),
      loading: false,
      required:{ required: true,message:this.$t('sea.pleaseEnter'),trigger: 'change'},
      dataList: [],
      gridOptionsRight: {},
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnDefsRight: [
        {
          headerName: this.$t('sys.channelCode'),
          field: 'channelCodeName',
          minWidth: 150
        }, {
          headerName: this.$t('sys.dataSourceType'),
          field: 'dataSourceTypeName',
          minWidth: 150
        }, {
          headerName: this.$t('sys.ediCode'),
          field: 'ediCode',
          minWidth: 150
        }, {
          headerName: this.$t('sys.sourceCode'),
          field: 'originalCode',
          minWidth: 150
        },  {
          headerName: this.$t('sys.remark'),
          field: 'remarks',
          minWidth: 150
        }, {
          headerName: this.$t('common.operation'), pinned: 'right', field: `id`, minWidth: 130,
          cellRendererFramework: 'ediMappingBtn'
        }],
      rules: { },
      channelCodeList:[],
      dataSourceTypeList:[],
    }
  },
  created() {
    this.gridOptionsRight = {
      rowSelection: 'multiple',
      rowMultiSelectWithClick: true,
      suppressRowClickSelection: true, // 选中单元格后可以复制内容
      context: {
        componentParent: this
      },
      onRowSelected: selectorObj => {
        if (selectorObj.node.selected) {
          this.selectedItems.push(selectorObj.data)
        } else {
          const _data = selectorObj.data
          const _id = this.selectedItems.findIndex(item => item.id === _data.id)
          this.selectedItems.splice(_id, 1)
        }
      }
    }
    this.init()
    this.list()
  },
  methods: {
    /**
     * 获取列表数据
     */
    list: function() {
      this.loading = true
      getMappingListApi(this.searchData).then(res => {
        if(res.ok) {
          this.dataList = res.content.list || []
          this.total = Number(res.content.total)
        }
        this.loading = false
      })
    },
    async init() {
      const ps = []
      const resChannelCode=getMappingChannelCodeSelectionsApi().then(res => {
        if (res.ok) {
          this.channelCodeList = res.content
        }
      })
      ps.push(resChannelCode)
      const resDataSourceType=getMappingDataSourceSelectionsApi().then(res => {
        if (res.ok) {
          this.dataSourceTypeList = res.content
        }
      })
      ps.push(resDataSourceType)
      await Promise.all(ps)
    },
    reset() {
      this.formDataInit()
      this.$refs.searchData.resetFields();
      this.list()
      // this.dataList = []
    },
    formDataInit() {
      this.searchData = {
        channelCode: null,
        dataSourceType: null,
        ediCode: null,
        originalCode: null,
      }
    },
    copyAdd(row) {
      row.id = ""
      this.dialog.title = this.$t('sys.newDataSourceAdded')
      row.channelCode = Number(row.channelCode)
      this.formData = this.$extends({}, row)
      this.$nextTick(() => {
        this.dialog.visible = true
      })
    },
    /**
     * 新增编辑
     */
    edit(id) {
      if (!id) {
        this.dialog.title = this.$t('sys.newDataSourceAdded')
        this.formData = this.$extends({}, this.defaultForm)
      } else {
        this.dialog.title = this.$t('sys.dataSourceEditing')
        this.detail(id)
      }
      this.$nextTick(() => {
        this.dialog.visible = true
      })
    },
    /**
     * 删除数据
     */
    del(id) {
      this.$confirm(this.$t('common.deleteTips'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.loading=true
        getMappingDelApi(id).then(res => {
          this.loading=false
          if(res.ok){
            this.$message.success(this.$t('common.deleteSuccess'))
            this.list()
          }
        })
      })
    },
    /**
     * 保存记录
     */
    async saveForm(refName) {
      this.$refs[refName].validate(async(valid) => {
        if (!valid) {
          return false
        }
        let url = getAddEdiMappingApi
        if(this.formData.id){
          url = getMappingEditApi
        }
        this.loading = true
        const res=await url(this.formData)
        this.loading = false
        if(res.ok){
          this.$message.success('保存成功')
          this.dialog.visible = false
          this.list()
        }
      })
    },
    /**
     *获取详情数据
     */
    detail(id) {
      getMappingDetailApi(id).then(res => {
        if(res.ok) {
          res.content.channelCode = Number(res.content.channelCode)
          this.$copyProps(this.formData, res.content)
        }
      })
    },
    onReadyRight(params) {
      // const self = this
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
          // self.onFirstDataRendered()
        })
      })
    }
  }

}
</script>

<style>

</style>
