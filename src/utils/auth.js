import base from './base'
import wepy from 'wepy'
import store from '../store/utils'
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

    userInfo && store.updateUser(userInfo)
  }

  /**
   * 获取用户信息
   */
  static async user(param = {block: false, redirect: false}, userInfo) {
    try {
      // 检查
      if (this.hasConfig('user')) {
       // store.save('user', this.getConfig('user'));
        return true
      }
      console.info('[auth] user check fail')
      // 重新登录
      await this.doLogin()
      // 获取用户信息
      const rawUser = userInfo != null ? userInfo : await wepy.getUserInfo()
      // 检查是否通过
      // await this.checkUserInfo(rawUser);
      // 解密信息
      const {user} = await this.decodeUserInfo(rawUser)
      // 保存登录信息
      await this.setConfig('user', user)
     // store.save('user', user);
      return true
    } catch (error) {
      console.error('[auth] 授权失败', error)
      if (param.block) {
        const url = `/pages/home/login?redirect=${param.redirect}`
        if (param.redirect) {
          WxUtils.backOrRedirect(url)
        } else {
          WxUtils.backOrNavigate(url)
        }
      }
      return false
    }
  }

  /**
   * 执行登录操作
   */
  static async doLogin() {
    console.info(`[auth] start login `)
    const { code } = await wepy.login()
    const url = `${this.baseUrl}/auth/userLogin`
    try {
      const result = await this.post(url, {loginCode: code})
      console.info(`[auth] login complete :${result.thirdSession} `)
      await this.setConfig('third_session', result.thirdSession)
      return result
    } catch (error) {
      console.log(error)
      console.error(`[auth] 登录 error:${error}`)
    }
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
