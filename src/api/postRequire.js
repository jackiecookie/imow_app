import base from './base'

export default class postRequire extends base {
  static async post(requireData = {}) {
    const url = ''
    const result = await this.put(url, requireData)
    return result
  }
}
