import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { tourAPI } from '../../services/api/tourAPI'

const initialState = {
  tours: [],
  currentTour: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTours: 0,
    toursPerPage: 6,
  },
  filters: {
    search: '',
    difficulty: '',
    duration: '',
    priceRange: [0, 2000],
    rating: 0,
  },
  sort: 'price',
  stats: null,
  monthlyPlan: null,
}

// Async thunks
export const fetchTours = createAsyncThunk(
  'tours/fetchTours',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await tourAPI.getTours(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tours')
    }
  }
)

export const fetchTour = createAsyncThunk(
  'tours/fetchTour',
  async (tourId, { rejectWithValue }) => {
    try {
      const response = await tourAPI.getTour(tourId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tour')
    }
  }
)

export const createTour = createAsyncThunk(
  'tours/createTour',
  async (tourData, { rejectWithValue }) => {
    try {
      const response = await tourAPI.createTour(tourData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tour')
    }
  }
)

export const updateTour = createAsyncThunk(
  'tours/updateTour',
  async ({ tourId, tourData }, { rejectWithValue }) => {
    try {
      const response = await tourAPI.updateTour(tourId, tourData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tour')
    }
  }
)

export const deleteTour = createAsyncThunk(
  'tours/deleteTour',
  async (tourId, { rejectWithValue }) => {
    try {
      await tourAPI.deleteTour(tourId)
      return tourId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tour')
    }
  }
)

export const fetchTopTours = createAsyncThunk(
  'tours/fetchTopTours',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tourAPI.getTopTours()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top tours')
    }
  }
)

export const fetchTourStats = createAsyncThunk(
  'tours/fetchTourStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tourAPI.getTourStats()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tour stats')
    }
  }
)

export const fetchMonthlyPlan = createAsyncThunk(
  'tours/fetchMonthlyPlan',
  async (year, { rejectWithValue }) => {
    try {
      const response = await tourAPI.getMonthlyPlan(year)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly plan')
    }
  }
)

// Tour slice
const tourSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentTour: (state) => {
      state.currentTour = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        difficulty: '',
        duration: '',
        priceRange: [0, 2000],
        rating: 0,
      }
    },
    setSort: (state, action) => {
      state.sort = action.payload
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tours
      .addCase(fetchTours.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.isLoading = false
        state.tours = action.payload.data.tours
        state.pagination = {
          ...state.pagination,
          totalTours: action.payload.results,
          totalPages: Math.ceil(action.payload.results / state.pagination.toursPerPage),
        }
        state.error = null
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch single tour
      .addCase(fetchTour.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTour.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentTour = action.payload.data.tour
        state.error = null
      })
      .addCase(fetchTour.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Create tour
      .addCase(createTour.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createTour.fulfilled, (state, action) => {
        state.isLoading = false
        state.tours.unshift(action.payload.data)
        state.error = null
      })
      .addCase(createTour.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update tour
      .addCase(updateTour.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTour.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.tours.findIndex(tour => tour._id === action.payload.data._id)
        if (index !== -1) {
          state.tours[index] = action.payload.data
        }
        if (state.currentTour?._id === action.payload.data._id) {
          state.currentTour = action.payload.data
        }
        state.error = null
      })
      .addCase(updateTour.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete tour
      .addCase(deleteTour.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteTour.fulfilled, (state, action) => {
        state.isLoading = false
        state.tours = state.tours.filter(tour => tour._id !== action.payload)
        if (state.currentTour?._id === action.payload) {
          state.currentTour = null
        }
        state.error = null
      })
      .addCase(deleteTour.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch top tours
      .addCase(fetchTopTours.fulfilled, (state, action) => {
        state.tours = action.payload.data.tours // Fix: access the nested tours array
      })
      
      // Fetch tour stats
      .addCase(fetchTourStats.fulfilled, (state, action) => {
        state.stats = action.payload.data
      })
      
      // Fetch monthly plan
      .addCase(fetchMonthlyPlan.fulfilled, (state, action) => {
        state.monthlyPlan = action.payload.data
      })
  },
})

export const {
  clearError,
  clearCurrentTour,
  setFilters,
  clearFilters,
  setSort,
  setPage,
} = tourSlice.actions

// Selectors
export const selectTours = (state) => state.tours.tours
export const selectCurrentTour = (state) => state.tours.currentTour
export const selectToursLoading = (state) => state.tours.isLoading
export const selectToursError = (state) => state.tours.error
export const selectToursPagination = (state) => state.tours.pagination
export const selectToursFilters = (state) => state.tours.filters
export const selectToursSort = (state) => state.tours.sort
export const selectTourStats = (state) => state.tours.stats
export const selectMonthlyPlan = (state) => state.tours.monthlyPlan

export default tourSlice.reducer
