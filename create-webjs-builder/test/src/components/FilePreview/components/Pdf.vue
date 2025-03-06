<template>
  <div>
    <div class="preview-container">
      <div class="image-slot" title="点击预览" @click="showPreview">
        <svg-icon iconClass="icon-bianzu14beifen3"/>
      </div>
      <div>
        <a class="demonstration" :href="file.url" target="blank" :title="fileName">{{fileName}}</a>
      </div>
    </div>
    <div class="pdf-container" v-if="previewVisible">
      <span class="close" @click="previewVisible = false"><i class="el-icon-close"></i></span>
      <div class="container">
        <div class="pdf-container-list" :style="{width: width + 'px', height: height + 'px', margin: '0 auto'}">
          <canvas
            v-for="index in totalPage"
            :key="index"
            :id="`canvas-${index}`"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist'
import { getFileName } from '@/utils/index'

let pdfjsUrl = '/static/pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsUrl + '/build/pdf.worker.js';

export default {
  name: 'PdfPreview',
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
      totalPage: '',
      width: 0,
      height: 0,
      previewVisible: false
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
  },
  methods: {

    showPreview() {
      this.previewVisible = true
      this.$nextTick(() => {
         this.init()
      })
    },
    init() {
      let data = {
        url: this.file.url,
        cMapUrl: pdfjsUrl + "/cmaps/",
        cMapPacked: true
      }
      pdfjsLib.getDocument(data).promise.then((pdfDocument) => {
          this.totalPage = pdfDocument.numPages; // 页码
          for (let i = 1; i <= pdfDocument.numPages; i++) {
            pdfDocument.getPage(i).then((pdfPage) => {
              let viewport = pdfPage.getViewport({scale: 1.2});
              const containerWidth = document.body.offsetWidth; // 容器宽度
              let canvas = document.getElementById(`canvas-${i}`);
              this.width = viewport.width
              this.height = viewport.height
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              let ctx = canvas.getContext("2d");
              let renderTask = pdfPage.render({
                canvasContext: ctx,
                viewport: viewport,
              });
              return renderTask.promise;
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("PDF加载失败");
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-container{
  position: fixed;
  padding: 20px;
  background: rgba(0,0,0,0.5);
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  z-index: 999;
}
.container {
  position: absolute !important;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 50px;
  overflow: auto;
  font-family: PingFang SC;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  position: relative;
}
.close {
  top: 40px;
  right: 40px;
  width: 40px;
  height: 40px;
  font-size: 24px;
  color: #fff;
  display: inline-block;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  background-color: #606266;
  position: absolute;
  z-index: 1000;
  cursor: pointer;
}


.preview-container {
  min-height: 100px;
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