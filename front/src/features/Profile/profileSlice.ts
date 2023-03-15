import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import IProfile from '../../models/profile';
import { logout } from '../Login/loginSlice';
import { addProfile, delProfile, delprofileImages, getAllProfile, getProfile, profileImages, updProfile } from './profileAPI';


export interface profileState {
  profiles:IProfile[]
  allProfiles?:any
  refresh:boolean
  status?:Boolean
}

const initialState: profileState = {
  profiles:[],
  refresh:false
};

export const getProfileAsync = createAsyncThunk(
  'profile/getProfile',
  async (obj: { id:number, accessToken: string }) => {
    const response = await getProfile(obj);
    return response;
  }
);
export const addProfileAsync = createAsyncThunk(
  'profile/addProfile',
  async (obj: { pro: IProfile, accessToken: string }) => {
    const response = await addProfile(obj);
    return response;
  }
);
export const updProfileAsync = createAsyncThunk(
  'profile/updProfile',
  async (obj: { pro: IProfile, accessToken: string }) => {
    const response = await updProfile(obj);
    return response;
  }
);
export const delProfileAsync = createAsyncThunk(
  'profile/delProfile',
  async (obj: { id: number, accessToken: string }) => {
    const response = await delProfile(obj);
    return response;
  }
);
export const ProfilePicAsync = createAsyncThunk(
  'profile/profileImages',
  async (obj: { id: number,pic:File, accessToken: string }) => {
    const response = await profileImages(obj);
    return response;
  }
);
export const delProfilePicAsync = createAsyncThunk(
  'profile/delprofileImages',
  async (obj: { id: number, accessToken: string }) => {
    const response = await delprofileImages(obj);
    return response;
  }
);
export const getAllProfileAsync=createAsyncThunk(
  "profile/getAllProfile",
  async (accessToken:string)=>{
    const response:any = await getAllProfile(accessToken);
    return response;
  }
)

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile:(state)=>
    {
      state.profiles = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.profiles = [action.payload]
      })
      .addCase(updProfileAsync.fulfilled, (state) => {
        state.refresh = !state.refresh
      })
      .addCase(addProfileAsync.fulfilled, (state) => {
        state.refresh = !state.refresh
      })
      .addCase(delProfileAsync.fulfilled, (state) => {
        state.refresh = !state.refresh
        logout()
      })
      .addCase(ProfilePicAsync.fulfilled, (state) => {
        state.refresh = !state.refresh
      })
      .addCase(delProfilePicAsync.fulfilled, (state) => {
        state.refresh = !state.refresh
      })
      .addCase(getAllProfileAsync.fulfilled, (state, action) => {
        state.allProfiles = action.payload
      })
      .addCase(getAllProfileAsync.rejected, (state) => {
        state.status = false
      })
      .addCase(getProfileAsync.rejected, (state) => {
        state.status = false
      })
  }
});

export const { resetProfile } = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile.profiles;
export const selectallProfile = (state: RootState) => state.profile.allProfiles;
export const selectProfileRefresh = (state: RootState) => state.profile.refresh;
export const selectReqStatus = (state: RootState) => state.profile.status;

export default profileSlice.reducer;
