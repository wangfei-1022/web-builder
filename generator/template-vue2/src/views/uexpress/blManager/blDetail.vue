<template>
  <div v-loading="loading" class="right-main-wrapper fixed-wrapper">
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBL.blDetail.baseInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BLBaseInfo :detail="blDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBL.blDetail.plateInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BLPlateInfo :detail="blDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBL.blDetail.flightInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BLFlightInfo :detail="blDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBL.blDetail.clearanceInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BLClearanceInfo :detail="blDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBL.blDetail.blListTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BLListInfo :detail="blDetail" />
      </div>
    </section>
    <!-- <div class="btn-wrap fixed-btn">
      <el-button type="default" size="mini" @click="backToList">{{$t('common.closed')}}</el-button>
      <el-button type="primary" size="mini" @click="submitRemarks">{{$t('common.submitBtn')}}</el-button>
    </div> -->
  </div>
</template>
<script>
import SectionTitle from '@/components/Cargo/Common/sectionTitle'
import BLBaseInfo from './components/BLBaseInfo'
import BLPlateInfo from './components/BLPlateInfo'
import BLFlightInfo from './components/BLFlightInfo'
import BLClearanceInfo from './components/BLClearanceInfo'
import BLListInfo from './components/BLListInfo'
import { getBLDetailApi, getBLBatchInfoApi } from '@/api/uexpress/blManager'
export default {
  name: 'UexpressBLDetail',
  components: {
    SectionTitle,
    BLBaseInfo,
    BLPlateInfo,
    BLFlightInfo,
    BLClearanceInfo,
    BLListInfo
  },
  data() {
    return {
      vm: this,
      blId: '',
      shardingKey: '',
      loading: false,
      remarks: '',
      blDetail: {}
    }
  },
  computed: {},
  watch: {},
  filters: {},
  methods: {
    async getBLDetail() {
      this.loading = true
      const res = await getBLDetailApi(this.blId)
      if (res.ok && res.content) {
        this.blDetail = {...this.blDetail, ...res.content}
        this.getBLBatchList()
      }
    },
    async getBLBatchList() {
      const params = {
        bolId: this.blDetail.id,
        bolSk: this.blDetail.shardingKey
      }
      const res = await getBLBatchInfoApi(params)
      if (res.ok) {
        this.$set(this.blDetail, 'internalTransits', res.content.list)
      }
      this.loading = false
    },
    backToList() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({name: 'UexpressBLList'})
    }
  },
  mounted() {
    if (this.$route.params.blId) {
      this.blId = this.$route.params.blId
      this.getBLDetail()
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
