import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './app.css'
import { useAppDispatch, useAppSelector } from './app/hooks';
import { CheckLogged, logout, rememberAsync, selectlogged } from './features/Login/loginSlice';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import "react-toastify/dist/ReactToastify.css";
import RegisterModal from './components/RegisterModal';
import ChngPwd from './components/ChngPwd';
import jwtDecode from 'jwt-decode';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import { modalStyle } from './env';
import { selectReqStatus } from './features/Profile/profileSlice';


function App() {
  const dispatch = useAppDispatch();
  const logged = useAppSelector(selectlogged)
  const reqFailed = useAppSelector(selectReqStatus)
  const accessToken = String(sessionStorage.getItem('token'))
  const navigate = useNavigate()
  const [timeoutModal, settimeoutModal] = useState(false)
  const [timeoutAck, settimeoutAck] = useState(false)

  let tokenDecode: any;

  if (accessToken !== String(null)) {
    tokenDecode = jwtDecode<any>(accessToken);
  }

  useEffect(() => {
    if (localStorage.getItem("refreshToken") !== null) {
      dispatch(rememberAsync(String(localStorage.getItem("refreshToken"))))
    }
    // eslint-disable-next-line
  }, [])

  const handleTimeout = () => {
    if (timeoutAck) {
      settimeoutModal(false)
      dispatch(logout())
      navigate('/')
      settimeoutAck(false)
    }
    else {
      settimeoutModal(true);
    }
  }

  useEffect(() => {
    dispatch(CheckLogged())
    if (logged || reqFailed) {
      if (Date.now() >= tokenDecode.exp * 1000) {
        handleTimeout()
      }
    }
    // eslint-disable-next-line
  }, [dispatch, reqFailed, logged])
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <LoginModal />
      <RegisterModal />
      <ChngPwd />
      <Outlet />

      <Modal open={timeoutModal}>
        <Box sx={modalStyle} >
          <h1>
            Your session is timed out!<br />
            Please Login Again<br /><br />
            <button className='btn' onClick={() => { settimeoutAck(true); handleTimeout() }}>OK</button>
          </h1>
        </Box>
      </Modal>

      <nav className="navbar bg-dark" style={{ position: 'fixed', bottom: '0vw', width: '100%' }}>
        <div className="container-fluid">
          <p style={{ color: 'white', verticalAlign: 'center' }}>Copyright &copy; {new Date().getFullYear()} My React App</p>
          <Link to={'/contact'} style={{ color: 'white', textDecoration: 'none' }}>Contact us</Link>
        </div>
      </nav>
    </div>
  );
}

export default App;
