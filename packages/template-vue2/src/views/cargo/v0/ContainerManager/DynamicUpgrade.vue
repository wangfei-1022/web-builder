<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-wrapper">
      <section class="info-section">
        <SectionTitle :title="$t('common.currentStatus')"></SectionTitle>
        <div class="info-content-wrap">
          <ul>
            <li v-for="(item, key) in dynamicDetail" :key="key" v-show="currInfoKeyName[key]">
              <span class="item-title">{{currInfoKeyName[key]}}</span>
              <span class="item-value" v-if="key === 'operationCode'">{{item | opreatorFilter(dynamicDetail.statusName)}}</span>
              <span class="item-value" v-else-if="key === 'operationTime'">{{item | dateFilter(vm)}}</span>
              <span class="item-value" v-else-if="key === 'emptyWeight'">{{item | emptyFilter}}</span>
              <span class="item-value" v-else-if="key === 'logContainerSituation'">{{item | statusFilter}}</span>
              <span class="item-value" v-else-if="key === 'vesselName'">
                <el-tooltip effect="dark" :content="item" placement="top">
                  <span class="tooltip-inner-span">{{item}}</span>
                </el-tooltip>
              </span>
              <span class="item-value" v-else>{{item}}</span>
            </li>
          </ul>
        </div>
      </section>
      <section class="info-section">
        <SectionTitle :title="$t('common.changeStatus')"></SectionTitle>
        <div class="info-content-wrap">
          <el-form ref="upgradeForm" :inline="true" :model="upgradeForm" label-width="100px" size="mini" :rules="upgradeFormRules">
            <el-form-item :label="`${$t('common.operation')}: `" prop="operationCode">
              <el-cascader
                v-model="operationSelected"
                :options="operationCodeList"
                :props="{ expandTrigger: 'hover' }" @change="setOpreator"></el-cascader>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.opreatorTime')}: `" required prop="operationTime">
              <CommonPicker
                v-model="upgradeForm.operationTime"
                :dependence-date="dependenceDate"
                parent-option="followingDependence"
                pickerFormat="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                size="mini"
                :clearable="false" />
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.operationYard')}: `" prop="operationYard">
              <el-select
                v-model="upgradeForm.operationYard"
                filterable
                remote
                :remote-method="filterYardList"
                :loading="remoteLoading"
                :placeholder="$t('common.placeholder')"
                @change="setOperationPort">
                <el-option
                  v-for="item in yardList"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.dynamicList.fullOrEmpty')}: `" prop="emptyWeight">
              <el-select
                v-model="upgradeForm.emptyWeight"
                :disabled="disableEmpty">
                <el-option
                  v-for="item in EFList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.vesselName')}: `" prop="vesselName">
              <el-input v-model="upgradeForm.vesselName" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.voyageNo')}: `" prop="voyageNo">
              <el-input v-model="upgradeForm.voyageNo" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.dynamicList.soNo')}: `" prop="soNo">
              <el-input v-model="upgradeForm.soNo" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.dynamicList.blNo')}: `" prop="blNo">
              <el-input v-model="upgradeForm.blNo" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.destinationPort')}: `" prop="destinationPort">
              <el-select
                v-model="upgradeForm.destinationPort"
                filterable
                remote
                :remote-method="filterPortCode"
                :loading="remoteLoading"
                :placeholder="$t('common.fiveCharCodePlaceholder')">
                <el-option
                  v-for="item in portList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.dynamicList.nextPort')}: `" prop="nextPort">
              <el-select
                v-model="upgradeForm.nextPort"
                filterable
                remote
                :remote-method="filterPortCode"
                :loading="remoteLoading"
                :placeholder="$t('common.fiveCharCodePlaceholder')">
                <el-option
                  v-for="item in portList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.containerSituation')}: ` " prop="logContainerSituation">
              <el-select
                v-model="upgradeForm.logContainerSituation">
                <el-option v-for="item in logContainerSituationList" :key="item.label" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.dynamicList.businessType')}: `" prop="businessType">
              <el-select v-model="upgradeForm.businessType">
                <el-option
                  v-for="item in businessTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('containerManager.remark')}: `" prop="remark">
              <el-input v-model="upgradeForm.remark" type="textarea" :rows="4" :cols="70" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" size="small" :loading="loading" :disabled="loading" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
          <el-button size="small" :disabled="loading" @click="backToList">{{$t('common.cancelBtn')}}</el-button>
        </div>
      </section>
    </section>
  </div>
</template>
<script>
  import SectionTitle from '@/components/Cargo/Common/sectionTitle'
  import {
    getDynamicUpgradeDetailApi,
    saveDynamicUpgradeApi,
    getOpreatorStatusListApi
  } from '@/api/containerDynamic'
  import { getContainerYardListApi } from '@/api/containerManager'
  import { seaportListApi } from '@/api/common'
  import { commonBusinessTypeList, commonEmptyWeightList, commonEmptyStatusArr, commonFullStatusArr, commonContainerSituationList } from './components/dynamicCommonList'
  export default {
    name: 'UpgradeDynamic',
    components: {
      SectionTitle
    },
    data() {
      const validateOperationTime = (rule, value, callback) => {
        if (!value || value === '') {
          callback(new Error(this.$t('containerManager.opreatorTimeEmptyInvalid')))
        }

        if (value <= Number(this.dynamicDetail.operationTime)) {
          callback(new Error(this.$t('containerManager.opreatorTimeErrorInvalid')))
        }

        callback()
      }
      return {
        vm: this,
        loading: false,
        remoteLoading: false,
        operationCodeList: [],
        operationSelected: [],
        disableEmpty: false,
        emptyStatusArr: commonEmptyStatusArr,
        fullStatusArr: commonFullStatusArr,
        upgradeForm: {
          containerId: '',
          statusName: '',
          operationCode: '',
          operationPort: '',
          operationTime: '',
          timeZone: 0,
          operationYard: '',
          operationYardName: '',
          emptyWeight: '',
          vesselName: '',
          voyageNo: '',
          soNo: '',
          blNo: '',
          destinationPort: '',
          nextPort: '',
          logContainerSituation: 1,
          remark: '',
          businessType: null,
          preOperationCode: null,
          preOperationYard: null
        },
        upgradeFormRules: {
          operationCode: [
            {required: true, message: this.$t('containerManager.operationEmptyInvalid'), trigger: 'change'}
          ],
          operationTime: [
            {validator: validateOperationTime, trigger: 'blur'}
          ],
          operationYard: [
            {required: true, message: this.$t('containerManager.operationYardEmptyInvalid'), trigger: 'change'}
          ],
          emptyWeight: [
            {required: true, message: this.$t('containerManager.fullAndEmptyInvalid'), trigger: 'change'}
          ],
          businessType: [
            {required: true, message: this.$t('containerManager.businessTypeEmptyInvalid'), trigger: 'change'}
          ],
          vesselName: [
            {required: true, message: this.$t('containerManager.vesselNameEmptyInvalid'), trigger: 'blur'}
          ],
          voyageNo: [
            {required: true, message: this.$t('containerManager.voyageNoEmptyInvalid'), trigger: 'blur'}
          ]
        },
        checkTimeErr: '',
        dynamicDetail: {},
        currInfoKeyName: {
          operationCode: `${this.$t('common.operation')}: `,
          emptyWeight: `${this.$t('containerManager.dynamicList.fullOrEmpty')}: `,
          soNo: `${this.$t('containerManager.dynamicList.soNo')}: `,
          blNo: `${this.$t('containerManager.dynamicList.blNo')}: `,
          operationYard: `${this.$t('containerManager.operationYard')}: `,
          operationTime: `${this.$t('containerManager.opreatorTime')}: `,
          vesselName: `${this.$t('containerManager.vesselName')}: `,
          voyageNo: `${this.$t('containerManager.voyageNo')}: `,
          destinationPort: `${this.$t('containerManager.destinationPort')}: `,
          nextPort: `${this.$t('containerManager.dynamicList.nextPort')}: `,
          logContainerSituation: `${this.$t('containerManager.containerSituation')}: `
        },
        logContainerSituationList: commonContainerSituationList,
        businessTypeList: commonBusinessTypeList,
        portList: [],
        yardList: [],
        EFList: commonEmptyWeightList
      }
    },
    computed: {
      dependenceDate: function() {
        return this.$moment(Number(this.dynamicDetail.operationTime)).add(-1, 'days').valueOf()
      }
    },
    watch: {
      "operationSelected": function(val) {
        if (val.some(item => this.emptyStatusArr.indexOf(item) >= 0)) {
          this.upgradeForm.emptyWeight = 1
          this.disableEmpty = true
        } else if (val.some(item => this.fullStatusArr.indexOf(item) >= 0)) {
          this.upgradeForm.emptyWeight = 2
          this.disableEmpty = true
        } else {
          this.upgradeForm.emptyWeight = null
          this.disableEmpty = false
        }
      }
    },
    filters: {
      opreatorFilter(val, status) {
        return `${status}/${val}`
      },
      dateFilter(val, vm) {
        return val ? vm.$moment(Number(val)).format('YYYY-MM-DD HH:mm') : ''
      },
      emptyFilter(val) {
        return val === 1 ? 'E' : 'F'
      },
      statusFilter(val) {
        return val === 1 ? 'AV' : 'DM'
      }
    },
    methods: {
      async getDetailInfo() {
        this.loading = true
        const res = await getDynamicUpgradeDetailApi(this.$route.params.id)
        if (res.ok) {
          this.dynamicDetail = res.content
          this.upgradeForm.preOperationYard = this.dynamicDetail.operationYard
          this.upgradeForm.preOperationCode = this.dynamicDetail.operationCode
          this.upgradeForm.containerId = this.dynamicDetail.containerId
          this.upgradeForm.timeZone = this.dynamicDetail.timeZone
        }
        this.loading = false
      },
      async getOpreatorStatusList() {
        const res = await getOpreatorStatusListApi()
        if (res.ok && res.content) {
          this.operationCodeList = res.content.map(item => {
            if (item.operationCodes) {
              const children = item.operationCodes.map(child => {
                let _data = {
                  label: child,
                  value: child
                }
                return _data
              })

              return {
                value: item.statusName,
                label: item.statusName,
                children
              }
            }
          })
        }
      },
      setOpreator(arr) {
        this.upgradeForm.statusName = arr[0]
        this.upgradeForm.operationCode = arr[1]
        if (arr[0] === this.$t('containerManager.onYardText') || arr[0] === this.$t('containerManager.onPortText')) {
          this.upgradeForm.operationYard = ''
          this.yardList = []
        }
      },
      async filterYardList(query) {
        this.remoteLoading = true
        if (query.length > 1) {
          const res = await getContainerYardListApi({yardCode: query})
          if (res.ok) {
            this.yardList = res.content.filter(item => {
              if (this.upgradeForm.statusName === this.$t('containerManager.onYardText')) {
                return item.yardType === 1
              } else if (this.upgradeForm.statusName === this.$t('containerManager.onPortText')) {
                return item.yardType === 2
              } else {
                return item
              }
            })
          }
        }
        this.remoteLoading = false
      },
      setOperationPort(val) {
        const _obj = this.yardList.filter(item => item.code === val)[0]
        this.upgradeForm.operationPort = _obj.portCode
        this.upgradeForm.operationYardName = _obj.name
      },
      async filterPortCode(query) {
        this.remoteLoading = true
        this.portList = []
        if (query.length > 1) {
          const res = await seaportListApi({keyword: query})
          if (res.ok) {
            this.portList = res.content.map(item => {
              let _data = {
                label: item.code5,
                value: item.code5
              }
              return _data
            })
          }
        }
        this.remoteLoading = false
      },
      validateForm() {
        this.$refs.upgradeForm.validate(valid => {
          if (valid) {
            this.submitForm()
          }
        })
      },
      backToList() {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({name: 'DynamicList', query: {refresh: true}})
      },
      async submitForm() {
        this.loading = true
        const res = await saveDynamicUpgradeApi(this.upgradeForm)
        if (res.ok) {
          this.$message({
            type: 'success',
            message: this.$t('containerManager.dynamicUpdateSuccess')
          })
          this.backToList()
        }
        this.loading = false
      }
    },
    mounted() {
      this.getDetailInfo()
      this.getOpreatorStatusList()
    },
    created() {}
  }
</script>
<style lang="scss" scoped>
  .right-main-wrapper{
    overflow: hidden;
    overflow-y: auto;
  }
  .info-content-wrap{
    max-width: 1000px;
    padding-top: 20px;
    ul {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      margin: 0;
      padding: 0;
      font-size: 14px;
      li{
        margin-left: 20px;
        height: 30px;
        line-height: 30px;
        width: 240px;
        .item-title{
          display: inline-block;
          width: 80px;
          text-align: right;
          vertical-align: middle;
        }
        .item-value{
          min-width: 80px;
          max-width: 140px;
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  ::v-deep.el-input--mini .el-input__inner{
    width: 179px;
  }
  .btn-wrap{
    width: 300px;
    margin: 30px auto;
  }
  .tooltip-inner-span{
    display: inline-block;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
</style>
