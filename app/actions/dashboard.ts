'use server'

const API_URL = 'http://34.227.37.16:8000/admin-dashboard'

export interface DashboardStats {
  active_users_count: number
  used_promotions_count: number
  conversion_rate: number
  leads_generated: number
}

export interface WeeklyStats {
  promotions_used: number[]
  active_users: number[]
}

export interface MonthlyPerformance {
  leads_generated: number[]
  qr_codes_scanned: number[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('Fetching dashboard stats...')
    const response = await fetch(`${API_URL}/get_dashboard_stats/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Dashboard stats response not ok:', response.status)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Dashboard stats received:', data)
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch dashboard stats')
    }
    
    return data.data
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      active_users_count: 0,
      used_promotions_count: 0,
      conversion_rate: 0,
      leads_generated: 0
    }
  }
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  try {
    console.log('Fetching weekly stats...')
    const response = await fetch(`${API_URL}/get_weekly_stats/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Weekly stats response not ok:', response.status)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Raw weekly stats response:', data)
    if (data.success) {
      console.log('Parsed weekly stats:', data.data)
    }
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch weekly stats')
    }
    
    return data.data
  } catch (error) {
    console.error('Error fetching weekly stats:', error)
    return {
      promotions_used: [0, 0, 0, 0, 0, 0, 0],
      active_users: [0, 0, 0, 0, 0, 0, 0]
    }
  }
}

export async function getMonthlyPerformance(): Promise<MonthlyPerformance> {
  try {
    console.log('Fetching monthly performance...')
    const response = await fetch(`${API_URL}/get_monthly_performance/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Monthly performance response not ok:', response.status)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Raw monthly performance response:', data)
    if (data.success) {
      console.log('Parsed monthly performance:', data.data)
    }
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch monthly performance')
    }
    
    return data.data
  } catch (error) {
    console.error('Error fetching monthly performance:', error)
    return {
      leads_generated: [0, 0, 0, 0, 0, 0, 0],
      qr_codes_scanned: [0, 0, 0, 0, 0, 0, 0]
    }
  }
}

