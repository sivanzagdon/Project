export interface TicketData {
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

export interface OpenRequest {
  id: string
  'Created on': string
  'Request status': string
  MainCategory: string
  SubCategory: string
  Building: string
  Site: string
  'Request description': string
}
