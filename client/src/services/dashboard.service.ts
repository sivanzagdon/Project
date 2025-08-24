import { get } from './axios.service'
import {
  DashboardData,
  TimeDataList,
  DashboardOpenRequests,
} from '../types/dashboard.type'

export class DashboardService {
  getDashboardData = async (): Promise<DashboardData> => {
    try {
      const response = await get('/api/dashboard')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw new Error('Failed to fetch dashboard data')
    }
  }

  getTimeData = async (): Promise<TimeDataList> => {
    try {
      const response = await get('/api/dashboard-data')
      return response.data
    } catch (error) {
      console.error('Error fetching time data:', error)
      throw new Error('Failed to fetch time data')
    }
  }

  getNumOfOpenRequests = async (): Promise<number> => {
    try {
      const response = await get('/api/num-open-requests')
      return response.data.numOfRequests
    } catch (error) {
      console.error('Error get num of open requests:', error)
      throw new Error('Error get num of open requests')
    }
  }

  getOpenRequestsDashboadData = async (): Promise<DashboardOpenRequests> => {
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
