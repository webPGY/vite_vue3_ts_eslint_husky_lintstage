import request from './request'

const login = (userNo: string, password: string, boDeviceId: string) =>
  new Promise((resolve, reject) => {
    request({
      url: 'https://koa.quickegret.com/kuailu/j?appid=com.kuailu.base.apps.security&method=clientLogin&seid=',
      method: 'post',
      headers: {
        boTerm: 'PC',
        boPlat: 'pc',
        boEquipmentType: 'PC',
        boDeviceId,
        boEquipmentModel: navigator?.userAgent?.match(/[(]([^;]*)[;]/g)?.[0]?.replace(/[(;]/g, ''),
        boVer: '2.8.7'
      },
      data: {
        ignoreSlider: true,
        movePosX: '',
        userNo,
        password,
        version: '1.0'
      }
    })
      ?.then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

export default {
  login
}
