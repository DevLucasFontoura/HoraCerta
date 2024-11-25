import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import timeRecordReducer from '../store/slices/timeRecordSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    timeRecord: timeRecordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
