import apiClient from './apiClient'

export const userAPI = {
  // Get all users (admin/lead-guide only)
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/users?${queryString}` : '/users'
    return apiClient.get(endpoint)
  },

  // Get single user
  getUser: async (userId) => {
    return apiClient.get(`/users/${userId}`)
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    return apiClient.patch(`/users/${userId}`, userData)
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    return apiClient.delete(`/users/${userId}`)
  },

  // Deactivate user (admin only)
  deactivateUser: async (userId) => {
    return apiClient.patch(`/users/${userId}/deactivate`)
  },

  // Upload user photo
  uploadPhoto: async (userId, photo) => {
    const formData = new FormData()
    formData.append('photo', photo)
    return apiClient.post(`/users/${userId}/photo`, formData)
  },
}
