import { SAVE } from '../types/user'
import { createAction } from 'redux-actions'

export const UpdateUserAction = createAction(SAVE, (user) => {
  if (user) {
    return user
  } else {

  }
})
