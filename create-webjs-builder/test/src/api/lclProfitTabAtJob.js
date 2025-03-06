import request from '@/utils/request'
import URL from './urlTranslator'

export function getDynamicColumnList(jobId, showMode) {
  const params = { showMode }
  return request({
    url: `${URL.act.lclprofitList}/${jobId}`,
    method: 'get',
    params
  })
}
