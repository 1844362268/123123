import { post, get } from '@/utils/request'

export default class EnterpriseApi {
  static getAccounts (params) {
    return get('/enterprise', params)
  }

  static getAccount (id) {
    return get('/enterprise/detail', { id })
  }

  static addAccount (params) {
    return post('/enterprise/add', params)
  }

  static updateAccount (params) {
    return post('/enterprise/update', params)
  }

  static deleteAccount (id) {
    return get('/enterprise/delete', { id: id })
  }
}
