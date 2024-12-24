export interface Partner {
  partner_id: number
  firebase_uid: string
  name: string
  contact_email: string
  phone_number: string
  created_at: string
}

export interface PartnersResponse {
  success: boolean
  data: Partner[]
}

export interface ErrorResponse {
  success: boolean
  message: string
}

