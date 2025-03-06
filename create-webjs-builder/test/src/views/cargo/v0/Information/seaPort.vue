<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row" style="padding-bottom: 10px;">
      <div class="filters">
        <el-form :inline="true" label-width="90px" label-position="left">
          <div class="el-form-item-wrapper">
            <el-form-item label="国家">
              <!--国家-->
              <cargo-advance-select
                :url="url.sys.countryList"
                :headers="['二字码','中文名称']"
                :fields="['code2','chineseName']"
                :callback-params="{key:'countryCode'}"
                callback-method-type="value"
                tag-value="code2"
                tag-name="chineseName"
                style="width:205px;"
                remote
                @parentCallBack="getValueFromChild"
              >
                <template slot-scope="{option:{item,fields}}">
                  <div style="display: flex;justify-content: space-between;width:400px;">
                    <div v-for="(field) in fields" :key="field" style="width:30%">{{ item[field] }}</div>
                  </div>
                </template>
              </cargo-advance-select>
            </el-form-item>
            <el-form-item label="海港五字码">
              <!--港口-->
              <el-input v-model="searchConditions.code5" size="mini" />
              <!--<cargo-advance-select-->
              <!--:url="url.sys.seaPortList"-->
              <!--:headers="['五字码','中文名称','英文名称']"-->
              <!--:fields="['code5','chineseName','englishName']"-->
              <!--:callback-params="{key:'code5'}"-->
              <!--callback-method-type="value"-->
              <!--tag-value="code5"-->
              <!--tag-name="code5"-->
              <!--style="width:205px;"-->
              <!--remote-->
              <!--@parentCallBack="getValueFromChild"-->
              <!--&gt;-->
              <!--<template slot-scope="{option:{item,fields}}">-->
              <!--<div style="display: flex;justify-content: space-between;width:400px;">-->
              <!--<el-tooltip v-for="(field) in fields" :key="field" :disabled="item[field].length<15" :content="item[field]" effect="dark" placement="left">-->
              <!--<div style="width:30%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">-->
              <!--{{ item[field] }}-->
              <!--</div>-->
              <!--</el-tooltip>-->
              <!--</div>-->
              <!--</template>-->
              <!--</cargo-advance-select>-->
            </el-form-item>
            <el-form-item label="港口英文名">
              <!--港口-->
              <el-input v-model="searchConditions.englishName" size="mini" />
              <!--<cargo-advance-select-->
              <!--:url="url.sys.seaPortList"-->
              <!--:headers="['中文名称','英文名称']"-->
              <!--:fields="['chineseName','englishName']"-->
              <!--:callback-params="{key:'englishName'}"-->
              <!--callback-method-type="value"-->
              <!--tag-value="englishName"-->
              <!--tag-name="englishName"-->
              <!--style="width:205px;"-->
              <!--remote-->
              <!--@parentCallBack="getValueFromChild"-->
              <!--&gt;-->
              <!--<template slot-scope="{option:{item,fields}}">-->
              <!--<div style="display: flex;justify-content: space-between;width:400px;">-->
              <!--<el-tooltip v-for="(field) in fields" :key="field" :disabled="item[field].length<15" :content="item[field]" effect="dark" placement="left">-->
              <!--<div style="width:30%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">-->
              <!--{{ item[field] }}-->
              <!--</div>-->
              <!--</el-tooltip>-->
              <!--</div>-->
              <!--</template>-->
              <!--</cargo-advance-select>-->
            </el-form-item>
            <el-form-item label="航线">
              <!--航线-->
              <cargo-advance-select
                :url="url.dmn.terminologyByType"
                :method-params="{termCode:'SEALINE'}"
                :callback-params="{key:'lineCode'}"
                :headers="['中文名称','CODE']"
                :fields="['chineseName','code']"
                tag-name="code"
                tag-value="code"
                callback-method-type="value"
                options-width="200px"
                style="width:205px;"
                @parentCallBack="getValueFromChild"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="triggers">
        <div><el-button size="mini" style="width:100%" @click="toQuery">查询</el-button></div>
      </div>
    </div>

    <div class="search-bar" style="display: flex; justify-content: space-between;height:40px;">
        <div class="search-bar-left" style="padding-top: 6px;padding-left:20px;">
          <el-button type="primary" size="mini" @click="createPort">新增</el-button>
          <!--<el-button type="danger" size="mini">删除</el-button>-->
        </div>
        <div class="search-bar-right" style="">
          <!--<el-button type="primary" size="mini">合并</el-button>-->
          <!--<el-button type="primary" size="mini">启用/停用</el-button>-->
        </div>
      </div>

    <div class="app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnDefs"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :pagination="true"
        :pagination-auto-page-size="true"
        style="width: 100%;height:calc(80vh - 160px);"
        class="ag-theme-balham"
      />
    </div>
    <el-dialog :visible.sync="isShowingSeaportForm" title="海运港口" width="650px">
      <el-form :model="oneSeaport" :rules="oneSeaportRules" label-width="50px" label-position="right">
        <el-form-item label="属性">
          <!--<el-checkbox v-model="oneSeaport.bActive" size="mini">启用</el-checkbox>-->
          <el-checkbox v-model="oneSeaport.bInland" size="mini">内陆点</el-checkbox>
        </el-form-item>
        <!--<el-form-item label="序号">
          <el-input-number v-model="oneSeaport.seqNo" :min="1" size="mini" style="width: calc(50% - 50px);" controls-position="right" @change="handleseqNoChange" />
        </el-form-item>-->
        <div style="display: flex;justify-content: space-between;">
          <!--<div style="width: 50%;">-->
            <!--<el-form-item label="三字码">-->
              <!--<el-input v-model="oneSeaport.code3" size="mini" disabled />-->
            <!--</el-form-item>-->
          <!--</div>-->
          <div style="width:calc(50% + 10px);">
            <el-form-item label="五字码">
              <el-input v-model="oneSeaport.code5" size="mini" disabled />
            </el-form-item>
          </div>
        </div>
        <el-form-item label="中文名">
          <el-input v-model="oneSeaport.chineseName" size="mini" placeholder="必填，不可重复" />
        </el-form-item>
        <el-form-item label="英文名">
          <el-input v-model="oneSeaport.englishName" size="mini" placeholder="必填，不可重复" />
        </el-form-item>
        <div style="display: flex;justify-content: space-between;">
          <div style="width: 50%;">
            <el-form-item label="区域">
              <el-select v-model="oneSeaport.countryCode" size="mini" :placeholder="$t('common.placeholder')">
                <el-option
                  v-for="item in dialogInitData.countryList"
                  :key="item.code2"
                  :label="item.chineseName"
                  :value="item.code2"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="width:calc(50% + 10px);padding-left:10px;">
            <el-form-item label="城市">
              <el-select v-model="oneSeaport.cityCode" size="mini" :placeholder="$t('common.placeholder')" clearable>
                <el-option
                  v-for="item in dialogInitData.cityList"
                  :key="item.code"
                  :label="item.chineseName"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <div style="width: 50%;">
            <el-form-item label="国家">
              <el-select v-model="oneSeaport.countryCode" size="mini" :placeholder="$t('common.placeholder')">
                <el-option
                  v-for="item in dialogInitData.countryList"
                  :key="item.code2"
                  :label="item.chineseName"
                  :value="item.code2"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="width:calc(50% + 10px);padding-left:10px;">
            <el-form-item label="航线">
              <cargo-advance-select
                :url="url.dmn.terminologyByType"
                :method-params="{termCode:'SEALINE'}"
                :callback-params="{key:'lineCode'}"
                :defaultValue="oneSeaport.lineCode"
                :headers="['中文名称','CODE']"
                :fields="['chineseName','code']"
                tag-name="code"
                tag-value="code"
                callback-method-type="value"
                options-width="200px"
                style="width:205px;"
                @parentCallBack="oneSeaport.lineCode = $event.value"
              />
            </el-form-item>
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="时区">
              <el-input-number v-model="oneSeaport.timeZone" :precision="2" :step="0.5" :max="20" :min="-20" size="mini"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="oneSeaport.longitude" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="oneSeaport.latitude" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-permission="['mdm:seaport:update']" size="mini" type="primary" @click="submitSeaPort()">确定</el-button>
        <el-button size="mini" @click="isShowingSeaportForm = false">取消</el-button>
        <!--<el-button size="mini" type="primary" @click="submitSeaPortAndContinue">保存并继续</el-button>-->
      </span>
    </el-dialog>

    <el-dialog :visible.sync="isShowingAddSeaportForm" v-if="isShowingAddSeaportForm" title="海运港口" width="500px" :close-on-click-modal="false">
      <el-form :model="addSeaPortForm" :rules="addSeaPortFormRule" ref="addSeaPortFormRef" label-width="90px" label-position="left">
        <el-form-item label="港口" prop="seaport">
          <type-select v-model="addSeaPortForm.seaport" type="addSeaport" :multiple="true"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-permission="['mdm:seaport:update']" size="mini" type="primary" @click="submitAddSeaPort()" :loading="addBtnLoading">确定</el-button>
        <el-button size="mini" @click="isShowingAddSeaportForm = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { getSeaPortList, getSeaPortById, batchDelSeaPort, switchSeaPortStatus, saveSeaPort, delSeaPort, addSeaPortApi } from '@/api/seaport'
import { getCountryList } from '@/api/country'
import { getDivisionList } from '@/api/division'
import seaportOperateButtonCellRendererFramework from './CellRendererFramework/seaportOperateButtonCellRendererFramework'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import URL from '@/api/urlTranslator'

import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'

export default {
  name: 'SeaPort',
  components: { AgGridVue, seaportOperateButtonCellRendererFramework, cargoAdvanceSelect, cargoLimitedSelect },
  data() {
    let validateNumber = async(rule, value, callback) => {
      let reg = /^[+]?(([0-9]\d*)|([0-9]\d*\.[0-9]{1,5}))$/
      if (value && !reg.test(value)) {
        callback(new Error('输入整数或五位小数'))
      } else {
        callback()
      }
    }
    return {
      seqNo: 1,
      dialogInitData: {
        cityList: [],
        regionList: [],
        countryList: []
      },
      searchConditions: {
        countryCode: '',
        code5: '',
        englishName: '',
        lineCode: ''
      },
      gridOptions: {},
      columnDefs: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      rowData: [],
      isShowingMoreSearchCondition: false,
      isShowingSeaportForm: false,
      oneSeaport: { id: '', subdivisionId: '', lineCode: '', chineseName: '', countryCode: '', cityId: '', englishName: '', code3: '', code5: '', bInland: '', seqNo: '',timeZone: 0, latitude:'',longitude:'' },
      oneSeaportRules:{
        latitude:[ {validator: validateNumber, trigger: 'blur'}],
        longitude:[ {validator: validateNumber, trigger: 'blur'}],
      },
      initOneSeaport: { id: '' },
      isShowingAddSeaportForm: false,
      addSeaPortForm:{
        seaport: []
      },
      addSeaPortFormRule:{
        seaport:[{required: true, message: '港口必填'}]
      },
      addBtnLoading: false
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  created() {
    const self = this
    self.initOneSeaport = { ...(self.oneSeaport) }
    self.gridOptions = {
      rowClassRules: {
        'grid-row-zebra-even': function(params) {
          return !(params.rowIndex % 2)
        },
        'grid-row-zebra-odd': function(params) {
          return (params.rowIndex % 2)
        }
      },
      context: {
        componentParent: self
      }
    }
    this.columnDefs = [
      // {
      //   headerName: '选择', width: 55, checkboxSelection: true, pinned: 'left',
      //   suppressSorting: true, suppressMenu: true, suppressSizeToFit: true, suppressResize: true
      // },
      {
        headerName: '国家',
        field: 'countryCode',
        cellRenderer: params => {
          // 国家Flag 还是使用 SVG模式
          const iconName = params.value
          return `<svg class="svg-icon" aria-hidden="true" style="height:1.1em;width:1.1em;">
                <use xlink:href="#icon-${iconName}"></use>
              </svg>${params.data.countryName}`
        }
      }, {
        headerName: '是否启用',
        field: 'bActive',
        cellRenderer: params => {
          // const iconName = !params.data.bActive ? 'grid-icon-enabled' : 'grid-icon-disabled'
          // const color = params.data.bActive ? '#67c23a' : '#e6a23c'
          // return `<svg class="svg-icon" fill="${color}" aria-hidden="true" style="height:1.1em;width:1.1em;">
          //       <use xlink:href="#icon-${iconName}"></use>
          //     </svg>`
          const iconName = !params.data.bActive ? 'icon-zanting' : 'icon-bofang'
          const color = params.data.bActive ? '#67c23a' : '#e6a23c'
          return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 12px;"></i>`
        }
      }, {
        headerName: '海运五字码',
        field: 'code5'
      }, {
        headerName: '港口名称',
        field: 'englishName'
      }, {
        headerName: '港口名称(中)',
        field: 'chineseName'
      }, {
        headerName: '区域代码',
        field: 'subdivisionId',
        hide: true
      }, {
        headerName: '航线',
        field: 'lineCode'
      }, {
        headerName: '港口代码',
        field: 'code3',
        hide: true
      }, {
        headerName: '创建人',
        field: 'createBy',
        hide: true
      }, {
        headerName: '创建日期',
        field: 'createByTime',
        hide: true
      }, {
        headerName: '更新人',
        field: 'updateBy',
        hide: true
      }, {
        headerName: '更新日期',
        field: 'updateByTime',
        hide: true
      }, {
        headerName: '操作', pinned: 'right', field: `bActive`, width: 400,
        cellRendererFramework: 'seaportOperateButtonCellRendererFramework'
      }]
  },
  beforeMount() {
    this.fetchSeaPortList()
  },
  mounted() {

  },
  methods: {
    createPort(){
      this.addSeaPortForm.seaport = []
      this.isShowingAddSeaportForm = true
    },

    submitAddSeaPort(){
      this.$refs.addSeaPortFormRef.validate(valid => {
        if(valid){
          var ids = []
          this.addSeaPortForm.seaport.forEach(function (v) {
            ids.push(v)
          })
          this.addBtnLoading = true
          return addSeaPortApi(ids).then(res => {
            this.isShowingAddSeaportForm = false
            this.addBtnLoading = false
            this.$message({ message: '保存海港信息成功', type: 'success' })
          }).then(() => {
            this.addBtnLoading = false
            this.fetchSeaPortList()
          })
        }
      })
    },
    onReady(params) {
      const self = this
      this.gridApi = params.api
      // params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          // params.api.sizeColumnsToFit()
          self.onFirstDataRendered(self.gridOptions)
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
    handleseqNoChange() {

    },
    getSeaPortSelected() {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      if (selectedRows.length <= 0) {
        this.$message.warning('没有选择数据')
        return null
      }
      console.log('海港 选中数量:', selectedRows.length)
      return selectedRows
    },
    fetchSeaPortList() {
      const self = this
      getSeaPortList(this.searchConditions).then(res => {
        if (res.ok) {
          self.rowData = res.content.list
        }
      })
    },
    toQuery() {
      this.fetchSeaPortList()
    },
    batchDelSeaPort() {
      const self = this
      const ids = this.getSeaPortSelected()
      if (ids) {
        const idsArr = []
        ids.forEach((item, index) => {
          idsArr.push(item.id)
        })
        this.$confirm('你确定要删除选中的记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDelSeaPort(ids).then(res => {
            if (res.ok) {
              self.fetchSeaPortList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'info',
                message: '删除失败!'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    delSeaPort(id) {
      // const self = this
      delSeaPort(id).then(res => {
        // self.$message({ type: 'info', message: '删除成功' })
      }).then(() => {
        this.fetchSeaPortList()
      })
    },
    popSeaPortFormDialog(id) {
      const self = this
      Promise.all([getCountryList(), getDivisionList(2)]).then(results => {
        const countryRes = results[0]
        const cityRes = results[1]
        if (id) {
          getSeaPortById(id).then(res => {
            if(res.ok) {
              self.oneSeaport = res.content
              self.isShowingSeaportForm = true
            }
          })
        } else {
          self.oneSeaport = self.initOneSeaport
          self.isShowingSeaportForm = true
        }

        if (countryRes.ok) {
          this.dialogInitData.countryList = countryRes.content.list
        }
        if (cityRes.ok) {
          this.dialogInitData.cityList = cityRes.content.list
        }
      })
    },
    addSeaPort() {
      return saveSeaPort(this.oneSeaport).then(res => {
        this.isShowingSeaportForm = false
        this.$message({ message: '保存海港信息成功', type: 'success' })
      }).then(() => {
        this.fetchSeaPortList()
      })
    },
    editSeaPort() {
      const id = this.oneSeaport.id
      return saveSeaPort(this.oneSeaport, id).then(res => {
        this.isShowingSeaportForm = false
        this.$message({ message: '编辑海港信息成功', type: 'success' })
      }).then(() => {
        this.fetchSeaPortList()
      })
    },
    submitSeaPort() {
      if (this.oneSeaport.id) {
        return this.editSeaPort()
      } else {
        return this.addSeaPort()
      }
    },
    submitSeaPortAndContinue() {
      const self = this
      self.submitSeaPort().then(() => {
        self.popSeaPortFormDialog()
      }).catch(err => {
        self.$message.warning('保存并新增操作异常' + err)
      })
    },
    switchSeaPortStatus(id, bActive) {
      switchSeaPortStatus(id, bActive).then(res => {
        this.fetchSeaPortList()
      }).catch(() => {
        // this.$message.error(err)
      })
    },
    getValueFromChild(obj) {
      this.searchConditions[obj.key] = obj.value
    }
  }

}
</script>
<style>

</style>
