import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import IRegisterUser from '../../models/register';
import { registerUser } from './registerAPI';

export interface registerState {
  status?:"success"|"failure"|null;
  registerModal: boolean;

}

const initialState: registerState = {
  registerModal: false,

};

export const registerAsync = createAsyncThunk(
  'register/registerUser',
  async (user: IRegisterUser) => {
    const response = await registerUser(user);
    return response;
  }
);

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    restStatus:(state)=>{
      state.status = null
    },
    setRegisterModalView: (state) => {
      state.registerModal = !state.registerModal
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.status = "failure";
      })
  },
});

export const { restStatus,setRegisterModalView } = registerSlice.actions;

export const selectStatus = (state: RootState) => state.register.status;
export const selectRegisterModal = (state: RootState) => state.register.registerModal;


export default registerSlice.reducer;
