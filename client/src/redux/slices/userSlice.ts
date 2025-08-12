import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoginResponse } from '../../types/user.type'

interface UserInterface {
  empID: any
  isLoggedIn: boolean
  user_name: string | null
  token: string | null
}

const initialState: UserInterface = {
  isLoggedIn: false,
  user_name: null,
  token: null,
  empID: undefined
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state: UserInterface, action: PayloadAction<LoginResponse>) {
      state.isLoggedIn = true
      state.user_name = action.payload.user_name
      state.token = action.payload.token
    },
    logout(state: UserInterface) {
      state.isLoggedIn = false
      state.user_name = null
      state.token = null
    },
  },
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer
