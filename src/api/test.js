import { get } from '@/utils/request'

export default class TagApi {
  static getList (params) {
    return get('/interviewer', params)
  }
}
