import {SAVE} from '../types/user'
import { handleActions } from 'redux-actions'

const defaultUser = {
  thirdSession: null,
  displayName: '未绑定',
  imowUser: false
}

export default handleActions({
  [SAVE] (state, action) {
    const {user} = action.payload
    return user
  }
}, defaultUser)
