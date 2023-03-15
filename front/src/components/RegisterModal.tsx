import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { registerAsync, restStatus, selectRegisterModal, selectStatus, setRegisterModalView } from '../features/Register/registerSlice'
import IRegisterUser from '../models/register'
import { send as emailJs } from '@emailjs/browser'
import { toast } from 'react-toastify'
import { Modal } from '@mui/material'
import { Box } from '@mui/system'
import { modalStyle } from '../env'
import { CloseOutlined } from '@mui/icons-material'

const RegisterModal = () => {
    const dispatch = useAppDispatch()
    const [email, setemail] = useState("")
    const [first_name, setfirstName] = useState("")
    const [last_name, setlast_name] = useState("")
    const [department, setdepartment] = useState<number>(0)
    const [role, setrole] = useState<number>(0)
    const [isManager, setisManager] = useState(false)
    const status = useAppSelector(selectStatus);
    const registerModal = useAppSelector<boolean>(selectRegisterModal)

    const handleRegister = () => {
        const usr: IRegisterUser = { email, "password": 'Aa123456!', first_name, last_name, department, role, "type": isManager ? 1 : (role === 3 || role === 5 || role === 6) ? 2 : 3 }
        dispatch(registerAsync(usr))
    }

    const handleSuccess = () => {
        emailJs("service_mur558c", "template_mxg7qpr", {
            email: email,
            firstname: first_name,
        }, 'y7dwm07pNohWq81rU');
        toast.success('User added successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
        });
        dispatch(setRegisterModalView())
    }

    useEffect(() => {
        if (status === 'success') {
            handleSuccess()
            dispatch(restStatus())
        }
        // eslint-disable-next-line
    }, [status])

    return (
        <div>
            <Modal open={registerModal} disableEscapeKeyDown={true}>
                <Box sx={modalStyle}>
                    <button className='btn' onClick={() => dispatch(setRegisterModalView())}>
                        <CloseOutlined />
                    </button>
                    <form onSubmit={(e) => { handleRegister(); e.preventDefault() }} style={{ textAlign: 'center' }} autoSave='off' autoComplete="off">
                        <label>
                            Email: {" "}<br />
                            <input type={'email'} onKeyUp={(e) => setemail(e.currentTarget.value)} required style={{ textAlign: 'center', textTransform: 'none' }} autoComplete="nonono" />
                        </label><br />
                        <label>
                            First Name: {" "}<br />
                            <input type={'text'} onKeyUp={(e) => setfirstName(e.currentTarget.value)} required style={{ textAlign: 'center', textTransform: 'none' }} autoComplete="nonono" />
                        </label><br />
                        <label>
                            Last Name: {" "}<br />
                            <input type={'text'} onKeyUp={(e) => setlast_name(e.currentTarget.value)} required style={{ textAlign: 'center', textTransform: 'none' }} autoComplete="nonono" />
                        </label><br /><br />
                        <label>
                            Department: {" "}<br />
                            <select onChange={(e) => setdepartment(+e.currentTarget.value)} required>
                                <option value={""}>Please choose</option>
                                <option value={1}>Operations</option>
                                <option value={2}>Passenger Service</option>
                            </select>
                        </label><br /><br />
                        <label>
                            Role: {" "}<br />
                            <select onChange={(e) => setrole(+e.currentTarget.value)} required>
                                {department === 2 ?
                                    <>
                                        <option value={""}>Please choose</option>
                                        <option value={1}>Flight Supervisor</option>
                                        <option value={2}>Check in Agent</option>
                                        <option value={3}>PS</option>
                                    </> :
                                    department === 1 ?
                                        <>
                                            <option value={""}>Please choose</option>
                                            <option value={4}>Ramp</option>
                                            <option value={5}>OPS</option>
                                            <option value={6}>Load Control</option>
                                        </> :
                                        <option value={""}>Please choose Department</option>}
                            </select>
                        </label><br /><br />
                        <label>
                            Is manager?<br/>
                            <input type={'checkbox'} onChange={(e) => setisManager(e.currentTarget.checked)} />
                        </label><br /><br />
                        <input type={'submit'} className='btn btn-success' /> <input type="reset" className='btn btn-danger' />
                        <br />
                    </form>
                </Box>
            </Modal >
        </div >
    )
}

export default RegisterModal