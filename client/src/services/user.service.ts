import { LoginResponse } from '../types/user.type'
import { post } from './axios.service'

export class UserService {
  updatePassword(empId: any, currentPassword: string, newPassword: string) {
    throw new Error('Method not implemented.')
  }
  updateUsername(empId: any, username: string) {
    throw new Error('Method not implemented.')
  }
  deleteAccount(empId: any) {
    throw new Error('Method not implemented.')
  }
  updatePreferences(empId: any, darkMode: boolean, notificationsEnabled: boolean) {
    throw new Error('Method not implemented.')
  }
  async login(empId: number, password: string): Promise<LoginResponse> {
    const data = {
      EmpID: empId,
      Password: password,
    }
    console.log(data)
    console.log('user service')

    try {
      const response = await post('/login', data)
      console.log('Response received:', response.data)
      return response.data as LoginResponse
    } catch (error: any) {
      const status = error?.response?.status
      console.error('Error occurred:', error)
      let serverMessage = 'An unknown error occurred.'

      switch (status) {
        case 401:
          serverMessage = 'Invalid email or password.'
          break
        case 500:
          serverMessage = 'Server error. Please try again later.'
          break
        default:
          console.log(error)
          serverMessage = 'Unexpected error occurred.'
      }

      console.warn(`Login Service Error [${status}]:`, serverMessage)
      throw new Error(serverMessage)
    }
  }
}

export const userService = new UserService()
