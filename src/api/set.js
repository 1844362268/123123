import { post, get } from '@/utils/request'

export default class SetApi {
  static getInfo () {
    return get('/setting')
  }

  static reset (params) {
    return post('/setting/reset', params)
  }
  static getCaptcha (phone) {
    return get('/setting/captcha', phone)
  }
  static update (params) {
    return post('/setting/update', params)
  }
}
