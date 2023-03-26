import { CloseOutlined } from '@mui/icons-material';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../app/hooks';
import { modalStyle } from '../env';
import { getAllUsersAsync } from '../features/DailySchedule/dailySlice';

const UpdateFlight = (props: any) => {
    const accessToken = String(sessionStorage.getItem('token'))
    let tokenDecode: any;
    if (accessToken !== String(null)) {
        tokenDecode = jwtDecode<any>(accessToken);
    }
    const [agents, setagents] = useState<number[]>([]) //array of agents ID
    const [ambulift, setambulift] = useState<boolean>(false) // true or false
    const [arrivalAgent, setarrivalAgent] = useState(0) // EMPLOYEE ID
    const [clc, setclc] = useState(0) // EMPLOYEE ID
    const [delayCode, setdelayCode] = useState<string[]>([])
    const [ETD, setETD] = useState("")
    const [gate, setgate] = useState("")
    const [pit, setpit] = useState("")
    const [pushback, setpushback] = useState(0)// EMPLOYEE ID
    const [ramp, setramp] = useState(0)// EMPLOYEE ID
    const [sorter, setsorter] = useState(0)// EMPLOYEE ID
    const [SPV, setSPV] = useState(0)// EMPLOYEE ID
    const [wingWalker, setwingWalker] = useState<number[]>([]) //array of agents ID
    
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllUsersAsync())
        // eslint-disable-next-line
    }, [])
    
    return (
        <div>
            {/* 
            dep
            email
            role
            type
            */}
            <Modal open={props.Fupdate}>
                <Box sx={modalStyle}>
                    <button className='btn' onClick={() => props.setUpdate(false)}>
                        <CloseOutlined />
                    </button>
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        <label>
                            Aircraft Type -<br />
                            <input />
                        </label><br />
                        <label>
                            Aircraft REG -<br />
                            <input />
                        </label><br />
                        <label>
                            Check in supervisor -<br />
                            <input />
                        </label><br />
                        <label>
                            Ramp agent -<br />
                            <input />
                        </label><br />
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default UpdateFlight