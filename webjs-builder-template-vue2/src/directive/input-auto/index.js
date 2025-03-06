import inputAuto from './inputAuto'

const install = function(Vue) {
  Vue.directive('input-auto', inputAuto)
}

if (window.Vue) {
  window['input-auto'] = inputAuto
  Vue.use(install); // eslint-disable-line
}

inputAuto.install = install
export default inputAuto
