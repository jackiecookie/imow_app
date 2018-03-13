import { getStore } from 'wepy-redux'
import {UpdateUserAction} from './actions'

const get = key => {
  return state => {
    return state.userReducer[key]
  }
}

const updateUser = user => {
  const store = getStore()
  store.dispatch(UpdateUserAction(user))
}

export default {get, updateUser}
