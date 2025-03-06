<template>
  <section class="tab-item-wrap">
    <section class="tab-item-info">
      <div class="input-info">
        <h6>{{$t('containerManager.releaseList.sailSchedule')}}: </h6>
        <div class="input-wrap">
          <el-input disabled size="mini" v-model="sailScheduleDate"></el-input>
        </div>
        <p style="width: 120px;"></p>
        <h6>{{$t('containerManager.releaseList.releasedContainerTypeQuantity')}}: </h6>
        <div class="input-wrap">
          <el-tooltip effect="dark" :content="portReleasedContainer" placement="top">
            <el-input disabled size="mini" v-model="portReleasedContainer"></el-input>
          </el-tooltip>
        </div>
      </div>
      <div class="input-info second-line">
        <h6>{{$t('containerManager.releaseDetailPort.planOnPort')}}: </h6>
        <div class="input-wrap">
          <el-tooltip effect="dark" :content="portContainerQuntity" placement="top">
            <el-input disabled size="mini" v-model="portContainerQuntity"></el-input>
          </el-tooltip>
        </div>
        <el-button class="flex-right-btn" type="primary" size="mini" @click="getStorageFromPort">{{$t('containerManager.releaseDetailPort.loadAmount')}}</el-button>
        <h6>{{$t('containerManager.releaseList.yardCode')}}: </h6>
        <div class="input-wrap">
          <!-- <el-input size="mini" v-model="yardCode"></el-input> -->
          <el-select
            v-model="yardCode"
            filterable
            remote
            reserve-keyword
            clearable
            :placeholder="$t('common.placeholder')"
            :remote-method="filterYardList"
            :loading="remoteLoading"
            size='mini'>
            <el-option
              v-for="item in yardList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button
          class="flex-right-btn"
          :disabled="this.yardCode.length === 0"
          type="primary"
          size="mini"
          @click="pushReleaseDraftInfos">
          添加
        </el-button>
      </div>
    </section>
    <div :class="['subtable-wrap', {'invalidated': validateError}]">
      <el-table :data="tab.releaseDraftInfos" :key="tableKey">
        <el-table-column prop="portCode" :label="$t('containerManager.port')" fixed="left"></el-table-column>
        <el-table-column prop="yardCode" :label="$t('containerManager.releaseDetailPort.yard')" fixed="left"></el-table-column>
        <el-table-column prop="storageQuantity" :label="$t('containerManager.releaseDetailPort.containerAmount')">
          <template slot-scope="scope">
            {{scope.row.storageQuantity ? scope.row.storageQuantity : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="storageContainerType" :label="$t('containerManager.typeAndAmount')" width="160px">
          <template slot-scope="scope">
            {{scope.row.storageContainerType ? scope.row.storageContainerType : ''}}
          </template>
        </el-table-column>
        <el-table-column v-for="(item, cindex) in tab.requireContainerList" :prop="item.containerType" :label="item.containerType" :key="item.containerType + cindex">
          <template slot-scope="scope">
            <NumberInput
              v-show="scope.row.modifying"
              v-model="scope.row[item.containerType]"
              :disabled="scope.row[item.containerType] === null"
              limitType="int"
              :limitRange="{digits: 3, decimal: 0}" />
            <span v-show="!scope.row.modifying">
              {{scope.row[item.containerType] | filterNumber}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="releaseSort" :label="$t('containerManager.releaseList.releaseOrder')">
          <template
            slot="header"
            slot-scope="{ column }">
            <span style="color: red;">*</span>
            {{column.label}}
          </template>
          <template slot-scope="scope">
            <NumberInput
              v-show="scope.row.modifying"
              v-model="scope.row.releaseSort"
              limitType="positive"
              :limitRange="{digits: 3, decimal: 0}" />
            <span v-show="!scope.row.modifying">
              {{scope.row.releaseSort ? scope.row.releaseSort : ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="portCode" :label="$t('common.operation')" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" v-show="!scope.row.modifying && (scope.row.storageQuantity !== null) && scope.row.storageQuantity > 0" @click="modifyQuantity(scope.row)" style="margin-right: 10px;">{{$t('common.editBtn')}}</el-button>
            <el-button type="text" v-show="!scope.row.modifying" @click="deleteRow(scope.row, scope.$index)" style="margin-left: 0;">{{$t('common.deleteBtn')}}</el-button>
            <el-button type="text" v-show="!scope.row.modifying" @click="getStorageFromYard(scope.$index, scope.row.yardCode)">{{$t('containerManager.releaseDetailPort.updateAmount')}}</el-button>
            <el-button type="text" v-show="scope.row.modifying" @click="saveModify(scope.$index, scope.row)" style="margin-left: 0;">{{$t('common.saveBtn')}}</el-button>
            <el-button type="text" v-show="scope.row.modifying" @click="cancelModify(scope.row)">{{$t('common.cancelBtn')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <p class="error-message" v-show="validateError">{{errorMessage}}</p>
  </section>
</template>
<script>
  import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
  import { deepClone } from '@/utils'
  import { getStorageApi, deleteYardDataApi } from '@/api/containerReleasedList'
  import { getContainerYardListApi } from '@/api/containerManager'
  export default {
    name: 'ReleaseDetailPort',
    components: {
      NumberInput
    },
    props: {
      value: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        yardCode: '',
        modifying: false,
        tplOjb: null,
        validateError: false,
        errorMessage: '',
        remoteLoading: false,
        yardList: [],
        preloadYard: null,
        isOutsideYard: false
      }
    },
    watch: {
    },
    computed: {
      tab: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      sailScheduleDate() {
        return this.tab.sailSchedule ? this.$moment(Number(this.tab.sailSchedule)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      portReleasedContainer() {
        return this.tab.portReleasedContainerList ? this.tab.portReleasedContainerList.map(item => `${item.containerType}x${item.quantity}`).join(',') : ''
      },
      containerSize() {
        return this.tab.releaseDraftInfos ? this.tab.releaseDraftInfos : []
      },
      currPortCode() {
        return this.tab.portCode
      },
      portContainerQuntity() {
        return this.tab.requireContainerList ? this.tab.requireContainerList.map(item => `${item.containerType}x${item.quantity}`).join(',') : ''
      },
      isModifyDraft() {
        return this.$route.query.type === 'edit'
      },
      tableKey() {
        return `tableKey${this.tab.releaseDraftInfos.length}`
      }
    },
    filters: {
      filterNumber(_number) {
        return _number ? _number : 0
      }
    },
    methods: {
      async getStorageFromPort() {
        this.isOutsideYard = false
        this.loading = true
        const res = await getStorageApi({portCode: this.tab.portCode})
        if (res.ok && res.content) {
          // 更新存量及箱型箱量
          res.content.forEach(item1 => {
            let isMerged = false
            this.tab.releaseDraftInfos.forEach(item2 => {
              if (item1.yardCode === item2.yardCode) {
                item2.storageQuantity = item1.storageQuantity
                item2.storageContainerType = item1.storageContainerType
                isMerged = true
              }
            })
            if (!isMerged) {// 新数据
              item1.modifying = false
              const newRow = deepClone(item1)
              // 初始化行对象
              this.initListObj(item1, newRow)
            }
          })
        }
        if (this.tab.releaseDraftInfos.length === 0) {
          this.$message.warning(this.$t('containerManager.releaseDetailPort.includeContainerTypeInvalid'))
        }
        this.loading = false
      },
      async filterYardList(query) {
        this.remoteLoading = true
        if (query.length > 1) {
          const res = await getContainerYardListApi({yardCode: query})
          if (res.ok) {
            this.yardList = res.content.map(item => ({
                label: item.code,
                value: item.code
              }))
          }
        }
        this.remoteLoading = false
      },
      pushReleaseDraftInfos() {
        const exsitYard = this.tab.releaseDraftInfos.filter(item => item.yardCode === this.yardCode)
        if (exsitYard.length > 0) {
          this.$message.warning(this.$t('containerManager.releaseDetailPort.duplicateYard'))
        } else {
          this.getStorageFromYard()
        }
      },
      async getStorageFromYard(_index = null, yardCode = this.yardCode) { // 获取当前堆场存箱量
        this.isOutsideYard = true
        this.loading = true
        const res = await getStorageApi({yardCode: yardCode})
        if (res.ok && res.content) {
          // 更新存量及箱型箱量
          if (res.content.length > 0) {
            const _yard = deepClone(res.content[0])
            if (_index !== null) { // 更新
              this.tab.releaseDraftInfos[_index].storageQuantity = _yard.storageQuantity
              this.tab.releaseDraftInfos[_index].storageContainerType = _yard.storageContainerType
            } else { // 新数据
              const newRow = deepClone(_yard)
              newRow.modifying = false
              // newRow.showRefresh = true
              // 初始化行对象
              this.initListObj(_yard, newRow, true)
              // this.tab.releaseDraftInfos.push(this.preloadYard)
            }
          } else {
            this.$message.warning(this.$t('containerManager.modifyRelease.yardDataError'))
          }
        } else {
          this.$message.warning(this.$t('containerManager.modifyRelease.yardDataError'))
        }
        this.loading = false
      },
      // setPreloadYard(_storageQuantity = null, _storageContainerType = '') {
      //   // 生成要添加的新堆场记录
      //   this.preloadYard = {
      //     releaseInfoId: '',
      //     portCode: this.tab.portCode,
      //     yardCode: this.yardCode,
      //     storageQuantity: _storageQuantity,
      //     storageContainerType: _storageContainerType,
      //     modifying: false
      //   }
      // },
      initListObj(originObj, newObj) {
        // 堆场包含的箱型是否满足当前需求箱型
        let include_count = 0
        this.tab.requireContainerList.forEach(item1 => {
          originObj.containerList.forEach(item2 => {
            if (item2.containerType === item1.containerType && item2.quantity > 0) {
              include_count++
            }
          })
        })
        if (include_count === 0) {
          if (this.isOutsideYard) {// 外部堆场不满足箱型箱量条件
            this.$message.warning(this.$t('containerManager.releaseDetailPort.includeContainerTypeInvalid'))
          }
          return false
        }
        newObj.releaseSort = null
        newObj.portCode = this.currPortCode
        newObj.oriContainerList = originObj.containerList
        newObj.oriContainerList.forEach(item => {
          newObj[item.containerType] = 0
        })
        this.tab.releaseDraftInfos.push(newObj)
      },
      modifyQuantity(_obj) {// 修改行数据
        if (this.modifying) {
          this.$message.warning(this.$t('containerManager.modifyRelease.editTips'))
          return false
        } else {
          this.tplOjb = deepClone(_obj) // 深拷贝原值
          this.$set(_obj, 'modifying', true)
          this.modifying = true
        }
      },
      saveModify(_index, _obj) { // 保存行数据的修改
        if (this.checkRowInfo(_index, _obj)) {
          this.$set(_obj, 'modifying', false)
          this.modifying = false
          // 如果是编辑草稿，则请求接口提交数据
          if (this.isModifyDraft) {
            // 重置提交的数据格式
            this.serializeModifyDataInfo(_obj)
          }
        }
      },
      checkRowInfo(_index, _obj) { // 验证行数据
        if (!_obj.storageQuantity) {
          this.validateError = true
          this.errorMessage = this.$t('containerManager.releaseDetailPort.containerAmountEmptyInvalid')
          return false
        } else {
          // 验证对应箱型填写数量是否超过当前堆场数量
          // const containerCount = _obj.containerList.filter(item => {
          //   return Number(_obj[item.containerType]) > Number(item.quantity)
          // })
          // if (containerCount.length > 0) {
          //   this.validateError = true
          //   this.errorMessage = '对应箱型存在超放'
          //   return false
          // }

          // 验证排序
          if (!_obj.releaseSort) {
            this.validateError = true
            this.errorMessage = this.$t('containerManager.releaseDetailPort.releasedOrderEmptyInvalid')
            return false
          }

          const sortError = this.tab.releaseDraftInfos.filter((item, index) => item.releaseSort === _obj.releaseSort && index !== _index)
          if (sortError.length > 0) {
            this.validateError = true
            this.errorMessage = this.$t('containerManager.releaseDetailPort.releasedOrderEmptyInvalid')
            return false
          }
        }

        this.validateError = false
        this.errorMessage = ''
        return true
      },
      serializeModifyDataInfo(_obj) {
        // 整理要提交的数据格式
        const arr = []
        let count = 0
        _obj.containerList.forEach(item => {
          if (_obj[item.containerType]) {
            arr.push({
              containerType: item.containerType,
              quantity: _obj[item.containerType]
            })
          }
          // item.quantity = _obj[item.containerType] ? _obj[item.containerType] : 0
          count += item.quantity
        })

        // 如果和为 0 则不能提交
        if (count === 0) {
          this.$message.warning(this.$t('containerManager.modifyRelease.numberInputEmptyInvalid'))
          return false
        }

        // 整理 releaseDraftInfos 数据
        const releaseDraftInfos = {
          sailRequirementId: this.tab.id,
          yardCode: _obj.yardCode,
          releaseSort: _obj.releaseSort,
          releaseContainerList: arr
        }
        const submitObj = {
          portRequireContainerList: this.tab.requireContainerList,
          releaseInfo: releaseDraftInfos,
          sailScheduleId: this.sailScheduleId
        }
        this.$attrs.saveModifyInfo(submitObj, _obj, this.tab.portCode)
      },
      deleteRow(obj, _index) { // 删除行
        this.$confirm(this.$t('common.deleteWarnningTips'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.deleteBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          confirmButtonClass: 'el-button--danger',
          type: 'warning'
        }).then(async () => {
          if (this.isModifyDraft) {
            // 如果是编辑草稿，调用删除接口
            const deleteObj = {
              sailRequirementIds: this.$attrs.sailRequirementIdList,
              sailRequirementId: this.tab.id,
              yardCode: obj.yardCode
            }
            const deleteRes = await deleteYardDataApi(deleteObj)
            if (deleteRes && deleteRes.ok) {
              // 如果删除成功
              this.tab.releaseDraftInfos.splice(_index, 1)
              if (deleteRes.content === false) {
                this.showNonBatch()
              }
            }
          } else {
            this.tab.releaseDraftInfos.splice(_index, 1)
          }
          // 记录重新渲染前的 scrollTop
          const _scroll = document.querySelector('.right-main-wrapper').scrollTop
          this.$nextTick(() => {
            // 表格重新选然后，滚动到原来的 scrollTop
            document.querySelector('.right-main-wrapper').scrollTop = _scroll
          })
        }).catch(() => {})
      },
      cancelModify(_obj) {// 取消行编辑，恢复上次保存的值
        this.$confirm(this.$t('containerManager.modifyRelease.dropWarnningTips'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.dropEditBtn'),
          cancelButtonText: this.$t('containerManager.modifyRelease.thinkOver'),
          confirmButtonClass: 'el-button--danger',
          type: 'warning'
        }).then(() => {
          // 恢复上一次的箱型箱量
          this.setLastInfo(_obj)
        }).catch(() => {})
      },
      showNonBatch() {
        this.$alert(this.$t('containerManager.releaseDetailPort.batchDeletedSuccessTips'), this.$t('common.tips'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('containerManager.releaseDetailPort.confirmAndBackBtn'),
          callback: () => {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push({name: 'ReleasedList', query: {refresh: true}})
          }
        })
      },
      setLastInfo(_obj) {
        this.tplOjb.oriContainerList.forEach(item => {
          _obj[item.containerType] = this.tplOjb[item.containerType]
        })
        this.$set(_obj, 'releaseSort', this.tplOjb.releaseSort)
        this.$set(_obj, 'modifying', false)
        this.modifying = false
        this.validateError = false
        this.errorMessage = ''
      }
    },
    created() {
    },
    mounted() {}
  }
</script>
<style scoped lang="scss">
  .tab-item-info{
    min-width: 800px;
  }
  .input-info{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 50px;
    h6{
      width: 100px;
      text-align: right;
      font-weight: normal;
    }
    .input-wrap{
      margin-left: 10px;
    }
    .flex-right-btn{
      margin: 0 20px;
    }
  }
  .subtable-wrap{
    width: 1200px;
    margin-top: 20px;
    border: 1px solid white;
    &.invalidated{
      border: 1px solid red;
    }
  }
  .error-message{
    font-size: 13px;
    margin: 5px 0;
    color: red;
  }
  .danger{
    color: #fff;
    background: #f56c6c;
    border: 1px solid #f56c6c;
  }
  .remark-span{
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
