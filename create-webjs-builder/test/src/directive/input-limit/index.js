import inputLimit from './limit'

const install = function(Vue) {
  Vue.directive('input-limit', inputLimit)
}

if (window.Vue) {
  window['input-limit'] = inputLimit
  Vue.use(install); // eslint-disable-line
}

inputLimit.install = install
export default inputLimit
