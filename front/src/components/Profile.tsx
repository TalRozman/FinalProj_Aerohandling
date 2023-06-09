import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import IProfile from '../models/profile'
import { CheckLogged, selectlogged } from '../features/Login/loginSlice'
import { addProfileAsync, delProfilePicAsync, getProfileAsync, ProfilePicAsync, selectLoaded, selectProfile, selectProfileRefresh, updProfileAsync } from '../features/Profile/profileSlice'
import { modalStyle } from '../env'
import { Modal, Box, Button } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material';

const Profile = () => {
    const dispatch = useAppDispatch()
    const logged = useAppSelector(selectlogged)
    const loaded = useAppSelector(selectLoaded)
    const accessToken = String(sessionStorage.getItem('token'))
    const [phoneNum, setphoneNum] = useState("")
    const [address, setaddress] = useState("")
    const [birthDate, setbirthDate] = useState("")
    const [needTaxi, setneedTaxi] = useState(false)
    const profile = useAppSelector(selectProfile)
    const refresh = useAppSelector(selectProfileRefresh)
    const [isUpdate, setisUpdate] = useState(false)
    const [img, setimg] = useState<File | undefined>()
    const [imgModal, setimgModal] = useState(false)

    let tokenDecode: any;
    let myobj: { "id": number, "accessToken": string };
    if (accessToken !== String(null)) {
        tokenDecode = jwtDecode<any>(accessToken);
        myobj = { "id": +tokenDecode!.user_id, accessToken };
    }

    const handleSubmit = () => {
        const pro: IProfile = { "address": address, "birthDate": birthDate, "phoneNum": phoneNum, "user": tokenDecode!.user_id, "needTaxi": needTaxi }
        const obj = { pro, accessToken }
        dispatch(addProfileAsync(obj))
    }

    const handleEdit = () => {
        const pro: IProfile = { "address": address, "birthDate": birthDate, "phoneNum": phoneNum, "user": tokenDecode!.user_id, "needTaxi": needTaxi }
        const obj = { pro, accessToken }
        dispatch(updProfileAsync(obj))
        setisUpdate(false)
    }

    const handleImage = () => {
        if (img !== undefined) {
            const obj = { "id": +tokenDecode!.user_id, "accessToken": accessToken, "pic": img }
            dispatch(ProfilePicAsync(obj))
            setimgModal(false)
        }
    }

    const handleDelPic = () => {
        const Myobj = { "id": +tokenDecode!.user_id, "accessToken": accessToken, "imgUrl": String(profile[0].image) }
        dispatch(delProfilePicAsync(Myobj))
        setimgModal(false)
    }

    useEffect(() => {
        dispatch(CheckLogged())
        if (logged) {
            dispatch(getProfileAsync(myobj));
        }
        // eslint-disable-next-line
    }, [refresh])

    useEffect(() => {
        dispatch(getProfileAsync(myobj));
        // eslint-disable-next-line
    }, [])


    return (
        <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '40%', textAlign: 'center' }}>
            {loaded ?
                profile.length ?
                    (!isUpdate ?
                        <div>
                            <h1>My Profile</h1>
                            <p>My address - {profile[0]?.address}</p>
                            <p>My birth date - {profile[0]?.birthDate}</p>
                            <p>My phone number - {profile[0]?.phoneNum}</p>
                            <p>My department - {tokenDecode.dep}</p>
                            <p>My role - {tokenDecode.role}</p>
                            <p>I am - {tokenDecode.type}</p>
                            <p>Taxi required? - {profile[0]?.needTaxi ? "Yes" : "No"}</p>
                            <p onClick={() => setimgModal(true)}>My profile picture -<br />(please click to edit)<br /> <img src={profile[0].image} style={{ width: "100px", height: "100px" }} alt="My profile" /></p>
                            <button className='btn btn-warning' onClick={() => setisUpdate(true)}>Update</button>
                        </div> :
                        <form onSubmit={(e) => { handleEdit(); e.preventDefault() }}>
                            <h1>Please Update your information</h1><br /><br />
                            <label>
                                Phone Number: {" "}
                                <input type={'text'} onChange={(e) => setphoneNum(e.currentTarget.value)} required />
                            </label><br />
                            <label>
                                Address: {" "}
                                <input type={'text'} onChange={(e) => setaddress(e.currentTarget.value)} required />
                            </label><br />
                            <label>
                                Need Taxi?: {" "}
                                <input type={'checkbox'} onChange={(e) => setneedTaxi(e.currentTarget.checked)} defaultValue={String(profile[0]?.needTaxi)} />
                            </label><br /><br />
                            <button className='btn btn-success' type={'submit'}>Submit</button><button className='btn btn-danger' onClick={() => setisUpdate(false)}>Cancel</button>
                            <br />
                        </form>
                    )
                    : <form onSubmit={(e) => { handleSubmit(); e.preventDefault() }}>
                        <label>
                            Phone Number: {" "}
                            <input type={'text'} onChange={(e) => setphoneNum(e.currentTarget.value)} required />
                        </label><br />
                        <label>
                            Birth Date: {" "}
                            <input type={'date'} onChange={(e) => setbirthDate(e.currentTarget.value)} required />
                        </label><br />
                        <label>
                            Address: {" "}
                            <input type={'text'} onChange={(e) => setaddress(e.currentTarget.value)} required />
                        </label><br />
                        <label>
                            Need Taxi?: {" "}
                            <input type={'checkbox'} onChange={(e) => setneedTaxi(e.currentTarget.checked)} defaultValue={String(profile[0]?.needTaxi)} />
                        </label><br /><br />
                        <button className='btn btn-success' type={'submit'}>Submit</button>
                        <br />
                    </form> :
                <img src='https://joyustrips.com/assets/images/FlightLoader.gif' width={'100%'} height={'100%'} style={{ position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px' }} alt="loaderGIF" />
            }
            <Modal open={imgModal}>
                <Box sx={modalStyle}>
                    <Button onClick={() => setimgModal(false)}>
                        <CloseOutlined />
                    </Button>
                    <form onSubmit={(e) => { e.preventDefault(); handleImage() }}>
                        <label>
                            Please upload an image - <br />
                            <input type={'file'} accept={'image/jpg,jpeg,png'} required onChange={(e) => setimg(e.currentTarget.files?.[0])} />
                        </label>
                        <input type={'submit'} />
                    </form>
                    OR<br />
                    <button onClick={() => handleDelPic()}>Delete my profile image</button>
                </Box>
            </Modal>
        </div>
    )
}

export default Profile