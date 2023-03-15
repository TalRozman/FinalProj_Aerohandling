import { MY_SERVER } from "../../env";
import axios from "axios";

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