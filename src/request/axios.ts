import axios from 'axios'

import { is } from '@electron-toolkit/utils'

const _baseUrl = 'https://kuailu-media-dev5.brightoilonline.com/path/klmeeting'

const instance = axios.create({
  baseURL: _baseUrl,
  timeout: 20 * 1000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

instance.interceptors.request.use(
  (config) => {
    if (is.dev) {
      const { url, data, params } = config
      console.log('axios request -------', { url, data, params })
    }
    /** body传参为字符串时 */
    if (typeof config.data === 'string') {
      config.headers['Content-Type'] = 'text/plain;charset=utf-8'
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => {
    if (is.dev) {
      const {
        data,
        config: { url }
      } = response
      console.log('axios response -------', { url, data })
    }
    if (response.status !== 200 || response.data.code > 0) {
      return Promise.reject(response.data)
    }
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
