/**
 * 去除两边空格
 * 使用 <el-input v-model="xxx" v-trim></el-input>
 */
function getInput(el) {
  let inputEle
  if (el.tagName !== 'INPUT') {
    inputEle = el.querySelector('input')
  } else {
    inputEle = el
  }
  return inputEle
}
function dispatchEvent(el, type) {
  let evt = document.createEvent('HTMLEvents')
  evt.initEvent(type, true, true)
  el.dispatchEvent(evt)
}
const Trim = {
  inserted: el => {
    let inputEle = getInput(el)
    const handler = function(event) {
      const newVal = event.target.value.trim()
      if (event.target.value !== newVal) {
        event.target.value = newVal
        dispatchEvent(inputEle, 'input')
      }
    }
    el.inputEle = inputEle
    el._blurHandler = handler
    inputEle.addEventListener('blur', handler)
  },
  unbind(el) {
    const { inputEle } = el
    inputEle.removeEventListener('blur', el._blurHandler)
  }
}
Trim.install = function(Vue) {
  Vue.directive('trim', Trim)
}
export default Trim
