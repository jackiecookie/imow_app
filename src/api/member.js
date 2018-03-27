import base from './base'
import auth from './auth'
import wepy from 'wepy'
import Tip from '../utils/Tips'
import store from '../store/utils'

export default class member extends base {
  /**
   * 登录
   */
  static async login(logNameVal, pwdVal) {
    const { code } = await wepy.login()
    const url = `${this.baseUrl}/api/user/login`
    const result = await this.post(url, {
      userName: logNameVal,
      password: pwdVal,
      loginCode: code
    })
    if (result && result.status === 0) {
      await this.setLoginTag(result)
      return true
    }
  }

/**
   * 登录
   */
  static async register(logNameVal, pwdVal, vcode) {
    const { code } = await wepy.login()
    const url = `${this.baseUrl}/api/user/register`
    const result = await this.post(url, {
      userName: logNameVal,
      password: pwdVal,
      vcode: vcode,
      loginCode: code
    })
    if (result && result.status === 0) {
      await this.setLoginTag(result)
      return true
    }
  }

  async setLoginTag(user) {
    await auth.setSession(user.thirdSession)
    await store.updateUser({
      thirdSession: user.thirdSession,
      imowUser: user.imowUser
    })
  }
}
