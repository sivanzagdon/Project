export interface TicketData {
  MainCategory: string
  SubCategory: string
  Building: string
  Site: string
  Description: string
}

export type RiskBucket = 'Low' | 'Medium' | 'High'

export type TicketResponse = {
  predicted_hours?: number
  sla_hours?: number
  overdue_probability?: number
  risk_bucket?: RiskBucket
  recommendations?: string[]
  sla_time?: number
  risk_score: number
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
