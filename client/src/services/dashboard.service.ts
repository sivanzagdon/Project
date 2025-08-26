import { get } from './axios.service'
import {
  DashboardData,
  TimeDataList,
  DashboardOpenRequests,
} from '../types/dashboard.type'

// Service class for handling dashboard-related API calls and data fetching
export class DashboardService {
  // Fetches comprehensive dashboard data organized by sites, years and months
  getDashboardData = async (): Promise<DashboardData> => {
    try {
      const response = await get('/api/dashboard')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw new Error('Failed to fetch dashboard data')
    }
  }

  // Fetches time-based data for service requests including creation and resolution dates
  getTimeData = async (): Promise<TimeDataList> => {
    try {
      const response = await get('/api/dashboard-data')
      return response.data
    } catch (error) {
      console.error('Error fetching time data:', error)
      throw new Error('Failed to fetch time data')
    }
  }

  // Returns the total count of currently open service requests
  getNumOfOpenRequests = async (): Promise<number> => {
    try {
      const response = await get('/api/num-open-requests')
      return response.data.numOfRequests
    } catch (error) {
      console.error('Error get num of open requests:', error)
      throw new Error('Error get num of open requests')
    }
  }

  // Fetches detailed dashboard data for open requests including risk analysis and predictions
  getOpenRequestsDashboardData = async (): Promise<DashboardOpenRequests> => {
    try {
      const response = await get('/api/dashboard-open-requests')
      console.log('test', response.data)
      return response.data
    } catch (error) {
      console.error('Error get data open requests:', error)
      throw new Error('Error get data of open requests')
    }
  }
}
