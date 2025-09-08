import apiClient from './apiClient'

export const tourAPI = {
  // Get all tours with optional filters
  getTours: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/tours?${queryString}` : '/tours'
    return apiClient.get(endpoint)
  },

  // Get single tour
  getTour: async (tourId) => {
    return apiClient.get(`/tours/${tourId}`)
  },

  // Create tour (authenticated)
  createTour: async (tourData) => {
    return apiClient.post('/tours', tourData)
  },

  // Update tour (authenticated)
  updateTour: async (tourId, tourData) => {
    return apiClient.patch(`/tours/${tourId}`, tourData)
  },

  // Delete tour (admin only)
  deleteTour: async (tourId) => {
    return apiClient.delete(`/tours/${tourId}`)
  },

  // Get top 5 cheap tours
  getTopTours: async () => {
    return apiClient.get('/tours/top-5-cheap')
  },

  // Get tour statistics (admin only)
  getTourStats: async () => {
    return apiClient.get('/tours/stats')
  },

  // Get monthly plan (admin/lead-guide only)
  getMonthlyPlan: async (year) => {
    return apiClient.get(`/tours/monthly-plan/${year}`)
  },

  // Get tours within radius
  getToursWithin: async (distance, latlng, unit = 'mi') => {
    return apiClient.get(`/tours/tours-within/${distance}/center/${latlng}/unit/${unit}`)
  },

  // Get distances to tours
  getDistances: async (latlng, unit = 'mi') => {
    return apiClient.get(`/tours/tours-distances/${latlng}/unit/${unit}`)
  },

  // Upload tour images
  uploadTourImages: async (tourId, images) => {
    const formData = new FormData()
    images.forEach((image, index) => {
      formData.append(`images`, image)
    })
    return apiClient.post(`/tours/${tourId}/images`, formData)
  },
}
