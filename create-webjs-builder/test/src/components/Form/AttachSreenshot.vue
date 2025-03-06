<template>
  <div v-loading="loading" class="attach-sreenshot">
    <div class="copy-img" tabindex="1000"  v-if="!fileList[0]">
      <span>{{$t('common.clickCopyImg')}}</span>
    </div>
    <div v-else class="sreenshot-img">
      <PreviewImageList ref="previewImageList" :imgList="fileList" imgWidth="200px"></PreviewImageList>
      <div class="oper">
        <i class="iconfont icon-sousuofangda" @click="previewFn"/>
        <i class="iconfont icon-trash2" @click="deleteFn"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ossUpload } from '@/utils/ossUpload'
import { isAssetTypeAnImage } from '@/utils/index'
import PreviewImageList from '@/components/ImagePreview/PreviewImageList'

export default {
	name: 'AttachSreenshot',
  components: {
    PreviewImageList
  },
	props: {

	},
	data() {
		return {
      loading: false,
      imgSrc: "",
      fileList: []
		}
	},
	mounted() {
    this.$el.addEventListener('paste', this.handlePaste);
	},
  beforeDestory() {
    this.$el.removeEventListener('paste', this.handlePaste);
  },
	methods: {
    previewFn() {
      this.$refs.previewImageList.previewImg()
    },
    deleteFn() {
      this.fileList = []
      this.imgSrc = ""
      this.$emit('input', this.fileList)
    },
    handlePaste(e) {
        // some chrome version compatibility
        if (e.clipboardData || e.originalEvent) {
            let cbd = e.clipboardData || e.originalEvent.clipboardData
            if (!cbd || !cbd.items) {
                return;
            }
            let blobs = []
            for (let i = 0; i < cbd.items.length; i++) {
              let item = cbd.items[i];
              if (item.kind === "file") {
                  let blob = item.getAsFile();
                  if (blob && blob.size === 0) {
                      return;
                  }
                  this.httpRequest({file: blob})
                  blobs.push(blob)
              }
            }
            // if (blobs.length > 0) {
            //   blobs.forEach(v => {
            //     let reader = new FileReader()
            //     reader.onload = fileEvent => {
            //         this.imgSrc = fileEvent.target.result
            //     }
            //     reader.readAsDataURL(v)
            //   })
            // }
        }
    },
    httpRequest(data) {
			if (data.file.name && data.file.name.length > 150) {
				this.$message.error(this.$t('common.fileNameLenToLarge'))
				return
			}

			let callback = (res, data = null) => {
				// 当该组件被定义为单个图片上传预览时 需要把之前的清空，进行单一的文件覆盖
				if (this.type === 'SINGLE_FILE_PREVIEW') {
          this.fileList = []
				}

        res.name = res.name || res.originFileName || res.cloudFileName
        res.isImage = isAssetTypeAnImage(res.originFileName)

				this.$emit('success', res)
				this.fileList.push(res)
				this.$emit('input', this.fileList)
				this.loading = false
			}
			this.loading = true
			// TODO
			// 上传接口需要FormData
			if (this.uploadMethod) {
				// 兼容ESIT提供的接口数据返回
				const formData = new FormData()
				formData.append('file', data.file)
				this.uploadMethod(formData).then(res => {
					if (res.ok) {
						callback(res.content)
					} else {
						// 上传失败 清除elment upload value
						this.fileList = []
						this.loading = false
						this.handleError(res)
						this.$emit('error')
					}
				}).catch(err => {
					this.$emit('error', err)
					this.loading = false
				})
			} else {
				// 兼容OSS
				ossUpload(data).then(res => {
					callback(res, data)
				}).catch(err => {
					this.$emit('error', err)
					this.loading = false
				})
			}
		}
	}
}
</script>
<style scoped lang="scss">
.attach-sreenshot{
  width: 100%;
  height: 100%;
  text-align: center;
  overflow: hidden;
}
.copy-img{
  width: 100%;
  height: 100%;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.copy-img:focus{
  border-color: #46a6ff;
}

.sreenshot-img{
  width: 100%;
  height: 100%;
  position: relative; /*相对定位*/
}
.sreenshot-img ::v-deep img {
  display: block;
  width: 100%!important;
  height: 100%!important;
}
.sreenshot-img .oper{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
}
.sreenshot-img::after {
  content: ''; /*必须有*/
  position: absolute; /*绝对定位*/
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5); /*设置背景颜色*/
  opacity: 0; /*遮罩层默认隐藏*/
  transition: all 0.3s; /*过渡效果*/
}
.sreenshot-img:hover::after {
  opacity: 1;
}

.sreenshot-img:hover .oper {
  opacity: 1;
}

.icon-sousuofangda{
  position: absolute;
  left: 5px;
  top: 50%;
  color: white;
  margin-top: -10px;
  font-size: 20px;
  cursor: pointer;
}
.icon-trash2{
  position: absolute;
  right: 5px;
  top: 50%;
  color: white;
  margin-top: -10px;
  font-size: 20px;
  cursor: pointer;
}

</style>
