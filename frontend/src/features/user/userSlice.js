import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userAPI } from '../../services/api/userAPI'

const initialState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 10,
  },
}

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUsers(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  }
)

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUser(userId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateUser(userId, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await userAPI.deleteUser(userId)
      return userId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user')
    }
  }
)

export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userAPI.deactivateUser(userId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate user')
    }
  }
)

// User slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload.data
        state.pagination = {
          ...state.pagination,
          totalUsers: action.payload.total,
          totalPages: Math.ceil(action.payload.total / state.pagination.usersPerPage),
        }
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch single user
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.data
        state.error = null
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.users.findIndex(user => user._id === action.payload.data._id)
        if (index !== -1) {
          state.users[index] = action.payload.data
        }
        if (state.currentUser?._id === action.payload.data._id) {
          state.currentUser = action.payload.data
        }
        state.error = null
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = state.users.filter(user => user._id !== action.payload)
        if (state.currentUser?._id === action.payload) {
          state.currentUser = null
        }
        state.error = null
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Deactivate user
      .addCase(deactivateUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.users.findIndex(user => user._id === action.payload.data._id)
        if (index !== -1) {
          state.users[index] = action.payload.data
        }
        if (state.currentUser?._id === action.payload.data._id) {
          state.currentUser = action.payload.data
        }
        state.error = null
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentUser, setPage } = userSlice.actions

// Selectors
export const selectUsers = (state) => state.users.users
export const selectCurrentUser = (state) => state.users.currentUser
export const selectUsersLoading = (state) => state.users.isLoading
export const selectUsersError = (state) => state.users.error
export const selectUsersPagination = (state) => state.users.pagination

export default userSlice.reducer
