import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { getFlightsAsync, pullFlightsAsync, selectFlights, selectFlightsRefresh, setSingleFlightModal } from '../features/DailySchedule/dailySlice'
import SingleFlight from './SingleFlight'
import UpdateFlight from './UpdateFlight'

const DailyFlights = () => {
  const dispatch = useAppDispatch()
  const flights = useAppSelector(selectFlights)
  const accessToken = String(sessionStorage.getItem('token'))
  let tokenDecode: any;
  const [displayType, settype] = useState<"arrivals" | "departures" | "all">("all")
  const [myDate, setmyDate] = useState<Date>(new Date())
  const [today, settoday] = useState("")
  const [newFlts, setnewFlts] = useState([...flights])
  const [moveDate, setmoveDate] = useState(false)
  const [loaded, setloaded] = useState(false)
  const [update, setupdate] = useState(false)
  const [fId, setfId] = useState<number>(0)

  if (accessToken !== String(null)) {
    tokenDecode = jwtDecode<any>(accessToken);
  }

  const sortMyArr = (a: any, b: any) => {
    var keyA = new Date(a.stdLocal),
      keyB = new Date(b.stdLocal);
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  }

  useEffect(() => {
    dispatch(getFlightsAsync(accessToken))
    // eslint-disable-next-line
  }, [selectFlightsRefresh])

  useEffect(() => {
    settoday(myDate.toISOString().slice(0, 10))
    setnewFlts([...flights])
    // console.log(newFlts)
    setnewFlts(newFlts.sort((a, b) => sortMyArr(a, b)))
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
  setTimeout(() => {
    setloaded(true);
    setnewFlts([...flights])
  }, 3000);

  const handleSelectedFlight = (id: number) => {
    setfId(id)
    dispatch(setSingleFlightModal())
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!loaded ?
        <>
          <img src='https://joyustrips.com/assets/images/FlightLoader.gif' width={'100%'} height={'100%'} style={{ position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px' }} alt="loaderGIF" />
        </> :
        <>
          {tokenDecode?.type === "Manager" && <button className='btn btn-warning  ' onClick={() => dispatch(pullFlightsAsync())}>PULL FLIGHTS</button>}<br />
          <button className='btn' onClick={() => settype('all')}>All flights</button>
          <button className='btn' onClick={() => settype('departures')}>Departures only</button>
          <button className='btn' onClick={() => settype('arrivals')}>Arrivals only</button>
          <br />
          <div className='center'>
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
                    {(tokenDecode?.type === "Manager" || tokenDecode?.type === "Shift Supervisor") &&
                      <th scope='col'>Actions</th>}
                    <th scope="col">Type</th>
                    <th scope="col">Number</th>
                    <th scope="col">Schedual time</th>
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
                  {newFlts.filter((f: any) => f.stdLocal.slice(0, 10) === today).map((f: any, i: number) =>
                    <tr key={i} onClick={() => handleSelectedFlight(f.id)}>
                      {(tokenDecode?.type === "Manager" || tokenDecode?.type === "Shift Supervisor") &&
                        <td onClick={(e) => e.stopPropagation()}><button className='btn btn-warning' onClick={() => setupdate(true)}>Update</button></td>}
                      <td>{f.type}</td>
                      <td>{f.flightNum}</td>
                      <td>{f.stdLocal.slice(11, 16)}&nbsp;&nbsp; Z<br />{new Date(f.stdLocal).toTimeString().slice(0, 5)}&nbsp; LT</td>
                      <td>{f.dest}</td>
                      <td>{f.aircraftType === "TBA" ? "" : f.aircraftType}</td>
                      <td>{f.aircraftReg === "TBA" ? "" : f.aircraftReg}</td>
                      <td>{f.spv}</td>
                      <td>{f.ambulift}</td>
                      <td>{f.ramp}</td>
                      <td>{f.gate === "TBA" ? "" : f.gate}</td>
                      <td>{f.stand}</td>
                      <td>{f.obTime}</td>
                      <td>{f.delaycode}<br />{f.delaytime}</td>
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
                    <th scope="col">Schedual time</th>
                    <th scope="col">Destination</th>
                    <th scope="col">A/C type</th>
                    <th scope="col">A/C reg</th>
                    <th scope="col">Ambulift</th>
                    <th scope="col">Ramp</th>
                    <th scope="col">Stand</th>
                  </tr>
                </thead>
                <tbody>
                  {newFlts.filter((f: any) => f.stdLocal.slice(0, 10) === today).filter((f: any) => f.type === 'A').map((f: any, i: number) =>
                    <tr key={i} onClick={() => handleSelectedFlight(f.id)}>
                      <td>{f.type}</td>
                      <td>{f.flightNum}</td>
                      <td>{f.stdLocal.slice(11, 16)}&nbsp;&nbsp; Z<br />{new Date(f.stdLocal).toTimeString().slice(0, 5)}&nbsp; LT</td>
                      <td>{f.dest}</td>
                      <td>{f.aircraftType === "TBA" ? "" : f.aircraftType}</td>
                      <td>{f.aircraftReg === "TBA" ? "" : f.aircraftReg}</td>
                      <td>{f.ambulift === null ? "" : f.ambulift ? "YES" : "NO"}</td>
                      <td>{f.ramp}</td>
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
                    <th scope="col">Schedual time</th>
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
                  {newFlts.filter((f: any) => f.stdLocal.slice(0, 10) === today).filter((f: any) => f.type === 'D').map((f: any, i: number) =>
                    <tr key={i} onClick={() => handleSelectedFlight(f.id)}>
                      <td>{f.type}</td>
                      <td>{f.flightNum}</td>
                      <td>{f.stdLocal.slice(11, 16)}&nbsp;&nbsp; Z<br />{new Date(f.stdLocal).toTimeString().slice(0, 5)}&nbsp; LT</td>
                      <td>{f.dest}</td>
                      <td>{f.aircraftType === "TBA" ? "" : f.aircraftType}</td>
                      <td>{f.aircraftType === "TBA" ? "" : f.aircraftType}</td>
                      <td>{f.spv}</td>
                      <td>{f.clc}</td>
                      <td>{f.ramp}</td>
                      <td>{f.aircraftType === "TBA" ? "" : f.aircraftType}</td>
                      <td>{f.actualTime}</td>
                    </tr>)}
                </tbody>
              </table>}
          </div>
        </>
      }
      <SingleFlight flightId={fId} />
      <UpdateFlight Fupdate={update} setUpdate={setupdate}/>
    </div >
  )
}

export default DailyFlights