import { LoginResponse } from '../types/user.type'
import { post } from './axios.service'

export class UserService {
  async updatePassword(empId: any, currentPassword: string, newPassword: string) {
    try {
      const response = await post('/update-password', {
        empId,
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error: any) {
      console.error('Error updating password:', error)
      throw new Error('Failed to update password')
    }
  }

  async updateUsername(empId: any, username: string) {
    try {
      const response = await post('/update-username', {
        empId,
        username
      })
      return response.data
    } catch (error: any) {
      console.error('Error updating username:', error)
      throw new Error('Failed to update username')
    }
  }

  async updateAccountInfo(empId: any, accountData: {
    company: string
    department: string
    position: string
    level?: string
    employeeId?: string
    hireDate?: string
  }) {
    try {
      const response = await post('/update-account-info', {
        empId,
        ...accountData
      })
      return response.data
    } catch (error: any) {
      console.error('Error updating account info:', error)
      throw new Error('Failed to update account information')
    }
  }

  async updateDashboardPreferences(empId: any, dashboardData: {
    defaultPage: string
    autoRefreshInterval: number
    cardLayout: string
    defaultFilter: string
  }) {
    try {
      const response = await post('/update-dashboard-preferences', {
        empId,
        ...dashboardData
      })
      return response.data
    } catch (error: any) {
      console.error('Error updating dashboard preferences:', error)
      throw new Error('Failed to update dashboard preferences')
    }
  }

  async updatePrivacySettings(empId: any, privacyData: {
    profileVisibility: string
    activityStatus: string
  }) {
    try {
      const response = await post('/update-privacy-settings', {
        empId,
        ...privacyData
      })
      return response.data
    } catch (error: any) {
      console.error('Error updating privacy settings:', error)
      throw new Error('Failed to update privacy settings')
    }
  }

  async getUserPreferences(empId: any) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-user-preferences?empId=${empId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user preferences')
      }
      return await response.json()
    } catch (error: any) {
      console.error('Error getting user preferences:', error)
      throw new Error('Failed to get user preferences')
    }
  }

  async deleteAccount(empId: any) {
    try {
      const response = await post('/delete-account', { empId })
      return response.data
    } catch (error: any) {
      console.error('Error deleting account:', error)
      throw new Error('Failed to delete account')
    }
  }

  async updatePreferences(empId: any, darkMode: boolean, notificationsEnabled: boolean) {
    try {
      const response = await post('/update-preferences', {
        empId,
        darkMode,
        notificationsEnabled
      })
      return response.data
    } catch (error: any) {
      console.error('Error updating preferences:', error)
      throw new Error('Failed to update preferences')
    }
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
