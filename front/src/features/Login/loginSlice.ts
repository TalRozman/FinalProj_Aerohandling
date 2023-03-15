import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Iuser from '../../models/user';
import { resetProfile } from '../Profile/profileSlice';
import { changeUserPassword, userLogin, userLoginRemember } from './loginAPI';

export interface logInState {
  accessToken: string;
  refreshToken: string;
  logged: boolean;
  error?: string;
  remember: boolean;
  loginModal: boolean;
}

const initialState: logInState = {
  accessToken: "",
  refreshToken: "",
  logged: false,
  remember: false,
  loginModal: false,
};

export const loginAsync = createAsyncThunk(
  'login/userLogin',
  async (user: Iuser) => {
    const response = await userLogin(user);
    return response;
  }
);
export const rememberAsync = createAsyncThunk(
  'login/userLoginRemember',
  async (refreshToken: string) => {
    const response = await userLoginRemember(refreshToken);
    return response;
  }
);
export const changeUsrPwdAsync = createAsyncThunk(
  'login/changeUserPassword',
  async (myObj: {id:number,pwd:string,accessToken:string}) => {
    const response = await changeUserPassword(myObj);
    return response;
  }
);

export const loginSlice = createSlice(
  {
    name: 'login',
    initialState,
    reducers: {
      logout: (state) => {
        state.accessToken = "";
        sessionStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        state.logged = false;
        resetProfile()
      },
      rememberMe: (state, action) => {
        if (action.payload === true) {
          state.remember = true
        }
      },
      CheckLogged: (state) => {
        if (sessionStorage.getItem('token')?.length || sessionStorage.getItem('token') !== null) {
          state.logged = true;
        }
        else{
          state.logged = false;
        }
      },
      setLoginModal: (state,action) => {
        state.loginModal = action.payload
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginAsync.fulfilled, (state, action) => {
          state.accessToken = action.payload?.access
          state.refreshToken = action.payload?.refresh
          state.logged = true;
          sessionStorage.setItem('token', state.accessToken)
          sessionStorage.setItem('tmpToken', state.refreshToken)
        })
        .addCase(loginAsync.rejected, (state, action) => {
          state.error = "Please try again";
        })
        .addCase(rememberAsync.fulfilled, (state, action) => {
          state.accessToken = action.payload?.access
          state.refreshToken = action.payload?.refresh
          state.logged = true;
          sessionStorage.setItem('token', state.accessToken)
          sessionStorage.setItem('tmpToken', state.refreshToken)
        })
        .addCase(changeUsrPwdAsync.fulfilled, (state, action) => {
          state.accessToken = action.payload?.access
          state.refreshToken = action.payload?.refresh
          state.logged = true;
          sessionStorage.setItem('token', state.accessToken)
          sessionStorage.setItem('tmpToken', state.refreshToken)
        })
    },
  });

export const { logout, rememberMe, CheckLogged,setLoginModal } = loginSlice.actions;

export const selectAccessToken = (state: RootState) => state.login.accessToken;
export const selectRefreshToken = (state: RootState) => state.login.refreshToken;
export const selectlogged = (state: RootState) => state.login.logged;
export const selectError = (state: RootState) => state.login.error;
export const selectModalView = (state:RootState) => state.login.loginModal;


export default loginSlice.reducer;