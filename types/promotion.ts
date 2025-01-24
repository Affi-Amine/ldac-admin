export interface Promotion {
  promotion_id: number
  name: string
  description: string
  pack_type: string
  valid_from: string
  valid_until: string
  usage_limit: number | null
  partner: string | null
  image: string | null
}

