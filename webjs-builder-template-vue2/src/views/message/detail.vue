<template>
  <div class="messageDetail">
    <div v-if="origin" class="link">
      <a @click="goBackList">{{ $t('messageCenter.goBackList') }}</a>
      <!--<el-link type="primary" :disabled="prevIndex < 0 || prevIndex == currentIndex || prevIndex >= this.ids.length" @click="getDetail(ids[prevIndex])">{{ $t('messageCenter.prev') }}-->
      <!--</el-link>-->
      <!--<el-link type="primary" :disabled="nextIndex < 0 || nextIndex == currentIndex || nextIndex >= this.ids.length" @click="getDetail(ids[nextIndex])">{{ $t('messageCenter.next') }}-->
      <!--</el-link>-->
    </div>
    <div>
      <p class="messageTitle">{{ detail.notifyTitle }}</p>
      <p class="messageTime">{{ detail.messageTime }}</p>
      <p class="messageContent" v-html="detail.notifyContent" />
    </div>
  </div>
</template>
<script>
import { getMessageDetailApi } from '@/api/middleware/message'
import { parseTime } from '@/utils/index'

export default {
  name: 'Detail',
  data() {
    return {
      id: '',
      origin: '',
      ids: [],
      detail: {},
      detailVisible: false,
      currentIndex: null,
      prevIndex: null,
      nextIndex: null
    }
  },
  mounted() {
    this.id = this.$route.query.id
    const ids = this.$route.query.ids
    this.origin = this.$route.query.origin
    if (ids) {
      this.ids = ids.split(',')
    }
    if (this.id) {
      this.getDetail(this.id)
    }
  },
  methods: {
    handleClose() {
      this.$emit('hide-detail', false)
    },
    goBackList() {
      this.$router.push('/message/list')
    },
    getDetail(id) {
      this.ids.forEach((v, index) => {
        if (v === id) {
          this.currentIndex = index
          this.prevIndex = index - 1
          this.nextIndex = index + 1
        }
      })

      getMessageDetailApi(id).then(res => {
        if (res && res.ok) {
          this.detailVisible = true
          res.content.messageTime = parseTime(res.content.createTime)
          this.detail = res.content
          // 获取最新数目
          this.$store.dispatch('message/getUnreadNumber')
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  @import './detail.scss';
</style>
