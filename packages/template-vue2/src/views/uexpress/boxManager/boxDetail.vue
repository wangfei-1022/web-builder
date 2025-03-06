<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBox.boxDetail.baseInfoTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BoxBaseInfo :detail="boxDetail" />
      </div>
    </section>
    <section class="info-wrapper">
      <SectionTitle :title="$t('uexpressBox.boxDetail.packageTableTitle')"></SectionTitle>
      <div class="info-content-wrap">
        <BoxPackageInfo :detail="boxDetail" />
      </div>
    </section>
  </div>
</template>
<script>
import SectionTitle from '@/components/Cargo/Common/sectionTitle'
import BoxBaseInfo from './components/BoxBaseInfo'
import BoxPackageInfo from './components/BoxPackageInfo'
import { getBoxDetailApi } from '@/api/uexpress/boxManager'
export default {
  name: 'UexpressBoxDetail',
  components: {
    SectionTitle,
    BoxBaseInfo,
    BoxPackageInfo
  },
  data() {
    return {
      vm: this,
      boxId: '',
      shardingKey: '',
      loading: false,
      boxDetail: {}
    }
  },
  computed: {},
  watch: {},
  filters: {},
  methods: {
    async getBoxDetail() {
      this.loading = true
      const res = await getBoxDetailApi({boxId: this.boxId, shardingKey: this.shardingKey})
      if (res.ok && res.content) {
        this.boxDetail = {...this.boxDetail, ...res.content}
      }
      this.loading = false
    }
  },
  mounted() {
    if (this.$route.params.boxId) {
      this.boxId = this.$route.params.boxId
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
