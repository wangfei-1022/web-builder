import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess(_successMessage) {
  Vue.prototype.$message({
    message: _successMessage || '复制成功',
    type: 'success',
    duration: 1500
  })
}

function clipboardError(_errorMessage) {
  Vue.prototype.$message({
    message: _errorMessage || '复制失败',
    type: 'error'
  })
}

export default function handleClipboard(text, event, successMessage = '', errorMessage = '') {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(successMessage)
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(errorMessage)
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
