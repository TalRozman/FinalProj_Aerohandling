import { CloseOutlined } from '@mui/icons-material';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { modalStyle } from '../env';
import { getAllUsersAsync, selectAllUsers, updateFlightAsync } from '../features/DailySchedule/dailySlice';
import { pits, bridgeGates, hardStandGates } from '../models/gatesAndPits';

const SingleFlight = (props: any) => {
    const accessToken = String(sessionStorage.getItem('token'))
    let tokenDecode: any;
    if (accessToken !== String(null)) {
        tokenDecode = jwtDecode<any>(accessToken);
    }
    const [agents, setagents] = useState<number[] | null>(null) //array of agents ID
    const [ambulift, setambulift] = useState<boolean | null>(null) // true or false
    const [arrivalAgent, setarrivalAgent] = useState<number | null>(null) // EMPLOYEE ID
    const [clc, setclc] = useState<number | null>(null) // EMPLOYEE ID
    const [delayCodes, setdelayCodes] = useState<string[] | null>(null)
    const [ETD, setETD] = useState<Date | null>(null)
    const [gate, setgate] = useState("TBA")
    const [pit, setpit] = useState("TBA")
    const [pushback, setpushback] = useState<number | null>(null)// EMPLOYEE ID
    const [ramp, setramp] = useState<number[] | null>(null)// EMPLOYEE ID
    const [sorter, setsorter] = useState<number | null>(null)// EMPLOYEE ID
    const [SPV, setSPV] = useState<number | null>(null)// EMPLOYEE ID
    const [wingWalkers, setwingWalkers] = useState<number[] | null>(null) //array of agents ID
    const [obTime, setobTime] = useState<Date | null>(null) //DateTime
    const [acReg, setacReg] = useState("TBA") //string of aircraft registration
    const [acType, setacType] = useState("TBA") // string of aircraft type


    const [updateFlt, setupdateFlt] = useState(false)
    const users = useAppSelector(selectAllUsers)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllUsersAsync())
        // eslint-disable-next-line
    }, [])

    const handleSave = () => {
        const updFlt = { "id": props.currentFlight?.id, "aircraftReg": acReg.toUpperCase(), "aircraftType": acType.toUpperCase(), "ambulift": ambulift, "arivalAgent": arrivalAgent, "clc": clc, "delaycode": delayCodes, "etdLocal": ETD, "gate": gate, "pit": pit, "obTime": obTime, "pushback": pushback, "sorter": sorter, "spv": SPV, "agents": agents, "ramp": ramp, "wingWalker": wingWalkers }
        const obj = { "accessToken": accessToken, "flight": updFlt }
        dispatch(updateFlightAsync(obj)).then(() => setupdateFlt(false))
    }
    const handleCancel = () => {
        setagents(null)
        setambulift(null)
        setarrivalAgent(null)
        setclc(null)
        setdelayCodes(null)
        setETD(null)
        setgate("TBA")
        setpit("TBA")
        setpushback(null)
        setramp(null)
        setsorter(null)
        setSPV(null)
        setwingWalkers(null)
        setobTime(null)
        setacReg("TBA")
        setacType("TBA")
        setupdateFlt(false)
    }

    return (
        <div>
            <Modal open={props.clicked}>
                <Box sx={modalStyle}>
                    <button className='btn' onClick={() => props.setClicked(false)}><CloseOutlined /></button>
                    {(updateFlt && (tokenDecode.type === "Manager" || tokenDecode.type === "Shift Supervisor")) ?
                        // SHOW IF UPDATE FLAG IS ON AND USER IS MANAGER OR SHIFT SUPERVISOR
                        <div style={{ textAlign: 'center' }}>
                            {/* SHOW ONLY IF  MANAGER OR PS - UPDATE ONLY PS INFO (SPV/AGENTS) */}
                            {(tokenDecode.type === "Manager" || tokenDecode.role === "PS") &&
                                <div>
                                    <form onSubmit={(e) => { e.preventDefault(); }}>
                                        <table>
                                            <tbody>
                                                {props.currentFlight?.type === "D" ?
                                                    <>
                                                        <tr>
                                                            <td>
                                                                <label>
                                                                    Check in Supervisor -<br />
                                                                    <select onChange={(e) => setSPV(+e.currentTarget.value)}>
                                                                        <option value="" selected disabled>Please select employee</option>
                                                                        {users.filter((usr: any) => usr.role === 1).map((usr: any, i: number) =>
                                                                            <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                    </select>
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <label>
                                                                    Check in Agents -<br />
                                                                    <select multiple onChange={(e) => setagents(agents ? [...agents, +e.currentTarget.value] : [+e.currentTarget.value])} >
                                                                        <option value="" selected disabled>Please select employee</option>
                                                                        {users.filter((usr: any) => usr.role === 2).map((usr: any, i: number) =>
                                                                            <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                    </select>
                                                                </label>
                                                            </td>
                                                        </tr>
                                                    </> : <>
                                                        <tr>
                                                            <td>
                                                                <label>
                                                                    Arrival agent -<br />
                                                                    <select onChange={(e) => setarrivalAgent(+e.currentTarget.value)}>
                                                                        <option value="" selected disabled>Please select employee</option>
                                                                        {users.filter((usr: any) => usr.role === 9).map((usr: any, i: number) =>
                                                                            <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                    </select>
                                                                </label></td>
                                                            <td>
                                                                <label>
                                                                    Ambulift - <br />
                                                                    <input type={"checkbox"} onChange={(e) => setambulift(e.currentTarget.checked)} defaultChecked={Boolean(ambulift)} />
                                                                </label>
                                                            </td>
                                                        </tr>
                                                    </>}
                                            </tbody>
                                        </table>
                                    </form>
                                </div>}
                            <hr />
                            {(tokenDecode.type === "Manager" || tokenDecode.role === "OPS") &&
                                <form onSubmit={(e) => { e.preventDefault(); }}>
                                    <table>
                                        <tbody>
                                            {/* SHOW ONLY ID MANAGER OR OPS - UPDATE ONLY OPERATIONS INFO */}
                                            {props.currentFlight?.type === "D" ?
                                                <>
                                                    {/* // DEPARTURES */}
                                                    <tr>
                                                        <td>
                                                            <label>
                                                                Aircragt Registration -<br />
                                                                <input onChange={(e) => setacReg(e.currentTarget.value)} />
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <label>
                                                                Aircragt Type -<br />
                                                                <input onChange={(e) => setacType(e.currentTarget.value)} />
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label>
                                                                Pit -<br />
                                                                <select onChange={(e) => setpit(e.currentTarget.value)}>
                                                                    <option value="" selected disabled>Please select Pit</option>
                                                                    {pits.map((pit: string, i: number) =>
                                                                        <option key={i}>{pit}</option>)}
                                                                </select>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <label>
                                                                Gate -<br />
                                                                <select onChange={(e) => setgate(e.currentTarget.value)}>
                                                                    {bridgeGates.filter((gate: string) => gate === pit).length === 1 ? <option selected>{pit}</option> :
                                                                        <>
                                                                            <option value="" selected disabled>Please select Gate</option>
                                                                            {hardStandGates.map((gate: string, i: number) =>
                                                                                <option key={i}>{gate}</option>)}
                                                                        </>}
                                                                </select>

                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label>
                                                                Load controller -<br />
                                                                <select onChange={(e) => setclc(+e.currentTarget.value)}>
                                                                    <option value="" selected disabled>Please select employee</option>
                                                                    {users.filter((usr: any) => usr.role === 6).map((usr: any, i: number) =>
                                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                </select>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <label>
                                                                Ramp Agents -<br />
                                                                <select multiple onChange={(e) => setramp(ramp ? [...ramp, +e.currentTarget.value] : [+e.currentTarget.value])}>
                                                                    <option value="" selected disabled>Please select employee</option>
                                                                    {users.filter((usr: any) => usr.role === 4).map((usr: any, i: number) =>
                                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                </select>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label>
                                                                Sorter -<br />
                                                                <select onChange={(e) => setsorter(+e.currentTarget.value)}>
                                                                    <option value="" selected disabled>Please select employee</option>
                                                                    {users.filter((usr: any) => usr.role === 8).map((usr: any, i: number) =>
                                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                </select>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <label>
                                                                Pushback Driver -<br />
                                                                <select onChange={(e) => setpushback(+e.currentTarget.value)}>
                                                                    <option value="" selected disabled>Please select employee</option>
                                                                    {users.filter((usr: any) => usr.role === 7).map((usr: any, i: number) =>
                                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                </select>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label>
                                                                Wing walkers -<br />
                                                                <select multiple onChange={(e) => setwingWalkers(wingWalkers ? [...wingWalkers, +e.currentTarget.value] : [+e.currentTarget.value])}>
                                                                    <option value="" selected disabled>Please select employee</option>
                                                                    {users.filter((usr: any) => usr.role === 4 || usr.role === 5 || usr.role === 6).map((usr: any, i: number) =>
                                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                </select>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <label>
                                                                OB Time -<br />
                                                                <input type={'datetime-local'} onChange={(e) => { const tmpTime = new Date(new Date(e.currentTarget.value).toISOString()); setobTime(tmpTime); console.log(obTime) }} />
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label>
                                                                ETD -<br />
                                                                <input type={'datetime-local'} onChange={(e) => { const tmpTime = new Date(new Date(e.currentTarget.value).toISOString()); setETD(tmpTime) }} />
                                                            </label>
                                                        </td>
                                                    </tr>
                                                </> :
                                                // ARRIVALS
                                                <>
                                                    <tr>
                                                        <td>
                                                            <label>
                                                                Aircragt Registration -<br />
                                                                <input onChange={(e) => setacReg(e.currentTarget.value)} defaultValue={props.currentFlight?.acReg} />
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <label>
                                                                Aircragt Type -<br />
                                                                <input onChange={(e) => setacType(e.currentTarget.value)} defaultValue={props.currentFlight?.acType} />
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label>
                                                                Ramp Agents -<br />
                                                                <select multiple onChange={(e) => setramp(ramp ? [...ramp, +e.currentTarget.value] : [+e.currentTarget.value])}>
                                                                    <option value="" selected disabled>Please select employee</option>
                                                                    {users.filter((usr: any) => usr.role === 4).map((usr: any, i: number) =>
                                                                        <option key={i} value={usr.id}>{usr.first_name} {usr.last_name}</option>)}
                                                                </select>
                                                            </label>
                                                        </td>
                                                        {tokenDecode.type !== "Manager" &&
                                                            <td>
                                                                <label>
                                                                    Ambulift - <br />
                                                                    <input type={"checkbox"} onChange={(e) => setambulift(e.currentTarget.checked)} defaultChecked={Boolean(ambulift)} />
                                                                </label>
                                                            </td>}
                                                    </tr>
                                                </>}
                                        </tbody>
                                    </table>
                                </form>}
                            <br /><button className='center btn btn-success' onClick={() => handleSave()}>Save</button><button className='center btn btn-danger' onClick={() => { handleCancel() }}>Cancel</button>
                        </div> :
                        <div>
                            <div className='FlightInfo' style={{ textAlign: 'center' }}>
                                <h3>{props.currentFlight?.flightNum}</h3><br/>
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
                                                                                    <tr key={i} style={{ borderBottom: '1px solid gray' }}>
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
                                                                                        <tr key={i} style={{ borderBottom: '1px solid gray' }}>
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
                                                                                    <tr key={i} style={{ borderBottom: '1px solid gray' }}>
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
                                                                                    <tr key={i} style={{ borderBottom: '1px solid gray' }}>
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
                            </div><br/>
                            {(tokenDecode.type === "Manager" || tokenDecode.role === "PS" || tokenDecode.role === "OPS") &&
                            <button className='center btn btn-warning' onClick={() => setupdateFlt(true)}>Update Info</button>}
                        </div>
                    }
                    <br /><br />
                </Box >
            </Modal >
        </div >
    )
}

export default SingleFlight