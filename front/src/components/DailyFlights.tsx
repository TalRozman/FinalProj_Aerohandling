import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { getFlightsAsync, pullFlightsAsync, selectAllUsers, selectFlights, selectFlightsRefresh } from '../features/DailySchedule/dailySlice'
import { Iflight } from '../models/flight'
import SingleFlight from './SingleFlight'
import Timer from './Timer'

const DailyFlights = () => {
  const dispatch = useAppDispatch()
  const flights = useAppSelector(selectFlights)
  const [loading, setloading] = useState(true)
  const flightRefresh = useAppSelector(selectFlightsRefresh)
  const accessToken = String(sessionStorage.getItem('token'))
  let tokenDecode: any;
  const [displayType, settype] = useState<"arrivals" | "departures" | "all">("all")
  const [myDate, setmyDate] = useState<Date>(new Date())
  const [today, settoday] = useState("")
  const [sorted, setsorted] = useState<Iflight[]>([...flights].sort((a, b) => +new Date(a.stdLocal) - +new Date(b.stdLocal)))
  const [moveDate, setmoveDate] = useState(false)
  const [Clicked, setClicked] = useState(false)
  const [currentFlight, setcurrentFlight] = useState<Iflight>()

  const users = useAppSelector(selectAllUsers)

  if (accessToken !== String(null)) {
    tokenDecode = jwtDecode<any>(accessToken);
  }

  useEffect(() => {
    dispatch(getFlightsAsync(accessToken))
      .then(() => {
        const tempFlights = [...flights]
        setsorted(tempFlights.sort((a, b) => +new Date(a.stdLocal) - +new Date(b.stdLocal)))
      }).then(()=>setloading(false))
    // eslint-disable-next-line
  },[])

  useEffect(() => {
    dispatch(getFlightsAsync(accessToken))
      .then(() => {
        const tempFlights = [...flights]
        setsorted(tempFlights.sort((a, b) => +new Date(a.stdLocal) - +new Date(b.stdLocal)))
      }).then(()=>setloading(false))
    // eslint-disable-next-line
  }, [flightRefresh])

  useEffect(() => {
    settoday(myDate.toISOString().slice(0, 10))
    // eslint-disable-next-line
  }, [moveDate])

  const addDay = () => {
    myDate.setDate(myDate.getDate() + 1);
    setmyDate(myDate)
    setmoveDate(!moveDate)
  }
  const backDay = () => {
    myDate.setDate(myDate.getDate() - 1);
    setmyDate(myDate)
    setmoveDate(!moveDate)
  }
  const setToday = () => {
    setmyDate(new Date())
    setmoveDate(!moveDate)
  }

  const handleSelectFlight = (f: Iflight) => {
    setClicked(true)
    setcurrentFlight(f)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {loading ?
        <>
          <img src='https://joyustrips.com/assets/images/FlightLoader.gif' width={'100%'} height={'100%'} style={{ position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px' }} alt="loaderGIF" />
        </> :
        <>
          {tokenDecode?.type === "Manager" && <button className='btn btn-warning  ' onClick={() => dispatch(pullFlightsAsync())}>PULL FLIGHTS</button>}<br />
          <button className='btn' onClick={() => settype('all')}>All flights</button>
          <button className='btn' onClick={() => settype('departures')}>Departures only</button>
          <button className='btn' onClick={() => settype('arrivals')}>Arrivals only</button>
          <br />
          <div>
            <button className='btn' onClick={() => backDay()}> - </button>
            <button className='btn' onClick={() => setToday()}>{today}</button>
            <button className='btn' onClick={() => addDay()}> + </button>
          </div>
          <div className="table-responsive">
            {/* SHOW ALL FLIGHTS */}
            {displayType === 'all' &&
              <table className='table table-striped table-hover' style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                <thead>
                  <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Number</th>
                    <th scope="col">schedule time</th>
                    <th scope="col">Destination</th>
                    <th scope="col">A/C type</th>
                    <th scope="col">A/C reg</th>
                    <th scope="col">SPV</th>
                    <th scope="col">Ambulift</th>
                    <th scope="col">Ramp</th>
                    <th scope="col">Gate</th>
                    <th scope="col">Stand</th>
                    <th scope="col">Actual time</th>
                    <th scope="col">Timer<br />Delay code</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted?.filter((f: any) => f.stdLocal.slice(0, 10) === today)?.map((f: any, i: number) =>
                    <tr key={i} onClick={() => handleSelectFlight(f)}>
                      <td>{f.type}</td>
                      <td>{f.flightNum}</td>
                      <td>{f.stdLocal.slice(11, 16)}&nbsp;&nbsp; Z<br />{new Date(f.stdLocal).toTimeString().slice(0, 5)}&nbsp; LT</td>
                      <td>{f.dest}</td>
                      <td>{f.aircraftType === "TBA" ? "" : f.aircraftType}</td>
                      <td>{f.aircraftReg === "TBA" ? "" : f.aircraftReg}</td>
                      <td>{users?.filter((u: any) => u.id === f.spv)[0]?.first_name} {users?.filter((u: any) => u.id === f.spv)[0]?.last_name}</td>
                      <td>{f.ambulift === null ? "" : f.ambulift === true ? "YES" : "NO"}</td>
                      <td>{f.ramp?.map((agent: number, i: number) =>
                        <p key={i} style={{ verticalAlign: 'center' }}>
                          {users?.filter((u: any) => u.id === agent)[0]?.first_name} {users?.filter((u: any) => u.id === agent)[0]?.last_name}
                        </p>)}</td>
                      <td>{f.gate === "TBA" ? "" : f.gate}</td>
                      <td>{f.stand}</td>
                      <td>{f.obTime}</td>
                      <td>{f.obTime ? <>{f.delaycode}<br />{f.delaytime}</> :
                        today === new Date().toISOString().slice(0, 10) &&
                        <Timer deadline={f.stdLocal} />}</td>
                    </tr>)}
                </tbody>
              </table>}
            {/* DISPLAY ARRIVALS ONLY */}
            {displayType === 'arrivals' &&
              <table className='table table-striped table-hover' style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                <thead>
                  <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Number</th>
                    <th scope="col">schedule time</th>
                    <th scope="col">Destination</th>
                    <th scope="col">A/C type</th>
                    <th scope="col">A/C reg</th>
                    <th scope="col">Ambulift</th>
                    <th scope="col">Ramp</th>
                    <th scope="col">Stand</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.filter((f: any) => f.stdLocal.slice(0, 10) === today).filter((f: any) => f.type === 'A').map((f: any, i: number) =>
                    <tr key={i} onClick={() => handleSelectFlight(f)}>
                      <td>{f.type}</td>
                      <td>{f.flightNum}</td>
                      <td>{f.stdLocal.slice(11, 16)}&nbsp;&nbsp; Z<br />{new Date(f.stdLocal).toTimeString().slice(0, 5)}&nbsp; LT</td>
                      <td>{f.dest}</td>
                      <td>{f.aircraftType === "TBA" ? "" : f.aircraftType}</td>
                      <td>{f.aircraftReg === "TBA" ? "" : f.aircraftReg}</td>
                      <td>{f.ambulift === null ? "" : f.ambulift ? "YES" : "NO"}</td>
                      <td>{f.ramp?.map((agent: number, i: number) =>
                        <p key={i}>
                          {users?.filter((u: any) => u.id === agent)[0]?.first_name} {users?.filter((u: any) => u.id === agent)[0]?.last_name}
                        </p>)}</td>
                      <td>{f.stand}</td>
                    </tr>)}
                </tbody>
              </table>}
            {/* DISPLAY DEPARTURES ONLY */}
            {displayType === 'departures' &&
              <table className='table table-striped table-hover' style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                <thead>
                  <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Number</th>
                    <th scope="col">schedule time</th>
                    <th scope="col">Destination</th>
                    <th scope="col">A/C type</th>
                    <th scope="col">A/C reg</th>
                    <th scope="col">SPV</th>
                    <th scope="col">CLC</th>
                    <th scope="col">Ramp</th>
                    <th scope="col">Gate</th>
                    <th scope="col">Actual time</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.filter((f: any) => f.stdLocal.slice(0, 10) === today).filter((f: any) => f.type === 'D').map((f: any, i: number) =>
                    <tr key={i} onClick={() => handleSelectFlight(f)}>
                      <td>{f.type}</td>
                      <td>{f.flightNum}</td>
                      <td>{f.stdLocal.slice(11, 16)}&nbsp;&nbsp; Z<br />{new Date(f.stdLocal).toTimeString().slice(0, 5)}&nbsp; LT</td>
                      <td>{f.dest}</td>
                      <td>{f.aircraftType === "TBA" ? "" : f.aircraftType}</td>
                      <td>{f.aircraftReg === "TBA" ? "" : f.aircraftReg}</td>
                      <td>{users?.filter((u: any) => u.id === f.spv)[0]?.first_name} {users?.filter((u: any) => u.id === f.spv)[0]?.last_name}</td>
                      <td>{users?.filter((u: any) => u.id === f.clc)[0]?.first_name} {users?.filter((u: any) => u.id === f.clc)[0]?.last_name}</td>
                      <td>{f.ramp?.map((agent: number, i: number) =>
                        <p key={i}>
                          {users?.filter((u: any) => u.id === agent)[0]?.first_name} {users?.filter((u: any) => u.id === agent)[0]?.last_name}
                        </p>)}</td>
                      <td>{f.gate === "TBA" ? "" : f.gate}</td>
                      <td>{f.actualTime}</td>
                    </tr>)}
                </tbody>
              </table>}
          </div>
        </>
      }
      <SingleFlight clicked={Clicked} setClicked={setClicked} currentFlight={currentFlight} />
    </div >
  )
}

export default DailyFlights