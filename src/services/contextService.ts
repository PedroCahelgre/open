import { Context, CreateContextRequest, UpdateContextRequest } from '@/types'

const API_BASE = '/api'

export const contextService = {
  async getContexts(): Promise<Context[]> {
    const response = await fetch(`${API_BASE}/contexts`)
    if (!response.ok) {
      throw new Error('Failed to fetch contexts')
    }
    return response.json()
  },

  async getContext(id: string): Promise<Context> {
    const response = await fetch(`${API_BASE}/contexts/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch context')
    }
    return response.json()
  },

  async createContext(data: CreateContextRequest): Promise<Context> {
    const response = await fetch(`${API_BASE}/contexts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create context')
    }
    return response.json()
  },

  async updateContext(id: string, data: UpdateContextRequest): Promise<Context> {
    const response = await fetch(`${API_BASE}/contexts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update context')
    }
    return response.json()
  },

  async deleteContext(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/contexts/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete context')
    }
  },
}