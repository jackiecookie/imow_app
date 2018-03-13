import {UpdateUserAction} from '../actions/index'
import { handleActions } from 'redux-actions'

const defaultState = {
  user: {
    thirdSession: null,
    displayName: '未绑定',
    imowUser: false
  }
}

export default handleActions({
  [UpdateUserAction] (state, action) {
    const {key, value} = action.payload
    console.info(`[dispatch] save : ${key} value : ${value}`)
    return {
      ...state,
      [key]: value
    }
  }
}, defaultState)
