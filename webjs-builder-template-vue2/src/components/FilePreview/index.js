import FilePreview from './file-preview'

FilePreview.install = function (Vue) {
  Vue.component(FilePreview.name, FilePreview)
}

if (typeof window !== 'undefined' && window.Vue) {
  FilePreview.install(window.Vue)
}

export default FilePreview

import ImagePreview from './components/Image.vue'
import PdfPreview from './components/Pdf.vue'

ImagePreview.install = function (Vue) {
  Vue.component(ImagePreview.name, ImagePreview)
}

PdfPreview.install = function (Vue) {
  Vue.component(PdfPreview.name, PdfPreview)
}

export { ImagePreview, PdfPreview }