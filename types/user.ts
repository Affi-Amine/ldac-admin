export interface User {
  firebase_uid: string
  username: string
  email: string
  phone: string
  created_at: string
}

export interface UsersResponse {
  success: boolean
  data: User[]
}

export interface ErrorResponse {
  success: boolean
  message: string
}

