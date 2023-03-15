import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Iflight } from '../../models/flight';
import { getAllFlights, pullFlights } from './dailyAPI';

export interface dailyState {
  flights: Iflight[]
  refresh:boolean
}

const initialState: dailyState = {
  flights:[],
  refresh: false,

};

export const getFlightsAsync = createAsyncThunk(
  'daily/getAllFlights',
  async (accessToken:string) => {
    const response = await getAllFlights(accessToken);
    return response;
  }
);
export const pullFlightsAsync = createAsyncThunk(
  'daily/pullFlights',
  async () => {
    const response = await pullFlights();
    return response;
  }
);

export const dailySlice = createSlice(
  {
    name: 'daily',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      builder
        .addCase(getFlightsAsync.fulfilled, (state, action) => {
          state.flights = action.payload
        })
        .addCase(pullFlightsAsync.fulfilled, (state) => {
          state.refresh = !state.refresh
        })
    },
  });

// export const { } = dailySlice.actions;

export const selectFlights = (state: RootState) => state.daily.flights;
export const selectFlightsRefresh = (state: RootState) => state.daily.refresh;

export default dailySlice.reducer;