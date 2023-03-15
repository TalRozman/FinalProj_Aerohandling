import { InfoOutlined } from '@mui/icons-material'
import { Modal } from '@mui/material'
import { Box } from '@mui/system'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { modalStyle } from '../env'
import { changeUsrPwdAsync, CheckLogged, logout, selectlogged, setLoginModal } from '../features/Login/loginSlice'

const ChngPwd = () => {
    const dispatch = useAppDispatch()
    const logged = useAppSelector(selectlogged)
    const accessToken = String(sessionStorage.getItem('token'))
    let decodedToken: any = null;
    const [changePsw, setchangePsw] = useState(false)
    const [password, setpassword] = useState("")
    const [tempPwd1, settempPwd1] = useState("")
    const [tempPwd2, settempPwd2] = useState("")

    if (logged) {
        decodedToken = jwtDecode<any>(String(accessToken))
    }

    useEffect(() => {
        dispatch(CheckLogged())
        if (logged) {
            if (!decodedToken?.lli) {
                setchangePsw(true)
            }
        }
        // eslint-disable-next-line
    }, [dispatch, logged])

    const handleChangePswd = async () => {
        const myObj = { "id": +decodedToken?.user_id, "pwd": password, "accessToken": accessToken }
        await dispatch(changeUsrPwdAsync(myObj))
        setchangePsw(false)
        await dispatch(logout())
        await dispatch(setLoginModal(true))
        settempPwd1("")
        settempPwd2("")
    }
    return (
        <div>
            <Modal open={changePsw} disableEscapeKeyDown={true}>
                <Box sx={modalStyle}>
                    <form onSubmit={(e) => { handleChangePswd(); e.preventDefault() }} style={{ textAlign: 'center' }} autoSave='off' autoComplete="off">
                        <h1>Hi {decodedToken?.name}!</h1>
                        <h2>This is your first time logging in!</h2><br />
                        <label>
                            Please choose your permanent password:<br />
                            <input type={'password'} autoSave='off' autoComplete="off" onChange={(e) => settempPwd1(e.currentTarget.value)} />
                        </label><br />
                        <label>
                            Please confirm your password:<br />
                            <input type={'password'} autoSave='off' autoComplete="off" onChange={(e) => settempPwd2(e.currentTarget.value)} />
                        </label><br /><br />
                        {(tempPwd1 !== "") ?
                            (tempPwd1 === tempPwd2) ? <input type={'submit'} placeholder="Change my password!" onClick={() => setpassword(tempPwd1)} /> : <h6 style={{ color: 'red' }}>Passwords not match!</h6> :
                            <h6 style={{ color: 'red' }}>Password cannot be empty</h6>}
                        <h5><InfoOutlined /> Please note that re-login is required after the change.</h5>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default ChngPwd