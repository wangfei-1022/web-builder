import { Loading } from 'element-ui'
// 基于 element的一些函数调用糖（简化调用）
/**
 * 删除之前确认提示
 * @param self vue实例对象
 * @param resolveCallback
 * @param title
 * @param content
 * @param resolveBtn
 * @param rejectBtn
 * @param type
 * @param rejectCallback
 */
const deleteConfirm = function(self, resolveCallback, { title, content, resolveBtn, rejectBtn, type, rejectCallback } = {}) {
  self.$confirm(content || '此操作将永久删除该记录, 是否继续?', title || '提示', {
    confirmButtonText: resolveBtn || '确定',
    cancelButtonText: rejectBtn || '取消',
    type: type || 'warning'
  }).then(() => {
    if (resolveCallback) {
      resolveCallback()
    } else {
      self.$message({
        type: 'success',
        message: '删除成功(应实现你自己的删除回调)!'
      })
    }
  }).catch(() => {
    if (rejectCallback) {
      rejectCallback()
    } else {
      self.$message({
        type: 'info',
        message: '已取消删除'
      })
    }
  })
}

// 切换启用、禁用状态 statusText(启用、停用，外部传入)
const switchEnableConfirm = function(self, resolveCallback, statusText, { title, content, resolveBtn, rejectBtn, type, rejectCallback }) {
  self.$confirm(content || `是否${statusText}?`, title || '提示', {
    confirmButtonText: resolveBtn || '确定',
    cancelButtonText: rejectBtn || '取消',
    type: type || 'warning'
  }).then(() => {
    if (resolveCallback) {
      resolveCallback()
    } else {
      self.$message({
        type: 'success',
        message: `${statusText}成功(应实现你自己的删除回调)!`
      })
    }
  }).catch(() => {
    if (rejectCallback) {
      rejectCallback()
    } else {
      self.$message({
        type: 'info',
        message: '已取消操作'
      })
    }
  })
}

// 确认提示框
const confirm = function(self, resolveCallback, { title, content, resolveBtn, rejectBtn, type, rejectCallback } = {}) {
  self.$confirm(content || '确认操作, 是否继续?', title || '提示', {
    confirmButtonText: resolveBtn || '确定',
    cancelButtonText: rejectBtn || '取消',
    type: type || 'warning'
  }).then(() => {
    if (resolveCallback) {
      resolveCallback()
    } else {
      self.$message({
        type: 'success',
        message: '操作成功!'
      })
    }
  }).catch(() => {
    if (rejectCallback) {
      rejectCallback()
    } else {
      self.$message({
        type: 'info',
        message: '已取消操作'
      })
    }
  })
}

// loading加载动画-待实现
export function createLoading(options = {}) {
  const loading = Loading.service({ ...{
    // target: '.bill-detail', // Loading 需要覆盖的 DOM 节点。若使用target，切记 是 该dom元素渲染成功后使用(否则，为整个窗口有遮罩)
    lock: true,
    text: '拼命加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  }, ...options })
  return loading
}

export { deleteConfirm, switchEnableConfirm, confirm }
