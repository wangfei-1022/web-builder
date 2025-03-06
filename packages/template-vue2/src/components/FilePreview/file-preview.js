import ImgPreviewer from './components/Image.vue'
import PdfPreviewer from './components/Pdf.vue'
import FilePreviewer from './components/File.vue' // 没有命中的其他文件的预览
import { fileAssetType } from '@/utils/index'

export default {
  name: 'FilePreview',
  render(h) {
    let children = this.fileList.map(v => {
      let fileType = fileAssetType(v.url) || ''
      switch (fileType.toLowerCase()) {
        case 'png':
        case 'jpg':
        case 'jpeg':
          return h(
            ImgPreviewer,
            {
              ref: 'imgPV',
              props: {
                fileList: [v]
              }
            },
            this.$slots['img-error']
          )
          break;
        case 'pdf':
          return h(PdfPreviewer, { ref: 'pdfPV', props: { file: v } })
          break;
        default:
          return h(FilePreviewer, { ref: 'filePV', props: { file: v } })
      }
    })
    return h('div', null, children)
  },
  props: {
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    }
  }
}