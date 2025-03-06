<template>
  <div class="right-main-wrapper">
    <section class="info-wrapper">
      <section class="info-section">
        <div class="info-content-wrap" style="padding-top: 20px;">
          <el-form :model="infoForm" :inline="true" size="mini">
            <el-form-item prop="vesselName" :label="`${$t('containerManager.vesselName')}: `">
              <el-input v-model="infoForm.vesselName" disabled></el-input>
            </el-form-item>
            <el-form-item prop="voyageNo" :label="`${$t('containerManager.voyageNo')}: `">
              <el-input v-model="infoForm.voyageNo" disabled></el-input>
            </el-form-item>
            <el-form-item prop="vesselOwner" :label="`${$t('containerManager.vesselOwner')}: `">
              <el-input v-model="infoForm.vesselOwner" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="info-section">
        <SectionTitle :title="$t('containerManager.containerRequireInfo')"></SectionTitle>
        <div class="info-content-wrap">
          <el-table :data="infoForm.requireInfos" tooltip-effect="dark">
            <el-table-column
              prop="portName"
              :label="$t('containerManager.portName')"
              width="180">
            </el-table-column>
            <el-table-column
              prop="portCode"
              :label="$t('common.fiveCharCode')"
              width="180">
            </el-table-column>
            <el-table-column
              prop="containerList"
              :label="$t('containerManager.containerTypeAmount')"
              width="200"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.containerList | filterContainerQuantity}}
              </template>
            </el-table-column>
            <el-table-column
              prop="sailSchedule"
              :label="$t('containerManager.releaseList.sailSchedule')"
              width="180"
              header-align="center"
              align="center">
              <template slot-scope="scope">
                {{scope.row.sailSchedule | filterDate(vm)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <section class="info-section">
        <SectionTitle :title="$t('containerManager.releasedContainerInfo')"></SectionTitle>
        <div class="info-content-wrap">
          <el-table :data="infoForm.releaseInfos" tooltip-effect="dark">
            <el-table-column
              prop="portName"
              :label="$t('containerManager.port')"
              width="180">
            </el-table-column>
            <el-table-column
              prop="portCode"
              :label="$t('common.fiveCharCode')"
              width="180">
            </el-table-column>
            <el-table-column
              prop="yardCode"
              :label="$t('containerManager.releaseList.yardCode')"
              width="180">
            </el-table-column>
            <el-table-column
              prop="containerList"
              :label="$t('containerManager.containerTypeAmount')"
              width="200"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.containerList | filterContainerQuantity}}
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t('common.typeText')"
              width="200"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.type | filterDynamicType}}
              </template>
            </el-table-column>
            <el-table-column
              prop="releaseSort"
              :label="$t('containerManager.releaseList.releaseOrder')"
              width="180"
              header-align="center"
              align="center">
            </el-table-column>
            <el-table-column
              prop="operationTime"
              :label="$t('containerManager.operationTime')"
              width="200"
              header-align="center"
              align="center">
              <template slot-scope="scope">
                {{scope.row.operationTime | filterTime(vm)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="batchNo"
              :label="$t('containerManager.batchNo')"
              align="center"
              width="180">
            </el-table-column>
          </el-table>
        </div>
      </section>
    </section>
  </div>
</template>
<script>
  import SectionTitle from '@/components/Cargo/Common/sectionTitle'
  import { getViewInfoApi } from '@/api/containerReleasedList'
  export default {
    name: 'ViewReleasedDetail',
    data() {
      return {
        vm: this,
        loading: false,
        infoForm: {
          vesselName: '',
          voyageNo: '',
          vesselOwner: '',
          requireInfos: [],
          releaseInfos: []
        }
      }
    },
    components: {
      SectionTitle
    },
    computed: {
      sailScheduleId() {
        return this.$route.params.sailScheduleId
      },
      requireInfosContainerQuantity() {
        if (this.requireInfos.contanerList) {
          const str = this.requireInfos.contanerList.map(item => `${item.containerType}x${item.quantity}`).join(";")
        }
        return ""
      }
    },
    filters: {
      filterDate(val, vm) {
        return vm.$moment(Number(val)).format('YYYY-MM-DD')
      },
      filterTime(val, vm) {
        return vm.$moment(Number(val)).format('YYYY-MM-DD HH:mm:ss')
      },
      filterContainerQuantity(arr) {
        if (arr) {
          return arr.map(item => `${item.containerType}x${item.quantity}`).join(";")
        } else {
          return ""
        }
      },
      filterDynamicType(type) {
        return type === 1 ? '正常放箱' : '调整放箱'
      }
    },
    methods: {
      async getRuleInfo () {
        this.loading = true
        const res = await getViewInfoApi(this.sailScheduleId)
        if (res.ok) {
          this.infoForm = res.content
        }
        this.loading = false
      }
    },
    created() {},
    mounted() {
      this.getRuleInfo()
    }
  }
</script>
<style scoped lang="scss">
.right-main-wrapper{
  overflow: hidden;
  overflow-y: auto;
}
.info-wrapper{
  width: 100%;
  .form-wrap{
    width: 800px;
    padding: 20px 0;
  }
  .shot-section{
    width: 60%;
  }
}
.btn-wrap{
  width: 300px;
  margin: 30px auto;
}
</style>
