import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Iflight } from '../../models/flight';
import Iuser from '../../models/user';
import { getAllFlights, getAllUsers, pullFlights } from './dailyAPI';

export interface dailyState {
  flights: Iflight[]
  refresh:boolean
  users: any[]
  loading: boolean
}

const initialState: dailyState = {
  flights:[],
  refresh: false,
  users: [],
  loading:true,
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
export const getAllUsersAsync = createAsyncThunk(
  'daily/getAllUsers',
  async () => {
    const response = await getAllUsers();
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
          state.loading = false
        })
        .addCase(pullFlightsAsync.fulfilled, (state) => {
          state.refresh = !state.refresh
        })
        .addCase(getAllUsersAsync.fulfilled, (state,action) => {
          state.users = action.payload 
        })
    },
  });

// export const { } = dailySlice.actions;

export const selectFlights = (state: RootState) => state.daily.flights;
export const selectFlightsRefresh = (state: RootState) => state.daily.refresh;
export const selectAllUsers = (state: RootState) => state.daily.users;
export const selectFlightsPending = (state: RootState) => state.daily.loading;


export default dailySlice.reducer;