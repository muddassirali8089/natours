import apiClient from './apiClient'

export const authAPI = {
  // Login user
  login: async (credentials) => {
    return apiClient.post('/users/login', credentials)
  },

  // Register user
  signup: async (userData) => {
    return apiClient.post('/users/signup', userData)
  },

  // Logout user
  logout: async () => {
    return apiClient.post('/users/logout')
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient.get('/users/me')
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiClient.patch('/users/updateMe', userData)
  },

  // Update password
  updatePassword: async (passwordData) => {
    return apiClient.patch('/users/updateMyPassword', passwordData)
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiClient.post('/users/forgotPassword', { email })
  },

  // Reset password
  resetPassword: async (token, passwordData) => {
    return apiClient.patch(`/users/resetPassword/${token}`, passwordData)
  },

  // Verify email
  verifyEmail: async (token) => {
    return apiClient.patch(`/users/verify-email/${token}`)
  },

  // Delete account
  deleteAccount: async () => {
    return apiClient.delete('/users/deleteMe')
  },
}
