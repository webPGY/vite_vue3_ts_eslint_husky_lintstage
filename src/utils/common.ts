// import type { ToastType, ToastPosition } from 'vant'
// import type { Numeric } from 'vant/lib/utils'
import i18n from '@/language/index'
import { ElMessage } from 'element-plus'
import Fingerprint2, { type Component } from 'fingerprintjs2'

/*
 * 作用： 防抖
 * 用法： debounce(function (...args) { this.x }
 **/

export function debounce(fn: Function, delay: number = 100) {
  let timeout: any = null
  return function (...args: any) {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => fn.call(null, ...args), delay)
  }
}

// 节流

export function throttle(fn: Function, ms: number = 100) {
  let throttleTimer: any = null
  return function (...args: any) {
    if (!throttleTimer) {
      // eslint-disable-next-line prefer-spread
      const ret = fn.apply(null, args)
      throttleTimer = setTimeout(() => {
        throttleTimer = null
      }, ms)
      return ret
    }
  }
}
/**
 * 生成随机字符串
 * @param length
 * @returns
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 获取URL参数
 * @param variable
 * @returns
 */
export function getQueryParam(variable: string) {
  try {
    let query = window.location.hash
    const _query = query.substring(query.indexOf('?') + 1, query.length)
    query =
      query.includes('sessionId=') || query.includes('seid=')
        ? _query
        : decodeURIComponent(window.atob(_query))
    console.debug('query', query)
    const vars = query.split('&')
    if (vars.length) {
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0].toLowerCase().includes(variable.toLowerCase())) {
          return pair[1]
        }
      }
    }

    return ''
  } catch (error) {
    return ''
  }
}

/*
 * 生成随机数
 * @param min
 * @param max
 */
export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 将任一字符串转换为数字
 * @param str
 */
export const getIntFromStr = (str: string) => {
  const encoded = encodeURIComponent(str)
  const numbers = encoded
    .split('')
    .map((item) => item.charCodeAt(0))
    .filter((n) => !Number.isNaN(n))
  const num = numbers.reduce((p, c) => p + c, 0)
  return num
}

/**
 * 将数字转换成[min, max]范围内的数字
 * @param num
 * @param max
 * @param min
 */
export const getIntInRange = (num: number, max: number, min: number = 0) => {
  return min + (num % (max + 1))
}

/**
 * 获取联系人默认头像背景色
 * @returns
 */
export const getContactDefaultBack = (email?: string): string => {
  const randomList = ['#3D7DF9', '#EF9D44', '#3FC6A7', '#8658F0', '#3FC6A7']
  if (email) {
    const index = getIntInRange(getIntFromStr(email), 3)
    return randomList[index]
  }
  return randomList[getRandomInt(0, 4)]
}

/**
 * 提示
 */
export const showTips = (
  message: string,
  type: string = 'success',
  common: boolean = false,
  position: string = 'middle',
  duration: number = 3000
) => {
  const { t } = i18n.global
  ElMessage.closeAll()
  const offset = 30
  if (type === 'success') {
    ElMessage({
      duration,
      customClass: 'kl-email-tips kl-email-tips-success',
      offset,
      message: t(message),
      type: 'success'
    })
  } else if (type === 'fail') {
    ElMessage({
      duration,
      customClass: 'kl-email-tips kl-email-tips-warning',
      offset,
      message: t(message),
      type: 'warning'
    })
  } else {
    ElMessage({
      duration,
      customClass: 'kl-email-tips kl-email-tips-info',
      offset,
      message: t(message),
      type: 'info'
    })
  }
}

export const isIPad = () => {
  return (
    (/macintosh|mac os x/i.test(navigator.userAgent) &&
      window.screen.height > window.screen.width &&
      !navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/)) ||
    navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/)
  )
}

export function handleSearch(
  text: string,
  key: string,
  background: string = 'unset',
  color: string = '#FD7D23'
) {
  if (!text) return ''
  const regExp = new RegExp(key, 'g')
  return text.replace(
    regExp,
    `<span style="background:${background};color:${color};">${key}</span>`
  )
}

/**
 * 延时函数
 * @param time 毫秒数
 */
export async function delay(time: number) {
  return new Promise(function (res) {
    setTimeout(res, time)
  })
}

/**
 * 至少延时函数，比如当原始操作少于指定时间，延迟至指定时间
 * @param promise 原始操作
 * @param ms 毫秒数
 */
export function atLeastDelay(promise: Promise<T>, ms: number): T {
  return new Promise((resolve, reject) => {
    Promise.all([promise, delay(ms)])
      .then((values) => {
        resolve(values[0])
      })
      .catch(reject)
  })
}

interface IThing {
  id: string
}

export function concatAndRemoveDuplicateById<T extends IThing>(array1: T[], array2: T[]) {
  // 拼接数组
  const combinedArray = array1.concat(array2)

  // 根据id属性去重
  const uniqueArray = combinedArray.filter((obj, index, arr) => {
    return arr.findIndex((o) => o.id === obj.id) === index
  })
  return uniqueArray
}

/**
 * base64编码
 * @param {Object} str
 */
export const base64encode = (str: string) => {
  const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let result = ''

  // 循环遍历字符串，每次处理3个字符
  // 一个字符对应一个ASCII，一个ASCII对应8bit，总24bit，即3byte，一个base64为6bit
  // 因此3个输入字符为一组正好能转为4个base64字符 --> 3byte * 8 = 6bit * 4
  for (let i = 0; i < str.length; i += 3) {
    // 分别计算每个字符对应的base64编码值
    const char1 = str.charCodeAt(i) >> 2 // 取byte1前6位
    const char2 = ((str.charCodeAt(i) & 3) << 4) | (str.charCodeAt(i + 1) >> 4) // 取byte1后2位+byte2前4位
    let char3 = ((str.charCodeAt(i + 1) & 15) << 2) | (str.charCodeAt(i + 2) >> 6) // 取byte2后4位+byte3前2位
    let char4 = str.charCodeAt(i + 2) & 63 // 取byte3的后6位

    // 判断是否需要填充（每次共处理3个输入字符，只需要判断是否存在第二与第三个字符）
    // 一个输入字符 8 bit，最起码会产生 2个 base64字符
    if (isNaN(str.charCodeAt(i + 1))) {
      char3 = char4 = 64 // 第二个字符不存在时，填充末尾2个 =
    } else if (isNaN(str.charCodeAt(i + 2))) {
      char4 = 64 // 第三个字符不存在时，填充末尾1个 =
    }

    result +=
      base64EncodeChars.charAt(char1) +
      base64EncodeChars.charAt(char2) +
      base64EncodeChars.charAt(char3) +
      base64EncodeChars.charAt(char4)
  }
  return result
}

export const getLocalLang = () => {
  return (
    getQueryParam('localLang') ||
    getQueryParam('locale') ||
    localStorage.getItem('locale')?.replace(/"/g, '') ||
    localStorage.getItem('localLang')?.replace(/"/g, '') ||
    'cn'
  )
}

export function isObj(obj: any) {
  return Object(obj) === obj // 判断传入的参数是否为引入类型
}
export function cloneDeep(obj: any) {
  if (!isObj(obj)) {
    // 基本数据类型直接返回
    return obj
  }
  if (Array.isArray(obj)) return JSON.parse(JSON.stringify(obj))
  const newObj: any = {}
  for (const k in obj) {
    newObj[k] = cloneDeep(obj[k])
  }
  return newObj
}

export const GetBoDeviceId = () => {
  return new Promise<string>((resolve) => {
    Fingerprint2.get(function (components: Component[]) {
      const values = components.map(function (component: Component, index: number) {
        if (index === 0) {
          return component.value.replace(/\bNetType\/\w+\b/, '')
        }
        return component.value
      })
      resolve(Fingerprint2.x64hash128(values.join(''), 31))
    })
  })
}
