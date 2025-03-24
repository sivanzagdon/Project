import { post } from './axios.service'

interface TicketData {
  mainCategory: string
  subCategory: string
  building: string
  site: string
  description: string
}

export interface TicketResponse {
  message: string
  sla_time: number
  risk_score: number
  recommendations: string[]
  request_id: string
}

export class RequestService {
  createTicket = async (ticketData: TicketData): Promise<TicketResponse> => {
    const response = await post('/api/tickets', ticketData)
    console.log('Adding a new service request received:', response.data)
    return response.data as TicketResponse
  }
}

export const requestService = new RequestService()
