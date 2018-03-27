import base from './base'
import wepy from 'wepy'
import WxUtils from '../utils/WxUtils'

/**
 * 权限服务类
 */
export default class auth extends base {
  /**
   * 一键登录
   */
  static async login() {
    let userInfo = null
    let needLogin = true
    let thirdSession = this.getConfig('third_session')
    console.info(`[auth] third_session : ${thirdSession} `)
    if (thirdSession) {
      // 检查网站session结果
      const sessionResult = await this.session(thirdSession)
      if (sessionResult.thirdSession && sessionResult.thirdSession === thirdSession) {
        needLogin = false
      } else {
        userInfo = sessionResult
      }
    }
    if (needLogin) {
      userInfo = await this.doLogin()
    }
    let result = {}
    result.thirdSession = userInfo.thirdSession
    result.imowUser = userInfo.imowUser
    await this.setSession(userInfo.thirdSession)
    const userInfoRaw = await this.userInfo()
    result.nickName = userInfoRaw.userInfo.nickName
    result.avatarUrl = userInfoRaw.userInfo.avatarUrl
    return result
  }

  static async setSession(thirdSession) {
    return await this.setConfig('third_session', thirdSession)
  }

  /**
   * 执行登录操作
   */
  static async doLogin() {
    console.info(`[auth] start login `)
    const { code } = await wepy.login()
    const url = `${this.baseUrl}/api/wxlogin`
    try {
      const result = await this.post(url, {loginCode: code})
      console.info(`[auth] login complete :${result.thirdSession} `)
      // await this.setConfig('third_session', result.thirdSession)
      return result
    } catch (error) {
      console.error(`[auth] 登录 error:${error}`)
    }
  }

   /**
   * 获取用户信息
   */
  static async userInfo() {
    const rawUser = await wepy.getUserInfo()
    return rawUser
  }

  /**
   * 获取会话
   */
  static async session(thirdSession) {
    const url = `${this.baseUrl}/auth/checkSession`
    const result = await this.post(url, {session: thirdSession})
    return result
  }

  /**
   * 读取权限值
   */
  static getConfig(key) {
    return wepy.$instance.globalData.auth[key]
  }

  /**
   * 检查是否存在权限制
   */
  static hasConfig(key) {
    const value = this.getConfig(key)
    return value != null && value !== ''
  }

  /**
   * 设置权限值
   */
  static async setConfig(key, value) {
    await wepy.setStorage({key: key, data: value})
    wepy.$instance.globalData.auth[key] = value
  }

  /**
   * 删除权限值
   */
  static async removeConfig(key) {
    console.info(`[auth] clear auth config [${key}]`)
    wepy.$instance.globalData.auth[key] = null
    await wepy.removeStorage({key: key})
  }
}
