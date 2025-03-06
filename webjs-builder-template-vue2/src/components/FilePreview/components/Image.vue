<template>
  <div class="img-previewer">
    <el-image
      v-for="(item, index) in fileList"
      :key="'cover' + index"
      fit="fill"
      :style="{ width: width + 'px', height: height + 'px', ...item.style}"
      :src="item.url"
      :alt="item.alt"
      :lazy="item.lazy"
      :z-index="item.zIndex"
      :preview-src-list="previewSrcList"
    >
      <template v-slot:error>
        <slot name:img-error></slot>
      </template>
    </el-image>
  </div>
</template>

<script>
export default {
  name: 'ImgPreviewer',

  props: {
    width: {
      type: [String, Number],
      default: 220
    },
    height: {
      type: [String, Number],
      default: 120
    },
    coverList: {
      type: Array,
      default: () => []
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    previewSrcList() {
      let arr = []
      this.fileList.forEach(v => {
        arr.push(v.url)
      })
      return arr
    }
  },
}
</script>

<style lang="scss" scoped>
.img-previewer {
  width: 220px;
  border: 1px solid #eee;
  border-radius: 5px;

  ::v-deep .el-image__inner{
    object-fit: contain!important;
    height: 100%;
    width: 100%;
  }
}
</style>