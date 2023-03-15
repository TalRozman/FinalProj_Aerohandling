export default interface IProfile {
    phoneNum:String,
    address: String,
    birthDate: String,
    user:number,
    needTaxi: boolean,
    image?: File|undefined,
    role?:number,
    department?:number,
    type?:number,
}