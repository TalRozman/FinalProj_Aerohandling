import { CloseOutlined } from '@mui/icons-material';
import { Box, Modal } from '@mui/material';
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { modalStyle } from '../env';
import { loginAsync, rememberAsync, rememberMe, selectError, selectlogged, selectModalView, setLoginModal } from '../features/Login/loginSlice';
import Iuser from '../models/user';

const LoginModal = () => {
    const logged = useAppSelector(selectlogged)
    const modalView = useAppSelector(selectModalView);
    const error = useAppSelector(selectError);
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [remember, setremember] = useState(false)
    const dispatch = useAppDispatch()
    // login
    const handleLogin = async (usr: Iuser) => {
        await dispatch(loginAsync(usr));
        if (remember) {
            dispatch(rememberMe(true));
            dispatch(rememberAsync(String(sessionStorage.getItem("tmpToken"))))
        }
    }
    useEffect(() => {
        if (logged){
            dispatch(setLoginModal(false));
        }
    }, [logged,dispatch])
    return (
        <div>
            <Modal open={modalView}>
                <Box sx={modalStyle}>
                    <button className='btn' onClick={() => dispatch(setLoginModal(false))}>
                        <CloseOutlined />
                    </button>
                    <br />
                    <label>
                        E-mail: {" "}
                        <input type={'email'} onKeyUp={(e) => setemail(e.currentTarget.value)} style={{ textTransform: 'none', textAlign: 'center' }} autoComplete="nono" />
                    </label><br />
                    <label>
                        Password: {" "}
                        <input type={'text'} className="psw" onKeyUp={(e) => setpassword(e.currentTarget.value)} style={{ textAlign: 'center', textTransform: 'none' }} autoComplete="nono" />
                    </label><br />
                    <label>
                        Remember me?: {" "}
                        <input type={'checkbox'} onClick={(e) => setremember(e.currentTarget.checked)} autoComplete="off" />
                    </label><br /><br />
                    <button className='btn btn-info' onClick={() => { const usr: Iuser = { username: email.toLowerCase(), password }; handleLogin(usr) }}>Log In</button>
                    <br />{error}
                </Box>
            </Modal>
        </div>
    )
}

export default LoginModal