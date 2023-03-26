import { CloseOutlined } from '@mui/icons-material';
import { Checkbox, InputLabel, ListItemText, MenuItem, Modal, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { Box } from '@mui/system';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { modalStyle } from '../env';
import { getAllUsersAsync, selectAllUsers } from '../features/DailySchedule/dailySlice';

const SingleFlight = (props: any) => {
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
    const [ramp, setramp] = useState<number[]>([])// EMPLOYEE ID
    const [sorter, setsorter] = useState(0)// EMPLOYEE ID
    const [SPV, setSPV] = useState(0)// EMPLOYEE ID
    const [wingWalker, setwingWalker] = useState<number[]>([]) //array of agents ID
    const [obTime, setobTime] = useState("") //DateTime

    const [updateFlt, setupdateFlt] = useState(false)
    const users = useAppSelector(selectAllUsers)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllUsersAsync())
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <Modal open={props.clicked}>
                <Box sx={modalStyle}>
                    <button className='btn' onClick={() => props.setClicked(false)}>
                        <CloseOutlined />
                    </button>
                    {(updateFlt && (tokenDecode.type === "Manager" || tokenDecode.type === "Shift Supervisor")) ?
                        // SHOW IF UPDATE FLAG IS ON AND USER IS MANAGER OR SHIFT SUPERVISOR
                        <div style={{ textAlign: 'center' }}>
                            {/* SHOW ONLY IF  MANAGER OR PS - UPDATE ONLY PS INFO (SPV/AGENTS) */}
                            {(tokenDecode.type === "Manager" || tokenDecode.role === "PS") &&
                                <div>
                                    {props.currentFlight?.type === "D" ?
                                        <form onSubmit={(e) => { e.preventDefault(); }}>
                                            <label>
                                                Check in Supervisor -<br />
                                                <select onChange={(e) => setSPV(+e.currentTarget.value)}>
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 1).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                            <label>
                                                Check in Agents -<br />
                                                <select multiple onChange={(e) => setagents([...agents, +e.currentTarget.value])} >
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 2).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                        </form>
                                        :
                                        <form onSubmit={(e) => { e.preventDefault(); }}>
                                            <label>
                                                Arrival agent -<br />
                                                <select onChange={(e) => setarrivalAgent(+e.currentTarget.value)}>
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 9).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                            <label>
                                                Ambulift - <br />
                                                <input type={"checkbox"} onChange={(e) => setambulift(e.currentTarget.checked)} defaultChecked={ambulift} />
                                            </label>
                                        </form>}
                                </div>}
                            {(tokenDecode.type === "Manager" || tokenDecode.role === "OPS") &&
                                <>
                                    {/* SHOW ONLY ID MANAGER OR OPS - UPDATE ONLY OPERATIONS INFO */}
                                    {props.currentFlight?.type === "D" ?
                                        // DEPARTURES
                                        <form>
                                            <label>
                                                Load controller -<br />
                                                <select onChange={(e) => setclc(+e.currentTarget.value)}>
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 6).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                            <label>
                                                Ramp Agents -<br />
                                                <select multiple onChange={(e) => setramp([...ramp, +e.currentTarget.value])}>
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 4).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                            <label>
                                                Sorter -<br />
                                                <select onChange={(e) => setsorter(+e.currentTarget.value)}>
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 8).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                            <label>
                                                Pushback Driver -<br />
                                                <select onChange={(e) => setpushback(+e.currentTarget.value)}>
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 7).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                            <label>
                                                Wing walkers -<br />
                                                <select multiple onChange={(e) => setwingWalker([...wingWalker, +e.currentTarget.value])}>
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 4 || usr.role === 5 || usr.role === 6).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                            <label>
                                                OB Time -<br />
                                                <input type={'datetime-local'} onChange={(e) => { const tmpTime = new Date(e.currentTarget.value).toISOString(); setobTime(tmpTime); console.log(obTime) }} />
                                            </label><br />
                                        </form> :
                                        // ARRIVALS
                                        <form>
                                            <label>
                                                Ramp Agents -<br />
                                                <select multiple onChange={(e) => setramp([...ramp, +e.currentTarget.value])}>
                                                    <option value="" selected disabled>Please select employee</option>
                                                    {users.filter((usr: any) => usr.role === 4).map((usr: any, i: number) =>
                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                </select>
                                            </label><br />
                                            {tokenDecode.type !== "Manager" &&
                                                <label>
                                                    Ambulift - <br />
                                                    <input type={"checkbox"} onChange={(e) => setambulift(e.currentTarget.checked)} defaultChecked={ambulift} />
                                                </label>}
                                        </form>}
                                </>
                            }
                            <br /><button className='center btn btn-success' onClick={() => setupdateFlt(true)}>Save</button><button className='center btn btn-danger' onClick={() => { setupdateFlt(false); setSPV(0); setagents([]) }}>Cancel</button>
                        </div> :
                        <div>
                            <div className='FlightInfo' style={{ textAlign: 'center' }}>
                                Flight {props.currentFlight?.flightNum},&nbsp;
                                {props.currentFlight?.type === "A" ? "Landing" : "Departing"} at {props.currentFlight?.stdLocal.slice(11, 16)} Z /&nbsp;
                                {new Date(props.currentFlight?.stdLocal).toTimeString().slice(0, 5)} LT,&nbsp;
                                {props.currentFlight?.type === "A" ? "From" : "To"} {props.currentFlight?.dest}.<br />
                                Aircraft Registration {props.currentFlight?.aircraftReg === "TBA" ? "Will be updated soon" : props.currentFlight?.aircraftReg}<br />
                                Aircraft Type {props.currentFlight?.aircraftType === "TBA" ? "Will be updated soon" : props.currentFlight?.aircraftType}<br /><br />
                                <table style={{ textAlign: 'center' }}>
                                    <thead>
                                        <tr>
                                            <th>Passenger Service</th>&nbsp;
                                            <th>Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {/* ARR */}
                                            {props.currentFlight?.type === "A" ?
                                                <>
                                                    {/* PS */}
                                                    <td>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Arrival Agent</th>&nbsp;
                                                                    <th>Ambulift</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>{props.currentFlight?.arivalAgent === null ? "Will be updated soon" :
                                                                        <>
                                                                            {users?.filter((u: any) => u.id === props.currentFlight?.arivalAgent)[0]?.first_name},{users?.filter((u: any) => u.id === props.currentFlight?.arivalAgent)[0]?.last_name}
                                                                        </>}
                                                                    </td>
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                    <td>{props.currentFlight?.ambulift === null ? "Will be updated soon" : props.currentFlight?.ambulift === true ? "Required" : "Not Required"}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {/* OPS */}
                                                    <td>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Ramp Agent</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>{props.currentFlight?.ramp === null ? "Will be updated soon" :
                                                                        <table>
                                                                            <tbody>
                                                                                {props.currentFlight?.ramp?.map((agent: number, i: number) =>
                                                                                    <tr key={i} style={{borderBottom:'1px solid gray'}}>
                                                                                        {users?.filter((u: any) => u.id === agent)[0]?.first_name} {users?.filter((u: any) => u.id === agent)[0]?.last_name}
                                                                                    </tr>)}
                                                                            </tbody>
                                                                        </table>}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </>
                                                :
                                                <>
                                                    {/* DEP */}
                                                    <td>
                                                        {/* PS */}
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Flight Supervisor</th>
                                                                    <th>Agents</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>{props.currentFlight?.spv === null ? "Will be updated soon" :
                                                                        <>
                                                                            {users?.filter((u: any) => u.id === props.currentFlight?.spv)[0]?.first_name} {users?.filter((u: any) => u.id === props.currentFlight?.spv)[0]?.last_name}
                                                                        </>}
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                    </td>
                                                                    <td>
                                                                        {props.currentFlight?.agents === null ? "Will be updated soon" :
                                                                            <table>
                                                                                <tbody>
                                                                                    {props.currentFlight?.agents?.map((agent: number, i: number) =>
                                                                                        <tr key={i} style={{borderBottom:'1px solid gray'}}>
                                                                                            {users?.filter((u: any) => u.id === agent)[0]?.first_name} {users?.filter((u: any) => u.id === agent)[0]?.last_name}
                                                                                        </tr>)}
                                                                                </tbody>
                                                                            </table>}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {/* OPS */}
                                                    <td>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Load controller</th>
                                                                    <th>Ramp Agent</th>
                                                                    <th>Sorter</th>
                                                                    <th>Pushback</th>
                                                                    <th>Wing Walkers</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        {props.currentFlight?.clc === null ? "Will be updated soon" :
                                                                            <>
                                                                                {users?.filter((u: any) => u.id === props.currentFlight?.clc)[0]?.first_name} {users?.filter((u: any) => u.id === props.currentFlight?.clc)[0]?.last_name}
                                                                            </>}
                                                                    </td>
                                                                    <td>{props.currentFlight?.ramp === null ? "Will be updated soon" :
                                                                        <table>
                                                                            <tbody>
                                                                                {props.currentFlight?.ramp?.map((agent: number, i: number) =>
                                                                                    <tr key={i} style={{borderBottom:'1px solid gray'}}>
                                                                                        {users?.filter((u: any) => u.id === agent)[0]?.first_name} {users?.filter((u: any) => u.id === agent)[0]?.last_name}
                                                                                    </tr>)}
                                                                            </tbody>
                                                                        </table>}
                                                                    </td>
                                                                    <td>
                                                                        {props.currentFlight?.sorter === null ? "Will be updated soon" :
                                                                            <>
                                                                                {users?.filter((u: any) => u.id === props.currentFlight?.sorter)[0]?.first_name} {users?.filter((u: any) => u.id === props.currentFlight?.sorter)[0]?.last_name}
                                                                            </>}
                                                                    </td>
                                                                    <td>
                                                                        {props.currentFlight?.pushback === null ? "Will be updated soon" :
                                                                            <>
                                                                                {users?.filter((u: any) => u.id === props.currentFlight?.pushback)[0]?.first_name} {users?.filter((u: any) => u.id === props.currentFlight?.pushback)[0]?.last_name}
                                                                            </>}
                                                                    </td>
                                                                    <td>{props.currentFlight?.wingWalker === null ? "Will be updated soon" :
                                                                        <table>
                                                                            <tbody>
                                                                                {props.currentFlight?.wingWalker?.map((agent: number, i: number) =>
                                                                                    <tr key={i} style={{borderBottom:'1px solid gray'}}>
                                                                                        {users?.filter((u: any) => u.id === agent)[0]?.first_name} {users?.filter((u: any) => u.id === agent)[0]?.last_name}
                                                                                    </tr>)}
                                                                            </tbody>
                                                                        </table>}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </>}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <br /><button className='center btn btn-warning' onClick={() => setupdateFlt(true)}>Update Info</button>
                        </div>
                    }
                    <br /><br />
                </Box >
            </Modal >
        </div >
    )
}

export default SingleFlight