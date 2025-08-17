import { post, get } from './axios.service'
import { OpenRequest, TicketData, TicketResponse } from '../types/request.type'

export class RequestService {
  createTicket = async (ticketData: TicketData): Promise<TicketResponse> => {
    const response = await post('/api/tickets', ticketData)
    console.log('Adding a new service request received:', response.data)

    return response.data as TicketResponse
  }

  getOpenRequests = async (): Promise<OpenRequest[]> => {
    try {
      const response = await get('/api/open-requests')
      console.log('Open requests:', response.data)
      return response.data as OpenRequest[]
    } catch (error) {
      console.error('Failed to fetch open requests:', error)
      return []
    }
  }
}

export const requestService = new RequestService()
