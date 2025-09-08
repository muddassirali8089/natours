import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api/authAPI'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Initialize auth state from localStorage
const initializeAuth = () => {
  const token = localStorage.getItem('token')
  return {
    ...initialState,
    isAuthenticated: !!token,
  }
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear token from localStorage first
      localStorage.removeItem('token')
      
      // Call logout API to clear server-side cookies
      await authAPI.logout()
      return null
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token')
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed')
    }
  }
)

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updatePassword(passwordData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password update failed')
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: initializeAuth(),
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.isAuthenticated = true
        state.error = null
        
        // Store token in localStorage for API requests
        if (action.payload.data.token) {
          localStorage.setItem('token', action.payload.data.token)
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logout.rejected, (state) => {
        // Even if logout API fails, clear the local state
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearAuth } = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
export const selectUserRole = (state) => state.auth.user?.roles?.[0] || 'user'
export const selectIsAdmin = (state) => state.auth.user?.roles?.includes('admin') || false

export default authSlice.reducer
