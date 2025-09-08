import apiClient from './apiClient'

export const reviewAPI = {
  // Get all reviews
  getReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/reviews?${queryString}` : '/reviews'
    return apiClient.get(endpoint)
  },

  // Get reviews for a specific tour
  getTourReviews: async (tourId) => {
    return apiClient.get(`/tours/${tourId}/reviews`)
  },

  // Get single review
  getReview: async (reviewId) => {
    return apiClient.get(`/reviews/${reviewId}`)
  },

  // Create review (authenticated)
  createReview: async (tourId, reviewData) => {
    return apiClient.post(`/tours/${tourId}/reviews`, reviewData)
  },

  // Update review (authenticated)
  updateReview: async (reviewId, reviewData) => {
    return apiClient.patch(`/reviews/${reviewId}`, reviewData)
  },

  // Delete review (authenticated)
  deleteReview: async (reviewId) => {
    return apiClient.delete(`/reviews/${reviewId}`)
  },
}
