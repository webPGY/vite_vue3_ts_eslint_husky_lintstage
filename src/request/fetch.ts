import { showTips } from '@/utils/common'

export type RequestData = {
  url: RequestInfo | URL | string
  data?: any
  method: string | ('get' | 'post')
  headers?: Record<string, any>
  type?: keyof typeof ContentType
}
export const ContentType = {
  JSON: 'application/json',
  URLENCODED: 'application/x-www-form-urlencoded',
  FORMDATA: 'multipart/form-data',
  TEXT: 'text/plain',
  BLOB: 'application/octet-stream',
  ARRAYBUFFER: 'application/octet-stream'
}

export class API {
  #init = {
    base: '',
    port: '',
    timeout: 600000,
    headers: { 'Content-Type': '' }
  }
  #AbortControllerMap: Record<string, AbortController> = {}
  get init() {
    return this.#init
  }
  private contentFormatters: Record<keyof typeof ContentType, (input: any) => any> = {
    JSON: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    TEXT: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    FORMDATA: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`
        )
        return formData
      }, new FormData()),
    URLENCODED: (input: any) => JSON.stringify(input),
    BLOB: function (input: any) {
      throw new Error('Function not implemented.')
    },
    ARRAYBUFFER: function (input: any) {
      throw new Error('Function not implemented.')
    }
  }
  constructor(init: Record<string, any> = {}) {
    this.#init.headers['Content-Type'] = init['Content-Type'] || ContentType.JSON
  }
  customFetch(...fetchParams: Parameters<typeof fetch>) {
    const [url, init] = [...fetchParams]
    if (Array.isArray(init?.headers)) {
      // ...
    } else if (init?.headers && init.headers instanceof Headers) {
      //  ...
    } else if (typeof init?.headers === 'object' && !(init?.headers instanceof Headers)) {
      // if (isIPad()) {
      //   init.headers['deviceId'] = useGlobalStore().deviceId
      // }
      // init.headers['userId'] = useGlobalStore().userInfo?.userId || ''
      // init.headers['userEmail'] =
      //   useGlobalStore().userMailinfo?.email ||
      //   useGlobalStore().mainCustomer ||
      //   useGlobalStore().userInfo?.email ||
      //   ''
      // init.headers['token'] = useGlobalStore().SEID
      // init.headers['channel'] = '4'
      // init.headers['language'] = useGlobalStore().locale || 'cn'
    }
    const requestTimeout = new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject({
          code: 'ERROR',
          message: '您当前网络环境较弱'
        })
      }, 550000)
    })
    const controller = new AbortController()
    let cancel: Function
    const cancelRequest = new Promise((resolve) => {
      cancel = () => {
        setTimeout(() => {
          controller.abort()
          return resolve({ code: '-1', message: '连接中断，建议检查网络或稍后再试' })
        }, 5000)
      }
    })
    const requestPromise = new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      fetchParams[1] && (fetchParams[1].signal = controller.signal)
      fetch(...fetchParams)
        .then((res) => resolve(res))
        .catch((e) => {
          console.debug(e)
          return reject(e)
        })
    })
    return Promise.race([requestPromise, requestTimeout, cancelRequest]).catch((e) => {
      showTips(e?.message, 'fail')
      cancel()
    })
  }
  /**
   * 请求
   * @param data
   * @returns
   */
  request(data: RequestData) {
    const _ = this.requestInterceptor(data)
    const { url } = _
    if (!url) return
    const headers = { ...this?.init.headers, ..._.headers }
    const controller = new AbortController()
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    url && (this.#AbortControllerMap[url.toString()] = controller)
    let cancel: Function
    const cancelRequest = new Promise((resolve) => {
      cancel = () => {
        controller.abort()
        return resolve({ code: 'END', msg: 'Request termination' })
      }
    })

    const requestTimeout = new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject({
          code: 'ERROR',
          message: '请求超时'
        })
      }, this.#init.timeout)
    })
    const requestPromise = new Promise((resolve, reject) => {
      fetch(url, {
        method: data.method,
        mode: 'cors',
        cache: 'no-cache',
        headers,
        signal: controller.signal,
        body: this.contentFormatters[data.type || 'JSON'](_.data)
      })
        .then((response) => {
          delete this.#AbortControllerMap[response.url] // 删除接口中止控制器
          resolve(this.responseInterceptor(response, 'JSON')) // 返回结果
        })
        .catch((error) => {
          this.errorHandler(error)
          reject(error) as unknown as Response
        })
    })

    return Promise.race([cancelRequest, requestTimeout, requestPromise]).catch((e) => {
      showTips(e?.message, 'fail')
      cancel()
    })
  }
  /**
   * 请求拦截器
   * @param options
   * @returns
   */
  requestInterceptor = (options: RequestData) => {
    let { url, headers } = options
    if (url && !/^http(s?):\/\//i.test(url.toString())) {
      url = '' + url // 拼接完整的请求URL
    }
    headers = { ...headers }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    headers['Content-Type'] || (headers['Content-Type'] = this.#init.headers['Content-Type'])
    return {
      method: options.method,
      data: options.data,
      url,
      headers
    }
  }
  /**
   * 响应拦截器
   * @param response
   * @param contentType
   * @returns
   */
  responseInterceptor = async (response: Response, contentType: keyof typeof ContentType) => {
    const { status } = response
    if (status >= 200 && status < 400) {
      let result
      switch (contentType) {
        case 'ARRAYBUFFER':
          result = response.arrayBuffer()
          break
        case 'BLOB':
          result = response.blob()
          break
        case 'FORMDATA':
          result = response.formData()
          break
        case 'TEXT':
          result = response.text()
          break
        case 'JSON':
          result = await response.json()
          break
        default:
          result = response
      }
      return result
    }
    return response
  }
  /**
   * 错误处理
   * @param error
   */
  errorHandler = function (error: any) {
    console.error('请求发生错误:', error)
  }
}

const api = new API({})

export default api
