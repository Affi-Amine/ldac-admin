'use server'

export interface Promotion {
  promotion_id: number
  name: string
  description: string
  pack_type: string
  valid_from: string
  valid_until: string
  usage_limit: number
  image?: string
  partner: string | null
}

export interface PromotionsResponse {
  success: boolean
  data: Promotion[]
}

const API_URL = 'http://34.227.37.16:8000/admin-dashboard'

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const response = await fetch(`${API_URL}/get_all_promotions/`, {
      next: { revalidate: 0 }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch promotions')
    }

    const data: PromotionsResponse = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return []
  }
}

export async function addPromotion(formData: FormData): Promise<{ success: boolean; message: string; promotion?: Promotion }> {
  try {
    const response = await fetch(`${API_URL}/add_promotion/`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      message: 'Promotion added successfully',
      promotion: data.promotion,
    }
  } catch (error) {
    console.error('Error adding promotion:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add promotion',
    }
  }
}

