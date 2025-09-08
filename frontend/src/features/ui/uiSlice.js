import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  notifications: [],
  theme: 'light',
  loading: {
    global: false,
    page: false,
  },
}

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      }
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      }
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload
    },
    setPageLoading: (state, action) => {
      state.loading.page = action.payload
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  setGlobalLoading,
  setPageLoading,
} = uiSlice.actions

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectModal = (state) => state.ui.modal
export const selectNotifications = (state) => state.ui.notifications
export const selectTheme = (state) => state.ui.theme
export const selectGlobalLoading = (state) => state.ui.loading.global
export const selectPageLoading = (state) => state.ui.loading.page

export default uiSlice.reducer
