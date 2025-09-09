// Base API client configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Create request with proper headers and credentials
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Get token from localStorage (if available)
    const token = localStorage.getItem('token')
    
    // Debug logging
    console.log('🔍 API Request Debug:', {
      endpoint,
      url,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      method: options.method || 'GET',
      fullToken: token // Add full token for debugging
    })
    
    const config = {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if token exists
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type']
    }

    // Debug: Log the actual headers being sent
    console.log('🔍 Request Headers:', config.headers)
    console.log('🔍 Request Config:', {
      method: config.method || 'GET',
      url,
      hasBody: !!config.body,
      bodyType: config.body ? config.body.constructor.name : 'none'
    })

    try {
      const response = await fetch(url, config)
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        // Enhanced error handling for authentication issues
        if (response.status === 401) {
          console.error('🚨 Authentication Error:', {
            status: response.status,
            message: data.message || data,
            endpoint,
            hasToken: !!token
          })
          
          // Clear invalid token
          if (token) {
            localStorage.removeItem('token')
            console.log('🗑️ Cleared invalid token from localStorage')
          }
        }
        
        throw new Error(data.message || data || `HTTP error! status: ${response.status}`)
      }

      return { data, status: response.status }
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // HTTP methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  // File upload helper
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })

    return this.post(endpoint, formData)
  }
}

// Create and export API client instance
export const apiClient = new ApiClient()
export default apiClient
