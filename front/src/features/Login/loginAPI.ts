import { MY_SERVER } from "../../env";
import axios from "axios";
import Iuser from "../../models/user";

export const userLogin = async (usr: Iuser) => {
  const res = await axios.post(`${MY_SERVER}login/`, {"username":usr.username,"password":usr.password})
  return res.data
}
export const userLoginRemember = async (refresh: string) => {
  const res = await axios.post(`${MY_SERVER}login/refresh/`, {"refresh":refresh})
  return res.data
}
export const changeUserPassword = async (myObj:{id:number,pwd:string,accessToken:string}) => {
  const res = await axios.post(`${MY_SERVER}login/changePassword/${myObj.id}`, {"password":myObj.pwd},{
    headers:{
      'Authorization': `Bearer ${myObj.accessToken}`
    }
  })
  return res.data
}