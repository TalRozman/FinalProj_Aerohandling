import { MY_SERVER, storage } from "../../env";
import axios from "axios";
import IProfile from "../../models/profile";
import { ref, uploadBytesResumable, getDownloadURL,deleteObject } from "firebase/storage"
import { toast } from 'react-toastify'


export const getProfile = async (obj: { id: number, accessToken: string }) => {
  const res = await axios.get(`${MY_SERVER}profile/${obj.id}`, {
    headers: {
      'Authorization': `Bearer ${obj.accessToken}`
    }
  })
  return res.data
}

export const addProfile = async (obj: { pro: IProfile, accessToken: string }) => {
  const res = await axios.post(`${MY_SERVER}profile/`, obj.pro, {
    headers: {
      "content-type": "multipart/form-data",
      'Authorization': `Bearer ${obj.accessToken}`
    }
  })
  return res.data
}

export const updProfile = async (obj: { pro: IProfile, accessToken: string }) => {
  console.log(obj)
  const res = await axios.put(`${MY_SERVER}profile/${obj.pro.user}`, obj.pro, {
    headers: {
      "content-type": "multipart/form-data",
      'Authorization': `Bearer ${obj.accessToken}`
    }
  })
  return res.data
}

export const delProfile = async (obj: { id: number, accessToken: string }) => {
  const res = await axios.patch(`${MY_SERVER}users/${obj.id}`, {
    headers: {
      'Authorization': `Bearer ${obj.accessToken}`
    }
  })
  return res.data
}

export const profileImages = async (obj: { id: number, pic: File, accessToken: string }) => {
  let Myurl = ""
  const storageRef = ref(storage, `/media/${obj.pic.name}`)
  const uploadTask = uploadBytesResumable(storageRef, obj.pic);
  setTimeout(async () => {
    await getDownloadURL(uploadTask.snapshot.ref).then(async (url: string) => {
      Myurl = url
      const res = await axios.patch(`${MY_SERVER}profile/picture/${obj.id}`, { "picture": Myurl }, {
        headers: {
          'Authorization': `Bearer ${obj.accessToken}`,
        }
      })
      return res.data
    })
    toast.success(`Image Changed successfully`)
  }, 1000);
}

export const delprofileImages = async (obj: { id: number,imgUrl:string, accessToken: string }) => {
  const startPicName = obj.imgUrl.lastIndexOf('/')+9
  const endPicname = obj.imgUrl.indexOf('?')
  const myImageName = obj.imgUrl.substring(startPicName,endPicname)
  console.log(myImageName)
  const desertRef = ref(storage, `media/${myImageName}`);
  obj.imgUrl !== "https://firebasestorage.googleapis.com/v0/b/myfirstproject-38539.appspot.com/o/media%2Fholder.jpeg?alt=media&token=0f691153-a358-4ba4-84e6-2de128532ab9" && deleteObject(desertRef)
  const res = await axios.patch(`${MY_SERVER}profile/delpicture/${obj.id}`, {
    headers: {
      'Authorization': `Bearer ${obj.accessToken}`,
    }
  })
  toast.success(`Image ${myImageName} deleted successfully`)
  return res.data
}

export const getAllProfile = async (accessToken: string) => {
  const res = await axios.get(`${MY_SERVER}profile/all/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  return res.data
}