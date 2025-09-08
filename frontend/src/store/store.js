import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import tourReducer from '../features/tour/tourSlice'
import userReducer from '../features/user/userSlice'
import reviewReducer from '../features/review/reviewSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tours: tourReducer,
    users: userReducer,
    reviews: reviewReducer,
    ui: uiReducer,
  },
})
