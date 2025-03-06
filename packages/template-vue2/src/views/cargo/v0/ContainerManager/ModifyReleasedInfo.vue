<template>
  <div class="right-main-wrapper" style="padding-top: 20px;">
    <section class="section-wrap">
      <el-form :model="infoForm" :inline="true" label-width="100px" size="mini">
        <el-form-item :label="`${$t('containerManager.vesselName')}: `" props="vesselName">
          <el-input v-model="infoForm.vesselName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.voyageNo')}: `" props="voyageNo">
          <el-input v-model="infoForm.voyageNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.vesselOwner')}: `" props="vesselOwner">
          <el-input v-model="infoForm.vesselOwner" disabled></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.modifyRelease.requirementContainerList')}: `" props="requirementContainerList">
          <el-tooltip effect="dark" :content="requirementContainer" placement="top">
            <el-input v-model="requirementContainer" disabled></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.modifyRelease.releasedContainerList')}: `" props="releasedContainerList">
          <el-tooltip effect="dark" :content="releasedContainer" placement="top">
            <el-input v-model="releasedContainer" disabled></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.modifyRelease.remark')}: `" props="remark" v-show="$route.query.sailType === '2'">
          <div class="inline-textarea-wrap">
            <el-input class="inline-textarea" size="mini" v-model="infoForm.remark" type="textarea" :rows="3"></el-input>
            <el-button class="inline-right-btn" type="primary" size="mini" @click="ModifyTopInfo" v-show="isModifyDraft">{{$t('common.submitBtn')}}</el-button>
          </div>
        </el-form-item>
        <!-- <el-form-item v-show="$route.query.sailType == '2' && isModifyDraft">
          <el-button class="inline-right-btn" type="primary" size="mini" @click="ModifyTopInfo">{{$t('common.submitBtn')}}</el-button>
        </el-form-item> -->
      </el-form>
    </section>
    <el-divider></el-divider>
    <section class="port-info">
      <el-tabs v-model="activeName" :before-leave="validateSwitchTab">
        <el-tab-pane v-for="(tab, name) in infoForm.sailRequirementInfos" :label="tab.portCode" :name="tab.portCode" :key="tab.portCode">
          <ReleaseDetailPort :ref="`releaseDetailPort-${tab.portCode}`" v-model="infoForm.sailRequirementInfos[name]" :saveModifyInfo="saveModifyInfo" :sailRequirementIdList="sailRequirementIdList" />
        </el-tab-pane>
      </el-tabs>
    </section>
    <section class="form-btn">
      <el-button type="primary" size="mini" @click="createInfo" v-show="!isModifyDraft">{{$t('common.submitBtn')}}</el-button>
      <el-button type="default" size="mini" @click="dropModify" style="margin-left: 20px;" v-show="!isModifyDraft">{{$t('common.cancelBtn')}}</el-button>
      <el-button type="primary" size="mini" @click="dropModify" style="margin-left: 20px;" v-show="isModifyDraft">{{$t('common.returnBtn')}}</el-button>
    </section>
  </div>
</template>
<script>
  import { getReleasedInfoApi, submitCreateReleasedApi, submitModifyReleasedApi, getStorageApi, submitModifyReleasedRemarkApi } from '@/api/containerReleasedList'
  import ReleaseDetailPort from './components/ReleaseDetailPort'
  export default {
    name: 'ModifyReleasedInfo',
    components: {
      ReleaseDetailPort
    },
    data() {
      return {
        vm: this,
        loading: false,
        activeName: '',
        requirementContainer: '',
        releasedContainer: '',
        infoForm: {
          batchNo: '',
          vesselName: '',
          voyageNo: '',
          vesselOwner: '',
          requirementContainerTypeQuantity: '',
          releasedContainerTypeQuantity: '',
          remark: '',
          sailScheduleId: '',
          sailRequirementInfos: [
            {
              requirementContainerList: [],
              sailRequirementId: '',
              portCode: '',
              containerTypeQuantity: '',
              sailSchedule: null,
              releaseDraftInfos: [
                {
                  releaseInfoId: '',
                  portCode: '',
                  yardCode: '',
                  containerType: '',
                  quanityty: '',
                  releaseSort: ''
                }
              ]
            }
          ]
        }
      }
    },
    computed: {
      sailScheduleId() {
        return this.$route.params.sailScheduleId
      },
      isModifyDraft() {
        return this.$route.query.type === 'edit'
      },
      sailRequirementIdList() {
        return this.infoForm.sailRequirementInfos.map(item => item.id)
      }
    },
    filters: {
      filterDate(val, vm) {
        return vm.$moment(val).format('YYYY-MM-DD')
      },
      filterTime(val, vm) {
        return vm.$moment(val).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      // 切换tab时验证
      validateSwitchTab(activeName, oldActiveName) {
        const curr_tab = this.$refs[`releaseDetailPort-${oldActiveName}`]
        if (curr_tab && curr_tab[0].modifying) {
          this.$message.warning(this.$t('containerManager.modifyRelease.editTips'))
          return false
        }
        return true
      },
      // 编辑草稿时，获取最新数据
      async getReleasedInfo () {
        this.loading = true
        const res = await getReleasedInfoApi(this.sailScheduleId)
        if (res.ok) {
          this.infoForm = res.content
          this.requirementContainer = this.containerArrayFilter(this.infoForm.requirementContainerList)
          this.releasedContainer = this.containerArrayFilter(this.infoForm.releasedContainerList)
          this.activeName = this.infoForm.sailRequirementInfos[0].portCode
          this.infoForm.sailRequirementInfos.forEach(item => {
            if (item.releaseDraftInfos) {
              item.releaseDraftInfos.forEach((item1, index) => {
                item.modifying = false
                this.refreshStorageFromYard(item1, item.portCode)
              })
            }
          })
        }
        this.loading = false
      },
      // 编辑时获取堆场最新存量
      // 需要在父组件中调用，由于route-view的原因，在子组件中调用时，会执行多次，导致数据错误
      async refreshStorageFromYard(currObj, portCode) { // 获取当前堆场存箱量
        this.loading = true
        const res = await getStorageApi({yardCode: currObj.yardCode})
        if (res.ok && res.content) {
          // 更新存量及箱型箱量
          if (res.content.length > 0) {
            const _yard = res.content[0]
            // 设置草稿数据
            this.$set(currObj, 'storageQuantity', _yard.storageQuantity)
            this.$set(currObj, 'storageContainerType', _yard.storageContainerType)
            this.$set(currObj, 'oriContainerList', currObj.releaseContainerList)
            // if (!_yard.portCode || _yard.portCode != portCode){ // 非港口关联堆场显示刷新按钮
            //   this.$set(currObj, 'showRefresh', true)
            // }
            this.$set(currObj, 'portCode', portCode)

            // 获取全部箱型
            _yard.containerList.forEach(item => {
              this.$set(currObj, `${item.containerType}`, 0)
            })

            // 设置已放过箱的对应箱型
            currObj.releaseContainerList.map(item => {
              this.$set(currObj, `${item.containerType}`, item.quantity)
            })

            // 设置当前堆场中各箱型的可放箱数量
            this.$set(currObj, 'containerList', _yard.containerList)

            // 设置已保存过的放箱数量
            const oriArr = _yard.containerList.map(item => {
              let _data = {
                containerType: item.containerType,
                quantity: currObj[item.containerType]
              }
              return _data
            })
            this.$set(currObj, 'oriContainerList', oriArr)
          } else {
            this.$message.warning(this.$t('containerManager.modifyRelease.yardDataError'))
          }
        }
        this.loading = false
      },
      containerArrayFilter(arr) { // 格式化箱型箱量
        if (arr && arr.length > 0) {
          return arr.map(item => `${item.containerType}x${item.quantity}`).join(',')
        }
        return ''
      },
      async createInfo() { // 提交表单
        if (this.checkRowModifying() && this.validateInof()) {
          // 设置每个tab下containerList每行的箱型数量
          this.setContainerListQuantity()

          // 是否所有数据都为0
          const canbeSubmit = this.infoForm.sailRequirementInfos.filter(item => {
            if (item.canbeSubmit) {
              return true
            }
          })
          if (canbeSubmit && canbeSubmit.length > 0) {
            this.$message.warning(this.$t('containerManager.modifyRelease.numberInputEmptyInvalid'))
            return false
          }

          // 组合成接口需要的对象形式
          let releaseInfos = []
          this.infoForm.sailRequirementInfos.forEach(item1 => {
            const obj = {
              sailRequirementId: item1.id,
              portCode: item1.portCode,
              portRequireContainerList: item1.requireContainerList,
              releaseDraftInfos: item1.releaseDraftInfos
            }
            releaseInfos.push(obj)
          })

          const batchNo = this.infoForm.batchNo ? this.infoForm.batchNo : ''

          // 开始提交
          this.loading = true
          const res = await submitCreateReleasedApi({releaseInfos: releaseInfos, sailScheduleId: this.infoForm.sailScheduleId, remark: this.infoForm.remark})

          if (res.ok) {
            this.$message.success(this.$t('containerManager.modifyRelease.saveReleasedDraftSuccess'))
            this.backToList('refresh')
          }

          // let res = null
          // if (this.$route.query.type == 'create') {
          //   res = await submitCreateReleasedApi({releaseInfos: releaseInfos, remark: this.infoForm.remark})
          // } else {
          //   res = await submitModifyReleasedApi({releaseInfo: releaseInfos, batchNo: batchNo, sailRequirementIds: this.sailRequirementIdList, sailScheduleId: this.infoForm.sailScheduleId, remark: this.infoForm.remark})
          // }
          this.loading = false
        }
      },
      checkRowModifying() {
        // 是否有正在编辑的行
        let modify_count = 0
        this.infoForm.sailRequirementInfos.forEach(item1 => {
          item1.releaseDraftInfos.forEach(item2 => {
            if (item2.modifying) {
              modify_count++
            }
          })
        })

        if (modify_count > 0) {
          this.$message.warning(this.$t('containerManager.modifyRelease.editTips'))
          return false
        }
        return true
      },
      validateInof() {
        // 验证放箱顺序
        let unsort = 0
        this.infoForm.sailRequirementInfos.forEach(item1 => {
          item1.releaseDraftInfos.forEach(item2 => {
            if (item2.releaseSort === null || item2.releaseSort === '') {
              unsort++
            }
          })
        })

        if (unsort > 0) {
          this.$message.warning(this.$t('containerManager.modifyRelease.releaseOrderInvalid'))
          return false
        }
        return true
      },
      setContainerListQuantity() { // 设置containerList中的每个箱型的数量
        this.infoForm.sailRequirementInfos.forEach(item1 => {
          item1.releaseDraftInfos.forEach(item2 => {
            let count = 0
            const arr = []
            item2.containerList.forEach(item3 => {
              if (item2[item3.containerType]) {
                arr.push({
                  containerType: item3.containerType,
                  quantity: item2[item3.containerType]
                })
              }
              // item3.quantity = item2[item3.containerType] ? item2[item3.containerType] : 0
              count += item3.quantity
            })

            item2.releaseContainerList = arr

            if (count === 0) {
              item1.canbeSubmit = true
            } else {
              item1.canbeSubmit = false
            }
          })
        })
      },
      dropModify() {
        if (this.isModifyDraft) { // 编辑草稿
          // 关闭标签，返回列表页
          this.backToList()
        } else { // 新建放箱
          this.$confirm(this.$t('containerManager.modifyRelease.dropWarnningTips'), this.$t('common.tips'), {
            confirmButtonText: this.$t('common.dropEditBtn'),
            cancelButtonText: this.$t('containerManager.modifyRelease.thinkOver'),
            confirmButtonClass: 'el-button--danger',
            type: 'warning'
          }).then(() => {
            // 关闭标签，返回列表页
            this.backToList()
          }).catch(() => {})
        }
      },
      // 单独提交remark
      async ModifyTopInfo() {
        const _obj = {
          remark: this.infoForm.remark,
          sailScheduleId: this.infoForm.sailScheduleId
        }
        const res = await submitModifyReleasedRemarkApi(_obj)
        if (res.ok) {
          this.$message.success(this.$t('containerManager.modifyRelease.saveRemarkSuccess'))
        }
      },
      // 编辑草稿时，单个保存编辑的数据
      async saveModifyInfo(obj, oriObj, portCode) {
        const batchNo = this.infoForm.batchNo ? this.infoForm.batchNo : ''
        // 开始提交
        this.loading = true
        const res = await submitModifyReleasedApi({...obj, batchNo: batchNo, sailRequirementIds: this.sailRequirementIdList})
        // const res = await submitModifyReleasedApi({...obj, batchNo: batchNo, sailRequirementIds: this.sailRequirementIdList, sailScheduleId: this.infoForm.sailScheduleId, remark: this.infoForm.remark})

        if (res.ok) {
          this.$message.success(this.$t('containerManager.modifyRelease.saveReleasedDraftSuccess'))
        } else {
          const refName = `releaseDetailPort-${portCode}`
          this.$refs[refName][0].setLastInfo(oriObj)
        }
        this.loading = false
      },
      backToList(refresh = '') {
        this.$store.dispatch('tagsView/delView', this.$route)
        if (refresh === 'refresh') {
          this.$router.push({name: 'ReleasedList', query: {refresh: true}})
        } else {
          this.$router.push({name: 'ReleasedList'})
        }
      }
    },
    created() {},
    mounted() {
      this.getReleasedInfo()
    }
  }
</script>
<style scoped lang="scss">
.right-main-wrapper{
  overflow: hidden;
  overflow-y: auto;
}
.section-wrap{
  width: 100%;
  padding-top: 20px;
  form {
    width: 70%;
  }
}
.btn-wrap{
  width: 300px;
  margin: 30px auto;
}
.form-btn {
  width: 1200px;
  height: 60px;
  margin-top: 30px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: flex-start;
}
.inline-textarea-wrap{
  width: 500px;
}
.inline-textarea{
  width: 376px;
}
.inline-right-btn{
  display: inline-block;
  vertical-align: bottom;
  margin-left: 10px;
}
</style>
