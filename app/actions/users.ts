'use server'

import { User, UsersResponse } from '@/types/user'

const API_URL = 'http://34.227.37.16:8000/admin-dashboard'

export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_URL}/get_all_users/`, {
      next: { revalidate: 0 }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const data: UsersResponse = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function deleteUser(firebase_uid: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/delete_user/`, {
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
    console.error('Error deleting user:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete user',
    }
  }
}

