import { configureStore } from '@reduxjs/toolkit';
import { cmsApi } from '../services/cms/cmsApi';
import seatSelectionReducer from './slices/seatSelectionSlice';

export const store = configureStore({
  reducer: {
    seatSelection: seatSelectionReducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cmsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
