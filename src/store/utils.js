import { getStore } from 'wepy-redux'
import {UpdateUserAction} from './actions'
import auth from '../api/auth'

// 加载状态
let isLoading = false
// 等待队列
let loadingQueue = []
// 元数据
const meta = {}
// 超时时间
const CACHE_TIMEOUT = 5 * 60 * 1000
// 初始化需要加载的字段
const INIT_KEY = ['user']

const get = key => {
  return state => {
    return state.userReducer[key]
  }
}

const updateUser = user => {
  const store = getStore()
  const state = store.getState()
  const orignUser = state.userReducer['user']
  const userForUpdate = Object.assign(orignUser, user)
  store.dispatch(UpdateUserAction(userForUpdate))
}

const init = async () => {
  if (isLoading) {
    console.info('[store] store is loading, wait completed')
    return new Promise(resolve => {
      const callback = () => {
        resolve()
      }
      loadingQueue.push(callback)
    })
  } else {
    // 开始初始化
    console.info('[store] start init store')
    isLoading = true
    await initUser(...INIT_KEY)
    // 清空等待队列
    console.info('[store] store init completed')
    isLoading = false
    loadingQueue.forEach(callback => callback())
    loadingQueue = []
  }
}

/**
 * 判断是否存在
 */
const exists = key => {
  // 判断是否初始化过
  if (meta[key] == null || meta[key].init != true) {
    return false
  }
  // 判断是否过期
  const updateTime = meta[key].updateTime
  const interval = new Date().getTime() - updateTime
  return interval < CACHE_TIMEOUT
}

const initUser = async (field = 'user') => {
  if (!exists(field)) {
    const userResult = await auth.login()
    updateUser(userResult)
    updateMeta(field)
  }
}

/**
 * 更新元数据
 */
const updateMeta = (field) => {
  if (meta[field] == null) {
    meta[field] = {}
    meta[field].init = true
  }
  meta[field].updateTime = new Date().getTime()
}

export default {get, updateUser, init}
