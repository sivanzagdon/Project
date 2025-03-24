import { post } from './axios.service'

export interface LoginResponse {
  user_name: string
  token: string
}

export class UserService {
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
