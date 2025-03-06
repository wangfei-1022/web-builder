import axios from 'axios'
import { Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import qs from 'qs'
const CANCEL_TOKEN = axios.CancelToken
const timeout = 30000
const ILW_TOOLSURL = 'http://127.0.0.1:4040'
let isIlwApi = false

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout, // request timeout
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 判断是否重复请求
    // if (!setRequestQueue(config)) {
    //   return Promise.reject({
    //     code: 9999,
    //     message: '请求重复'
    //   })
    // }
    // 发送给仓库小工具本地URL
    if (config.ilwTools) {
      config.baseURL = ILW_TOOLSURL
      config.withCredentials = false
      isIlwApi = true
    }

    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers.Authorization = getToken()
    }
    config.headers['App-Id'] = '1'
    config.headers['App-Version'] = `${process.env.VUE_APP_VERSION}`
    if (config.method !== 'get') {
      config.headers['content-type'] = 'application/json'
    }

    // cancelToken
    config.cancelToken = new CANCEL_TOKEN(c => {
      store.dispatch('axiosCancel/pushList', c)
    })

    return config
  },
  error => {
    // Do something with request error
    console.log('Request error') // for debug
    if (!error.message === 'cancelRequest') {
      Notification.error({
        title: 'Error!',
        message: error.message
      })
    }
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // 从重复请求监听队列中弹出
    // popupRequestQueue(response.config)

    if (response.headers['content-type'].indexOf('text/html') >= 0) {
      return response.data
    }

    const res = response.data
    if (res.ok === undefined && res.type) {
      // edi下载的响应方式是blog，不走正常响应流程
      if (res.type === 'application/octet-stream') {
        return response
      } else {
        // 下载失败
        return Promise.reject('edi模板异常，下载失败....')
      }
    } else {
      if (!res.ok) {
        if (res.code === '0004') {
          // Token 失效或错误 Token
          removeToken()
          resetRouter()
          store.dispatch('user/resetToken')

          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((v, index) => {
              setTimeout(() => {
                Message({
                  showClose: true,
                  message: v.message,
                  type: 'error',
                  duration: 5 * 1000
                })
              }, index * 5)
            })
          } else {
            Message({
              showClose: true,
              message: res.message,
              type: 'error',
              duration: 5 * 1000
            })
          }

          router.push('/login')
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((v, index) => {
              setTimeout(() => {
                Message({
                  showClose: true,
                  message: v.message,
                  type: 'error',
                  duration: 5 * 1000
                })
              }, index * 5)
            })
          } else {
            Message({
              showClose: true,
              message: res.message,
              type: 'error',
              duration: 5 * 1000
            })
          }
        }

        return Promise.reject(res)
      } else {
        return res
      }
    }
  },
  error => {
    console.log('Response error') // for debug
    if (error.message !== 'cancelRequest' && !isIlwApi) {
      Notification.error({
        title: 'Error!',
        message: error.message
      })
    }
    return Promise.reject(error)
  }
)

// export default service
export default function (data) {
  return service(data).catch(err => ({ ...err }))
}

/*
 * @function 将指定key压入requestQueue列表中
 * @params {config} 拦截器的 config 配置
 * @return Boolean 返回 true 表示没有未完成接口;
*/
// const requestQueue = new Set([])
// const setRequestQueue = config => {
//   let cancelKey = config.data ? `${config.method}-${config.baseURL}${config.url}-${JSON.stringify(config.data)}` : `${config.method}-${config.baseURL}${config.url}-${JSON.stringify(config.params)}`
//   // 生成唯一key,替换中间特殊符号
//   cancelKey = cancelKey.replace(/\\|"/g, '')
//   // 请求前检查是否存在未完成的接口
//   if (requestQueue.has(cancelKey) && !config.repeat && false) {
//     return false
//   } else {
//     requestQueue.add(cancelKey)
//     // 请求超时后清除之前请求
//     setTimeout(() => {
//       popupRequestQueue(config)
//     }, timeout)
//   }

//   return true
// }

/*
 * @function 将指定key从 requestQueue列表中弹出
 * @params {config} 拦截器的 config
*/
// const popupRequestQueue = config => {
//   let cancelKey = config.data ? `${config.method}-${config.baseURL}${config.url}-${JSON.stringify(config.data)}` : `${config.method}-${config.baseURL}${config.url}-${JSON.stringify(config.params)}`
//   // 生成唯一key,替换中间特殊符号
//   cancelKey = cancelKey.replace(/\\|"/g, '')
//   // 请求完成移除之前的请求
//   if (requestQueue.has(cancelKey)) {
//     setTimeout(() => {
//       requestQueue.delete(cancelKey)
//     }, 100)
//   }
// }

