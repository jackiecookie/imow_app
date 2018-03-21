import base from './base'

export default class postRequire extends base {
  static async postData(requireData = {}) {
    const url = ''
    const result = await this.put(url, requireData)
    return result
  }

  static async list(params = {}) {
    const url = 'http://mock.eolinker.com/td1pdjj6f0d1910c659b334de1e929b431ab8dc2c0e09fc?uri=/freight/list'
    const result = await this.post(url, params)
    return result
  }
}
