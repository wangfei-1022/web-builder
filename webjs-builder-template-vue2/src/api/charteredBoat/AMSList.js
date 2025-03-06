import request from '@/utils/request'
/**
 * 获取AMS列表数据
 * @param {*} params
 * @returns
 */
// 查询列表
export function houseBlListApi(params) {
  return request({
    url: `/api/cas-service/omc/cas/house/bl/list`,
    method: 'get',
    params
  })
}
// 查询详情(hblId)
export function houseBlDetailApi(hblId) {
  return request({
    url: `/api/cas-service/omc/cas/house/bl/detail/${hblId}`,
    method: 'get'
  })
}

// VITE-SP
export function saveHouseBleApi() { }
export function updateHouseBleApi() { }
export function validContainerRepeatApi() { }
