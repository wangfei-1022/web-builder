export default {
  bind(el, binding) {
    let flag = true
    const target = el instanceof HTMLInputElement ? el : el.querySelector('input')
    target.addEventListener('compositionstart', e => {
      flag = false
    })
    target.addEventListener('compositionend', e => {
      flag = true
    })
    target.addEventListener('input', e => {
      setTimeout(function() {
        if (flag && e.target) {
          const val = e.target.value
          let re
          if (binding.value[1] === 0) {
            re = new RegExp('(^\\d{0,' + binding.value[0] + '}$)|(^\\d{0,' + binding.value[0] + '}}$)')
          } else if (binding.value[1] === -1) { // 正整数
            if (Number(e.target.value) === 0) {
              e.target.value = null
              e.target.dispatchEvent(new Event('input'))
            }
            re = new RegExp('(^\\d{0,' + binding.value[0] + '}$)|(^\\d{0,' + binding.value[0] + '}}$)')
          } else {
            if (binding.value[0].toString().indexOf('-') > -1) {
              const bindingValue0 = binding.value[0].toString().split('-')
              re = new RegExp('(^\\-?\\d{0,' + bindingValue0[1] + '}$)|(^\\-?\\d{0,' + bindingValue0[1] + '}\\.\\d{0,' + binding.value[1] + '}$)')
            } else {
              re = new RegExp('(^\\d{0,' + binding.value[0] + '}$)|(^\\d{0,' + binding.value[0] + '}\\.\\d{0,' + binding.value[1] + '}$)')
            }

          }
          if (re.test(val)) {
            e.target.value = val
          } else {
            e.target.value = val.substring(0, val.length - 1)
          }
          e.target.dispatchEvent(new Event('input')) // 手动更新v-model值
        }
      }, 0)
    })
    // target.addEventListener('blur', e => {
    //   setTimeout(function() {
    //     if (flag && e.target) {
    //       const val = e.target.value
    //       if (binding.value[1] === 0 && val.indexOf('.') > -1) {
    //         e.target.value = val.substring(0, val.length - 1)
    //       }
    //       e.target.dispatchEvent(new Event('input')) // 手动更新v-model值
    //     }
    //   }, 0)
    // })
  }
}
