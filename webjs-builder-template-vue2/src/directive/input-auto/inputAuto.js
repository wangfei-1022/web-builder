export default {
  // en 可输入 英文
  // EN 可输入 英文 并自动转大写
  // EN_num 可输入 英文、数字 并自动转大写
  bind: function (el, binding = 'en') {
    let flag = true
    const target = el instanceof HTMLInputElement ? el : el.querySelector('input') || el.querySelector('textarea')
    target.addEventListener('compositionstart', e => {
      flag = false
    })
    target.addEventListener('compositionend', e => {
      flag = true
    })
    target.addEventListener('input', e => {
      setTimeout(function () {
        if (flag && e.target) {
          let val = e.target.value
          switch (binding.value) {
            case "en":
              e.target.value = val.replace(/[^\a-zA-Z]/g, '')
              break
            case "EN":
              e.target.value = val.replace(/[^\a-zA-Z]/g, '').toUpperCase()
              break
            case "num":
              e.target.value = val.replace(/[^0-9]/g, '')
              break
            case "int":
              if (val.length === 1 && Number(val) === 0) {
                val = ''
              }
              e.target.value = val.replace(/[^0-9]/g, '')
              break
            case "EN_num":
              e.target.value = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
              break
            case "en_num_symbol": // 数字 英文字符
              e.target.value = val.replace(/[^\a-zA-Z0-9\s*\!\@\#\%\,\.\/\s\-\(\)\_\:\;\$\\\+\'\"\&]/g, '')
              // e.target.value = val.replace(/[^0-9]/g, '')
              break
            case "EN_num_symbol": // 数字 英文字符 大写
              e.target.value = val.replace(/[^\a-zA-Z0-9\s*\!\@\#\%\,\.\/\s\-\(\)\_\:\;\$\\\+\'\"\&]/g, '').toUpperCase()
              break
            case "upperCase": // 数字 英文字符 大写
              e.target.value = val.toUpperCase()
              break
            default:
              e.target.value = val.replace(/[^\a-zA-Z]/g, '')
          }
          e.target.dispatchEvent(new Event('input')) // 手动更新v-model值
        }
      }, 0)
    })
  }
}
