<template>
  <div v-loading="loading" class="right-main-wrapper fixed-wrapper">
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBatch.batchDetail.baseInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BatchBaseInfo :detail="batchDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBatch.batchDetail.plateInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BatchPlateInfo :detail="batchDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBatch.batchDetail.flightInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BatchFlightInfo :detail="batchDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBatch.batchDetail.clearanceInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BatchClearanceInfo :detail="batchDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBatch.batchDetail.packageInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BatchPackageInfo :detail="batchDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBatch.batchDetail.remarkTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <el-input type="textarea" rows="10" v-model="remarks"></el-input>
      </div>
    </section>
    <div class="btn-wrap fixed-btn">
      <el-button type="default" size="mini" @click="backToList">{{$t('common.closed')}}</el-button>
      <el-button type="primary" size="mini" @click="submitRemarks">{{$t('common.submitBtn')}}</el-button>
    </div>
  </div>
</template>
<script>
import SectionTitle from '@/components/Cargo/Common/sectionTitle'
import BatchBaseInfo from './components/BatchBaseInfo'
import BatchPlateInfo from './components/BatchPlateInfo'
import BatchFlightInfo from './components/BatchFlightInfo'
import BatchClearanceInfo from './components/BatchClearanceInfo'
import BatchPackageInfo from './components/BatchPackageInfo'
import BatchOperationInfo from './components/BatchOperationInfo'
import { getBatchDetailApi, submitBatchRemarksApi } from '@/api/uexpress/batchManager'
export default {
  name: 'UexpressBatchDetail',
  components: {
    SectionTitle,
    BatchBaseInfo,
    BatchPlateInfo,
    BatchFlightInfo,
    BatchClearanceInfo,
    BatchPackageInfo,
    BatchOperationInfo
  },
  data() {
    return {
      vm: this,
      outboundId: '',
      shardingKey: '',
      loading: false,
      remarks: '',
      batchDetail: {}
    }
  },
  computed: {},
  watch: {},
  filters: {},
  methods: {
    async getBoxDetail() {
      this.loading = true
      // const res = await getBatchDetailApi({outboundId: this.outboundId, shardingKey: this.shardingKey})
      const res = await getBatchDetailApi(this.outboundId)
      if (res.ok && res.content) {
        this.batchDetail = {...this.batchDetail, ...res.content}
      }
      this.loading = false
    },
    async submitRemarks() {
      this.loading = true
      const res = await submitBatchRemarksApi({
        outboundId: this.outboundId,
        remarks: this.remarks
      })

      if (res && res.ok) {
        this.$message.success(this.$t('uexpressBatch.batchDetail.submitRemarksSuccess'))
        this.remarks = ''
        this.loading = false
        this.getBoxDetail()
      } else {
        this.loading = false
      }
    },
    backToList() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({name: 'UexpressBatchList'})
    }
  },
  mounted() {
    if (this.$route.params.outboundId) {
      this.outboundId = this.$route.params.outboundId
      this.shardingKey = this.$route.params.shardingKey
      this.getBoxDetail()
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  overflow: hidden;
  overflow-y: auto;
}
.info-wrapper{
  width: 70%;
  margin-top: 20px;
  &:first-child{
    margin-top: 0;
  }
}
.section-title-wrap{
  margin-top: 0;
}
.info-content-wrap{
  border: 1px solid #ccc;
  border-top: 0 none;
}
.info-empty-text{
  font-size: 20px;
  width: 100%;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
</style>
