import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import dailySlice from '../features/DailySchedule/dailySlice';
import loginSlice from '../features/Login/loginSlice';
import profileSlice from '../features/Profile/profileSlice';
import registerSlice from '../features/Register/registerSlice';

export const store = configureStore({
  reducer: {
    login:loginSlice,
    register:registerSlice,
    profile:profileSlice,
    daily:dailySlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
