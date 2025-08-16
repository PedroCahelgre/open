import { Information, CreateInformationRequest, UpdateInformationRequest, SearchFilters, SearchResult } from '@/types'

const API_BASE = '/api'

export const informationService = {
  async getInformation(contextId?: string): Promise<Information[]> {
    const params = new URLSearchParams()
    if (contextId) {
      params.append('contextId', contextId)
    }
    
    const response = await fetch(`${API_BASE}/information?${params}`)
    if (!response.ok) {
      throw new Error('Failed to fetch information')
    }
    return response.json()
  },

  async getInformationById(id: string): Promise<Information> {
    const response = await fetch(`${API_BASE}/information/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch information')
    }
    return response.json()
  },

  async createInformation(data: CreateInformationRequest): Promise<Information> {
    const response = await fetch(`${API_BASE}/information`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create information')
    }
    return response.json()
  },

  async updateInformation(id: string, data: UpdateInformationRequest): Promise<Information> {
    const response = await fetch(`${API_BASE}/information/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update information')
    }
    return response.json()
  },

  async deleteInformation(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/information/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete information')
    }
  },

  async searchInformation(filters: SearchFilters): Promise<SearchResult> {
    const response = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    })
    if (!response.ok) {
      throw new Error('Failed to search information')
    }
    return response.json()
  },
}