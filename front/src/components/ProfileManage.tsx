import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { delProfileAsync, getAllProfileAsync, selectallProfile, selectProfileRefresh } from '../features/Profile/profileSlice'

const ProfileManage = () => {
  const dispatch = useAppDispatch()
  const accessToken = String(sessionStorage.getItem('token'))
  const profile = useAppSelector(selectallProfile)
  const refresh = useAppSelector(selectProfileRefresh)
  let myobj: { "id": number, "accessToken": string };
  let tokenDecode: any;
  const [showActive, setshowActive] = useState(false)

  const [displayType, settype] = useState<"all" | "operation" | "passenger service">("all")

  if (accessToken !== String(null)) {
    tokenDecode = jwtDecode<any>(accessToken);
    myobj = { "id": +tokenDecode!.user_id, accessToken };
  }

  useEffect(() => {
    dispatch(getAllProfileAsync(accessToken))
    // eslint-disable-next-line
  }, [refresh])

  const handleDelete = (id: number) => {
    myobj = { id, accessToken };
    dispatch(delProfileAsync(myobj))
  }

  return (
    <div className="table-responsive">
      <button className='btn' onClick={() => settype('all')}>All Departments</button>
      <button className='btn' onClick={() => settype('operation')}>Operations</button>
      <button className='btn' onClick={() => settype('passenger service')}>Passenger Service</button><br />
      Show only Active employees {" "}<input type="checkbox" onChange={() => setshowActive(!showActive)} defaultChecked={showActive} />
      <table className='table table-striped table-hover' style={{ verticalAlign: 'middle', textAlign: 'center' }}>
        <thead>
          <tr>
            <th scope="col">Actions</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
            <th scope="col">Active</th>
            <th scope="col">Department</th>
            <th scope="col">Role</th>
            <th scope="col">Employee type</th>
            <th scope="col">Address</th>
            <th scope="col">Birth-date</th>
            <th scope="col">Phone number</th>
            <th scope="col">Taxi required</th>
          </tr>
        </thead>
        <tbody>
          {showActive ?
            <>
              {displayType === 'all' ?
                profile?.Users.filter((usr: any) => usr.is_active).map((usr: any, i: number) =>
                  <tr key={i}>
                    <td>
                      {tokenDecode.user_id === usr.id ? <button className='btn btn-info' style={{ fontSize: '15px' }}>Cannot Disable yourself</button> :
                        (usr.is_active ?
                          <button className='btn btn-danger' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Disable<br />Employee</button>
                          :
                          <button className='btn btn-warning' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Enable<br />Employee</button>)}
                    </td>
                    <td>{usr.first_name}</td>
                    <td>{usr.last_name}</td>
                    <td>{usr.email}</td>
                    <td>{usr.is_active ? "Active" : "In-active"}</td>
                    <td>{usr.department === 1 ? "Operations" : "Passenger Service"}</td>
                    <td>{usr.role === 1 ? "SPV" : usr.role === 2 ? "Check in agent" : usr.role === 3 ? "PS" : usr.role === 4 ? "Ramp agent" : usr.role === 5 ? "OPS" : "CLC"}</td>
                    <td>{usr.type === 1 ? "Manager" : usr.type === 2 ? "Shift supervisor" : "Employee"}</td>
                    {
                      profile.Profiles.filter((pro: any) => pro.user === usr.id).map((mypro: any, i: number) =>
                        <React.Fragment key={i}>
                          <td>{mypro?.address}</td>
                          <td>{mypro?.birthDate}</td>
                          <td>{mypro?.phoneNum}</td>
                          <td>{mypro?.needTaxi ? "Yes" : "No"}</td>
                        </React.Fragment>)
                    }
                  </tr>) :
                displayType === 'operation' ?
                  profile?.Users.filter((usr: any) => usr.is_active).filter((usr: any) => usr.department === 1).map((usr: any, i: number) =>
                    <tr key={i}>
                      <td>
                        {tokenDecode.user_id === usr.id ? <button className='btn btn-info' style={{ fontSize: '15px' }}>Cannot Disable yourself</button> :
                          (usr.is_active ?
                            <button className='btn btn-danger' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Disable<br />Employee</button>
                            :
                            <button className='btn btn-warning' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Enable<br />Employee</button>)}
                      </td>
                      <td>{usr.first_name}</td>
                      <td>{usr.last_name}</td>
                      <td>{usr.email}</td>
                      <td>{usr.is_active ? "Active" : "In-active"}</td>
                      <td>{usr.department === 1 ? "Operations" : "Passenger Service"}</td>
                      <td>{usr.role === 1 ? "SPV" : usr.role === 2 ? "Check in agent" : usr.role === 3 ? "PS" : usr.role === 4 ? "Ramp agent" : usr.role === 5 ? "OPS" : "CLC"}</td>
                      <td>{usr.type === 1 ? "Manager" : usr.type === 2 ? "Shift supervisor" : "Employee"}</td>
                      {
                        profile.Profiles.filter((pro: any) => pro.user === usr.id).map((mypro: any, i: number) =>
                          <React.Fragment key={i}>
                            <td>{mypro?.address}</td>
                            <td>{mypro?.birthDate}</td>
                            <td>{mypro?.phoneNum}</td>
                            <td>{mypro?.needTaxi ? "Yes" : "No"}</td>
                          </React.Fragment>)
                      }
                    </tr>) :
                  profile?.Users.filter((usr: any) => usr.is_active).filter((usr: any) => usr.department === 2).map((usr: any, i: number) =>
                    <tr key={i}>
                      <td>
                        {tokenDecode.user_id === usr.id ? <button className='btn btn-info' style={{ fontSize: '15px' }}>Cannot Disable yourself</button> :
                          (usr.is_active ?
                            <button className='btn btn-danger' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Disable<br />Employee</button>
                            :
                            <button className='btn btn-warning' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Enable<br />Employee</button>)}
                      </td>
                      <td>{usr.first_name}</td>
                      <td>{usr.last_name}</td>
                      <td>{usr.email}</td>
                      <td>{usr.is_active ? "Active" : "In-active"}</td>
                      <td>{usr.department === 1 ? "Operations" : "Passenger Service"}</td>
                      <td>{usr.role === 1 ? "SPV" : usr.role === 2 ? "Check in agent" : usr.role === 3 ? "PS" : usr.role === 4 ? "Ramp agent" : usr.role === 5 ? "OPS" : "CLC"}</td>
                      <td>{usr.type === 1 ? "Manager" : usr.type === 2 ? "Shift supervisor" : "Employee"}</td>
                      {
                        profile.Profiles.filter((pro: any) => pro.user === usr.id).map((mypro: any, i: number) =>
                          <React.Fragment key={i}>
                            <td>{mypro?.address}</td>
                            <td>{mypro?.birthDate}</td>
                            <td>{mypro?.phoneNum}</td>
                            <td>{mypro?.needTaxi ? "Yes" : "No"}</td>
                          </React.Fragment>)}
                    </tr>)}
            </> :
            <>
              {displayType === 'all' ?
                profile?.Users.map((usr: any, i: number) =>
                  <tr key={i}>
                    <td>
                      {tokenDecode.user_id === usr.id ? <button className='btn btn-info' style={{ fontSize: '15px' }}>Cannot Disable yourself</button> :
                        (usr.is_active ?
                          <button className='btn btn-danger' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Disable<br />Employee</button>
                          :
                          <button className='btn btn-warning' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Enable<br />Employee</button>)}
                    </td>
                    <td>{usr.first_name}</td>
                    <td>{usr.last_name}</td>
                    <td>{usr.email}</td>
                    <td>{usr.is_active ? "Active" : "In-active"}</td>
                    <td>{usr.department === 1 ? "Operations" : "Passenger Service"}</td>
                    <td>{usr.role === 1 ? "SPV" : usr.role === 2 ? "Check in agent" : usr.role === 3 ? "PS" : usr.role === 4 ? "Ramp agent" : usr.role === 5 ? "OPS" : "CLC"}</td>
                    <td>{usr.type === 1 ? "Manager" : usr.type === 2 ? "Shift supervisor" : "Employee"}</td>
                    {
                      profile.Profiles.filter((pro: any) => pro.user === usr.id).map((mypro: any, i: number) =>
                        <React.Fragment key={i}>
                          <td>{mypro?.address}</td>
                          <td>{mypro?.birthDate}</td>
                          <td>{mypro?.phoneNum}</td>
                          <td>{mypro?.needTaxi ? "Yes" : "No"}</td>
                        </React.Fragment>)
                    }
                  </tr>) :
                displayType === 'operation' ?
                  profile?.Users.filter((usr: any) => usr.department === 1).map((usr: any, i: number) =>
                    <tr key={i}>
                      <td>
                        {tokenDecode.user_id === usr.id ? <button className='btn btn-info' style={{ fontSize: '15px' }}>Cannot Disable yourself</button> :
                          (usr.is_active ?
                            <button className='btn btn-danger' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Disable<br />Employee</button>
                            :
                            <button className='btn btn-warning' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Enable<br />Employee</button>)}
                      </td>
                      <td>{usr.first_name}</td>
                      <td>{usr.last_name}</td>
                      <td>{usr.email}</td>
                      <td>{usr.is_active ? "Active" : "In-active"}</td>
                      <td>{usr.department === 1 ? "Operations" : "Passenger Service"}</td>
                      <td>{usr.role === 1 ? "SPV" : usr.role === 2 ? "Check in agent" : usr.role === 3 ? "PS" : usr.role === 4 ? "Ramp agent" : usr.role === 5 ? "OPS" : "CLC"}</td>
                      <td>{usr.type === 1 ? "Manager" : usr.type === 2 ? "Shift supervisor" : "Employee"}</td>
                      {
                        profile.Profiles.filter((pro: any) => pro.user === usr.id).map((mypro: any, i: number) =>
                          <React.Fragment key={i}>
                            <td>{mypro?.address}</td>
                            <td>{mypro?.birthDate}</td>
                            <td>{mypro?.phoneNum}</td>
                            <td>{mypro?.needTaxi ? "Yes" : "No"}</td>
                          </React.Fragment>)
                      }
                    </tr>) :
                  profile?.Users.filter((usr: any) => usr.department === 2).map((usr: any, i: number) =>
                    <tr key={i}>
                      <td>
                        {tokenDecode.user_id === usr.id ? <button className='btn btn-info' style={{ fontSize: '15px' }}>Cannot Disable yourself</button> :
                          (usr.is_active ?
                            <button className='btn btn-danger' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Disable<br />Employee</button>
                            :
                            <button className='btn btn-warning' style={{ fontSize: '15px' }} onClick={() => handleDelete(usr.id)}>Enable<br />Employee</button>)}
                      </td>
                      <td>{usr.first_name}</td>
                      <td>{usr.last_name}</td>
                      <td>{usr.email}</td>
                      <td>{usr.is_active ? "Active" : "In-active"}</td>
                      <td>{usr.department === 1 ? "Operations" : "Passenger Service"}</td>
                      <td>{usr.role === 1 ? "SPV" : usr.role === 2 ? "Check in agent" : usr.role === 3 ? "PS" : usr.role === 4 ? "Ramp agent" : usr.role === 5 ? "OPS" : "CLC"}</td>
                      <td>{usr.type === 1 ? "Manager" : usr.type === 2 ? "Shift supervisor" : "Employee"}</td>
                      {
                        profile.Profiles.filter((pro: any) => pro.user === usr.id).map((mypro: any, i: number) =>
                          <React.Fragment key={i}>
                            <td>{mypro?.address}</td>
                            <td>{mypro?.birthDate}</td>
                            <td>{mypro?.phoneNum}</td>
                            <td>{mypro?.needTaxi ? "Yes" : "No"}</td>
                          </React.Fragment>)
                      }
                    </tr>)}
            </>}
        </tbody>
      </table>
    </div >
  )
}

export default ProfileManage