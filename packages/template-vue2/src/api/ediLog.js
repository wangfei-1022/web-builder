import request from '@/utils/request'
import URL from './urlTranslator'

export function getEdiLogList(data) {
  return request({
    url: URL.sys.ediLog,
    method: 'post',
    data
  })
}

