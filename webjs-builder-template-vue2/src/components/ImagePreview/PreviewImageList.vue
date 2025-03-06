<template>
  <div class="img-preview-wrap">
    <ul>
      <li v-for="item in imgList"
        :key="item.url"
        @click="previewImg">
        <img :src="item.url" :style="{width: imageWidth, height: imageHeight}" />
      </li>
    </ul>
    <ImagePreview
      ref="imagePreview"
      :z-index="2100"
      :multiple="true"
      :control-bar="true"
      :close-btn="true"
      :arrow-btn="true"
      :now-img-index="0"
      :img-list="imgList.map(item => item.url)" />
  </div>
</template>
<script>
  import ImagePreview from './index'
  export default {
    components: {
      ImagePreview
    },
    props: {
      imgList: {
        type: Array,
        default: () => []
      },
      imgWidth: {
        type: String,
        default: 'auto'
      },
      imgHeight: {
        type: String,
        default: 'auto'
      }
    },
    data() {
      return {}
    },
    computed: {
      imageWidth() {
        return this.imgWidth === 'auto' ? 'auto' : this.imgWidth
      },
      imageHeight() {
        return this.imgHeight === 'auto' ? 'auto' : this.imgHeight
      }
    },
    methods: {
      previewImg() {
        this.$refs.imagePreview.show = true
      }
    }
  }
</script>
import
<style lang="scss" scoped>
  .img-preview-wrap{
    ul {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      padding: 0;
      margin: 0;
      li {
        display: block;
        padding: 2px;
        border: 1px solid #ccc;
        margin-right: 6px;
        img {
          display: inline-block;
          vertical-align: middle;
          object-fit: cover;
        }
      }
    }
  }
</style>
