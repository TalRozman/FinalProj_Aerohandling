import { MY_SERVER } from "../../env";
import axios from "axios";
import { Iflight } from "../../models/flight";

export const getAllFlights = async (accessToken:string) => {
  const res = await axios.get(`${MY_SERVER}flights/`,{
    headers:{
      'Authorization': `Bearer ${accessToken}`
    }
  })
  return res.data
}

export const pullFlights = async () => {
  const res = await axios.get(`${MY_SERVER}flights/pull/`)
  return res.data
}

export const getAllUsers = async () => {
  const res = await axios.get(`${MY_SERVER}users/all/`)
  return res.data
}

export const updateFlight = async (obj:{flight:Iflight,accessToken:string}) => {
  console.log(obj.flight)
  const res = await axios.patch(`${MY_SERVER}flights/${obj.flight.id}`,obj.flight,{
    headers:{
      'Authorization': `Bearer ${obj.accessToken}`
    }
  })
  return res.data
}