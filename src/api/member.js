import base from './base'
import auth from './auth'
import wepy from 'wepy'
import Tip from '../utils/Tips'

export default class member extends base {
  /**
   * 登录
   */
  static async login(logNameVal, pwdVal) {
    try {
      const { code } = await wepy.login()
      const url = `${this.baseUrl}/auth/login`
      const result = await this.post(url, {
        userName: logNameVal,
        password: pwdVal,
        loginCode: code
      })
      if (result) {
        if (result.code === 1) {
          auth.loginProsses(result.data)
          return true
        } else if (result.code === -1) {
          Tip.error((result.errorMag && result.errorMag) || '登录失败请重试')
          return false
        }
      }
    } catch (error) {
      console.error(`[member] 登录 error:${error}`)
      return false
    }
  }
}
