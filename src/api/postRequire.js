import base from './base'
import Page from '../utils/Page'

export default class postRequire extends base {
  static async postData(requireData = {}) {
    const url = `${this.baseUrl}/freight/save`
    const result = await this.put(url, requireData)
    return result
  }

  static page () {
    const url = `${this.baseUrl}/freight/list`
    return new Page(url, (data) => {
      // data = data.list
    })
  }

  static async list(params = {}) {
    const url = `${this.baseUrl}/freight/list`
    const result = await this.post(url, params)
    return result
  }
}
