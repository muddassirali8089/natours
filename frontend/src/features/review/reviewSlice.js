import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { reviewAPI } from '../../services/api/reviewAPI'

const initialState = {
  reviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    reviewsPerPage: 10,
  },
}

// Async thunks
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getReviews(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews')
    }
  }
)

export const fetchTourReviews = createAsyncThunk(
  'reviews/fetchTourReviews',
  async (tourId, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getTourReviews(tourId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tour reviews')
    }
  }
)

export const fetchReview = createAsyncThunk(
  'reviews/fetchReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getReview(reviewId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch review')
    }
  }
)

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ tourId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.createReview(tourId, reviewData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review')
    }
  }
)

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.updateReview(reviewId, reviewData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review')
    }
  }
)

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewAPI.deleteReview(reviewId)
      return reviewId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review')
    }
  }
)

// Review slice
const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentReview: (state) => {
      state.currentReview = null
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response format: { status: "success", results: number, data: { reviews: [...] } }
        state.reviews = action.payload.data.reviews || action.payload.data
        state.pagination = {
          ...state.pagination,
          totalReviews: action.payload.results || action.payload.total,
          totalPages: Math.ceil((action.payload.results || action.payload.total) / state.pagination.reviewsPerPage),
        }
        state.error = null
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch tour reviews
      .addCase(fetchTourReviews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTourReviews.fulfilled, (state, action) => {
        state.isLoading = false
        // Debug: Log the API response
        console.log('fetchTourReviews.fulfilled - action.payload:', action.payload)
        
        // Handle the API response format: { status: "success", results: number, data: { reviews: [...] } }
        const reviews = action.payload.data.reviews || action.payload.data
        console.log('fetchTourReviews.fulfilled - extracted reviews:', reviews)
        
        state.reviews = reviews
        state.error = null
      })
      .addCase(fetchTourReviews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch single review
      .addCase(fetchReview.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReview.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response format: { status: "success", data: { review: {...} } }
        state.currentReview = action.payload.data.review || action.payload.data
        state.error = null
      })
      .addCase(fetchReview.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Create review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response format: { status: "success", data: { review: {...} } }
        const newReview = action.payload.data.review || action.payload.data
        state.reviews.unshift(newReview)
        state.error = null
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle the API response format: { status: "success", data: { review: {...} } }
        const updatedReview = action.payload.data.review || action.payload.data
        const index = state.reviews.findIndex(review => review._id === updatedReview._id)
        if (index !== -1) {
          state.reviews[index] = updatedReview
        }
        if (state.currentReview?._id === updatedReview._id) {
          state.currentReview = updatedReview
        }
        state.error = null
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false
        state.reviews = state.reviews.filter(review => review._id !== action.payload)
        if (state.currentReview?._id === action.payload) {
          state.currentReview = null
        }
        state.error = null
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentReview, setPage } = reviewSlice.actions

// Selectors
export const selectReviews = (state) => state.reviews.reviews
export const selectCurrentReview = (state) => state.reviews.currentReview
export const selectReviewsLoading = (state) => state.reviews.isLoading
export const selectReviewsError = (state) => state.reviews.error
export const selectReviewsPagination = (state) => state.reviews.pagination

export default reviewSlice.reducer
