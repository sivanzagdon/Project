import { post } from './axios.service'

interface TicketData {
  MainCategory: string
  SubCategory: string
  Building: string
  Site: string
  Description: string
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
    console.log(ticketData)
    return response.data as TicketResponse
  }
}

export const requestService = new RequestService()
