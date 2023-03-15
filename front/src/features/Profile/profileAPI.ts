import { MY_SERVER } from "../../env";
import axios from "axios";
import IProfile from "../../models/profile";

export const getProfile = async (obj:{id:number,accessToken:string}) => {
  const res = await axios.get(`${MY_SERVER}profile/${obj.id}`,{
    headers:{
      'Authorization': `Bearer ${obj.accessToken}`
    }})
  return res.data
}

export const addProfile = async (obj:{pro: IProfile,accessToken:string}) => {
  const res = await axios.post(`${MY_SERVER}profile/`,obj.pro,{
    headers:{
      "content-type": "multipart/form-data",
      'Authorization': `Bearer ${obj.accessToken}`
    }})
  return res.data
}

export const updProfile = async (obj:{pro: IProfile,accessToken:string}) => {
  console.log(obj)
  const res = await axios.put(`${MY_SERVER}profile/${obj.pro.user}`,obj.pro,{
    headers:{
      "content-type": "multipart/form-data",
      'Authorization': `Bearer ${obj.accessToken}`
    }})
  return res.data
}

export const delProfile = async (obj:{id: number,accessToken:string}) => {
  const res = await axios.patch(`${MY_SERVER}users/${obj.id}`,{
    headers:{
      'Authorization': `Bearer ${obj.accessToken}`
    }})
  return res.data
}
export const profileImages = async (obj: { id: number, pic: File, accessToken: string }) => {
  const res = await axios.patch(`${MY_SERVER}profile/picture/${obj.id}`, {"picture":obj.pic}, {
    headers: {
      'Authorization': `Bearer ${obj.accessToken}`,
      'Content-Type': 'multipart/form-data;boundary=l3iPy71otz"',
    }
  })
  return res.data
}

export const delprofileImages = async (obj: { id: number, accessToken: string }) => {
  const res = await axios.patch(`${MY_SERVER}profile/delpicture/${obj.id}`, {
    headers: {
      'Authorization': `Bearer ${obj.accessToken}`,
    }
  })
  return res.data
}

export const getAllProfile = async (accessToken:string) => {
  const res = await axios.get(`${MY_SERVER}profile/all/`,{
    headers:{
      'Authorization': `Bearer ${accessToken}`
    }})
  return res.data
}