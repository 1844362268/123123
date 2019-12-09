import { post, get } from '@/utils/request'

export default class TagApi {
  static getList (params) {
    return get('/skillTag', params)
  }

  static searchTag (id) {
    return get('/skillTag/detail', { id: id })
  }

  static add (params) {
    return post('/skillTag/add', params)
  }

  static update (params) {
    return post('/skillTag/update', params)
  }

  static delete (id) {
    return get('/skillTag/delete', { id: id })
  }
}
