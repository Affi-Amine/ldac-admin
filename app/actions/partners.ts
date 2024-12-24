'use server'

import { Partner, PartnersResponse } from '@/types/partner'

const API_URL = 'http://34.227.37.16:8000/admin-dashboard'

export async function getPartners(): Promise<Partner[]> {
  try {
    const response = await fetch(`${API_URL}/get-all-partners/`, {
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

export async function deletePartner(firebase_uid: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/delete_partner/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebase_uid }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: data.success,
      message: data.message,
    }
  } catch (error) {
    console.error('Error deleting partner:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete partner',
    }
  }
}

export async function modifyPartner(partner: {
  firebase_uid: string
  name: string
  contact_email: string
  phone_number: string
}): Promise<{ success: boolean; message: string; partner?: Partner }> {
  try {
    const response = await fetch(`${API_URL}/modify_partner/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partner),
    })

    const data = await response.json()
    return {
      success: data.success,
      message: data.message,
      partner: data.partner,
    }
  } catch (error) {
    console.error('Error modifying partner:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to modify partner',
    }
  }
}

export async function addPartner(partner: {
  name: string
  contact_email: string
  phone_number: string
  password: string
}): Promise<{ success: boolean; message: string; partner?: Partner }> {
  try {
    const response = await fetch(`${API_URL}/add-partner/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partner),
    })

    const data = await response.json()
    return {
      success: data.success,
      message: data.message,
      partner: data.partner,
    }
  } catch (error) {
    console.error('Error adding partner:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add partner',
    }
  }
}

