import { Promotion } from '@/types/promotion';
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
'use server'

export interface Partner {
  id: number
  name: string
}

export interface PromotionsResponse {
  success: boolean
  data: Promotion[]
}

export interface PartnersResponse {
  success: boolean
  data: Partner[]
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

export async function getPartners(): Promise<Partner[]> {
  try {
    const response = await fetch(`${API_URL}/fetch_partners_by_name/`, {
      next: { revalidate: 0 }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch partners')
    }

    const data: PartnersResponse = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export async function modifyPromotion(formData: FormData): Promise<{ success: boolean; message: string; promotion?: Promotion }> {
  try {
    const response = await fetch(`${API_URL}/modify_promotion/`, {
      method: 'PUT',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      message: 'Promotion modified successfully',
      promotion: data.promotion,
    }
  } catch (error) {
    console.error('Error modifying promotion:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to modify promotion',
    }
  }
}

export async function deletePromotion(promotionId: number): Promise<{ success: boolean; message: string }> {
  console.log('deletePromotion called with ID:', promotionId)
  try {
    const response = await fetch(`${API_URL}/delete_promotion/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promotion_id: promotionId }),
    })

    console.log('Delete response status:', response.status)
    const data = await response.json()
    console.log('Delete response data:', data)

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      message: 'Promotion deleted successfully',
    }
  } catch (error) {
    console.error('Error in deletePromotion:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete promotion',
    }
  }
}

