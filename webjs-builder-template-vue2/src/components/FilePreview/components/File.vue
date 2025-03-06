<template>
  <div class="preview-container">
    <div class="image-slot">
      <svg-icon iconClass="icon-bianzu14beifen3" />
    </div>
    <div>
      <a class="demonstration" :href="file.url" target="blank" :title="fileName">{{fileName}}</a>
    </div>
  </div>
</template>

<script>
import { getFileName } from '@/utils/index'

export default {
  name: 'FilePreview',
  props: {
    file: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data(){
    return {
     
    }
  },
  computed: {
    fileName() {
      if(this.file.originFileName) {
        return this.file.originFileName
      } else if(this.file.url) {
        return getFileName(this.file.url)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container {
  height: 120px;
  width: 220px;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 5px;

  .image-slot {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 56px;
    margin-bottom: 20px;
  }
  .demonstration {
    display: block;
    color: #1890ff;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>