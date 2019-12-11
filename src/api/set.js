import { post, get } from '@/utils/request'

export default class SetApi {
  static getInfo () {
    return get('/setting')
  }

  static reset (params) {
    return post('/setting/reset', params)
  }
  static getCaptcha (params) {
    return get('/setting/captcha', params)
  }
  static upDate (params) {
    return post('/setting/update', params)
  }
  static checkDate (params) {
    return post('/setting/check', params)
  }
}
