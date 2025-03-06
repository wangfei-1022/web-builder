<template>
  <div>
    <el-button type="text" size="mini" @click="previewImg" v-show="srcList.length > 0">{{$t('common.previewBtn')}}</el-button>
    <el-image
      ref="previewImgBox"
      style="width: 0px; height: 0px; display: inline-block; vertical-align: middle;"
      :src="srcList[0]"
      :preview-src-list="srcList">
    </el-image>
  </div>
</template>
<script>
  export default {
    name: 'ImgPreview',
    data() {
      return {}
    },
    computed: {
      srcList: function() {
        return this.params.value
      }
    },
    methods: {
      previewImg() {
        this.$refs.previewImgBox.showViewer = true
      }
    },
    mounted() {}
  }
</script>
<style lang="scss" scoped>

</style>
